const fs = require("fs");
const isEqual = require("lodash/isEqual");

const Tokenizer = require("./Tokenizer");
const Parser = require("./Parser");

const { TOKEN_TYPES } = Tokenizer;
const hasProp = Object.prototype.hasOwnProperty;
const TRAIN_LIMIT = 6;

// let id = 1;
const createIndex = props => {
    const index = Object.create(null);
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

const train = (data, options, tokensCb) => {
    data.forEach(agent => {
        const {ua} = agent;
        const name = getDataName(agent, options);

        if (name == null) {
            return;
        }

        const lname = name.toLowerCase();
        options.lnames = [lname];

        if (lname.indexOf(" ") !== -1) {
            options.lnames.push(lname.replace(/ /g, ""));
            options.lnames.push(lname.replace(/ /g, "-"));
        }

        const tokens = options.tokenizer.getTokens(ua, Object.assign(Object.create(null), options, {
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
            parent.children = Object.create(null);
        }

        if (!hasProp.call(parent.children, token)) {
            parent.children[token] = createIndex();
        }

        parent = parent.children[token];
    }

    if (hasProp.call(parent, "name")) {
        if (typeof parent.name === "string") {
            const _name = parent.name;
            parent.name = Object.create(null);
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

    let stack, keys, key, obj, tokens, tmp, i;

    if (!parent) {
        // keep only tokens that are used
        tokens = Object.create(null);
        Object.keys(indexes.tokens).forEach(token => {
            if (indexes.tokens[token] === TOKEN_TYPES.REMOVED) {
                tokens[token] = indexes.tokens[token];
            }
        });

        stack = [indexes.children];

        // eslint-disable-next-line no-cond-assign
        while (obj = stack.pop()) {
            keys = Object.keys(obj);
            for (i = keys.length - 1; i >= 0; i--) {
                key = keys[i];
                tmp = key.startsWith(" *", key.length - 2) ? key.slice(0, -2) : key;

                if (hasProp.call(indexes.tokens, tmp) && !hasProp.call(tokens, tmp)) {
                    tokens[tmp] = indexes.tokens[tmp];
                }

                if (obj[key].children) {
                    stack.push(obj[key].children);
                }
            }
        }

        indexes.tokens = tokens;
    }

    return indexes;
};

const doTrain = options => {
    const indexes = options.indexes;
    const tokenizer = options.tokenizer;
    const data = options.data;

    const errors = [];

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
        options.potentialVersion = Object.create(null);
    }

    const potentialVersion = options.potentialVersion;

    if (options.count == null) {
        options.count = 0;
    }

    if (options.count >= TRAIN_LIMIT) {
        throw new Error("Too much trainning. Something is wrong");
    }

    if (options.lastTokens == null) {
        options.lastTokens = Object.create(null);
    }

    while (options.count < TRAIN_LIMIT && (Object.keys(indexes.tokens).length === 0 || !isEqual(indexes.tokens, options.lastTokens))) {
        options.count++;
        console.error(`Train ${ options.os ? "os      " : "software" }`, options.count);

        Object.assign(options.lastTokens, indexes.tokens);
        tokenizer.updateTokens(indexes.tokens);

        errors.length = 0;
        delete indexes.children;

        train(data, {
            ontoken: (token, type, index, ua, currentTokens, agent) => {
                const name = getDataName(agent, options);
                const version = getDataVersion(agent, options);

                if (type === 2) {
                    if (!hasProp.call(indexes.tokens, token)) {
                        indexes.tokens[token] = TOKEN_TYPES.UNVERSIONED;
                    }
                } else if (type === 0) {
                    if (version && token.startsWith(version) && currentTokens.length !== 0) {
                        token = currentTokens[currentTokens.length - 1];
                        if (hasProp.call(indexes.tokens, token)) {
                            if (!hasProp.call(potentialVersion, name)) {
                                potentialVersion[name] = Object.create(null);
                            }
                            potentialVersion[name][token] = 1;
                            if (!hasProp.call(tokenizer.DLknownIrrelevantTokens, token)) {
                                indexes.tokens[token] = TOKEN_TYPES.INFINITE_VERSION;
                            }
                        }
                    }
                }
            },
            tokenizer,
            os: options.os
        }, tokensCb);

        Object.keys(indexes.tokens).sort((a, b) => {
            return a.length > b.length ? -1 : a.length < b.length ? 1 : 0;
        }).forEach((token1, i, keys) => {
            if (indexes.tokens[token1] === TOKEN_TYPES.UNVERSIONED) {
                tokenizer.LknownVersionedTokens.forEach(token2 => {
                    if (token1.startsWith(token2)) {
                        indexes.tokens[token1] = TOKEN_TYPES.INFINITE_VERSION;
                    }
                });

                const len = keys.length;
                for (let j = i + 1, token2; j < len; j++) {
                    token2 = keys[j];

                    if (indexes.tokens[token2] === TOKEN_TYPES.INFINITE_VERSION && token1.startsWith(token2)) {
                        indexes.tokens[token1] = indexes.tokens[token2];
                    }
                }
            }
        });
    }

    compressIndexes(indexes);

    // remove unused tokens
    tokenizer.updateTokens(indexes.tokens, Object.keys(options.lastTokens).filter(token => !hasProp.call(indexes.tokens, token)));

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

        let os = {
            data,
            file: opts.out.os,
            indexes: createIndex({
                tokens: Object.create(null)
            }),
            tokenizer: (new Parser({
                os: true,
                osOnly: true,
                indexes: Object.create(null),
                osIndexes: Object.create(null),
                tokenizer: Object.assign(Object.create(null), Parser.defaultOptions.tokenizer, {
                    tokens: undefined
                }),
                osTokenizer: Object.assign(Object.create(null), Parser.defaultOptions.osTokenizer, {
                    tokens: undefined
                })
            })).tokenizer,
            os: true
        };

        let software = {
            data,
            file: opts.out.software,
            indexes: createIndex({
                tokens: Object.create(null)
            }),
            tokenizer: new Tokenizer()
        };

        doTrain(os);
        doTrain(software);

        const conflictOptions = {};

        let conflicts = autofix(software.tokenizer, os.tokenizer, software.indexes, os.indexes, conflictOptions);

        if (conflicts) {
            console.log("conflicts between software tokenizer and os tokenizer", JSON.stringify(conflicts, null, 4));
            throw new Error("conflicts between software tokenizer and os tokenizer");
        }

        const tokens = Object.assign(Object.create(null), software.indexes.tokens, os.indexes.tokens);

        const tokenizer = (new Parser({
            os: true,
            version: true,
            indexes: Object.create(null),
            osIndexes: Object.create(null),
            tokenizer: Object.assign(Object.create(null), Parser.defaultOptions.tokenizer, {
                tokens
            }),
            osTokenizer: Object.assign(Object.create(null), Parser.defaultOptions.osTokenizer, {
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
                tokens: Object.assign(Object.create(null), tokens)
            }),
            tokenizer
        };

        software = {
            data,
            file: opts.out.software,
            indexes: createIndex({
                tokens: Object.assign(Object.create(null), tokens)
            }),
            tokenizer
        };

        doTrain(os);
        doTrain(software);

        [os, software].forEach(({indexes, tokenizer: tokenizer_}) => {
            const tokens_ = Object.create(null);

            Object.keys(tokenizer_.DLknownIrrelevantTokens).forEach(token => {
                tokens_[token] = TOKEN_TYPES.IRRELEVANT;
            });
            Object.keys(tokenizer_.DLknownFiniteVersionedTokens).forEach(token => {
                tokens_[token] = TOKEN_TYPES.FINITE_VERSION;
            });
            Object.keys(tokenizer_.DLknownInfiniteVersionedTokens).forEach(token => {
                tokens_[token] = TOKEN_TYPES.INFINITE_VERSION;
            });
            Object.keys(tokenizer_.DLknownUnversionedTokens).forEach(token => {
                tokens_[token] = TOKEN_TYPES.UNVERSIONED;
            });

            indexes.tokens = tokens_;

            // sort to ease debugging
            Object.keys(indexes.tokens).sort().forEach(token => {
                const value = indexes.tokens[token];
                delete indexes.tokens[token];
                indexes.tokens[token] = value;
            });
        });

        const ret = {
            os,
            software
        };

        Object.keys(ret).forEach(type => {
            const {errors, potentialVersion, file, indexes} = ret[type];

            if (!conflicts) {
                fs.writeFileSync(file, JSON.stringify(indexes, null, 4));
            }

            if (errors) {
                console.log("Unable to find tokens for", type, JSON.stringify(errors, null, 4));
            }

            if (potentialVersion && Object.keys(potentialVersion).length !== 0) {
                console.log("potential version matching", type, JSON.stringify(potentialVersion, null, 4));
            }
        });

        return ret;
    }
});
