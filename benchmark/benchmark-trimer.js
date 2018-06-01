const benchmark = require("benchmark");

const createTrimer = require("../functions/createTrimer");
const reg = /(?:^[“\\,!:#"'+<[?]+|[>\]'"#:!,\\“+?]+$)/g;
const trimIrrelevant = createTrimer(reg);

const suite = new benchmark.Suite();

suite
    .add("replace unmatched", () => {
        const token = "mozilla/4.0";
        reg.lastIndex = 0;
        token.replace(reg, "");
    })
    .add("trimIrrelevant unmatched", () => {
        trimIrrelevant("mozilla/4.0");
    })
    .add("replace matched start", () => {
        const token = "+mozilla/4.0";
        reg.lastIndex = 0;
        token.replace(reg, "");
    })
    .add("trimIrrelevant matched start", () => {
        trimIrrelevant("+mozilla/4.0");
    })
    .add("replace matched end", () => {
        const token = "mozilla/4.0+";
        reg.lastIndex = 0;
        token.replace(reg, "");
    })
    .add("trimIrrelevant matched end", () => {
        trimIrrelevant("mozilla/4.0+");
    })
    .add("replace matched start end", () => {
        const token = "+mozilla/4.0+";
        reg.lastIndex = 0;
        token.replace(reg, "");
    })
    .add("trimIrrelevant matched start end", () => {
        trimIrrelevant("+mozilla/4.0+");
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
