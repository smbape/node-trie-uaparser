"use strict";

const flip = require("../functions/flip");
const lowerCaseProp = require("../functions/lowerCaseProp");
const sanitizeVersion = require("../functions/sanitizeVersion");

const Tokenizer = require("./Tokenizer");

const hasProp = Object.prototype.hasOwnProperty;

const tryRequire = (request, defval) => {
    try {
        return require(request);
    } catch (err) {
        return defval;
    }
};

const DEFAULT_INDEXES = tryRequire("../data/indexes.json", Object.create(null));
const DEFAULT_OS_INDEXES = tryRequire("../data/indexes-os.json", Object.create(null));

const defaultOptions = {
    indexes: {
        children: DEFAULT_INDEXES.children
    },
    osIndexes: {
        children: DEFAULT_OS_INDEXES.children
    },
    tokenizer: Object.assign(Object.create(null), Tokenizer.defaultOptions, {
        tokens: DEFAULT_INDEXES.tokens
    }),
    osTokenizer: Object.assign(Object.create(null), Tokenizer.defaultOptions, {
        tokens: DEFAULT_OS_INDEXES.tokens
    }),
    versionMap: {
        "1337Browser": "1337Browser *",
        "200PleaseBot": "200PleaseBot *",
        "Ahrefs Backlink Research Bot": "AhrefsBot *",
        "Adobe Air": "AdobeAIR *",
        "Alertsite Monitoring Bot": "DejaClick *",
        "Alexa Site Audit": "audit *",
        "Android Browser": "Version *",
        "Aol Browser": "AOL *",
        "Apache HttpClient": "Apache-HttpClient *",
        Arora: "Arora *",
        Awesomium: "Awesomium *",
        "Baidu Spider": "Baiduspider *",
        Bingbot: "bingbot *",
        BingPreview: "BingPreview *",
        "Blackberry Browser": "Version *",
        "Broadsign Xpress": "BroadSign Xpress *",
        "CareerBot Search Crawler": "CareerBot *",
        "Catchpoint Analyser": "Chrome *",
        Chimera: "Chimera *",
        Chrome: ["Chrome *", "HeadlessChrome *", "CrMo *", "CriOS *"],
        Chromium: "Chromium *",
        "Comodo Icedragon": "Icedragon *",
        Curl: "curl *",
        "Delphi Embedded Web Browser": "EmbeddedWB *",
        "Domaintools Surveybot": "SurveyBot *",
        "Dorado Wap Browser": "WAP-Browser *",
        "Dotcom Monitor Bot": ["DMBrowser *", "Version *"],
        Dragon: "Dragon *",
        "Duckduckgo Favicons Bot": "DuckDuckGo-Favicons-Bot *",
        Edge: "Edge *",
        "Electron Application": "Electron *",
        Epiphany: "Epiphany *",
        "Exalead Crawler": "Exabot *",
        "ExB Language Crawler": "ExB Language Crawler *",
        "Facebook App": "FBAV *",
        "Facebook Bot": "facebookexternalhit *",
        Firebird: "Firebird *",
        Firefox: "Firefox *",
        "Genieo Bot": "Genieo *",
        "Gnip Unwindfetchor Crawler": "UnwindFetchor *",
        GomezAgent: "GomezAgent *",
        "Google Chromecast": "CrKey *",
        "Google Search App": "GSA *",
        "Google'S Media Partners System (Adsense)": "Mediapartners-Google *",
        "GoogleBot Mobile": "GoogleBot-Mobile *",
        GoogleBot: "GoogleBot *",
        "Grapeshot Bot": "GrapeshotCrawler *",
        Httpclient: "HTTPClient *",
        Iceweasel: "Iceweasel *",
        "Internet Explorer": lowerCaseProp({
            "Trident *": {
                3.1: "7.0",
                "4.0": "8.0",
                "5.0": "9.0",
                "6.0": "10.0",
                "7.0": "11.0",
            },
            "MSIE *": 1,
        }),
        "Internet Explorer Mobile": lowerCaseProp({
            "Trident *": {
                3.1: "7.0",
                "4.0": "8.0",
                "5.0": "9.0",
                "6.0": "10.0",
                "7.0": "11.0",
            },
            "MSIE *": 1,
        }),
        "Internet Tv Browser": "InettvBrowser *",
        "Jakarta Commons Httpclient": "Jakarta Commons-HttpClient *",
        "Javafx Platform": "JavaFX *",
        "Java Runtime Environment": "Java *",
        "K Meleon": "K-Meleon *",
        "Kindle Browser": "Version *",
        Konqueror: "Konqueror *",
        "Library For Www In Perl": "libwww-perl *",
        "Linkcheck Analyser": "MSIE *",
        Links: "links *",
        Lynx: "Lynx *",
        "Majestic 12 Distributed Search Bot": "MJ12bot *",
        Maxthon: "Maxthon *",
        "Meanpath Bot": "meanpathbot *",
        "Microsoft CryptoAPI": "Microsoft-CryptoAPI *",
        Midori: "Midori *",
        Minefield: "Minefield *",
        "Msn Bot": "msnbot *",
        "Mvision Player": "MVisionPlayer *",
        NetFront: "NetFront *",
        "Netseer Crawler": "NetSeer crawler *",
        Newsbot: "news bot *",
        Nexplayer: "NexPlayer *",
        "Nintendo Browser": "NintendoBrowser *",
        "Nokia Browser": "NokiaBrowser *",
        Okhttp: "okhttp *",
        "Openwave Mobile Browser": ["UP.Browser *", "Openwave *"],
        "Opera Mini": ["Opera Mini *", "OPR *", "Version *", "Opera *"],
        Opera: ["OPR *", "Version *", "Opera *"],
        "Ovi Browser": "S40OviBrowser *",
        PhantomJS: "PhantomJS *",
        "Pinterest Bot": "Pinterest *",
        Puffin: "Puffin *",
        "Python Urllib": "Python-urllib *",
        "QQ Browser": "MQQBrowser *",
        QupZilla: "QupZilla *",
        Rekonq: "rekonq *",
        Ruxitsynthetic: "RuxitSynthetic *",
        Safari: "Version *",
        "Samsung Browser": "SamsungBrowser *",
        SeaMonkey: "SeaMonkey *",
        Secondlife: "SecondLife *",
        "Amazon Silk": "Silk *",
        "Slackbot Link Checker": "Slackbot-LinkExpanding *",
        "Sosospider Search Bot": "Sosospider *",
        "Speedcurve Speed Tester": "PTST *",
        "Squider Bot": "Squider *",
        "Sogou Explorer": "SE *",
        "Sogou \"Search Dog\"": "Sogou web spider *",
        "Srware Iron": "Iron *",
        Thunderbird: "Thunderbird *",
        "Tweetmeme Bot": "TweetmemeBot *",
        TwitterBot: "TwitterBot *",
        "UC Browser": "UCBrowser *",
        "UC Browser Mini": "UCBrowser *",
        "Vision Mobile Browser": "Novarra-Vision *",
        Vivaldi: "Vivaldi *",
        "W3C Validator": "W3C_Validator *",
        W3M: "w3m *",
        Waterfox: "Waterfox *",
        "webOS Browser": "wOSBrowser *",
        Webpositive: "Webpositive *",
        "Webview Based Browser": "WebView *",
        Wget: "Wget *",
        "Yandex Browser": "YaBrowser *",
        "Yandex Search Bot": "YandexBot *",
        "Yodaobot Search Bot": "YodaoBot *",
    },
    osVersionMap: {
        Android: "android *",
        iOS: ["ipad *", "iphone *"],
        "Mac OS X": ["Mac OS X *"],
        Windows: lowerCaseProp({
            "windows nt *": {
                "10.0": "10.0",
                6.3: "8.1",
                6.2: "8.0",
                6.1: "7.0",
                "6.0": "Vista",
                5.2: "XP Professional x64",
                5.1: "XP",
                "5.0": "2000",
            }
        }),
        "Windows Phone": ["Windows Phone *", "Windows Phone OS *"],
    },
    targetVersionMap: {
        "Internet Explorer": lowerCaseProp({
            "MSIE *": 1
        }),
        "Internet Explorer Mobile": lowerCaseProp({
            "MSIE *": 1
        }),
    },
};

class Parser {
    constructor(options) {
        options = Object.assign(Object.create(null), Parser.defaultOptions, options);
        options.tokenizer = Object.assign(Object.create(null), options.tokenizer);

        if (options.os) {
            options.tokenizer = Parser.mergeOSTokenizer(options.tokenizer, options);
        }

        if (options.version) {
            this.versionMap = Parser.normalizeVersionMap(lowerCaseProp(options.versionMap, true, false));
            this.targetVersionMap = Parser.normalizeVersionMap(lowerCaseProp(options.targetVersionMap, true, false));
            this.osVersionMap = Parser.normalizeVersionMap(lowerCaseProp(options.osVersionMap, true, false));
            options.tokenizer = Parser.mergeVersionTokernizer(options.tokenizer, options);
        }

        this.os = options.os;
        this.splitVersion = options.splitVersion;
        this.indexes = options.indexes;
        this.osIndexes = options.osIndexes;
        this.tokenizer = options.tokenizer instanceof Tokenizer ? options.tokenizer : new Tokenizer(options.tokenizer);
    }

    parse(ua, options) {
        options = Object.assign(Object.create(null), Parser.defaultOptions, options);

        if (!options.match && options.version) {
            // version is not usable when match object is not returned
            options.version = false;
        }

        const tokens = this.tokenizer.getTokens(ua, options).reverse();
        const len = tokens.length;

        let os, ret, version, i;

        if (len !== 0) {
            ret = this.getIndexName(tokens, this.indexes);

            if (options.match && this.os) {
                os = this.getIndexName(tokens, this.osIndexes);
            }

            if (options.match) {
                ret = {
                    family: ret,
                    version: this.getVersion(ret, tokens, this.versionMap, options),
                    os: os == null ? null : {
                        family: os,
                        version: this.getVersion(os, tokens, this.osVersionMap, options),
                    }
                };

                if (this.targetVersionMap) {
                    ret.targetVersion = this.getVersion(ret.family, tokens, this.targetVersionMap, options);
                }

                if (ret.version && (options.splitVersion || this.splitVersion)) {
                    version = ret.version.split(".");
                    ret.major = version[0] || 0;
                    ret.minor = version[1] || 0;
                    ret.patch = version[2] || 0;
                }

                ret.tokens = new Array(len);
                for (i = len - 1; i >= 0; i--) {
                    ret.tokens[len - 1 - i] = tokens[i];
                }
                ret.versioned = tokens.versioned;
            }

            return ret;
        }

        return false;
    }

    getIndexName(tokens, indexes) {
        const len = tokens.length;
        let i = 0;

        while (indexes.children && i < len) {
            while (i < len && !hasProp.call(indexes.children, tokens[i])) {
                i++;
            }

            if (hasProp.call(indexes.children, tokens[i])) {
                indexes = indexes.children[tokens[i]];
            }

            i++;
        }

        return indexes.name;
    }

    getVersion(name, tokens, hashmap, options) {
        if (!hashmap) {
            return undefined;
        }

        let remap, token, vtoken, version;

        if (options.version || (options.version == null && this.tokenizer.version)) {
            if (hasProp.call(tokens, "versioned")) {
                if (!hasProp.call(hashmap, name)) {
                    return undefined;
                }

                vtoken = hashmap[name];

                if (typeof vtoken === "object") {
                    version = false;

                    for (token in vtoken) {
                        if (tokens.indexOf(token) !== -1) {
                            version = true;
                            remap = vtoken[token];
                            vtoken = token;
                            if (typeof remap !== "object") {
                                remap = undefined;
                            }
                            break;
                        }
                    }

                    if (!version) {
                        return undefined;
                    }
                }

                version = tokens.versioned[vtoken];
                version = remap ? remap[version] : version;

                return version ? sanitizeVersion(version) : version;
            }
        }

        return undefined;
    }
}

const mergeOSTokenizer = (tokenizer, options) => {
    return Tokenizer.mergeOptions(tokenizer, options.osTokenizer, Object.create(null));
};

const mergeVersionTokernizer = (tokenizer1, options) => {
    tokenizer1.version = true;

    const tokenizer2 = Object.create(null);
    tokenizer2.knownInfiniteVersionedTokens = tokenizer2.knownInfiniteVersionedTokens ? tokenizer2.knownInfiniteVersionedTokens.slice() : [];
    tokenizer2.knownUnversionedTokens = tokenizer2.knownUnversionedTokens ? tokenizer2.knownUnversionedTokens.slice() : [];

    const versionMap = lowerCaseProp(options.versionMap, true, false);
    const osVersionMap = lowerCaseProp(options.osVersionMap, true, false);
    const targetVersionMap = lowerCaseProp(options.targetVersionMap, true, false);

    [versionMap, osVersionMap, targetVersionMap].forEach(hashmap => {
        Object.keys(hashmap).forEach(key => {
            const value = hashmap[key];
            let arr;

            if (typeof value === "string") {
                arr = [value];
            } else if (Array.isArray(value)) {
                arr = value.map(val => val.toLowerCase());
            } else {
                arr = Object.keys(value);
            }

            arr.forEach(token => {
                if (token.endsWith(" *")) {
                    tokenizer2.knownInfiniteVersionedTokens.push(token.slice(0, -2));
                } else {
                    tokenizer2.knownUnversionedTokens.push(token);
                }
            });
        });
    });

    return Tokenizer.mergeOptions(tokenizer1, tokenizer2, Object.create(null));
};

const normalizeVersionMap = hashmap => {
    const obj = Object.create(null);
    Object.keys(hashmap).forEach(key => {
        const value = hashmap[key];
        obj[key] = Array.isArray(value) ? lowerCaseProp(flip(value, 1, true)) : value;
    });
    return obj;
};

Object.assign(Parser, {
    defaultOptions,
    mergeOSTokenizer,
    mergeVersionTokernizer,
    normalizeVersionMap,
});

const parser = new Parser({
    os: true,
    version: true,
    splitVersion: false,
});

Object.assign(Parser, {
    parser,
    parse: Parser.prototype.parse.bind(parser)
});

module.exports = Parser;
