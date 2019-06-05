const longestStringComparator = (a, b) => {
    const aLen = a.length;
    const bLen = b.length;
    const len = aLen > bLen ? bLen : aLen;
    const astr = a.slice(0, len);
    const bstr = b.slice(0, len);

    if (astr > bstr) {
        return 1;
    }

    if (astr < bstr) {
        return -1;
    }

    return aLen > bLen ? -1 : aLen < bLen ? 1 : 0;
};

const jsesc = require("jsesc");
const flip = require("../functions/flip");
const Trie = require("../lib/Trie");

const SIZE = Math.pow(2, 10);
const LENGTH = Math.pow(2, 5);

// const patterns = Object.keys(require("../data/indexes.json").tokens);
const patterns = new Array(SIZE);

for (let i = 0, j; i < SIZE; i++) {
    patterns[i] = new Array(LENGTH);
    for (j = 0; j < LENGTH; j++) {
        patterns[i][j] = String.fromCharCode(32 + Math.round((127 - 32) * Math.random()));
    }
    patterns[i] = patterns[i].join("");
}

const trie = new Trie(patterns);

const esc = str => {
    return str.replace(/([\t\n\f\r\v\b\\$()*+\-.?[\]^{|}])/g, "\\$1").replace(/[^\x20-\x7E]/g, jsesc);
};

const hashmap = flip(patterns, 1, true);
const sortedReg = new RegExp(`^(?:${ patterns.slice().sort(longestStringComparator).map(esc).join("|") })`);
const trieReg = new RegExp(`^${ trie.toRegExp().source }`);

const hasProp = Object.prototype.hasOwnProperty;

const token = "windows nt 6.3";

const benchmark = require("benchmark");
const suite = new benchmark.Suite();

suite
    .add("hashmap", () => {
        hasProp.call(hashmap, token);
    })
    .add("sortedReg", () => {
        sortedReg.exec(token);
    })
    .add("  trieReg", () => {
        trieReg.exec(token);
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
