const sysPath = require("path");
const yaml = require("js-yaml");
const fs = require("fs");

const sanitizeVersion = require("../functions/sanitizeVersion");

// const data = require("../data/softwares.json");
const data = require("../data/training.json");
// const data = [];

const test_ua = yaml.safeLoad(fs.readFileSync(sysPath.resolve(__dirname, "../data/test_ua.yaml"))).test_cases;
const test_os = yaml.safeLoad(fs.readFileSync(sysPath.resolve(__dirname, "../data/test_os.yaml"))).test_cases;
// const test_device = yaml.safeLoad(fs.readFileSync(sysPath.resolve(__dirname, "../data/test_device.yaml"))).test_cases;

const hasProp = Object.prototype.hasOwnProperty;

const SOFTWARE_FAMILY_MAP = {
    "008": "80Legs Web Crawler",
    "449 Overture-WebCrawler": "Overture WebCrawler",
    AdobeAIR: "Adobe Air",
    AhrefsBot: "Ahrefs Backlink Research Bot",
    Android: "Android Browser",
    AOL: "Aol Browser",
    "Apache-HttpClient": "Apache HttpClient",
    "AppEngine-Google": "Google App Engine Software",
    "archive.org_bot": "Internet Archiver Bot",
    archiver: "Internet Archive",
    Avant: "Avant Browser",
    "aws-cli": "AWS Command Line Interface",
    "aws-sdk-cpp": "AWS SDK for C++",
    "aws-sdk-go": "AWS SDK for Go",
    "aws-sdk-java": "AWS SDK for Java",
    "aws-sdk-nodejs": "AWS SDK for JavaScript in Node.js",
    "aws-sdk-ruby2": "AWS SDK for Ruby - Version 2",
    Baiduspider: "Baidu Spider",
    BaiDuSpider: "Baidu Spider",
    bingbot: "Bingbot",
    "BlackBerry WebKit": "Blackberry Browser",
    BlackBerry: "Blackberry Browser",
    Boto: "AWS SDK for Python",
    Boto3: "AWS SDK for Python (Boto3)",
    CareerBot: "CareerBot Search Crawler",
    "Catchpoint bot": "Catchpoint Analyser",
    Catchpoint: "Catchpoint Analyser",
    "Chrome Mobile iOS": "Chrome",
    "Chrome Mobile WebView": "Chrome",
    "Chrome Mobile": "Chrome",
    "compatible crawler": "Crawler",
    crawl: "Crawl",
    crawler: "Crawler",
    curl: "Curl",
    DAVdroid: "dav4android",
    DotBot: "Opensiteexplorer Crawler",
    "Edge Mobile": "Edge",
    Electron: "Electron Application",
    Exabot: "Exalead Crawler",
    Facebook: "Facebook App",
    FacebookBot: "Facebook Bot",
    "Firefox (Minefield)": "Minefield",
    "Firefox (Shiretoko)": "Shiretoko",
    "Firefox Alpha": "Firefox",
    "Firefox Beta": "Firefox",
    "Firefox iOS": "Firefox",
    "Firefox Mobile": "Firefox",
    Genieo: "Genieo Bot",
    Googlebot: "GoogleBot",
    "Googlebot-Mobile": "GoogleBot Mobile",
    GooglePlusBot: "Google+ Snippet Fetcher",
    GrapeshotCrawler: "Grapeshot Bot",
    "gsa-crawler": "Google Search App",
    HeadlessChrome: "Chrome",
    iaskspider2: "iaskspider",
    "IE Mobile": "Internet Explorer Mobile",
    IE: "Internet Explorer",
    Iron: "Srware Iron",
    "it-Crawler": "Liquida",
    Java: "Java Runtime Environment",
    JikeSpider: "Jike Spider Bot",
    "K-Meleon": "K Meleon",
    Kindle: "Kindle Browser",
    lftp: "LFTP",
    "libwww-perl": "Library For Www In Perl",
    masscan: "MASSCAN: Mass IP port scanner",
    meanpathbot: "Meanpath Bot",
    "Mediapartners-Google": "Google'S Media Partners System (Adsense)",
    "Microsoft-CryptoAPI": "Microsoft CryptoAPI",
    MJ12bot: "Majestic 12 Distributed Search Bot",
    "Mobile Safari UI/WKWebView": "Webkit Based Browser",
    "Mobile Safari": "Safari",
    msnbot: "Msn Bot",
    "NetFront NX": "NetFront",
    Netscape: "Netscape Navigator",
    "NetSeer crawler": "Netseer Crawler",
    "news bot": "Newsbot",
    "Nokia Services (WAP) Browser": "Nokia Browser",
    okhttp: "Okhttp",
    Openwave: "Openwave Mobile Browser",
    "Opera Mobile": "Opera",
    "Opera Tablet": "Opera",
    "Overture-WebCrawler": "Overture WebCrawler",
    Pinterest: "Pinterest App",
    Pinterestbot: "Pinterest Bot",
    "Python-urllib": "Python Urllib",
    "QQ Browser Mobile": "QQ Browser",
    rclone: "Rclone",
    "RCM CardDAV plugin": "RCMCardDAV",
    "Samsung Internet": "Samsung Browser",
    "Seznam prohlížeč": "Prohlížeč Seznam.cz",
    "Slackbot-LinkExpanding": "Slackbot Link Checker",
    "Sogou web spider": "Sogou \"Search Dog\"",
    Sosospider: "Sosospider Search Bot",
    SurveyBot: "Domaintools Surveybot",
    TweetmemeBot: "Tweetmeme Bot",
    "UP.Browser": "Openwave Mobile Browser",
    "WebKit Nightly": "Webkit Based Browser",
    "Yahoo! Slurp": "Yahoo! Slurp Web Crawler Bot",
    YandexBot: "Yandex Search Bot",
    YodaoBot: "Yodaobot Search Bot",
};

const OS_FAMILY_MAP = {
    BREW: "Brew MP",
    GoogleTV: "Android",
    Other: "--",
    "Windows 2000": "Windows",
    "Windows 3.1": "Windows",
};

const fixVersion = (software, version, ua, token) => {
    const index = ua.lastIndexOf(token);

    if (index === -1) {
        return version;
    }

    const reg = /[\d.]+/g;
    reg.lastIndex = index;
    const match = reg.exec(ua);

    return match ? match[0] : version;
};

const fixSoftwareName = (software, ua) => {
    switch (software) {
        case "Nutch; http:":
            return "The Sapphire Web Crawler";
        case "Java Runtime Environment":
            return ua.indexOf("Apache-HttpClient/") === -1 ? software : "Apache HttpClient";
        case "NetFront":
            return ua.indexOf("NintendoBrowser/") === -1 ? software : "Nintendo Browser";
        case "UC Browser":
            return ua.indexOf("Chrome/") === -1 ? "UC Browser Mini" : software;
        case "Safari":
        case "Webkit Based Browser":
            return ua.indexOf("PhantomJS/") === -1 ? software : "PhantomJS";
        default:
            return software;
    }
};

const fixSoftwareVersion = (software, version, ua) => {
    switch (software) {
        case "Android Browser":
            return fixVersion(software, version, ua, "Version/");
        case "Java Runtime Environment":
            return `1.${ version }`;
        case "Nintendo Browser":
            return fixVersion(software, version, ua, "NintendoBrowser/");
        case "The Sapphire Web Crawler":
            return fixVersion(software, version, ua, "SapphireWebCrawler/");
        case "Windows":
            if (version) {
                return version;
            }

            if (ua.indexOf("Windows 2000")) {
                return "2000";
            }

            if (ua.indexOf("Windows 3.1")) {
                return "3.1";
            }

            return version;
        default:
            return version.toLowerCase();
    }
};

const agentsmap = Object.create(null);

test_ua.forEach(({user_agent_string: ua, family, major, minor, patch, patch_minor}) => {
    // eslint-disable-next-line no-multi-assign
    const agent = agentsmap[ua] = {
        ua,
        software: hasProp.call(SOFTWARE_FAMILY_MAP, family) ? SOFTWARE_FAMILY_MAP[family] : family,
        version: sanitizeVersion([major || "", minor ? `.${ minor }` : "", patch ? `.${ patch }` : "", patch_minor ? `.${ patch_minor }` : ""].join("")),
    };

    agent.software = fixSoftwareName(agent.software, ua);
    agent.version = fixSoftwareVersion(agent.software, agent.version, ua);
});

test_os.forEach(({user_agent_string: ua, family, major, minor, patch, patch_minor}) => {
    if (!hasProp.call(agentsmap, ua)) {
        agentsmap[ua] = {ua};
    }

    Object.assign(agentsmap[ua], {
        os: {
            family: hasProp.call(OS_FAMILY_MAP, family) ? OS_FAMILY_MAP[family] : family,
            version: sanitizeVersion([major || "", minor ? `.${ minor }` : "", patch ? `.${ patch }` : "", patch_minor ? `.${ patch_minor }` : ""].join("")),
        }
    });
});

// test_device.forEach(({user_agent_string: ua, family, brand, model}) => {
//     if (!hasProp.call(agentsmap, ua)) {
//         agentsmap[ua] = {ua};
//     }

//     Object.assign(agentsmap[ua], {
//         device: {
//             family,
//             brand,
//             model,
//         }
//     });
// });

let i = data.length;
data.length += Object.keys(agentsmap).length;
Object.keys(agentsmap).forEach(key => {
    data[i++] = agentsmap[key];
});

module.exports = data;
