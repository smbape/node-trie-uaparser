"use strict";

const fs = require("fs");
const isEqual = require("lodash/isEqual");

const Tokenizer = require("./Tokenizer");
const Parser = require("./Parser");

const flip = require("../functions/flip");
const lowerCaseProp = require("../functions/lowerCaseProp");

const { TOKEN_TYPES } = Tokenizer;
const hasProp = Object.prototype.hasOwnProperty;
const TRAIN_LIMIT = 6;

// let id = 1;
const createIndex = props => {
    const index = {};
    // index.id = `Index_${ id++ }`;
    Object.assign(index, props);
    return index;
};

const getDataName = (agent, options) => {
    if (options.os) {
        const os = typeof agent.os === "object" ? agent.os.family || agent.os.name : agent.os;
        return typeof os === "object" ? os.name : os;
    }

    return agent.software;
};

const getDataVersion = (agent, options) => {
    if (options.os) {
        const version = typeof agent.os === "object" ? agent.os.version : undefined;
        return typeof version === "object" ? version.value : version;
    }
    return agent.version;
};

const isSameName = (token, name) => {
    name = name.toLowerCase();
    return token === name || token === `${ name }-ipad` || token === `${ name }-iphone`;
};

const train = (data, options, tokensCb) => {
    const {tokenizer} = options;

    data.forEach(agent => {
        const {ua} = agent;
        const name = getDataName(agent, options);

        if (name == null) {
            return;
        }

        const lname = name.toLowerCase();
        const lnames = [lname];

        if (lname.indexOf(" ") !== -1) {
            lnames.push(lname.replace(/ /g, ""));
            lnames.push(lname.replace(/ /g, "-"));
        }

        const tokens = tokenizer.getTokens(ua, Object.assign({}, options, {
            lnames,
            ontoken() {
                const len = arguments.length;
                const args = new Array(len + 1);
                for (let i = 0; i < len; i++) {
                    args[i] = arguments[i];
                }
                args[len] = agent;
                options.ontoken(...args);
            }
        }));

        tokensCb(tokens.length === 0 ? ua : null, agent, tokens, options);
    });
};

const addIndex = (agent, tokens, indexes, options) => {
    const name = getDataName(agent, options);
    let parent = indexes;

    for (let i = tokens.length - 1, token; i >= 0; i--) {
        token = tokens[i];

        if (!hasProp.call(parent, "children")) {
            parent.children = {};
        }

        if (!hasProp.call(parent.children, token)) {
            parent.children[token] = createIndex();
        }

        parent = parent.children[token];
    }

    if (hasProp.call(parent, "name")) {
        if (typeof parent.name === "string") {
            const _name = parent.name;
            parent.name = {};
            parent.name[_name] = 1;
        }

        if (!hasProp.call(parent.name, name)) {
            parent.name[name] = 0;
        }

        parent.name[name]++;
    } else {
        parent.name = name;
    }
};

const compressIndexes = (indexes, parent, childKey, lastChildIndex, reduce) => {
    if (indexes.name && typeof indexes.name === "object") {
        // Later names have priority
        indexes.name = Object.keys(indexes.name).reverse().sort((a, b) => {
            a = indexes.name[a];
            b = indexes.name[b];
            return a > b ? -1 : a < b ? 1 : 0;
        })[0];
    }

    if (indexes.children) {
        const keys = Object.keys(indexes.children);
        const last = keys.length - 1;
        keys.forEach((child, i) => {
            compressIndexes(indexes.children[child], indexes, child, last, i === last);
        });
    }

    if (parent && parent.name === indexes.name && !indexes.children) {
        delete parent.children[childKey];
    }

    if (reduce && parent) {
        if (lastChildIndex === 0 && !parent.name) {
            // pass grand children to parent
            // since there is no other possible child
            parent.name = indexes.name;
            parent.children = indexes.children;
        } else if (!indexes.children) {
            // If all children have the same name
            // and parent does not have a name
            // having any child does not change the name
            if (
                (!parent.name || parent.name === indexes.name) &&
                !Object.keys(parent.children).some(child => parent.children[child].children || parent.children[child].name !== indexes.name)
            ) {
                parent.name = indexes.name;
                delete parent.children;
            }
        }
    }

    return indexes;
};

const doTrain = options => {
    const {data, indexes, tokenizer} = options;
    const errors = [];

    const addedTokens = {};
    const dlnames = {};

    data.forEach(agent => {
        const name = getDataName(agent, options);

        if (name == null) {
            return;
        }

        const lname = name.toLowerCase();
        const lnames = [lname];

        if (lname.indexOf(" ") !== -1) {
            lnames.push(lname.replace(/ /g, ""));
            lnames.push(lname.replace(/ /g, "-"));
        }

        lnames.forEach(token => {
            dlnames[token] = 1;
            if (!hasProp.call(tokenizer.DLknownTokens, token)) {
                addedTokens[token] = TOKEN_TYPES.UNVERSIONED;
            }
        });
    });

    tokenizer.updateTokens(addedTokens);

    const tokensCb = (err, agent, tokens, options) => {
        if (err) {
            if (!options.os || agent.os !== "--") {
                errors.push(agent);
            }
        } else {
            addIndex(agent, tokens, indexes, options);
        }
    };

    if (options.potentialVersion == null) {
        options.potentialVersion = {};
    }

    if (options.versionMap == null) {
        options.versionMap = {};
    }

    const potentialVersion = options.potentialVersion;
    const versionMap = options.versionMap;

    if (options.count == null) {
        options.count = 0;
    }

    if (options.count >= TRAIN_LIMIT) {
        throw new Error("Too much trainning. Something is wrong");
    }

    if (options.lastTokens == null) {
        options.lastTokens = {};
    }

    while (options.count < TRAIN_LIMIT && (Object.keys(indexes.tokens).length === 0 || !isEqual(indexes.tokens, options.lastTokens))) {
        options.count++;
        console.error(`Train ${ options.os ? "os      " : "software" }`, options.count);

        Object.assign(options.lastTokens, indexes.tokens);
        tokenizer.updateTokens(indexes.tokens);

        errors.length = 0;
        delete indexes.children;

        train(data, {
            ontoken: (token, uaVersion, type, index, ua, uaStart, uaEnd, currentTokens, agent) => {
                const name = getDataName(agent, options);
                const version = getDataVersion(agent, options);

                if (Array.isArray(token)) {
                    token = token[0];
                }

                if (type !== 0 && type !== 2 && hasProp.call(dlnames, token)) {
                    type = 2;
                }

                switch (type) {
                    case 0:
                        if (version && token.startsWith(version) && currentTokens.length !== 0) {
                            token = currentTokens[currentTokens.length - 1];
                            if (Array.isArray(token)) {
                                token = token[0];
                            }

                            if (hasProp.call(indexes.tokens, token)) {
                                if (isSameName(token, name)) {
                                    if (!hasProp.call(options.oversionMap, name)) {
                                        versionMap[name] = `${ token } *`;
                                    }
                                } else {
                                    if (!hasProp.call(potentialVersion, name)) {
                                        potentialVersion[name] = {};
                                    }
                                    potentialVersion[name][token] = 1;
                                    if (!hasProp.call(tokenizer.DLknownIrrelevantTokens, token)) {
                                        indexes.tokens[token] = TOKEN_TYPES.INFINITE_VERSION;
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        if (uaVersion && uaVersion.startsWith(version) && (isSameName(token, name))) {
                            if (!hasProp.call(options.oversionMap, name)) {
                                versionMap[name] = `${ token } *`;
                            }
                        }

                        if (hasProp.call(indexes.tokens, token)) {
                            if (versionMap[name] && indexes.tokens[token] === TOKEN_TYPES.UNVERSIONED) {
                                indexes.tokens[token] = TOKEN_TYPES.INFINITE_VERSION;
                            }
                        } else {
                            indexes.tokens[token] = versionMap[name] ? TOKEN_TYPES.INFINITE_VERSION : TOKEN_TYPES.UNVERSIONED;
                        }
                        break;
                }
            },
            tokenizer,
            os: options.os
        }, tokensCb);
    }

    compressIndexes(indexes);

    if (!options.keepUnusedTokens) {
        tokenizer.updateTokens(indexes.tokens, Object.keys(options.lastTokens).filter(token => !hasProp.call(indexes.tokens, token)));
    }

    // sort to ease debugging
    Object.keys(indexes.tokens).sort().forEach(token => {
        const value = indexes.tokens[token];
        delete indexes.tokens[token];
        indexes.tokens[token] = value;
    });

    Object.keys(options.lastTokens).forEach(token => {
        delete options.lastTokens[token];
    });
    Object.assign(options.lastTokens, indexes.tokens);

    if (errors.length !== 0) {
        options.errors = errors;
    }

    Object.keys(addedTokens).forEach(token => {
        addedTokens[token] = TOKEN_TYPES.REMOVED;
    });

    tokenizer.updateTokens(addedTokens);
};

const makeVersioned = (indexes, token) => {
    indexes.tokens[token] = TOKEN_TYPES.INFINITE_VERSION;

    const stack = [indexes.children];
    let obj;

    const recurse = key => {
        if (hasProp.call(obj[key], "children") && obj[key].children != null) {
            stack.push(obj[key].children);
        }
    };

    // eslint-disable-next-line no-cond-assign
    while (obj = stack.pop()) {
        if (hasProp.call(obj, token)) {
            obj[`${ token } *`] = obj[token];
            delete obj[token];
        }
        Object.keys(obj).reverse().forEach(recurse);
    }
};

const autofix = (leftTokenizer, rightTokenizer, leftIndexes, rightIndexes, options, level) => {
    let conflicts = leftTokenizer.conflict(rightTokenizer, leftIndexes.tokens, rightIndexes.tokens);

    if (!conflicts) {
        return conflicts;
    }

    let fixed = false;
    let conflict, token, index, versioned;

    if (level == null) {
        level = 0;
    }

    if (++level > 3) {
        return conflicts;
    }

    for (let i = conflicts.length - 1; i >= 0; i--) {
        conflict = conflicts[i];
        token = null;

        if (conflict.startsWith("left unversioned '")) {
            index = conflict.lastIndexOf("' starts with versioned '");
            token = conflict.slice("left unversioned '".length, index);
            versioned = conflict.slice(index + "' starts with versioned '".length, -1);
            leftIndexes.tokens[token] = TOKEN_TYPES.REMOVED;
            if (!hasProp.call(leftTokenizer.DLknownVersionedTokens, versioned)) {
                makeVersioned(leftIndexes, versioned);
            }
            conflicts.splice(i, 1);
            fixed = true;
            token = null;
        } else if (conflict.startsWith("right unversioned '")) {
            index = conflict.lastIndexOf("' starts with versioned '");
            token = conflict.slice("right unversioned '".length, index);
            versioned = conflict.slice(index + "' starts with versioned '".length, -1);
            rightIndexes.tokens[token] = TOKEN_TYPES.REMOVED;
            if (!hasProp.call(rightTokenizer.DLknownVersionedTokens, versioned)) {
                makeVersioned(rightIndexes, versioned);
            }
            conflicts.splice(i, 1);
            fixed = true;
            token = null;
        }

        if (conflict.startsWith("versioned in right but not in left: '")) {
            token = conflict.slice("versioned in right but not in left: '".length, -1);
        } else if (conflict.startsWith("versioned in left but not in right: '")) {
            token = conflict.slice("versioned in left but not in right: '".length, -1);
        }

        if (token) {
            if (leftIndexes.tokens[token] === TOKEN_TYPES.UNVERSIONED) {
                makeVersioned(leftIndexes, token);
            }

            if (rightIndexes.tokens[token] === TOKEN_TYPES.UNVERSIONED) {
                makeVersioned(rightIndexes, token);
            }

            conflicts.splice(i, 1);
            fixed = true;
        }
    }

    if (fixed) {
        conflicts = autofix(leftTokenizer, rightTokenizer, leftIndexes, rightIndexes, options, level);

        if (conflicts || level > 1) {
            return conflicts;
        }

        return leftTokenizer.conflict(rightTokenizer, leftIndexes.tokens, rightIndexes.tokens);
    }

    return false;
};

Object.assign(exports, {
    train: opts => {
        const data = opts.data;

        const versionTokens = {};
        const versionTokenizerOptions = Parser.mergeVersionTokernizer({}, Parser.defaultOptions);

        ["knownFiniteVersionedTokens", "knownInfiniteVersionedTokens"].forEach(prop => {
            if (!hasProp.call(versionTokenizerOptions, prop)) {
                return;
            }

            const hashmap = flip(versionTokenizerOptions[prop], 1, true);
            Object.keys(hashmap).forEach(token => {
                switch (prop) {
                    case "knownFiniteVersionedTokens":
                        versionTokens[token] = TOKEN_TYPES.FINITE_VERSION;
                        break;
                    case "knownInfiniteVersionedTokens":
                        versionTokens[token] = TOKEN_TYPES.INFINITE_VERSION;
                        break;
                    default:
                        throw new Error("Not going to happen");
                }
            });
        });

        let os = {
            data,
            file: opts.out.os,
            indexes: createIndex({
                tokens: Object.assign({}, versionTokens)
            }),
            tokenizer: (new Parser({
                os: true,
                osOnly: true,
                indexes: {},
                osIndexes: {},
                tokenizer: Object.assign({}, Parser.defaultOptions.tokenizer, {
                    tokens: Object.assign({}, versionTokens)
                }),
                osTokenizer: Object.assign({}, Parser.defaultOptions.osTokenizer, {
                    tokens: Object.assign({}, versionTokens)
                })
            })).tokenizer,
            os: true,
            oversionMap: Parser.normalizeVersionMap(lowerCaseProp(Parser.defaultOptions.osVersionMap, true, false))
        };

        let software = {
            data,
            file: opts.out.software,
            indexes: createIndex({
                tokens: Object.assign({}, versionTokens)
            }),
            tokenizer: new Tokenizer(),
            oversionMap: Parser.normalizeVersionMap(lowerCaseProp(Parser.defaultOptions.versionMap, true, false))
        };

        doTrain(os);
        doTrain(software);

        const conflictOptions = {};

        let conflicts = autofix(software.tokenizer, os.tokenizer, software.indexes, os.indexes, conflictOptions);

        if (conflicts) {
            console.log("conflicts between software tokenizer and os tokenizer", JSON.stringify(conflicts, null, 4));
            throw new Error("conflicts between software tokenizer and os tokenizer");
        }

        const tokens = Object.assign({}, software.indexes.tokens, os.indexes.tokens);

        const tokenizer = (new Parser({
            os: true,
            version: true,
            indexes: {},
            osIndexes: {},
            tokenizer: Object.assign({}, Parser.defaultOptions.tokenizer, {
                tokens
            }),
            osTokenizer: Object.assign({}, Parser.defaultOptions.osTokenizer, {
                tokens
            })
        })).tokenizer;

        conflicts = autofix(software.tokenizer, tokenizer, software.indexes, createIndex({
            tokens
        }), conflictOptions);

        if (conflicts) {
            console.log("conflicts between tokenizer and software tokenizer", JSON.stringify(conflicts, null, 4));
            throw new Error("conflicts between tokenizer and software tokenizer");
        }

        conflicts = autofix(os.tokenizer, tokenizer, os.indexes, createIndex({
            tokens
        }), conflictOptions);

        if (conflicts) {
            console.log("conflicts between tokenizer and os tokenizer", JSON.stringify(conflicts, null, 4));
            throw new Error("conflicts between tokenizer and os tokenizer");
        }

        tokenizer.updateTokens(tokens);

        os = {
            data,
            file: opts.out.os,
            os: true,
            indexes: createIndex({
                tokens: Object.assign({}, tokens)
            }),
            tokenizer,
            oversionMap: Parser.normalizeVersionMap(lowerCaseProp(Parser.defaultOptions.osVersionMap, true, false)),
            versionMap: os.versionMap,
            keepUnusedTokens: true,
        };

        software = {
            data,
            file: opts.out.software,
            indexes: createIndex({
                tokens: Object.assign({}, tokens)
            }),
            tokenizer,
            oversionMap: Parser.normalizeVersionMap(lowerCaseProp(Parser.defaultOptions.versionMap, true, false)),
            versionMap: software.versionMap,
            keepUnusedTokens: true,
        };

        doTrain(os);
        doTrain(software);

        // keep only used tokens
        const unused = flip(Object.keys(tokens), 1, true);

        let keys, key, obj, tmp, i;
        const stack = [os.indexes.children, software.indexes.children];

        // eslint-disable-next-line no-cond-assign
        while (obj = stack.pop()) {
            keys = Object.keys(obj);
            for (i = keys.length - 1; i >= 0; i--) {
                key = keys[i];
                tmp = key.endsWith(" *") ? key.slice(0, -2) : key;

                if (hasProp.call(unused, tmp)) {
                    unused[tmp] = undefined;
                }

                if (obj[key].children) {
                    stack.push(obj[key].children);
                }
            }
        }

        Object.keys(unused).forEach(token => {
            if (unused[token] != null) {
                delete tokens[token];
            }
        });

        // [os, software].forEach(({indexes, tokenizer: tokenizer_}) => {
        //     indexes.tokens = tokens;

        //     Object.keys(tokenizer_.DLknownIrrelevantTokens).forEach(token => {
        //         if (hasProp.call(tokens, token) && tokens[token] !== TOKEN_TYPES.IRRELEVANT) {
        //             tokens[token] = TOKEN_TYPES.IRRELEVANT;
        //         }
        //     });
        //     Object.keys(tokenizer_.DLknownFiniteVersionedTokens).forEach(token => {
        //         if (hasProp.call(tokens, token) && tokens[token] !== TOKEN_TYPES.FINITE_VERSION) {
        //             tokens[token] = TOKEN_TYPES.FINITE_VERSION;
        //         }
        //     });
        //     Object.keys(tokenizer_.DLknownInfiniteVersionedTokens).forEach(token => {
        //         if (hasProp.call(tokens, token) && tokens[token] !== TOKEN_TYPES.INFINITE_VERSION) {
        //             tokens[token] = TOKEN_TYPES.INFINITE_VERSION;
        //         }
        //     });
        //     Object.keys(tokenizer_.DLknownUnversionedTokens).forEach(token => {
        //         if (hasProp.call(tokens, token) && tokens[token] !== TOKEN_TYPES.UNVERSIONED) {
        //             tokens[token] = TOKEN_TYPES.UNVERSIONED;
        //         }
        //     });
        // });

        // sort to ease debugging
        Object.keys(tokens).sort().forEach(token => {
            const value = tokens[token];
            delete tokens[token];
            tokens[token] = value;
        });

        const ret = {
            os,
            software
        };

        Object.keys(ret).forEach(type => {
            const {errors, potentialVersion, versionMap, file, indexes} = ret[type];

            if (!conflicts) {
                fs.writeFileSync(file, JSON.stringify(indexes, null, 4));
            }

            if (errors) {
                console.log("Unable to find tokens for", type, JSON.stringify(errors, null, 4));
            }

            if (versionMap && Object.keys(versionMap).length !== 0) {
                console.log("version map", type, JSON.stringify(versionMap, null, 4));
            }

            if (potentialVersion && Object.keys(potentialVersion).length !== 0) {
                console.log("potential version matching", type, JSON.stringify(potentialVersion, null, 4));
            }
        });

        return ret;
    }
});
