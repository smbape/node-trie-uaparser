/* eslint-env mocha */
const {expect} = require("chai");
const Trie = require("../lib/Trie");

describe("Trie", () => {
    it("should create", () => {
        const patterns = [0, 1, 2, "a", "aa", "aaa", "b", "bb", "bbb", 3, 4];
        const trie1 = new Trie(patterns);
        const trie2 = new Trie();
        trie2.add(patterns);

        expect(trie1.toRegExp().source).to.equal(trie2.toRegExp().source);
    });

    it("should toRegExp", () => {
        const patterns = [0, 1, 2, "a", "aa", "aaa", "b", "bb", "bbb", 3, 4, 43218, "fisopud"];
        const trie = new Trie(patterns);

        patterns.forEach(pattern => {
            expect(new RegExp(`^${ trie.toRegExp().source }`).test(String(pattern))).to.equal(true);
            expect(new RegExp(`^${ trie.toRegExp().source }`).test(`${ pattern }z`)).to.equal(true);
            expect(new RegExp(`^${ trie.toRegExp().source }`).test(`z${ pattern }`)).to.equal(false);
        });
    });

    it("should toRegExp capture", () => {
        const patterns = [0, 1, 2, "a", "aa", "aaa", "b", "bb", "bbb", 3, 4, 43218, "fisopud"];
        const trie = new Trie(patterns);

        patterns.forEach(pattern => {
            const match = Object.assign([String(pattern), String(pattern)], {
                index: 0,
                input: "0"
            });

            expect(new RegExp(`^${ trie.toRegExp(true).source }`).exec(String(pattern))).to.deep.equal(match);
            expect(new RegExp(`^${ trie.toRegExp(true).source }`).exec(`${ pattern }z`)).to.deep.equal(match);
            expect(new RegExp(`^${ trie.toRegExp(true).source }`).exec(`z${ pattern }`)).to.equal(null);
        });
    });
});
