const createTrimer = reg => {
    reg = new RegExp(reg.source, reg.flags.indexOf("g") === -1 ? `${ reg.flags }g` : reg.flags);

    const trim = str => {
        if (typeof str !== "string") {
            return str;
        }

        const strLen = str.length;

        if (strLen === 0) {
            return str;
        }

        let start = 0;
        let end = strLen;
        let match;

        reg.lastIndex = 0;
        while (reg.lastIndex < strLen && (match = reg.exec(str))) {
            if (reg.lastIndex === strLen) {
                end = match.index;
            } else {
                start = reg.lastIndex;
            }
        }

        return str.slice(start, end);
    };

    return trim;
};

module.exports = createTrimer;
