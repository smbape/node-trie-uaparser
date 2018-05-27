const sysPath = require("path");

const Parser = require("./Parser");
const Trainer = require("./Trainer");
const data = require("./data");

const config = Trainer.train({
    data,
    out: {
        os: sysPath.resolve(__dirname, "../data/indexes-os.json"),
        software: sysPath.resolve(__dirname, "../data/indexes.json"),
        device: sysPath.resolve(__dirname, "../data/indexes-device.json"),
    }
});

const parser = new Parser({
    os: true,
    version: true,
    indexes: config.software.indexes,
    osIndexes: config.os.indexes,
    tokenizer: Object.assign(Object.create(null), Parser.defaultOptions.tokenizer, {
        tokens: config.software.indexes.tokens
    }),
    osTokenizer: Object.assign(Object.create(null), Parser.defaultOptions.osTokenizer, {
        tokens: config.os.indexes.tokens
    })
});

let count = 0;
let total = 0;

const failures = {
    software: [],
    version: [],
    os: [],
};

const success = {
    software: 0,
    version: 0,
    os: 0,
};

const timerInit = Date.now();
data.forEach(agent => {
    const {ua, software, version} = agent;
    let { os } = agent;

    if (typeof os === "object") {
        os = os.family;
    }

    const match = parser.parse(ua, {
        match: true
    });

    total++;

    if (match !== false) {
        count++;

        if (match.family !== software && software != null) {
            failures.software.push([match.family, software, ua, match.tokens.join(", ")]);
        } else {
            success.software++;
        }

        if ((match.os == null && os !== "--" && os != null) || (match.os && match.os.family !== os && os != null)) {
            failures.os.push([match.os, os, match.family, software, ua, match.tokens.join(", ")]);
        } else {
            success.os++;
        }

        if ((version && match.version == null) || (match.version != null && version != null && !match.version.startsWith(version))) {
            failures.version.push([match.version, version, match.family, software, ua, match.tokens.join(", ")]);
        } else {
            success.version++;
        }
    } else {
        // console.log("unable to find tokens for", ua);
    }
});

console.error("trie-uaparser", total, Date.now() - timerInit, "ms");

const strlen = Object.keys(success).sort((a, b) => {
    a = a.length;
    b = b.length;
    return a > b ? -1 : a < b ? 1 : 0;
})[0].length;

Object.keys(success).forEach(key => {
    const padded = " ".repeat(strlen - key.length) + key;
    console.error(padded, `${ (success[key] * 100 / count).toFixed(2) }%`, `${ count - success[key] }, ${ success[key] }, ${ count }`);

    if (failures[key].length !== 0) {
        console.log(`${ key } failures`, JSON.stringify(failures[key], null, 4));
    }
});
