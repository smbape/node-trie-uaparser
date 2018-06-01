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

const SIZE = 1024;
const patterns = new Array(SIZE);
const gen = generator(patterns.length);

for (let i = 0; i < SIZE; i++) {
    patterns[i] = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    patterns[i] = patterns[i].slice(0, Math.floor(Math.random() * patterns[i].length));
}

const trie = new Trie(patterns);

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
