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
        "80Legs Web Crawler": "008 *",
        "Adobe Air": "AdobeAIR *",
        "Ahrefs Backlink Research Bot": "AhrefsBot *",
        Airmail: "Airmail *",
        "Alertsite Monitoring Bot": "DejaClick *",
        "Alexa Site Audit": "audit *",
        "Amazon Silk": "Silk *",
        "Android Browser": "Version *",
        "Aol Browser": "AOL *",
        "Apache HttpClient": "Apache-HttpClient *",
        aria2: "aria2 *",
        Arora: "Arora *",
        Awesomium: "Awesomium *",
        "AWS Command Line Interface": "aws-cli *",
        "AWS SDK for C++": "aws-sdk-cpp *",
        "AWS SDK for Go": "aws-sdk-go *",
        "AWS SDK for Java": "aws-sdk-java *",
        "AWS SDK for JavaScript in Node.js": "aws-sdk-nodejs *",
        "AWS SDK for Python": "Boto *",
        "AWS SDK for Python (Boto3)": "Boto3 *",
        "AWS SDK for Ruby - Version 2": "aws-sdk-ruby2 *",
        Axel: "Axel *",
        "BacaBerita App": "BacaBerita App *",
        "Baidu Browser": "baidubrowser *",
        "Baidu Spider": "Baiduspider *",
        Barca: "Barca *",
        Basilisk: "Basilisk *",
        "beta crawler": "beta crawler *",
        Bingbot: "bingbot *",
        BingPreview: "BingPreview *",
        "Blackberry Browser": "Version *",
        Bloglovin: "Bloglovin *",
        BOLT: "BOLT *",
        Box: "Box *",
        "Box Sync": "Box Sync *",
        BoxNotes: "BoxNotes *",
        Brave: "Brave *",
        "Broadsign Xpress": "BroadSign Xpress *",
        Bunjalloo: "Bunjalloo *",
        "CareerBot Search Crawler": "CareerBot *",
        "Catchpoint Analyser": "Chrome *",
        Chimera: "Chimera *",
        "Chrome Frame": "chromeframe *",
        Chrome: ["Chrome *", "HeadlessChrome *", "CrMo *", "CriOS *"],
        Chromium: "Chromium *",
        "Coc Coc": "coc_coc_browser *",
        "Comodo Dragon": "Comodo_Dragon *",
        "Comodo Icedragon": "Icedragon *",
        Conkeror: "Conkeror *",
        Crosswalk: "Crosswalk *",
        Curl: "curl *",
        Cyberduck: "Cyberduck *",
        dav4android: "DAVdroid *",
        "Debian APT-HTTP": "Debian APT-HTTP *",
        "Delphi Embedded Web Browser": "EmbeddedWB *",
        Dolfin: "Dolfin *",
        Dolphin: ["Dolphin *", "DolphinHDCN *", "Dolphin/INT *"],
        "Domaintools Surveybot": "SurveyBot *",
        "Dorado Wap Browser": "WAP-Browser *",
        "Dotcom Monitor Bot": ["DMBrowser *", "Version *"],
        Dragon: "Dragon *",
        "Duckduckgo Favicons Bot": "DuckDuckGo-Favicons-Bot *",
        Edge: "Edge *",
        "Electron Application": "Electron *",
        Epiphany: "Epiphany *",
        Espial: "Espial *",
        ESPN: "ESPN Radio *",
        Evolution: "Evolution *",
        "Exalead Crawler": "Exabot *",
        "ExB Language Crawler": "ExB Language Crawler *",
        ExchangeServicesClient: "ExchangeServicesClient *",
        ExchangeWebServices: "ExchangeWebServices *",
        "Facebook App": "FBAV *",
        "Facebook Bot": "facebookexternalhit *",
        Firebird: "Firebird *",
        Firefox: "Firefox *",
        FireWeb: "FireWeb *",
        Flipboard: "Flipboard *",
        "Flipboard-Briefing": "Flipboard-Briefing *",
        "Genieo Bot": "Genieo *",
        "Gnip Unwindfetchor Crawler": "UnwindFetchor *",
        GomezAgent: "GomezAgent *",
        "Go-http-client": "Go-http-client *",
        "Google Chromecast": "CrKey *",
        "Google Search App": "GSA *",
        "Google'S Media Partners System (Adsense)": "Mediapartners-Google *",
        "Google-HTTP-Java-Client": "Google-HTTP-Java-Client *",
        "GoogleBot Mobile": "GoogleBot-Mobile *",
        GoogleBot: "GoogleBot *",
        "Grapeshot Bot": "GrapeshotCrawler *",
        HbbTV: "HbbTV *",
        "HipChat Desktop Client": "HipChat *",
        Httpclient: "HTTPClient *",
        "iBrowser Mini": "iBrowser/Mini *",
        "ICE Browser": "ICE Browser *",
        IceCat: "IceCat *",
        Iceweasel: "Iceweasel *",
        Instagram: "Instagram *",
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
            "IEMobile *": 1,
            "Trident *": {
                3.1: "7.0",
                "4.0": "8.0",
                "5.0": "9.0",
                "6.0": "10.0",
                "7.0": "11.0",
            },
            "MSIE *": 1,
        }),
        "Internet Spider": "Internet Spider *",
        "Internet Tv Browser": "InettvBrowser *",
        iRAPP: "iRAPP *",
        "Jakarta Commons Httpclient": "Jakarta Commons-HttpClient *",
        "Java Runtime Environment": "Java *",
        "Javafx Platform": "JavaFX *",
        JetS3t: "JetS3t *",
        JobSpider_BA: "JobSpider_BA *",
        "K Meleon": "K-Meleon *",
        "Kindle Browser": "Version *",
        kmail2: "kmail2 *",
        "Kurio App": "Kurio *",
        Konqueror: "Konqueror *",
        LFTP: "lftp *",
        "libcurl-agent": "libcurl-agent *",
        "Library For Www In Perl": "libwww-perl *",
        Lightning: "Lightning *",
        "Linkcheck Analyser": "MSIE *",
        LinkedInBot: "LinkedInBot *",
        Links: "links *",
        "Lotus Notes": "Lotus-Notes *",
        Lynx: "Lynx *",
        MacOutlook: "MacOutlook *",
        "Mail.ru Chromium Browser": "Chrome *",
        "Mail.RU_Bot": "Mail.RU_Bot *",
        MailBar: "MailBar *",
        "Majestic 12 Distributed Search Bot": "MJ12bot *",
        Maxthon: ["Maxthon *", "MxBrowser *"],
        "MASSCAN: Mass IP port scanner": "masscan *",
        mDolphin: "mDolphin *",
        "Meanpath Bot": "meanpathbot *",
        MedSpider: "MedSpider *",
        "Microsoft CryptoAPI": "Microsoft-CryptoAPI *",
        "Microsoft SkyDriveSync": "Microsoft SkyDriveSync *",
        Midori: "Midori *",
        Minefield: "Minefield *",
        Minimo: "Minimo *",
        MobileIron: "MobileIron *",
        MozillaDeveloperPreview: "MozillaDeveloperPreview *",
        "Msn Bot": "msnbot *",
        "Mvision Player": "MVisionPlayer *",
        "NCSA Mosaic": "NCSA_Mosaic *",
        NetFront: ["NX *", "NetFront *", "ACS-NetFront *"],
        "Netseer Crawler": "NetSeer crawler *",
        NewRelicPingerBot: "NewRelicPinger *",
        Newsbot: "news bot *",
        Nexplayer: "NexPlayer *",
        "Nintendo Browser": "NintendoBrowser *",
        "Nokia Browser": "NokiaBrowser *",
        Obigo: "Obigo-Q *",
        Okhttp: "okhttp *",
        OktaMobile: "OktaMobile *",
        "ONE Browser": "OneBrowser *",
        Onefootball: "Onefootball/Android *",
        "Openwave Mobile Browser": ["UP.Browser *", "Openwave *"],
        "Opera Coast": "Coast *",
        "Opera Mini": ["Opera Mini/att *", "Opera Mini *", "OPR *", "Version *", "Opera *", "OPiOS *"],
        Opera: ["OPR *", "Version *", "Opera *"],
        Otter: "Otter *",
        Outlook: lowerCaseProp({
            "MSOffice *": {
                12: "2007",
                14: "2010",
                15: "2013",
                16: "2016",
            }
        }),
        "Outlook-iOS": "Outlook-iOS *",
        "Outlook-iOS-Android": "Outlook-iOS-Android *",
        Owncloud: ["Owncloud *", "ownCloud-android *"],
        "Ovi Browser": "S40OviBrowser *",
        "Pale Moon": "PaleMoon *",
        "Phantom Browser": "Phantom *",
        PhantomJS: "PhantomJS *",
        "Pinterest App": ["Pinterest for Android Tablet *", "Pinterest for Android *", "Pinterest *"],
        "Pinterest Bot": ["Pinterestbot *", "Pinterest *"],
        Planetweb: "Planetweb *",
        Postbox: "Postbox *",
        "Prohlížeč Seznam.cz": "sznprohlizec *",
        Puffin: "Puffin *",
        PyAMF: "PyAMF *",
        PycURL: "PycURL *",
        "Python Requests": "python-requests *",
        "Python Urllib": "Python-urllib *",
        "QQ Browser Mini": "MQQBrowser/Mini *",
        "QQ Browser": ["QQBrowser *", "MQQBrowser *"],
        qutebrowser: "qutebrowser *",
        QupZilla: "QupZilla *",
        Qwantify: "Qwantify *",
        RackspaceBot: "Rackspace Monitoring *",
        Rclone: "rclone *",
        "Reader Notifier": "Reader Notifier *",
        Rekonq: "rekonq *",
        reqwest: "reqwest *",
        RCMCardDAV: "RCM CardDAV plugin *",
        RockMelt: "RockMelt *",
        Roku: "Roku/DVP *",
        Ruxitsynthetic: "RuxitSynthetic *",
        "S3 Browser": "S3 Browser *",
        s3fs: "s3fs *",
        Safari: "Version *",
        "Samsung Browser": "SamsungBrowser *",
        "scalaj-http": "scalaj-http *",
        SeaMonkey: "SeaMonkey *",
        Secondlife: "SecondLife *",
        SemrushBot: "SemrushBot *",
        sgbot: "sgbot *",
        Shiretoko: "Shiretoko *",
        SiteCon: "SiteCon *",
        Skyfire: "Skyfire *",
        "Slack Desktop Client": "Slack_SSB *",
        "Slack-ImgProxy": "Slack-ImgProxy *",
        "Slackbot Link Checker": "Slackbot-LinkExpanding *",
        Sleipnir: "Sleipnir *",
        Snowshoe: "Snowshoe *",
        "Sogou \"Search Dog\"": "Sogou web spider *",
        "Sogou Explorer": "SE *",
        SophosAgent: "SophosAgent *",
        SophosUpdateManager: "SophosUpdateManager *",
        "Sosospider Search Bot": "Sosospider *",
        "Speedcurve Speed Tester": "PTST *",
        Spider_Monkey: "Spider_Monkey *",
        SpiderKU: "SpiderKU *",
        Spiderlytics: "Spiderlytics *",
        SpiderMan: "SpiderMan *",
        spiderpig: "spiderpig *",
        SpiderView: "SpiderView *",
        Spotify: "Spotify *",
        "Squider Bot": "Squider *",
        "Srware Iron": "Iron *",
        suggybot: "suggybot *",
        Tableau: "Tableau *",
        TAMU_CS_IRL_CRAWLER: "TAMU_CS_IRL_CRAWLER *",
        TelemetrySpider2: "TelemetrySpider2 *",
        "The Bat!": "The Bat! *",
        Thunderbird: "Thunderbird *",
        "Tiny Tiny RSS": "Tiny Tiny RSS *",
        "Tweetmeme Bot": "TweetmemeBot *",
        TwitterBot: "TwitterBot *",
        "Ubuntu APT-HTTP": "Ubuntu APT-HTTP *",
        "UC Browser Mini": ["UCBrowser *", "UCWEB *"],
        "UC Browser": ["UCBrowser *", "UCWEB *", "UC Browser *"],
        urlgrabber: "urlgrabber *",
        "Vision Mobile Browser": "Novarra-Vision *",
        Vivaldi: "Vivaldi *",
        "W3C Validator": "W3C_Validator *",
        W3M: "w3m *",
        Waterfox: "Waterfox *",
        WebCrawler: "WebCrawler *",
        "Webkit Based Browser": "Version *",
        "webOS Browser": "wOSBrowser *",
        Webpositive: "Webpositive *",
        "Webview Based Browser": "WebView *",
        Wget: "Wget *",
        WhatsApp: "WhatsApp *",
        "Windows-Update-Agent": "Windows-Update-Agent *",
        "Yahoo! Slurp Web Crawler Bot": "Yahoo! Slurp *",
        YahooMobileMail: "YahooMobileMail *",
        "Yandex Browser": "YaBrowser *",
        "Yandex Search Bot": "YandexBot *",
        "Yodaobot Search Bot": "YodaoBot *",
    },
    osVersionMap: {
        Android: "android *",
        "HP webOS": "hpwOS *",
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
