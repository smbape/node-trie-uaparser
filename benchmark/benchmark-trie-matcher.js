const Trie = require("../lib/Trie");

const generator = len => {
    let index = 0;

    return {
        next: () => {
            if (index === len) {
                index = 0;
            }
            return index++;
        },
        reset: () => {
            index = 0;
        }
    };
};

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

const gen = generator(patterns.length);

const trie = new Trie(patterns);
console.log(JSON.stringify({
    nodes: trie.nodes,
    depth: trie.depth,
    height: trie.height,
    paths: trie.paths,
    ends: Object.keys(trie.ends).length,
    letters: Object.keys(trie.letters).length,
}, null, 4));

const RegexTrie = require("regex-trie");
const regexTrie = (new RegexTrie()).add(patterns).toRegExp();

const trieReg = new RegExp(`^${ trie.toRegExp().source }`);
const trieFn = trie.toFunction();

const benchmark = require("benchmark");
const suite = new benchmark.Suite();

suite
    .add("match", () => {
        trie.match(patterns[gen.next()]);
    })
    .add("function", () => {
        trieFn(patterns[gen.next()]);
    })
    .add("regex", () => {
        trieReg.test(patterns[gen.next()]);
    })
    .add("regexTrie", () => {
        regexTrie.test(patterns[gen.next()]);
    })
    .on("cycle", event => {
        console.log(String(event.target));
        gen.reset();
    })
    .on("complete", function() {
        // eslint-disable-next-line no-invalid-this
        console.log(`Fastest is ${ this.filter("fastest").map("name").toString().trim() }`);
    })
    .run({
        async: true
    });
