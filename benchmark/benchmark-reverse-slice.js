const benchmark = require("benchmark");

const reverseSlice = require("../functions/reverseSlice");

const len = 15;
const cut = len - 5;

const arr = new Array(len);
for (let i = 0; i < len; i++) {
    arr[i] = i;
}

const suite = new benchmark.Suite();

suite
    .add("Array#slice(...).reverse()", () => {
        arr.slice(0, cut).reverse();
    })
    .add("         reverseSlice(...)", () => {
        reverseSlice(arr, cut);
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
