/* eslint-env mocha */
const {assert} = require("chai");
const lcs = require("../functions/lcs");

describe("lcs", () => {
    it("should return common \" substring\"", () => {
        const actual = lcs("Testing common \"abcd...\" substring", "abcd substring");
        const expected = {
            length: 10,
            offset1: 24,
            offset2: 4,
            sequence: " substring"
        };
        assert.deepEqual(actual, expected);
    });
    it("should return empty sequence if none common", () => {
        const actual = lcs("Testing common \"abcd...\" substring", "");
        const expected = {
            length: 0,
            offset1: 0,
            offset2: 0,
            sequence: ""
        };
        assert.deepEqual(actual, expected);
    });
    it("should return empty with invalid params", () => {
        const actual = lcs();
        const expected = {
            length: 0,
            offset1: 0,
            offset2: 0,
            sequence: ""
        };
        assert.deepEqual(actual, expected);
    });
});
