const LknownTokens = [
    "google-http-java-client",
    "x86_64-redhat-linux-gnu",
    "qtweb internet browser",
    "i386-redhat-linux-gnu",
    "http://www.qtweb.net",
    "mediapartners-google",
    "apple-x86_64-darwin",
    "khtml, like gecko",
    "khtml  like gecko",
    "wayback save page",
    "khtml like gecko",
    "appengine-google",
    "googlebot-mobile",
    "windows phone os",
    "playstation vita",
    "google earth pro",
    "javaplatform/jp",
    "nintendobrowser",
    "ipad; u; cpu os",
    "google favicon",
    "micromessenger",
    "samsungbrowser",
    "ruxitsynthetic",
    "yjapp-android",
    "samsung-sgh-i",
    "s40ovibrowser",
    "like mac os x",
    "inettvbrowser",
    "windows phone",
    "amazon kindle",
    "rim tablet os",
    "avant browser",
    "samsung-sm-j",
    "samsung-sm-t",
    "google earth",
    "ipad; cpu os",
    "haosouspider",
    "samsung-sm-g",
    "samsung-sm-n",
    "dmbrowser-uv",
    "dmbrowser-bv",
    "pinterestbot",
    "qtcarbrowser",
    "playstation",
    "ucweb-squid",
    "bingpreview",
    "qutebrowser",
    "qtwebengine",
    "applewebkit",
    "kindle fire",
    "chromeframe",
    "ddg-android",
    "nokia-lumia",
    "like gecko",
    "uc browser",
    "bb10,touch",
    "gomezagent",
    "mocordroid",
    "qt-creator",
    "ipod touch",
    "wosbrowser",
    "qtembedded",
    "windows ce",
    "3b-webview",
    "windows nt",
    "blackberry",
    "compatible",
    "nooktablet",
    "opera mini",
    "ahrefsbot",
    "nookcolor",
    "pinterest",
    "googlebot",
    "dejaclick",
    "iris fuel",
    "360spider",
    "phantomjs",
    "aolshield",
    "ucbrowser",
    "tclwebkit",
    "aolsecure",
    "aol-iweng",
    "symbianos",
    "surveybot",
    "dmbrowser",
    "bbb100-3",
    "news bot",
    "andromax",
    "mac os x",
    "netfront",
    "iemobile",
    "casperjs",
    "googletv",
    "lavairis",
    "bbb100-1",
    "smart-tv",
    "windvane",
    "bbb100-2",
    "openbsd",
    "facebot",
    "mozilla",
    "browser",
    "freebsd",
    "mj12bot",
    "bingbot",
    "maxthon",
    "android",
    "trident",
    "libcurl",
    "smarttv",
    "samsung",
    "symbian",
    "ideatab",
    "firefox",
    "squider",
    "netbsd",
    "kfthwi",
    "metasr",
    "kfgiwi",
    "kffowi",
    "kfdowi",
    "exabot",
    "iphone",
    "kfsuwi",
    "iris x",
    "darwin",
    "kfauwi",
    "dalvik",
    "safari",
    "chrome",
    "puffin",
    "nokiac",
    "nokiae",
    "nokian",
    "nokiax",
    "kfsowi",
    "symbos",
    "kindle",
    "nookhd",
    "aolapp",
    "nokia",
    "droid",
    "haiku",
    "ucweb",
    "arora",
    "crios",
    "opios",
    "opera",
    "yahoo",
    "qtweb",
    "linux",
    "snook",
    "fbios",
    "gecko",
    "fxios",
    "kfjwi",
    "dillo",
    "beos",
    "bada",
    "qihu",
    "wget",
    "msie",
    "fban",
    "cros",
    "bb10",
    "silk",
    "kfot",
    "java",
    "kftt",
    "iron",
    "iris",
    "ipod",
    "ipad",
    "iemb",
    "crmo",
    "acer",
    "ptst",
    "edga",
    "edge",
    "curl",
    "nook",
    "curl",
    "lynx",
    "dwb",
    "x11",
    "win",
    "mib",
    "gsa",
    "opr",
    "ios",
    "aol",
    "mmp",
    "qt"
];

const versionStartMatcher = new RegExp(`^(?:${ LknownTokens.join("|") })`);
const versionStartReplacer = new RegExp(`^(${ LknownTokens.join("|") })`);
const versionStartReplacerEnd = new RegExp(`^(${ LknownTokens.join("|") }).*$`);

const benchmark = require("benchmark");
const token = "windows nt 6.3";

const suite = new benchmark.Suite();

suite
    .add("    versionStartMatcher", () => {
        versionStartMatcher.exec(token);
    })
    .add("   versionStartReplacer", () => {
        token.replace(versionStartReplacer, "");
    })
    .add("versionStartReplacerEnd", () => {
        token.replace(versionStartReplacerEnd, "$1");
    })
    .on("cycle", event => {
        console.log(String(event.target));
    })
    .on("complete", function() {
        // eslint-disable-next-line no-invalid-this
        console.log(`Fastest is ${ this.filter("fastest").map("name").toString().trim() }`);
    })
    .run({
        async: true
    });
