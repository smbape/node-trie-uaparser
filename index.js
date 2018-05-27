const Tokenizer = require("./lib/Tokenizer");
const { getTokens } = Tokenizer;
const Parser = require("./lib/Parser");
const { parse } = Parser;

Object.assign(exports, {
    Tokenizer,
    getTokens,
    Parser,
    parse,
});
