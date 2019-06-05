const Ethiopian_multiplication = function(count) {
    // known faster way to convert to number particularly on IE11 and Firefox
    // https://jsperf.com/parse-vs-plus/10
    count |= 0;

    if (count < 0) {
        throw new RangeError("Invalid count value");
    }

    let str = '' + this;
    const len = str.length;

    // avoid unecessary computation when string is empty
    if (len === 0 || count === 0) {
        return "";
    }

    // tests on chrome 72 throw this error if total lengh exceeds 0x4FFFFFFF
    if (len * count >= 0x4FFFFFFF) { // eslint-disable-line no-magic-numbers
        throw new RangeError("Invalid string length");
    }

    let res = "";

    while (count > 1) {
        if (count & 1) {
            res += str; // 3. integer odd/even? (bit-wise and 1)
        }
        count >>>= 1; // 1. integer halved (by right-shift)
        str += str; // 2. integer doubled (addition to self)
    }

    return res + str;
};

const Polyfill_multiplication = function(count) {
    if (this == null) {
        throw new TypeError('can\'t convert ' + this + ' to object');
    }
    let str = '' + this;
    // To convert string to integer.
    count = +count;
    if (count != count) {
        count = 0;
    }
    if (count < 0) {
        throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
        throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
        return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
        throw new RangeError('repeat count must not overflow maximum string size');
    }
    const maxCount = str.length * count;
    count = Math.floor(Math.log(count) / Math.log(2));
    while (count) {
        str += str;
        count--;
    }
    str += str.substring(0, maxCount - str.length);
    return str;
};

const Polyfill_optimized_multiplication = function(count) {
    // known faster way to convert to number particularly on IE11 and Firefox
    // https://jsperf.com/parse-vs-plus/10
    count |= 0;

    if (count < 0) {
        throw new RangeError("Invalid count value");
    }

    let str = '' + this;
    const len = str.length;

    // avoid unecessary computation when string is empty
    if (len === 0 || count === 0) {
        return str;
    }

    const repeatedLen = str.length * count;

    // tests on chrome 72 throw this error if total lengh exceeds 0x4FFFFFFF
    if (repeatedLen >= 0x4FFFFFFF) { // eslint-disable-line no-magic-numbers
        throw new RangeError("Invalid string length");
    }

    const initialCount = count;
    count = Math.floor(Math.log(count) / Math.log(2));
    while (count) {
        str += str;
        count--;
    }

    return str + str.slice(0, repeatedLen - str.length);
};

const randomInteger = max => {
    return Math.random() * max | 0;
};

const benchmark = require("benchmark");
const suite = new benchmark.Suite();

[
    Ethiopian_multiplication,
    Polyfill_multiplication,
    Polyfill_optimized_multiplication,
    String.prototype.repeat,
].forEach(repeat => {
    const name = repeat.name;

    const count = randomInteger(100);
    const actual = repeat.call("0", count);
    const expected = String.prototype.repeat.call("0", count);
    if (actual !== expected) {
        throw new Error(`${ name } is not a valid repeat function`);
    }

    suite.add(name, () => {
        repeat.call("0", randomInteger(100));
    });
});

suite
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
