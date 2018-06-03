const jsesc = require("jsesc");
const hasProp = Object.prototype.hasOwnProperty;

class Trie {
    constructor(patterns) {
        this.init();
        this.add(patterns);
    }

    init() {
        this.dict = {};
        this.depth = 0;
        this.height = 0;
        this.paths = 0;
        this.nodes = 0;
        this.ends = {};
        this.letters = {};
    }

    add(patterns) {
        if (patterns == null) {
            return;
        }

        if (!Array.isArray(patterns)) {
            patterns = [patterns];
        }

        const len = patterns.length;

        for (let i = 0, dict, j, ch, pattern, strlen, height; i < len; i++) {
            pattern = patterns[i];
            if (pattern == null) {
                continue;
            }

            if (typeof patter !== "string") {
                pattern = String(pattern);
            }

            strlen = pattern.length;

            if (strlen === 0) {
                continue;
            }

            dict = this.dict;
            if (strlen > this.depth) {
                this.depth = strlen;
            }

            for (j = 0; j < strlen; j++) {
                ch = pattern[j];
                if (!hasProp.call(dict, ch)) {
                    dict[ch] = {};
                    this.nodes++;
                }

                height = Object.keys(dict).length;
                if (height > this.height) {
                    this.height = height;
                }

                this.letters[ch] = 1;

                dict = dict[ch];
            }

            if (!dict.end) {
                dict.end = true;
                this.paths++;
                this.ends[ch] = 1;
            }
        }
    }

    toRegExp(capture) {
        let source = "";

        const stack = new Array(this.depth);

        stack[0] = [this.dict, 0];

        let lastIndex = 0;
        let args, dict, parent, i, tmp, keys, processed, ch, maxlen, childrenLen, chars, strings, str;

        while (lastIndex >= 0) {
            args = stack[lastIndex--];
            [dict, processed, ch, i, parent] = args;

            if (!processed) {
                // process children first
                keys = Object.keys(dict).filter(key => key !== "end");
                processed = new Array(keys.length);
                args = [dict, processed, ch, i, parent];
                stack[++lastIndex] = args;

                for (i = 0, childrenLen = keys.length; i < childrenLen; i++) {
                    if (keys[i] === "end") {
                        continue;
                    }
                    ch = keys[i].replace(/([\t\n\f\r\v\b\\$()*+\-.?[\]^{|}])/g, "\\$1").replace(/[^\x20-\x7E]/g, jsesc);
                    stack[++lastIndex] = [dict[keys[i]], undefined, ch, i, processed];
                }

                continue;
            }

            childrenLen = processed.length;

            if (childrenLen === 0) {
                // no children
                if (parent) {
                    parent[i] = ch;
                }
                continue;
            }

            chars = [];
            strings = [];

            for (tmp = 0; tmp < childrenLen; tmp++) {
                str = processed[tmp];
                if (str.length === 1) {
                    chars.push(str);
                } else {
                    strings.push(str);
                }
            }

            if (chars.length === 0) {
                tmp = strings.join("|");
            } else {
                if (chars.length === 1) {
                    chars = chars[0];
                } else {
                    chars = `[${ chars.join("") }]`;
                }

                if (strings.length !== 0) {
                    tmp = `${ chars }|${ strings.join("|") }`;
                } else {
                    tmp = chars;
                }
            }

            if (childrenLen !== 1) {
                if (capture && !parent) {
                    tmp = `(${ tmp })`;
                } else {
                    tmp = `(?:${ tmp })`;
                }
            } else if (capture && !parent) {
                tmp = `(${ tmp })`;
            }

            if (parent) {
                if (dict.end) {
                    if (maxlen === 1 || childrenLen !== 1) {
                        tmp += "?";
                    } else {
                        tmp = `(?:${ tmp })?`;
                    }
                }

                parent[i] = `${ ch }${ tmp }`;
            } else {
                source = tmp;
            }
        }

        return new RegExp(source);
    }

    toString(capture) {
        return this.toRegExp(capture).source;
    }

    toFunction() {
        const source = [`
        if (typeof str !== "string") {
            return -1;
        }
        const len = str.length;
        if (len === 0) {
            return -1;
        }
        `, ""];

        const stack = new Array(this.depth);

        stack[0] = [this.dict, 0];

        let lastIndex = 0;
        let args, dict, len, parent, i, tmp, keys, processed, ch, childrenLen;

        while (lastIndex >= 0) {
            args = stack[lastIndex--];
            [dict, len, processed, ch, i, parent] = args;

            if (!processed) {
                // process children first
                keys = Object.keys(dict).filter(key => key !== "end");
                processed = new Array(keys.length);
                args = [dict, len, processed, ch, i, parent];
                stack[++lastIndex] = args;

                for (i = 0, childrenLen = keys.length; i < childrenLen; i++) {
                    ch = keys[i];
                    stack[++lastIndex] = [dict[ch], len + 1, undefined, `${ JSON.stringify(ch) }`, i, processed];
                }

                continue;
            }

            if (processed.length === 0) {
                // no children
                if (parent) {
                    parent[i] = `
                        case ${ ch }:
                            return ${ dict.end ? len : -1 };
                    `;
                }
                continue;
            }

            tmp = `
                    if (len === ${ len }) {
                        return ${ dict.end ? len : -1 };
                    }

                    switch(str[${ len }]) {
                        ${ processed.join("") }
                        default:
                            return ${ dict.end ? len : -1 };
                    }
                `;

            if (parent) {
                parent[i] = `
                        case ${ ch }:
                            ${ tmp }
                    `;
            } else {
                source[1] = tmp;
            }
        }

        // eslint-disable-next-line no-new-func
        return new Function("str", source.join("\n"));
    }

    match(str, start, end) {
        if (typeof str !== "string") {
            return -1;
        }

        const len = str.length;

        if (start == null) {
            start = 0;
        } else if (start < 0) {
            start += len;
        }

        if (end == null) {
            end = len;
        } else if (end < 0) {
            end += len;
        }

        let dict = this.dict;

        let i = start;
        while (i < end && hasProp.call(dict, str[i])) {
            dict = dict[str[i]];
            i++;
        }

        return dict.end ? i : -1;
    }
}

module.exports = Trie;
