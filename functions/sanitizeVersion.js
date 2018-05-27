const sanitizeVersion = str => {
    const len = str.length;
    const res = new Array(len);

    for (let i = 0, ch; i < len; i++) {
        ch = str[i];
        switch (ch) {
            case "-":
            case "_":
            case ",":
                res[i] = ".";
                break;
            default:
                res[i] = ch;
        }
    }

    return res.join("");
};

module.exports = sanitizeVersion;
