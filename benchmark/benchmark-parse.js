const benchmark = require("benchmark");

const {Parser} = require("../");
const useragent = require("useragent");
const uaparser = require("ua-parser");
const useragent_parser = require("useragent_parser");
const useragent_parser2 = require("useragent-parser");

const shuffle = a => {
    let j;
    for (let i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
};

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

const testcases = shuffle(require("../data/training.json").map(({ua}) => ua));
const gen = generator(testcases.length);
const suite = new benchmark.Suite();

const trieUaparser = new Parser({
    os: true,
    version: true,
    splitVersion: true,
});

suite
    .add(`   trie-uaparser v${ require("../package.json").version }`, () => {
        trieUaparser.parse(testcases[gen.next()]);
    })
    .add(`       useragent v${ require("useragent/package.json").version }`, () => {
        useragent.parse(testcases[gen.next()]);
    })
    .add(`useragent_parser v${ require("useragent_parser/package.json").version }`, () => {
        useragent_parser.parse(testcases[gen.next()]);
    })
    .add(`useragent-parser v${ require("useragent-parser/package.json").version }`, () => {
        useragent_parser2.parse(testcases[gen.next()]);
    })
    .add(`       ua-parser v${ require("ua-parser/package.json").version }`, () => {
        uaparser.parseUA(testcases[gen.next()]);
    })
    .on("cycle", event => {
        console.log(event.target.toString());
        gen.reset();
    })
    .on("complete", function() {
        // eslint-disable-next-line no-invalid-this
        console.log(`Fastest is ${ this.filter("fastest").map("name").toString().trim() }`);
    })
    .run({
        async: false
    });
