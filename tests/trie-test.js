/* eslint-env mocha */
const {expect} = require("chai");
const jsesc = require("jsesc");
const Trie = require("../lib/Trie");

const SIZE = Math.pow(2, 5);
const patterns = new Array(SIZE);

const dump = str => {
    return str.replace(/([\t\n\f\r\\$()*+\-.?[\]^{|}])/g, "\\$1").replace(/[^\x20-\x7E]/g, jsesc);
};

for (let i = 0, len; i < SIZE; i++) {
    patterns[i] = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    len = Math.round(Math.random() * patterns[i].length);
    if (len !== 0) {
        patterns[i] = patterns[i].slice(0, len);
    }
}

describe("Trie", () => {
    it("should create", () => {
        const trie1 = new Trie(patterns);
        const trie2 = new Trie();
        trie2.add(patterns);

        expect(trie1.toRegExp().source).to.equal(trie2.toRegExp().source);
    });

    it("should toRegExp", () => {
        const trie = new Trie(patterns);
        const reg = new RegExp(`^${ trie.toRegExp().source }`);

        patterns.forEach(pattern => {
            expect(reg.test(String(pattern))).to.equal(true, `Expecting to match "${ dump(pattern) }"`);
            expect(reg.test(`${ pattern }===`)).to.equal(true, `Expecting to match "${ dump(pattern) }"`);
            expect(reg.test(`===${ pattern }`)).to.equal(false, `Expecting to not match "${ dump(pattern) }"`);
        });
    });

    it("should toRegExp capture", () => {
        const trie = new Trie(patterns);
        const reg = new RegExp(`^${ trie.toRegExp(true).source }`);

        patterns.forEach(pattern => {
            const match = Object.assign([String(pattern), String(pattern)], {
                index: 0,
                input: "0"
            });

            expect(reg.exec(String(pattern))).to.deep.equal(match, `Expecting to match "${ dump(pattern) }"`);
            expect(reg.exec(`${ pattern }===`)).to.deep.equal(match, `Expecting to match "${ dump(pattern) }"`);
            expect(reg.exec(`===${ pattern }`)).to.equal(null, `Expecting to not match "${ dump(pattern) }"`);
        });
    });
});
