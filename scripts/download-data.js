const fs = require("fs");
const sysPath = require("path");
const request = require("request");

["ua", "os"/*, "device"*/].forEach(type => {
    const filepath = sysPath.resolve(__dirname, "../data/test_" + type + ".yaml");
    fs.access(filepath, err => {
        if (err && err.code === "ENOENT") {
            console.log("downloading", filepath);
            request("https://raw.githubusercontent.com/ua-parser/uap-core/master/tests/test_" + type + ".yaml").pipe(fs.createWriteStream(filepath));
        }
    });
});
