/* eslint-env mocha */
const {expect} = require("chai");
const {parse} = require("../");
const fs = require("fs");
const sysPath = require("path");

describe("parse", () => {
    it("should parse Android Browser", () => {
        const ua = "Mozilla/5.0 (Linux; U; Android 4.1.2; fr-fr; G740-L00 Build/HuaweiG740-L00) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";
        expect(parse(ua)).to.equal("Android Browser");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Android Browser");
        expect(match.version).to.equal("4.0");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Android");
        expect(match.os.version).to.equal("4.1.2");
    });

    it("should parse Chrome", () => {
        const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
        expect(parse(ua)).to.equal("Chrome");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Chrome");
        expect(match.version).to.equal("66.0.3359.181");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Windows");
        expect(match.os.version).to.equal("10.0");
    });

    it("should parse Chromecast", () => {
        const ua = "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.84 Safari/537.36 CrKey/1.22.74257";
        expect(parse(ua)).to.equal("Google Chromecast");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Google Chromecast");
        expect(match.version).to.equal("1.22.74257");
    });

    it("should parse Edge", () => {
        const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; ServiceUI 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299";
        expect(parse(ua)).to.equal("Edge");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Edge");
        expect(match.version).to.equal("16.16299");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Windows");
        expect(match.os.version).to.equal("10.0");
    });

    it("should parse Firefox", () => {
        const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0";
        expect(parse(ua)).to.equal("Firefox");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Firefox");
        expect(match.version).to.equal("60.0");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Windows");
        expect(match.os.version).to.equal("10.0");
    });

    it("should parse IE11", () => {
        const ua = "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko";
        expect(parse(ua)).to.equal("Internet Explorer");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Internet Explorer");
        expect(match.version).to.equal("11.0");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Windows");
        expect(match.os.version).to.equal("10.0");
    });

    it("should parse IE11 - emulated IE10", () => {
        const ua = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 10.0; Trident/7.0)";
        expect(parse(ua)).to.equal("Internet Explorer");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Internet Explorer");
        expect(match.version).to.equal("11.0");
        expect(match.targetVersion).to.equal("10.0");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Windows");
        expect(match.os.version).to.equal("10.0");
    });

    it("should parse IE11 - Edge", () => {
        const ua = "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko";
        expect(parse(ua)).to.equal("Internet Explorer");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Internet Explorer");
        expect(match.version).to.equal("11.0");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Windows");
        expect(match.os.version).to.equal("8.1");
    });

    it("should parse IE10 - Edge", () => {
        const ua = "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)";
        expect(parse(ua)).to.equal("Internet Explorer");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Internet Explorer");
        expect(match.version).to.equal("10.0");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Windows");
        expect(match.os.version).to.equal("8.0");
    });

    it("should parse IE9 - Edge", () => {
        const ua = "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)";
        expect(parse(ua)).to.equal("Internet Explorer");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Internet Explorer");
        expect(match.version).to.equal("9.0");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Windows");
        expect(match.os.version).to.equal("7.0");
    });

    it("should parse IE8 - Edge", () => {
        const ua = "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)";
        expect(parse(ua)).to.equal("Internet Explorer");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Internet Explorer");
        expect(match.version).to.equal("8.0");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Windows");
        expect(match.os.version).to.equal("7.0");
    });

    it("should parse Opera", () => {
        const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36 OPR/52.0.2871.99";
        expect(parse(ua)).to.equal("Opera");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Opera");
        expect(match.version).to.equal("52.0.2871.99");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Windows");
        expect(match.os.version).to.equal("10.0");
    });

    it("should parse Opera Mini", () => {
        const ua = "Mozilla/5.0 (Linux; U; Android 4.1.2; G740-L00 Build/HuaweiG740-L00) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 OPR/35.0.2254.127755";
        expect(parse(ua)).to.equal("Opera Mini");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Opera Mini");
        expect(match.version).to.equal("35.0.2254.127755");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Android");
        expect(match.os.version).to.equal("4.1.2");
    });

    it("should parse Safari", () => {
        const ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.7 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7";
        expect(parse(ua)).to.equal("Safari");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("Safari");
        expect(match.version).to.equal("9.1.2");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Mac OS X");
        expect(match.os.version).to.equal("10.11.6");
    });

    it("should parse UC Browser", () => {
        const ua = "Mozilla/5.0 (Linux; U; Android 4.1.2; en-US; G740-L00 Build/HuaweiG740-L00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.5.0.1109 Mobile Safari/537.36";
        expect(parse(ua)).to.equal("UC Browser");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("UC Browser");
        expect(match.version).to.equal("12.5.0.1109");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Android");
        expect(match.os.version).to.equal("4.1.2");
    });

    it("should parse UC Browser Mini", () => {
        const ua = "Mozilla/5.0 (Linux; U; Android 4.1.2; en-US; G740-L00 Build/HuaweiG740-L00) AppleWebKit/528.5+ (KHTML, like Gecko) Version/3.1.2 Mobile Safari/525.20.1 UCBrowser/11.1.3.1128 Mobile";
        expect(parse(ua)).to.equal("UC Browser Mini");

        const match = parse(ua, {
            match: true
        });

        expect(match).not.to.equal(false);
        expect(match.family).to.equal("UC Browser Mini");
        expect(match.version).to.equal("11.1.3.1128");
        expect(match.os).not.to.equal(null);
        expect(typeof match.os).to.equal("object");
        expect(match.os.family).to.equal("Android");
        expect(match.os.version).to.equal("4.1.2");
    });

    it("should have more than 99% success rate", () => {
        const data = JSON.parse(fs.readFileSync(sysPath.resolve(__dirname, "../data/training.json")));

        let count = 0;
        let success = 0;

        data.forEach(agent => {
            const {ua, software: family} = agent;
            const match = parse(ua, {
                match: true
            });

            if (match !== false) {
                count++;

                if (match.family === family) {
                    success++;
                } else {
                    // console.error(`expect '${ match.family }' to equal '${ family }' for user agent '${ ua }'`);
                }
            } else {
                // console.error("unable to find tokens for", ua);
            }
        });

        expect(success / count > 0.99).to.equal(true);
    });
});
