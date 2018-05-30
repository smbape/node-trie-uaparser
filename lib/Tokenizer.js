"use strict";

const RegexTrie = require("regex-trie");

const flip = require("../functions/flip");
const lcs = require("../functions/lcs");
const lowerCaseProp = require("../functions/lowerCaseProp");
const reverseSlice = require("../functions/reverseSlice");
const createTrimer = require("../functions/createTrimer");

const hasProp = Object.prototype.hasOwnProperty;

const defaultOptions = {
    knownIrrelevantTokens: [
        "http://www.bing.com/bingbot.htm",
        "KHTML  like Gecko",
        "KHTML like Gecko",
        "KHTML, like Gecko",
        "like Gecko",
        "like Mac OS X",
        "Samsung",
        "SAMSUNG-SGH-I",
        "SAMSUNG-SM-G",
        "SAMSUNG-SM-J",
        "SAMSUNG-SM-N",
        "SAMSUNG-SM-T",
        "Silk-Accelerated=false",
        "Silk-Accelerated=true",
    ],

    knownFiniteVersionedTokens: [
        "PLAYSTATION",
        "PlayStation Vita"
    ],

    knownInfiniteVersionedTokens: [
        "Adr",
        "Amazon Kindle",
        "AmigaOS",
        "Android",
        "AOL",
        "AOL-IWENG",
        "AolApp",
        "AOLSecure",
        "AOLShield",
        "Apple TV",
        "Atom",
        "audit",
        "Avant Browser",
        "Bada",
        "BeOS",
        "beta crawler",
        "bingbot",
        "BingPreview",
        "Blackberry",
        "BMP",
        "Box Sync",
        "BREW",
        "Brew MP",
        "BroadSign Xpress",
        "Browser",
        "BSD",
        "BT Crawler",
        "Build/iris",
        "CasperJS",
        "CFNetwork",
        "Chrome",
        "chromeframe",
        "CriOS",
        "CrKey armv7l",
        "CrKey",
        "CrMo",
        "CrOS",
        "Curl",
        "CYGWIN_NT",
        "Dalvik",
        "Darwin",
        "DDG-Android",
        "Debian",
        "Debian APT-HTTP",
        "DejaClick",
        "DMBrowser",
        "DMBrowser-BV",
        "DMBrowser-UV",
        "Dolphin",
        "DolphinHDCN",
        "Dolphin/INT",
        "Door Spider",
        "Droid",
        "dwb",
        "EdgA",
        "Edge",
        "ESPN Radio",
        "Exabot",
        "ExB Language Crawler",
        "facebookexternalhit",
        "FAST Crawler",
        "FBAV",
        "Fedora",
        "Firebird",
        "FreeBSD",
        "FxiOS",
        "Gecko",
        "Gnam Spider",
        "GomezAgent",
        "Google Earth Pro",
        "Google Earth",
        "Google Favicon",
        "GoogleBot",
        "GoogleBot-Mobile",
        "GoogleTV",
        "GSA",
        "IBM WebExplorer",
        "iBrowser",
        "iBrowser/Mini",
        "IEMB",
        "Inspiron",
        "Internet Spider",
        "iOS",
        "iPad OS",
        "iPad",
        "iPad; CPU OS",
        "iPad; U; CPU OS",
        "iPhone OS",
        "iPhone",
        "iPhone; CPU OS",
        "iPhone; U; CPU OS",
        "Iris Fuel",
        "Iris X",
        "Iris",
        "Iron",
        "IWE Spider",
        "IXE Crawler",
        "Jakarta Commons-HttpClient",
        "Java",
        "JavaPlatform/JP",
        "Jaxified Crawler",
        "jp.co.yahoo.android.yjtop",
        "KFDOWI",
        "KFFOWI",
        "KFGIWI",
        "KFJWI",
        "KFOT",
        "KFSOWI",
        "KFSUWI",
        "KFTHWI",
        "KFTT",
        "Kindle Fire",
        "Kindle",
        "KIT webcrawler",
        "LAVAIRIS",
        "Link Crawler",
        "Linux",
        "Liquid MT",
        "Lite Bot",
        "Lynx",
        "Mandriva",
        "Mac OS X",
        "Mediapartners-Google",
        "MetaSr",
        "MIB",
        "MicroMessenger",
        "Microsoft Outlook",
        "Microsoft SkyDriveSync",
        "Minix",
        "MJ12bot",
        "MMP",
        "MocorDroid",
        "Mozilla",
        "Mozilla crawl",
        "MQQBrowser",
        "MQQBrowser/Mini",
        "MSIE",
        "MSOffice",
        "MULTICS",
        "MxBrowser",
        "My Spider",
        "NetBSD",
        "NetSeer crawler",
        "news bot",
        "NintendoBrowser",
        "NMG Spider",
        "Nokia",
        "NOKIA-Lumia",
        "NokiaBrowser",
        "NokiaC",
        "NokiaE",
        "NokiaN",
        "NokiaX",
        "NX",
        "Obigo",
        "Obigo-Q",
        "Onefootball/Android",
        "Opera Mini",
        "Opera Mini/att",
        "Opera Mobi",
        "Opera",
        "OPiOS",
        "OPR",
        "OWF",
        "Peeplo Screenshot Bot",
        "PhantomJS",
        "Pinterest for Android",
        "Pinterest for Android Tablet",
        "Pinterestbot",
        "PlayStation Vita",
        "PPC",
        "PTST",
        "Puffin",
        "QQBrowser",
        "Qt",
        "Qt-Creator",
        "QtCreator",
        "QtEmbedded",
        "QtWeb Internet Browser",
        "QtWeb",
        "QtWebEngine",
        "qutebrowser",
        "RDF crawler",
        "RIM Tablet OS",
        "RISC OS",
        "Roku/DVP",
        "RuxitSynthetic",
        "rv",
        "S40OviBrowser",
        "S60",
        "S60Version",
        "SAS Crawler",
        "SE",
        "search crawler",
        "SeekOn Spider",
        "semantics webbot",
        "Series40",
        "Series60",
        "Server Crawler",
        "Silk",
        "Sogou develop Spider",
        "Sogou head Spider",
        "Sogou Orion Spider",
        "Sogou Pic Spider",
        "Sogou Push Spider",
        "Sogou web spider",
        "Sony",
        "Squider",
        "SunOS",
        "SurveyBot",
        "Symbian OS",
        "Symbian",
        "SymbianOS",
        "SymbOS",
        "The Bat!",
        "Tiny Tiny RSS",
        "Toms Spider",
        "Trident",
        "trunk.ly spider",
        "U2",
        "Ubuntu",
        "Ubuntu APT-HTTP",
        "UC Browser",
        "UC Web",
        "UCBrowser",
        "UCWEB",
        "ucweb-squid",
        "UNIX",
        "UNTRUSTED",
        "UP.Browser",
        "Version",
        "visaduhoc.info Crawler",
        "w3m",
        "WAP-Browser",
        "WEBB Crawler",
        "webOSBrowser",
        "WebTV",
        "Wget",
        "Win",
        "Windows CE",
        "Windows Mobile",
        "Windows NT",
        "Windows Phone OS",
        "Windows Phone",
        "WindowsCE",
        "WinNT",
        "WinXP",
        "WMPRO",
        "wOSBrowser",
        "WP7",
        "XYZ Spider",
        "Yahoo! Slurp",
        "YATS crawler",
        "YunOS",
        "ZIBB Crawler",
    ],

    knownUnversionedTokens: [
        "360Spider",
        "3B-Webview",
        "8bo Crawler Bot",
        "909",
        "Acer",
        "ARCHOS",
        "AROS",
        "BB10",
        "BB10,Touch",
        "BBB100-1",
        "BBB100-2",
        "BBB100-3",
        "BoardReader Blog Indexer",
        "Build/GINGERBREAD",
        "CheckerOS",
        "FBAN",
        "Hackintosh",
        "http://www.QtWeb.net",
        "https://developers.google.com/+/web/snippet/",
        "ichiro/mobile",
        "iPod touch",
        "iPod",
        "Kubuntu",
        "Mac_PowerPC",
        "Macintosh",
        "MeeGo",
        "Nintendo Wii",
        "Nook",
        "NookColor",
        "NookHD",
        "NookTablet",
        "OpenBSD ftp",
        "OpenSUSE",
        "OS/2",
        "PDA",
        "Philips",
        "PlayBook",
        "QIHU",
        "QtQmlViewer",
        "QtWebCrawler",
        "QtWebkitKiosk",
        "SMART-TV",
        "SmartTV",
        "Snook",
        "Unknown",
        "Wayback Save Page",
        "Wireless Crawler",
        "X11",
        "XBLWP7",
        "Xubuntu",
        "Yahoo",
    ],

    tokenAliasMap: {
        "AOL-IWENG": "AOL",
        AolApp: "AOL",
        AOLSecure: "AOL",
        AOLShield: "AOL",
        "BB10,Touch": "BB10",
        "BBB100-1": "BB10",
        "BBB100-2": "BB10",
        "BBB100-3": "BB10",
        "CrKey armv7l": "CrKey",
        "ddg-android-%version": "DDG-Android",
        "DMBrowser-BV": "DMBrowser",
        "DMBrowser-UV": "DMBrowser",
        "iPad OS": "iPhone",
        "iPad; CPU OS": "iPad",
        "iPad; U; CPU OS": "iPad",
        "iPhone OS": "iPhone",
        "iPhone; CPU OS": "iPhone",
        "iPhone; U; CPU OS": "iPhone",
        "iPod touch": "iPod",
        "JavaPlatform/JP": "Java",
        KFAUWI: "Kindle Fire",
        KFDOWI: "Kindle Fire",
        KFFOWI: "Kindle Fire",
        KFGIWI: "Kindle Fire",
        KFJWI: "Kindle Fire",
        KFOT: "Kindle Fire",
        KFSOWI: "Kindle Fire",
        KFSUWI: "Kindle Fire",
        KFTHWI: "Kindle Fire",
        KFTT: "Kindle Fire",
        "NOKIA-Lumia": "Nokia",
        NokiaC: "Nokia",
        NokiaE: "Nokia",
        NokiaN: "Nokia",
        NokiaX: "Nokia",
        NookColor: "Nook",
        NookHD: "Nook",
        NookTablet: "Nook",
        QtWebEngine: "Qt",
        qutebrowser: "Qt",
        "SMART-TV": "SmartTV",
        Snook: "Nook",
        "Symbian OS": "Symbian",
        SymbianOS: "Symbian",
        SymbOS: "Symbian",
        "Windows Phone OS": "Windows Phone",
    }
};

const TOKEN_TYPE_IRRELEVANT = -1;
const TOKEN_TYPE_REMOVED = 0;
const TOKEN_TYPE_FINITE_VERSION = 1;
const TOKEN_TYPE_INFINITE_VERSION = 2;
const TOKEN_TYPE_UNVERSIONED = 3;

const DELIMITERS = ["\\s", ";", ",", "(", ")", "|", "+", "/"];
const DELIMITER_CHARS_REG = new RegExp(`[${ DELIMITERS.join("") }]`, "g");
const NON_SLASH_DELIMITER_REG = new RegExp(`[${ DELIMITERS.slice(0, -1).join("") }]+`, "g");

const VERSION_SEP_START_REG = /^[-+_/\s?.=:][vV]?/;
const VERSION_PART_REG = new RegExp(`(?:\\d|${ VERSION_SEP_START_REG.source.slice(1) })?${ /\d[^\s();]*/.source }`);

const trimIrrelevant = createTrimer(/(?:^[“\\,!:#"'+<[?]+|[>\]'"#:!,\\“+?]+$)/g);
const trimNotVersion = createTrimer(VERSION_SEP_START_REG);
const trimModelNumber = createTrimer(/^[^/]+\//);

class Tokenizer {
    constructor(options) {
        options = Object.assign({}, Tokenizer.defaultOptions, options);
        this.init(options);
        this.updateTokens(options.tokens);
    }

    init(options) {
        this.setTokensType("knownIrrelevantTokens", options.knownIrrelevantTokens, options);
        this.setTokensType("knownFiniteVersionedTokens", options.knownFiniteVersionedTokens, options);
        this.setTokensType("knownInfiniteVersionedTokens", options.knownInfiniteVersionedTokens, options);
        this.setTokensType("knownUnversionedTokens", options.knownUnversionedTokens, options);

        this.setTokensType("knownVersionedTokens", this.LknownFiniteVersionedTokens.concat(this.LknownInfiniteVersionedTokens), options);
        this.setTokensType("knownTokens", this.LknownIrrelevantTokens.concat(this.LknownVersionedTokens, this.LknownUnversionedTokens), options);

        this.tokenAliasMap = lowerCaseProp(options.tokenAliasMap, true);

        if (options.version != null) {
            this.version = options.version;
        }

        const trie = new RegexTrie();
        trie.add(this.LknownTokens);

        this.matcher = new RegExp([
            "(?:",
                `(?<=^|${ DELIMITER_CHARS_REG.source })`,
                `(${ trie.toRegExp().source.slice(3, -1) })`,
                `(${ VERSION_PART_REG.source })?`,
            ")?",
            `(${ DELIMITER_CHARS_REG.source }+|$)`
        ].join(""), "g");

         if (this.LknownVersionedTokens.length !== 0) {
            const regexp = (new RegexTrie()).add(this.LknownVersionedTokens).toRegExp().source.slice(3, -1);
            this.versionStartMatcher = new RegExp(`^(?:${ regexp })(?=${ VERSION_PART_REG.source })`);
        } else {
            this.versionStartMatcher = /[^\S\s]/;
        }

        const errors = [];

        this.LknownUnversionedTokens.forEach(token => {
            let match = token.match(this.versionStartMatcher);
            let versioned;
            if (match) {
                versioned = match[0];
                match = versioned.match(VERSION_PART_REG);
                errors.push(`unversioned '${ token }' starts with versioned '${ match ? versioned.slice(0, match.index) : versioned }'`);
            }
        });

        this.LknownTokens.forEach(token => {
            if (DELIMITER_CHARS_REG.test(token[0])) {
                errors.push(`token '${ token }' starts with a delimiter character`);
            }
        });

        if (errors.length) {
            if (options.errors) {
                options.errors.push(...errors);
            } else {
                // Too harsh, prevents loading when data are corrupted
                // throw new Error(JSON.stringify(errors, null, 4));
            }
        }
    }

    updateTokens(tokens, options) {
        const keys = tokens == null ? [] : Object.keys(tokens);

        if (keys.length === 0) {
            return;
        }

        if (options && options.reset) {
            this.DLknownIrrelevantTokens = {};
            this.DLknownFiniteVersionedTokens = {};
            this.DLknownInfiniteVersionedTokens = {};
            this.DLknownUnversionedTokens = {};
        }

        let i, token, type;
        const len = keys.length;

        for (i = 0; i < len; i++) {
            token = keys[i];
            type = tokens[token];
            if (type == null) {
                type = TOKEN_TYPE_UNVERSIONED;
            }

            switch (type) {
                case TOKEN_TYPE_IRRELEVANT:
                    this.DLknownIrrelevantTokens[token] = 1;
                    delete this.DLknownFiniteVersionedTokens[token];
                    delete this.DLknownInfiniteVersionedTokens[token];
                    delete this.DLknownUnversionedTokens[token];
                    break;
                case TOKEN_TYPE_REMOVED:
                    delete this.DLknownIrrelevantTokens[token];
                    delete this.DLknownFiniteVersionedTokens[token];
                    delete this.DLknownInfiniteVersionedTokens[token];
                    delete this.DLknownUnversionedTokens[token];
                    break;
                case TOKEN_TYPE_FINITE_VERSION:
                    delete this.DLknownIrrelevantTokens[token];
                    this.DLknownFiniteVersionedTokens[token] = 1;
                    delete this.DLknownInfiniteVersionedTokens[token];
                    delete this.DLknownUnversionedTokens[token];
                    break;
                case TOKEN_TYPE_INFINITE_VERSION:
                    delete this.DLknownIrrelevantTokens[token];
                    delete this.DLknownFiniteVersionedTokens[token];
                    this.DLknownInfiniteVersionedTokens[token] = 1;
                    delete this.DLknownUnversionedTokens[token];
                    break;
                case TOKEN_TYPE_UNVERSIONED:
                    delete this.DLknownIrrelevantTokens[token];
                    delete this.DLknownFiniteVersionedTokens[token];
                    delete this.DLknownInfiniteVersionedTokens[token];
                    this.DLknownUnversionedTokens[token] = 1;
                    break;
                default:
                    // Nothing to do
            }
        }

        this.init(Object.assign({}, options, {
            knownIrrelevantTokens: Object.keys(this.DLknownIrrelevantTokens),
            knownFiniteVersionedTokens: Object.keys(this.DLknownFiniteVersionedTokens),
            knownInfiniteVersionedTokens: Object.keys(this.DLknownInfiniteVersionedTokens),
            knownUnversionedTokens: Object.keys(this.DLknownUnversionedTokens)
        }));
    }

    setTokensType(prop, tokens, options) {
        const updatedTokens = options && options.tokens || {};

        const len = tokens.length;
        const arr = new Array(len);
        let size = 0;

        for (let i = 0, token; i < len; i++) {
            token = tokens[i].toLowerCase();

            if (hasProp.call(updatedTokens, token) && updatedTokens[token] === TOKEN_TYPE_REMOVED) {
                continue;
            }

            arr[size++] = token;
        }

        this[`DL${ prop }`] = flip(arr.slice(0, size), 1, true);
        this[`L${ prop }`] = Object.keys(this[`DL${ prop }`]);
    }

    compressTokens(tokens, options) {
        const versioned = {};
        const tokensLen = tokens.length;
        const tokens_ = new Array(tokensLen);

        let len = 0;
        let version, token, vtoken, rversion;

        // later tokens have priority
        for (let i = tokensLen - 1; i >= 0; i--) {
            token = tokens[i];
            version = null;
            rversion = null;

            if (Array.isArray(token)) {
                vtoken = token[0];
                version = token[1];

                if (hasProp.call(this.tokenAliasMap, vtoken)) {
                    vtoken = this.tokenAliasMap[vtoken];
                }

                if (hasProp.call(this.DLknownInfiniteVersionedTokens, vtoken)) {
                    [vtoken, version, rversion] = this.getInifiniteVersion(vtoken, version, options);
                }

                token = `${ vtoken } ${ version }`;
            } else if (hasProp.call(this.DLknownInfiniteVersionedTokens, token)) {
                if (hasProp.call(this.tokenAliasMap, token)) {
                    token = this.tokenAliasMap[token];
                }
                // Treat 'XXXX' as 'XXXX *', thus reducing keys to save
                token = `${ token } *`;
            }

            version = rversion ? rversion : version;

            if (hasProp.call(versioned, token)) {
                if (version && !versioned[token]) {
                    versioned[token] = version;
                }
                continue;
            }

            // Object.keys always put numbered key at the begining
            // Thats why we need to keep tokens order in an array
            // instead of doing Object.keys(versioned)
            versioned[token] = version;
            tokens_[len++] = token;
        }

        tokens = reverseSlice(tokens_, len);

        if (options.version || (options.version == null && this.version)) {
            tokens.versioned = versioned;
        }

        return tokens;
    }

    addToken(token, version, tokens, prev, ua, uaMatch, uaStart, uaEnd, options) {
        const ltoken = hasProp.call(this.DLknownTokens, token) ? token : trimIrrelevant(token);

        if (ltoken.length === 0) {
            return 0;
        }

        let type = -1;
        let state = 0;

        if (hasProp.call(this.DLknownVersionedTokens, ltoken)) {
            tokens.push(version ? [ltoken, version] : ltoken);
            state = version ? 2 : 1;
        } else if (hasProp.call(this.DLknownTokens, ltoken)) {
            tokens.push(ltoken);
            state = 1;
        } else if (options.lnames && options.lnames.some(lname => lcs(ltoken, lname).length >= (lname.length >= 5 ? 5 : lname.length))) {
            tokens.push(ltoken);
            state = 1;
            type = 2;
        } else if (tokens.length !== 0) {
            const lastToken = tokens[tokens.length - 1];

            if (/^[\s/(]+$/.test(prev) && /^[-+_]?\d.*$/.test(ltoken)) {
                if (Array.isArray(lastToken)) {
                    if (hasProp.call(this.DLknownVersionedTokens, lastToken[0])) {
                        tokens[tokens.length - 1] = [lastToken[0], `${ lastToken[1] }/${ ltoken }`];
                    } else {
                        // A token without meaning
                        if (options.ontoken) {
                            options.ontoken(ltoken, version, 0, uaMatch.index, ua, uaStart, uaEnd, tokens);
                        }
                        return 0;
                    }
                } else if (hasProp.call(this.DLknownVersionedTokens, lastToken)) {
                    tokens[tokens.length - 1] = [lastToken, ltoken];
                } else {
                    // A token without meaning
                    if (options.ontoken) {
                        options.ontoken(ltoken, version, 0, uaMatch.index, ua, uaStart, uaEnd, tokens);
                    }
                    return 0;
                }
            } else {
                // A token without meaning
                if (options.ontoken) {
                    options.ontoken(ltoken, version, 0, uaMatch.index, ua, uaStart, uaEnd, tokens);
                }
                return 0;
            }

            state = 2;
        } else {
            // A token without meaning
            if (options.ontoken) {
                options.ontoken(ltoken, version, 0, uaMatch.index, ua, uaStart, uaEnd, tokens);
            }
            return 0;
        }

        if (options.ontoken) {
            options.ontoken(tokens[tokens.length - 1], version, type, uaMatch.index, ua, uaStart, uaEnd, tokens);
        }

        return state;
    }

    getTokens(ua, options) {
        ua = ua.toLowerCase();

        if (/[^\S ]/.test(ua)) {
            ua = ua.replace(/[^\S ]/g, " ");
        }

        const uaLen = ua.length;
        const tokens = [];

        let lastIndex = 0;
        let match, start, end, prev, tmp, token, version, delimiter;

        this.matcher.lastIndex = 0;

        // eslint-disable-next-line no-cond-assign
        while (this.matcher.lastIndex < uaLen && (match = this.matcher.exec(ua))) {
            [tmp, token, version, delimiter] = match;

            if (token && hasProp.call(this.DLknownIrrelevantTokens, token)) {
                lastIndex = this.matcher.lastIndex;
                prev = "";
                continue;
            }

            if (token == null) {
                start = lastIndex;
                end = match.index;
                token = ua.slice(start, end);
            } else {
                start = match.index;
                end = start + token.length;
            }

            if (tmp === "//" && (token === "http:" || token === "https:")) {
                NON_SLASH_DELIMITER_REG.lastIndex = this.matcher.lastIndex;
                tmp = NON_SLASH_DELIMITER_REG.exec(ua);

                if (tmp) {
                    start = lastIndex;
                    end = tmp.index;
                    token = ua.slice(start, end);
                    this.matcher.lastIndex = NON_SLASH_DELIMITER_REG.lastIndex;
                } else {
                    this.matcher.lastIndex = uaLen;
                    start = lastIndex;
                    end = uaLen;
                    token = ua.slice(start, end);
                }
            }

            if (this.addToken(token, trimNotVersion(version), tokens, prev, ua, match, start, end, options) === 1) {
                prev = delimiter;
            } else {
                prev = "";
            }

            lastIndex = this.matcher.lastIndex;
        }

        return this.compressTokens(tokens, options);
    }

    getInifiniteVersion(vtoken, version, options) {
        if (vtoken !== "blackberry") {
            return [vtoken, "*", version];
        }

        version = trimModelNumber(version);

        return [vtoken, version[0] === "4" ? "4" : "*", version];
    }

    conflict(tokenizer, tokens1, tokens2) {
        const conflicts = [];
        const errors = [];

        const tokenAliasMap1 = lowerCaseProp(this.tokenAliasMap, true);
        const tokenAliasMap2 = lowerCaseProp(tokenizer.tokenAliasMap, true);
        const tokenAliasMap = Object.assign({}, tokenAliasMap1, tokenAliasMap2);

        Object.keys(tokenAliasMap1).forEach(token => {
            if (hasProp.call(tokenAliasMap2, token) && tokenAliasMap1[token] !== tokenAliasMap2[token]) {
                conflicts.push(`${ token } resolves to '${ tokenAliasMap1[token] }' in left and to '${ tokenAliasMap2[token] }' in right`);
            }
        });

        const resolveToken = token => {
            return hasProp.call(tokenAliasMap, token) ? tokenAliasMap[token] : token;
        };

        const tokenizer1 = Object.create(Tokenizer.prototype);
        tokenizer1.init({
            knownIrrelevantTokens: Object.keys(this.DLknownIrrelevantTokens).map(resolveToken),
            knownFiniteVersionedTokens: Object.keys(this.DLknownFiniteVersionedTokens).map(resolveToken),
            knownInfiniteVersionedTokens: Object.keys(this.DLknownInfiniteVersionedTokens).map(resolveToken),
            knownUnversionedTokens: Object.keys(this.DLknownUnversionedTokens).map(resolveToken),
            tokens: tokens1,
            errors
        });
        const tokens1_ = {};
        Object.keys(tokens1).forEach(token => {
            token = token.toLowerCase();
            tokens1_[resolveToken(token)] = tokens1[token];
        });
        tokenizer1.updateTokens(tokens1_, {
            errors
        });

        errors.forEach(err => {
            conflicts.push(`left ${ err }`);
        });
        errors.length = 0;

        const DLknownIrrelevantTokens1 = tokenizer1.DLknownIrrelevantTokens;
        const DLknownVersionedTokens1 = tokenizer1.DLknownVersionedTokens;
        const DLknownUnversionedTokens1 = tokenizer1.DLknownUnversionedTokens;
        const LknownTokens1 = tokenizer1.LknownTokens;
        const DLknownTokens1 = tokenizer1.DLknownTokens;

        const tokenizer2 = Object.create(Tokenizer.prototype);
        tokenizer2.init({
            knownIrrelevantTokens: Object.keys(tokenizer.DLknownIrrelevantTokens).map(resolveToken),
            knownFiniteVersionedTokens: Object.keys(tokenizer.DLknownFiniteVersionedTokens).map(resolveToken),
            knownInfiniteVersionedTokens: Object.keys(tokenizer.DLknownInfiniteVersionedTokens).map(resolveToken),
            knownUnversionedTokens: Object.keys(tokenizer.DLknownUnversionedTokens).map(resolveToken),
            tokens: tokens2,
            errors
        });
        const tokens2_ = {};
        Object.keys(tokens2).forEach(token => {
            token = token.toLowerCase();
            tokens2_[resolveToken(token)] = tokens2[token];
        });
        tokenizer2.updateTokens(tokens2_, {
            errors
        });

        errors.forEach(err => {
            conflicts.push(`right ${ err }`);
        });
        errors.length = 0;

        const DLknownIrrelevantTokens2 = tokenizer2.DLknownIrrelevantTokens;
        const DLknownVersionedTokens2 = tokenizer2.DLknownVersionedTokens;
        const DLknownUnversionedTokens2 = tokenizer2.DLknownUnversionedTokens;
        const LknownTokens2 = tokenizer2.LknownTokens;
        const DLknownTokens2 = tokenizer2.DLknownTokens;

        const l1 = LknownTokens1.length;
        const l2 = LknownTokens2.length;

        let i, j, token1, token2;

        for (i = 0; i < l1; i++) {
            token1 = LknownTokens1[i];

            if (hasProp.call(DLknownIrrelevantTokens1, token1)) {
                // Nothing to do
            } else if (hasProp.call(DLknownVersionedTokens1, token1)) {
                if (hasProp.call(DLknownUnversionedTokens2, token1)) {
                    conflicts.push(`versioned in left but not in right: '${ token1 }'`);
                }
            } else if (hasProp.call(DLknownUnversionedTokens1, token1)) {
                if (hasProp.call(DLknownVersionedTokens2, token1)) {
                    conflicts.push(`versioned in right but not in left: '${ token1 }'`);
                }
            }

            if (hasProp.call(DLknownTokens2, token1)) {
                continue;
            }

            for (j = 0; j < l2; j++) {
                token2 = LknownTokens2[j];

                if (token1.length > token2.length) {
                    if (
                        token1.startsWith(token2) &&
                        !hasProp.call(DLknownTokens2, token1) &&
                        !hasProp.call(DLknownIrrelevantTokens1, token1) &&
                        !hasProp.call(DLknownIrrelevantTokens2, token2) &&
                        DELIMITER_CHARS_REG.test(token1)
                    ) {
                        conflicts.push(`'${ token1 }' starts with '${ token2 }'`);
                    }
                } else if (token1.length < token2.length) {
                    if (
                        token2.startsWith(token1) &&
                        !hasProp.call(DLknownTokens1, token2) &&
                        !hasProp.call(DLknownIrrelevantTokens1, token1) &&
                        !hasProp.call(DLknownIrrelevantTokens2, token2) &&
                        DELIMITER_CHARS_REG.test(token2)
                    ) {
                        conflicts.push(`'${ token1 }' is at the begining of '${ token2 }'`);
                    }
                }
            }
        }

        for (j = 0; j < l2; j++) {
            token2 = LknownTokens2[j];

            if (hasProp.call(DLknownTokens1, token2)) {
                continue;
            }

            if (hasProp.call(DLknownIrrelevantTokens2, token2)) {
                // Nothing to do
            } else if (hasProp.call(DLknownVersionedTokens2, token2)) {
                if (hasProp.call(DLknownUnversionedTokens1, token2)) {
                    conflicts.push(`versioned in right but not in left: '${ token2 }'`);
                }
            } else if (hasProp.call(DLknownUnversionedTokens2, token2)) {
                if (hasProp.call(DLknownVersionedTokens1, token2)) {
                    conflicts.push(`versioned in left but not in right: '${ token2 }'`);
                }
            }

            for (i = 0; i < l1; i++) {
                token1 = LknownTokens1[i];

                if (token2.length > token1.length) {
                    if (
                        token2.startsWith(token1) &&
                        !hasProp.call(DLknownTokens1, token2) &&
                        !hasProp.call(DLknownIrrelevantTokens1, token1) &&
                        !hasProp.call(DLknownIrrelevantTokens2, token2) &&
                        DELIMITER_CHARS_REG.test(token2)
                    ) {
                        conflicts.push(`'${ token1 }' is at the begining of '${ token2 }'`);
                    }
                } else if (token2.length < token1.length) {
                    if (
                        token1.startsWith(token2) &&
                        !hasProp.call(DLknownTokens2, token1) &&
                        !hasProp.call(DLknownIrrelevantTokens1, token1) &&
                        !hasProp.call(DLknownIrrelevantTokens2, token2) &&
                        DELIMITER_CHARS_REG.test(token1)
                    ) {
                        conflicts.push(`'${ token1 }' starts with '${ token2 }'`);
                    }
                }
            }
        }

        return conflicts.length ? conflicts : false;
    }
}

Tokenizer.defaultOptions = defaultOptions;

const tokenizer = new Tokenizer();

const mergeOptions = (tokenizer1, tokenizer2, options) => {
    ["knownFiniteVersionedTokens", "knownInfiniteVersionedTokens", "knownUnversionedTokens"].forEach(prop => {
        if (tokenizer2[prop]) {
            tokenizer1[prop] = tokenizer1[prop] == null ? tokenizer2[prop] : tokenizer1[prop].concat(tokenizer2[prop]);
        }
    });

    ["knownIrrelevantTokens"].forEach(prop => {
        if (tokenizer2[prop]) {
            if (tokenizer1[prop] == null) {
                tokenizer1[prop] = tokenizer2[prop];
                return;
            }

            if (tokenizer2[prop] == null) {
                return;
            }

            const ret = new Array(tokenizer1[prop].length + tokenizer2[prop].length);
            let len = 0;

            const relevant = lowerCaseProp(flip([].concat(
                tokenizer1.knownFiniteVersionedTokens, tokenizer1.knownInfiniteVersionedTokens, tokenizer1.knownUnversionedTokens,
                tokenizer2.knownFiniteVersionedTokens, tokenizer2.knownInfiniteVersionedTokens, tokenizer2.knownUnversionedTokens
            ), 1, true));

            const irrelevant2 = lowerCaseProp(flip(tokenizer2[prop], 1, true));

            tokenizer1[prop].forEach(token => {
                token = token.toLowerCase();
                if (hasProp.call(irrelevant2, token) && !hasProp.call(relevant, token.toLowerCase())) {
                    ret[len++] = token;
                }
            });

            tokenizer1[prop] = ret.slice(0, len);
        }
    });

    ["tokenAliasMap", "tokens"].forEach(prop => {
        if (tokenizer2[prop] != null) {
            tokenizer1[prop] = Object.assign({}, tokenizer1[prop], tokenizer2[prop]);
        }
    });

    return tokenizer1;
};

Object.assign(Tokenizer, {
    TOKEN_TYPES: {
        IRRELEVANT: TOKEN_TYPE_IRRELEVANT,
        REMOVED: TOKEN_TYPE_REMOVED,
        FINITE_VERSION: TOKEN_TYPE_FINITE_VERSION,
        INFINITE_VERSION: TOKEN_TYPE_INFINITE_VERSION,
        UNVERSIONED: TOKEN_TYPE_UNVERSIONED,
    },
    tokenizer,
    getTokens: Tokenizer.prototype.getTokens.bind(tokenizer),
    mergeOptions
});

module.exports = Tokenizer;
