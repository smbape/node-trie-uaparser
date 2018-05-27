const benchmark = require("benchmark");

const version = "10_11_6";
const suite = new benchmark.Suite();
const CHARS = "-_,".split("");

const replace = str => {
    return version.replace(/[-_,]/g, ".");
};

const exec = str => {
    const reg = /[-_,]/g;
    const len = str.length;
    const res = new Array(len);
    let i = 0;
    let match;
    let lastIndex = 0;

    // eslint-disable-next-line no-cond-assign
    while (match = reg.exec(str)) {
        res[i++] = str.slice(lastIndex, match.index);
        res[i++] = ".";
        lastIndex = reg.lastIndex;
    }

    if (lastIndex < len) {
        res[i++] = str.slice(lastIndex);
    }

    return res.slice(0, i).join("");
};

const indexOf = str => {
    const res = Array.from(str);

    const len = CHARS.length;
    let i, j, ch;

    for (i = 0; i < len; i++) {
        ch = CHARS[i];
        j = -1;

        // eslint-disable-next-line no-cond-assign
        while ((j = str.indexOf(ch, j + 1)) !== -1) {
            res[j] = ".";
        }
    }

    return res.join("");
};

const sanitizeVersion = require("../functions/sanitizeVersion");

suite
    .add("replace", () => {
        replace(version);
    })
    .add("exec", () => {
        exec(version);
    })
    .add("indexOf", () => {
        indexOf(version);
    })
    .add("sanitizeVersion", () => {
        sanitizeVersion(version);
    })
    .on("cycle", event => {
        console.log(String(event.target));
    })
    .on("complete", function() {
        // eslint-disable-next-line no-invalid-this
        console.log(`Fastest is ${ this.filter("fastest").map("name").toString().trim() }`);
    })
    .run({
        async: true
    });
