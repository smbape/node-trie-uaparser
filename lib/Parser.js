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

const DEFAULT_INDEXES = tryRequire("../data/indexes.json", {});
const DEFAULT_OS_INDEXES = tryRequire("../data/indexes-os.json", {});

const defaultOptions = {
    indexes: {
        children: DEFAULT_INDEXES.children
    },
    osIndexes: {
        children: DEFAULT_OS_INDEXES.children
    },
    tokenizer: Object.assign({}, Tokenizer.defaultOptions, {
        tokens: DEFAULT_INDEXES.tokens,
        reset: true
    }),
    osTokenizer: Object.assign({}, Tokenizer.defaultOptions, {
        tokens: DEFAULT_OS_INDEXES.tokens,
        reset: true
    }),
    versionMap: {
        "1337Browser": "1337Browser *",
        "200PleaseBot": "200PleaseBot *",
        "3 Robot": "robot *",
        "50.nu": "50.nu *",
        "80bot": "80bot *",
        "80Legs Web Crawler": "008 *",
        "A6-Indexer": "a6-indexer *",
        Aboundex: "aboundex *",
        "Accoona-AI-Agent": "accoona-ai-agent *",
        "Accoona-Biz-Agent": "accoona-biz-agent *",
        AcquiloSpider: "acquilospider *",
        "Adobe Air": "AdobeAIR *",
        agbot: "agbot *",
        "Ahrefs Backlink Research Bot": "AhrefsBot *",
        Airmail: "Airmail *",
        "Aleksika Spider": "aleksika spider *",
        "Alertsite Monitoring Bot": "DejaClick *",
        "Alexa Site Audit": "Alexa Site Audit *",
        Altresium: "altresium *",
        "Amazon Silk": "Silk *",
        AmorankSpider: "amorankspider *",
        "Android Browser": "Version *",
        AngryBirdsBlack: "angrybirdsblack-iphone *",
        AnomaliesBot: "anomaliesbot *",
        "Ant-Nutch": "ant-nutch *",
        "Aol Browser": "AOL *",
        "Apache HttpClient": "Apache-HttpClient *",
        "Apexoo Spider": "apexoo spider *",
        archive_crawler: "archive_crawler *",
        Argus: "argus *",
        aria2: "aria2 *",
        Arora: "Arora *",
        "Asterias Crawler": "asterias crawler *",
        audioCrawlerBot: "audiocrawlerbot *",
        "Automattic Analytics Crawler": "automattic analytics crawler *",
        "Avant Browser": "avant browser *",
        awesomebar_scraper: "awesomebar_scraper *",
        Awesomium: "Awesomium *",
        "AWS Command Line Interface": "aws-cli *",
        "AWS SDK for C++": "aws-sdk-cpp *",
        "AWS SDK for Go": "aws-sdk-go *",
        "AWS SDK for Java": "aws-sdk-java *",
        "AWS SDK for JavaScript in Node.js": "aws-sdk-nodejs *",
        "AWS SDK for Python (Boto3)": "Boto3 *",
        "AWS SDK for Python": "Boto *",
        "AWS SDK for Ruby - Version 2": "aws-sdk-ruby2 *",
        Axel: "Axel *",
        Axtaris: "axtaris *",
        BabalooSpider: "babaloospider *",
        babbelIndonesian: "babbelindonesian-ipad *",
        "BacaBerita App": "BacaBerita App *",
        "Baidu Browser": "baidubrowser *",
        "Baidu Spider": "Baiduspider *",
        BaiduMobaider: "baidumobaider *",
        Barca: ["Barca *", "BarcaPro *"],
        Basilisk: "Basilisk *",
        BebopBot: "bebopbot *",
        "beta crawler": "beta crawler *",
        "Bing for iPad": "bing for ipad *",
        Bingbot: "bingbot *",
        BingPreview: "BingPreview *",
        "Blackberry Browser": "Version *",
        BLEXBot: "blexbot *",
        BlinkaCrawler: "blinkacrawler *",
        blog_crawler: "blog_crawler *",
        BlogBridge: "blogbridge *",
        Bloglovin: "Bloglovin *",
        BlogRangerCrawler: "blograngercrawler *",
        "BoardReader Favicon Fetcher": "BoardReader Favicon Fetcher *",
        BoardReader: "boardreader *",
        "boitho.com-dc": "boitho.com-dc *",
        BOLT: "BOLT *",
        "Bot Blocker Crawler": "bot blocker crawler *",
        BotSeer: "botseer *",
        "Box Sync": "Box Sync *",
        Box: "Box *",
        BoxNotes: "BoxNotes *",
        Brave: "Brave *",
        "Brekiri crawler": "brekiri crawler *",
        "Broadsign Xpress": "BroadSign Xpress *",
        "BT Crawler": "bt crawler *",
        Bunjalloo: "Bunjalloo *",
        "BurstFind Crawler": "burstfind crawler *",
        BurstFindCrawler: "burstfindcrawler *",
        "ca-crawler": "ca-crawler *",
        CamontSpider: "camontspider *",
        "CareerBot Search Crawler": "CareerBot *",
        "Catchpoint Analyser": "Chrome *",
        CazoodleBot: "cazoodlebot *",
        CCBot: "ccbot *",
        CFNetwork: "cfnetwork *",
        Charlotte: "charlotte *",
        Checklinks: "checklinks *",
        Chimera: "Chimera *",
        "Chrome Frame": "chromeframe *",
        Chrome: ["Chrome *", "HeadlessChrome *", "CrMo *", "CriOS *"],
        Chromium: "Chromium *",
        CloudServerMarketSpider: "cloudservermarketspider *",
        "Coc Coc": "coc_coc_browser *",
        "Comodo Dragon": "Comodo_Dragon *",
        "Comodo Icedragon": "Icedragon *",
        "Comodo Spider": "comodo spider *",
        "Comodo-Webinspector-Crawler": "comodo-webinspector-crawler *",
        CompSpyBot: "compspybot *",
        Conkeror: "Conkeror *",
        ConveraCrawler: "converacrawler *",
        ConveraMultiMediaCrawler: "converamultimediacrawler *",
        Cooliris: "cooliris *",
        CosmixCrawler: "cosmixcrawler *",
        Crawl: "crawl *",
        "CRAWL-E": "crawl-e *",
        CrawlBot: "crawlbot *",
        CrawlConvera: "crawlconvera *",
        CrawlDaddy: "crawldaddy *",
        Crawler: "crawler *",
        Crawllybot: "crawllybot *",
        CrawlWave: "crawlwave *",
        Crawly: "crawly *",
        Crawlzilla: "crawlzilla *",
        CRAZYWEBCRAWLER: "crazywebcrawler *",
        Crosswalk: "Crosswalk *",
        Curl: "curl *",
        Cyberduck: "Cyberduck *",
        CydralSpider: "cydralspider *",
        DataparkSearch: "dataparksearch *",
        Daumoa: "daumoa *",
        "Daumoa-feedfetcher": "daumoa-feedfetcher *",
        dav4android: "DAVdroid *",
        dCrawlBot: "dcrawlbot *",
        "DealGates Bot": "dealgates bot *",
        "Debian APT-HTTP": "Debian APT-HTTP *",
        deepcrawler: "deepcrawler *",
        DefaultCrawlTest: "defaultcrawltest *",
        "Delphi Embedded Web Browser": "EmbeddedWB *",
        "Denodo IECrawler": "denodo iecrawler *",
        DEPoker: "depoker-ipad *",
        Diffbot: "diffbot *",
        DNSGroup: "dnsgroup *",
        Dolfin: "Dolfin *",
        Dolphin: ["Dolphin *", "DolphinHDCN *", "Dolphin/INT *"],
        DomainCrawler: "domaincrawler *",
        "Domaintools Surveybot": "SurveyBot *",
        "Dorado Wap Browser": "WAP-Browser *",
        "Dotcom Monitor Bot": ["DMBrowser *", "Version *"],
        DotSpotsBot: "dotspotsbot *",
        Dragon: "Dragon *",
        "Duckduckgo Favicons Bot": "DuckDuckGo-Favicons-Bot *",
        echocrawl: "echocrawl *",
        Edge: "Edge *",
        EDI: "edi *",
        "Electron Application": "Electron *",
        "enicura crawler": "enicura crawler *",
        envolk: "envolk *",
        "envolk[ITS]spider": "envolk[its]spider *",
        Epiphany: "Epiphany *",
        ERACrawler: "eracrawler *",
        "eseek-crawler": "eseek-crawler *",
        Espial: "Espial *",
        ESPN: "ESPN Radio *",
        EventGuruBot: "eventgurubot *",
        Evolution: "Evolution *",
        "Ex-Crawler": "ex-crawler *",
        "ExactSeek Crawler": "exactseek crawler *",
        ExactSeekCrawler: "exactseekcrawler *",
        "Exalead Crawler": "Exabot *",
        "ExB Language Crawler": "ExB Language Crawler *",
        ExchangeServicesClient: "ExchangeServicesClient *",
        ExchangeWebServices: "ExchangeWebServices *",
        "Facebook App": "FBAV *",
        "Facebook Bot": "facebookexternalhit *",
        FANGCrawl: "fangcrawl *",
        "FAST Crawler": "fast crawler *",
        "FAST Enterprise Crawler": "fast enterprise crawler *",
        "FAST EnterpriseCrawler": "fast enterprisecrawler *",
        "FAST FreshCrawler": "fast freshcrawler *",
        "FAST-WebCrawler": "fast-webcrawler *",
        fastlwspider: "fastlwspider *",
        FASTMobileCrawl: "fastmobilecrawl *",
        FatBot: "fatbot *",
        "Feedjit Favicon Crawler": "feedjit favicon crawler *",
        fetchurl: "fetchurl *",
        findlinks: "findlinks *",
        Firebird: "Firebird *",
        Firefox: "Firefox *",
        FireWeb: "FireWeb *",
        FlaxCrawler: "flaxcrawler *",
        Flipboard: "Flipboard *",
        "Flipboard-Briefing": "Flipboard-Briefing *",
        FyberSpider: "fyberspider *",
        GarlikCrawler: "garlikcrawler *",
        GematchCrawler: "gematchcrawler *",
        "Genieo Bot": "Genieo *",
        Gigabot: "gigabot *",
        GingerCrawler: "gingercrawler *",
        "Glo-De": "glo-de-ipad *",
        "Gnip Unwindfetchor Crawler": "UnwindFetchor *",
        "Go-http-client": "Go-http-client *",
        GoGuidesBot: "goguidesbot *",
        GomezAgent: "GomezAgent *",
        Goodzer: "goodzer *",
        "Google Chromecast": "CrKey *",
        "Google Search App": "GSA *",
        "Google'S Media Partners System (Adsense)": "Mediapartners-Google *",
        "Google-HTTP-Java-Client": "Google-HTTP-Java-Client *",
        "GoogleBot Mobile": "GoogleBot-Mobile *",
        GoogleBot: "GoogleBot *",
        "Googlebot-Image": "googlebot-image *",
        "Googlebot-Video": "googlebot-video *",
        "Grapeshot Bot": "GrapeshotCrawler *",
        Grub: "grub *",
        "grub-client": "grub-client *",
        GSiteCrawler: "gsitecrawler *",
        Hailoobot: "hailoobot *",
        "Hatena::Crawler": "hatena::crawler *",
        HbbTV: "HbbTV *",
        heritrix: "heritrix *",
        HiddenMarket: "hiddenmarket *",
        "HipChat Desktop Client": "HipChat *",
        hitcrawler_0: "hitcrawler_0 *",
        HiveCrawler: "hivecrawler *",
        holmes: "holmes *",
        HooWWWer: "hoowwwer *",
        "Host-Spy Crawler": "host-spy crawler *",
        "HPI FeedCrawler": "hpi feedcrawler *",
        HRCrawler: "hrcrawler *",
        htdig: "htdig *",
        Httpclient: "HTTPClient *",
        HttpSpider: "httpspider *",
        HuaweiSymantecSpider: "huaweisymantecspider *",
        "HubSpot Crawler": "hubspot crawler *",
        i1searchbot: "i1searchbot *",
        ia_archiver: "ia_archiver *",
        iaskspider: "iaskspider *",
        "iBrowser Mini": "iBrowser/Mini *",
        "ICC-Crawler": "icc-crawler *",
        "ICE Browser": "ICE Browser *",
        IceCat: "IceCat *",
        Iceweasel: "Iceweasel *",
        ichiro: "ichiro *",
        IconSurf: "iconsurf *",
        IlTrovatore: "iltrovatore *",
        IMPlusFull: "implusfull-ipad *",
        Infohelfer: "infohelfer *",
        InfuzApp: "infuzapp *",
        INGRID: "ingrid *",
        Instagram: "Instagram *",
        "Internet Archive": "special_archiver *",
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
        InternetArchive: "internetarchive *",
        "Iplexx Spider": "iplexx spider *",
        iRAPP: "iRAPP *",
        IRLbot: "irlbot *",
        Isara: "isara *",
        "Island for iPhone": "island for iphone *",
        ISSpider: "isspider *",
        "it2media-domain-crawler": "it2media-domain-crawler *",
        iTunes: "itunes *",
        "Jakarta Commons Httpclient": "Jakarta Commons-HttpClient *",
        Jambot: "jambot *",
        "Java Runtime Environment": "Java *",
        "Javafx Platform": "JavaFX *",
        "Jaxified Crawler": "jaxified crawler *",
        JDSports: "jdsports-ipad *",
        JetS3t: "JetS3t *",
        JNLP: "jnlp *",
        JobSpider_BA: "JobSpider_BA *",
        Jomjaibot: "jomjaibot *",
        jrCrawler: "jrcrawler *",
        "K Meleon": "K-Meleon *",
        "KDDI-Googlebot-Mobile": "kddi-googlebot-mobile *",
        "Kindle Browser": "Version *",
        "KIT webcrawler": "kit webcrawler *",
        kmail2: "kmail2 *",
        Konqueror: "Konqueror *",
        Kraken: "kraken *",
        "Kurio App": "Kurio *",
        Kurzor: "kurzor *",
        "Kyoto-Crawler": "kyoto-crawler *",
        larbin: "larbin *",
        "LB-Crawler": "lb-crawler *",
        LEIA: "leia *",
        LFTP: "lftp *",
        "libcurl-agent": "libcurl-agent *",
        "Library For Www In Perl": "libwww-perl *",
        Lightning: "Lightning *",
        Lightningspider: "lightningspider *",
        LikaholixCrawler: "likaholixcrawler *",
        "Linkcheck Analyser": "MSIE *",
        LinkedInBot: "LinkedInBot *",
        Links: "links *",
        LinksCrawler: "linkscrawler *",
        "Liquida Spider": "liquida spider *",
        Liquida: "Liquida.it-Crawler *",
        "Lite Bot": "lite bot *",
        Llaut: "llaut *",
        "loc-crawl": "loc-crawl *",
        "loc-crawler": "loc-crawler *",
        "Logict IPv6 Crawler": "logict ipv6 crawler *",
        LOOQ: "looq *",
        "Lotus Notes": "Lotus-Notes *",
        LSSRocketCrawler: "lssrocketcrawler *",
        "lworld spider": "lworld spider *",
        Lynx: "Lynx *",
        m65bot: "m65bot *",
        MacAppStore: "macappstore *",
        MacOutlook: "MacOutlook *",
        "magpie-crawler": "magpie-crawler *",
        "Mail.ru Chromium Browser": "Chrome *",
        "Mail.RU_Bot": "Mail.RU_Bot *",
        MailBar: "MailBar *",
        "Majestic 12 Distributed Search Bot": "MJ12bot *",
        masidani_bot: "masidani_bot *",
        "MASSCAN: Mass IP port scanner": "masscan *",
        Maxthon: ["Maxthon *", "MxBrowser *"],
        mDolphin: "mDolphin *",
        "Meanpath Bot": "meanpathbot *",
        MedSpider: "MedSpider *",
        MetaGeneratorCrawler: "metageneratorcrawler *",
        MetamojiCrawler: "metamojicrawler *",
        "Microsoft CryptoAPI": "Microsoft-CryptoAPI *",
        "Microsoft SkyDriveSync": "Microsoft SkyDriveSync *",
        Midori: "Midori *",
        Minefield: "Minefield *",
        Minimo: "Minimo *",
        "Mobile Spider1": "mobile spider1 *",
        MobileIron: "MobileIron *",
        MobileRSSFree: "mobilerssfree-ipad *",
        MonkeyCrawl: "monkeycrawl *",
        mozDex: "mozdex *",
        "Mozilla crawl": "mozilla crawl *",
        MozillaDeveloperPreview: "MozillaDeveloperPreview *",
        MPICrawler: "mpicrawler *",
        "Msn Bot": "msnbot *",
        "msnbot-media": "msnbot-media *",
        "Mvision Player": "MVisionPlayer *",
        "MXit WebBot": "mxit webbot *",
        "My Spider": "my spider *",
        NalezenCzBot: "nalezenczbot *",
        "NationalDirectory-WebSpider": "nationaldirectory-webspider *",
        "NCSA Mosaic": "NCSA_Mosaic *",
        "Netchart Adv Crawler": "netchart adv crawler *",
        NetFront: ["NX *", "NetFront *", "ACS-NetFront *"],
        "Netseer crawler": "netseer crawler *",
        "Netseer Crawler": "NetSeer crawler *",
        NetWhatCrawler: "netwhatcrawler *",
        "New-Sogou-Spider": "new-sogou-spider *",
        NewRelicPingerBot: "NewRelicPinger *",
        Newsbot: "news bot *",
        "NewsGator FetchLinks extension": "newsgator fetchlinks extension *",
        NewsGator: "newsgator *",
        NewsGatorOnline: "newsgatoronline *",
        NewzCrawler: "newzcrawler *",
        Nexplayer: "NexPlayer *",
        NightstandPaid: "nightstandpaid-ipad *",
        NimbleCrawler: "nimblecrawler *",
        NING: "ning *",
        "Nintendo Browser": "NintendoBrowser *",
        NLCrawler: "nlcrawler *",
        "NMG Spider": "nmg spider *",
        NodejsSpider: "nodejsspider *",
        "None-Crawler": ".None-Crawler *",
        "Nokia Browser": "NokiaBrowser *",
        Noobot: "noobot *",
        noxtrumbot: "noxtrumbot *",
        Nutch: "nutch *",
        NutchCVS: "nutchcvs *",
        NutchOrg: "nutchorg *",
        NutchOSUOSL: "nutchosuosl *",
        NWSpider: "nwspider *",
        nyobot: "nyobot *",
        Obigo: "Obigo-Q *",
        ObjectsSearch: "objectssearch *",
        oBot: "obot *",
        Okhttp: "okhttp *",
        OktaMobile: "OktaMobile *",
        OMGCrawler: "omgcrawler *",
        omgilibot: "omgilibot *",
        OmniExplorer_Bot: "omniexplorer_bot *",
        "ONE Browser": "OneBrowser *",
        Onefootball: "Onefootball/Android *",
        OpenCrawler: "opencrawler *",
        "Opensiteexplorer Crawler": "DotBot *",
        "Openwave Mobile Browser": ["UP.Browser *", "Openwave *"],
        OpenWebSpider: "openwebspider *",
        "Opera Coast": "Coast *",
        "Opera Mini": ["Opera Mini/att *", "Opera Mini *", "OPR *", "Version *", "Opera *", "OPiOS *"],
        Opera: ["OPR *", "Version *", "Opera *"],
        Orgbybot: "orgbybot *",
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
        "Overture WebCrawler": "Overture-WebCrawler *",
        "Ovi Browser": "S40OviBrowser *",
        Owncloud: ["Owncloud *", "ownCloud-android *"],
        "Pale Moon": "PaleMoon *",
        parallelContextFocusCrawler1: "parallelcontextfocuscrawler1 *",
        PArchiveCrawler: "parchivecrawler *",
        "Parking Mania Free": "parking mania free *",
        PathDefender: "pathdefender *",
        PaxleFramework: "paxleframework *",
        "Peeplo Screenshot Bot": "peeplo screenshot bot *",
        Peew: "peew *",
        PercolateCrawler: "percolatecrawler *",
        "persomm-spider": "persomm-spider *",
        "Pete-Spider": "pete-spider *",
        "Phantom Browser": "Phantom *",
        PhantomJS: "PhantomJS *",
        PicSpider: "picspider *",
        PingdomBot: ["Pingdom.com_bot_version *", "PingdomTMS *"],
        "Pinterest App": ["Pinterest for Android Tablet *", "Pinterest for Android *", "Pinterest *"],
        "Pinterest Bot": ["Pinterestbot *", "Pinterest *"],
        "Planet Boing!": "planet boing! *",
        Planetweb: "Planetweb *",
        PlantyNet_WebRobot: "plantynet_webrobot *",
        PlayTube: "playtube *",
        PluckItCrawler: "pluckitcrawler *",
        Pompos: "pompos *",
        Poof: "poof *",
        PornSpider: "pornspider *",
        PortalBSpider: "portalbspider *",
        Postbox: "Postbox *",
        PostPost: "postpost *",
        ProCogBot: "procogbot *",
        "Prohlížeč Seznam.cz": "sznprohlizec *",
        ProloCrawler: "prolocrawler *",
        PsSpider: "psspider *",
        Puffin: "Puffin *",
        PyAMF: "PyAMF *",
        PycURL: "PycURL *",
        "Python Requests": "python-requests *",
        "Python Urllib": "Python-urllib *",
        "QQ Browser Mini": "MQQBrowser/Mini *",
        "QQ Browser": ["QQBrowser *", "MQQBrowser *"],
        QupZilla: "QupZilla *",
        qutebrowser: "qutebrowser *",
        Qwantify: "Qwantify *",
        RackspaceBot: "Rackspace Monitoring *",
        Rclone: "rclone *",
        RCMCardDAV: "RCM CardDAV plugin *",
        "Reader Notifier": "Reader Notifier *",
        Reaper: "reaper *",
        redbot: "redbot *",
        RedCarpet: "redcarpet *",
        Rekonq: "rekonq *",
        reqwest: "reqwest *",
        RockMelt: "RockMelt *",
        rogerBot: "rogerbot *",
        rogerbot: "rogerbot *",
        Roku: "Roku/DVP *",
        RSpider: "rspider *",
        RSScrawler: "rsscrawler *",
        RSSIncludeBot: "rssincludebot *",
        "Rummy LITE iPad": "rummy lite ipad *",
        Ruxitsynthetic: "RuxitSynthetic *",
        RyzeCrawler: "ryzecrawler *",
        "S3 Browser": "S3 Browser *",
        s3fs: "s3fs *",
        Safari: "Version *",
        "Samsung Browser": "SamsungBrowser *",
        "Sangfor Spider": "sangfor spider *",
        "scalaj-http": "scalaj-http *",
        ScollSpider: "scollspider *",
        Scrapy: "scrapy *",
        "Screaming Frog SEO Spider": "screaming frog seo spider *",
        ScSpider: "scspider *",
        SeaMonkey: "SeaMonkey *",
        SearchSpider: "searchspider *",
        Searchspider: "searchspider *",
        Secondlife: "SecondLife *",
        "SeekOn Spider": "seekon spider *",
        semanticdiscovery: "semanticdiscovery *",
        "semantics webbot": "semantics webbot *",
        SemrushBot: "SemrushBot *",
        sgbot: "sgbot *",
        SheenBot: "sheenbot *",
        Shiretoko: "Shiretoko *",
        ShopSalad: "shopsalad *",
        SimpleCrawler: "simplecrawler *",
        Simpy: "simpy *",
        SiteCon: "SiteCon *",
        Skyfire: "Skyfire *",
        "Slack Desktop Client": "Slack_SSB *",
        "Slack-ImgProxy": "Slack-ImgProxy *",
        "Slackbot Link Checker": "Slackbot-LinkExpanding *",
        Sleipnir: "Sleipnir *",
        "SlugBug Spider": "slugbug spider *",
        Slurp: "slurp *",
        SmartAndSimpleWebCrawler: "smartandsimplewebcrawler *",
        SMXCrawler: "smxcrawler *",
        Snowshoe: "Snowshoe *",
        socialbm_bot: "socialbm_bot *",
        Socialradarbot: "socialradarbot *",
        "Sogou \"Search Dog\"": "Sogou web spider *",
        "Sogou develop spider": "sogou develop spider *",
        "Sogou Explorer": "SE *",
        "Sogou head spider": "sogou head spider *",
        "Sogou Orion spider": "sogou orion spider *",
        "Sogou Pic Spider": "sogou pic spider *",
        "Sogou Push Spider": "sogou push spider *",
        "Sogou-Test-Spider": "sogou-test-spider *",
        SophosAgent: "SophosAgent *",
        SophosUpdateManager: "SophosUpdateManager *",
        Sosoimagespider: "sosoimagespider *",
        "Sosospider Search Bot": "Sosospider *",
        "Speedcurve Speed Tester": "PTST *",
        Spider: "spider *",
        Spider_Monkey: "Spider_Monkey *",
        SpiderKU: "SpiderKU *",
        Spiderlytics: "Spiderlytics *",
        SpiderMan: "SpiderMan *",
        spiderpig: "spiderpig *",
        SpiderView: "SpiderView *",
        SpokeSpider: "spokespider *",
        Spotify: "Spotify *",
        sproose: "sproose *",
        "Squider Bot": "Squider *",
        "Squrl Java": "squrl java *",
        "SRCCN!Spider": "srccn!spider *",
        "Srware Iron": "Iron *",
        Steeler: "steeler *",
        StoneSunSpider: "stonesunspider *",
        StreamScraper: "streamscraper *",
        suggybot: "suggybot *",
        SuperSpider: "superspider *",
        SWEBot: "swebot *",
        "T3census-Crawler": "t3census-crawler *",
        Tableau: "Tableau *",
        Tailsweep: "tailsweep *",
        TAMU_CS_IRL_CRAWLER: "TAMU_CS_IRL_CRAWLER *",
        Tasapspider: "tasapspider *",
        tCrawler: "tcrawler *",
        "TECOMAC-Crawler": "tecomac-crawler *",
        TelemetrySpider2: "TelemetrySpider2 *",
        "The Bat!": "The Bat! *",
        "The Sapphire Web Crawler": "SapphireWebCrawler *",
        TheUsefulbot: "theusefulbot *",
        Thunderbird: "Thunderbird *",
        ThunderBrowse: "thunderbrowse *",
        "TinEye-bot": "tineye-bot *",
        "Tiny Tiny RSS": "Tiny Tiny RSS *",
        tivraSpider: "tivraspider *",
        TLSProber: "tlsprober *",
        "Toms Spider": "toms spider *",
        "Top10Ranking Spider": "top10ranking spider *",
        "TouTrix crawler": "toutrix crawler *",
        TridentSpider: "tridentspider *",
        TurnitinBot: "turnitinbot *",
        "Tutorial Crawler": "tutorial crawler *",
        "Tweetmeme Bot": "TweetmemeBot *",
        TwitterBot: "TwitterBot *",
        "Ubuntu APT-HTTP": "Ubuntu APT-HTTP *",
        "UC Browser Mini": ["UCBrowser *", "UCWEB *"],
        "UC Browser": ["UCBrowser *", "UCWEB *", "UC Browser *"],
        unchaos_crawler_2: "unchaos_crawler_2 *",
        "URLfilterDB-crawler": "urlfilterdb-crawler *",
        urlgrabber: "urlgrabber *",
        "Using Fast Enterprise Crawler": "using fast enterprise crawler *",
        Vagabondo: "vagabondo *",
        VinjaVideoSpider: "vinjavideospider *",
        VisBot: "visbot *",
        "Vision Mobile Browser": "Novarra-Vision *",
        Vivaldi: "Vivaldi *",
        VodpodCrawler: "vodpodcrawler *",
        "Votay bot": "votay bot *",
        voyager: "voyager *",
        VSE: "vse *",
        "W3C Validator": "W3C_Validator *",
        W3M: "w3m *",
        WangIDSpider: "wangidspider *",
        Waterfox: "Waterfox *",
        "Web-Robot": "web-robot *",
        "Web-sniffer": "web-sniffer *",
        "WebAlta Crawler": "webalta crawler *",
        Webbot: "webbot *",
        WebCrawler: "WebCrawler *",
        WebCrunch: "webcrunch *",
        WebIndexer: "webindexer *",
        "Webkit Based Browser": "Version *",
        "webOS Browser": ["wOSBrowser *", "webOS *"],
        Webpositive: "Webpositive *",
        webscraper: "webscraper *",
        Webspider: "webspider *",
        WebThumb: "webthumb *",
        "Webview Based Browser": "WebView *",
        WebZIP: "webzip *",
        WeltMobile: "weltmobile-ipad *",
        Wget: "Wget *",
        WhatsApp: "WhatsApp *",
        WhatWeb: "whatweb *",
        "Windows-Update-Agent": "Windows-Update-Agent *",
        WinHTTP: "winhttp *",
        WinkBot: "winkbot *",
        WinWebBot: "winwebbot *",
        WIRE: "wire *",
        wminer: "wminer *",
        "Wocodi Web Crawler": "wocodi web crawler *",
        WordPress: "wordpress *",
        "WordSurfer Spider": "wordsurfer spider *",
        WormsiPhone: "wormsiphone-ipad *",
        Wotbox: "wotbox *",
        WSDLSpider: "wsdlspider *",
        wume_crawler: "wume_crawler *",
        "Xaldon WebSpider": "xaldon webspider *",
        "Xenu Link Sleuth": "xenu link sleuth *",
        "Xenu's Link Sleuth": "xenu's link sleuth *",
        "Xerka WebBot": "xerka webbot *",
        XSpider: "xspider *",
        "Y!J-BRI": "y!j-bri *",
        "Y!J-BRW": "y!j-brw *",
        "Yahoo! Slurp Web Crawler Bot": "Yahoo! Slurp *",
        "Yahoo-MMCrawler": "yahoo-mmcrawler *",
        "Yahoo-Newscrawler": "yahoo-newscrawler *",
        "Yahoo-VerticalCrawler-FormerWebCrawler": "yahoo-verticalcrawler-formerwebcrawler *",
        YahooMobileMail: "YahooMobileMail *",
        YahooSeeker: "yahooseeker *",
        "Yandex Browser": "YaBrowser *",
        "Yandex Search Bot": "YandexBot *",
        "Yodaobot Search Bot": "YodaoBot *",
        "YodaoBot-Image": "yodaobot-image *",
        YoonoCrawler: "yoonocrawler *",
        YoudaoBot: "youdaobot *",
        Yowedo: "yowedo *",
        zcspider: "zcspider *",
        ZemlyaCrawl: "zemlyacrawl *",
        Zeusbot: "zeusbot *",
        ZooShot: "zooshot *",
        ZyBorg: "zyborg *",
    },
    osVersionMap: {
        Android: "android *",
        Bada: "bada *",
        "Brew MP": "brew mp *",
        Debian: "debian *",
        FreeBSD: "freebsd *",
        "HP webOS": "hpwOS *",
        iOS: ["ipad *", "iphone *"],
        Kindle: "kindle *",
        Linux: "linux *",
        "Mac OS X": ["Mac OS X *"],
        Mandriva: "mandriva *",
        NetBSD: "netbsd *",
        OpenBSD: "openbsd *",
        Panasonic: "panasonic *",
        Sony: "sony *",
        Tizen: "tizen *",
        Ubuntu: "ubuntu *",
        webOS: "webos *",
        WebTV: "webtv *",
        "Windows Mobile": "windows mobile *",
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
                3.1: "3.1",
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
        options = Object.assign({}, Parser.defaultOptions, options);
        options.tokenizer = Object.assign({}, options.tokenizer);

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
        options = Object.assign({}, Parser.defaultOptions, options);

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
    return Tokenizer.mergeOptions(tokenizer, options.osTokenizer, {});
};

const mergeVersionTokernizer = (tokenizer1, options) => {
    tokenizer1.version = true;

    const tokenizer2 = {};
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

    return Tokenizer.mergeOptions(tokenizer1, tokenizer2, {});
};

const normalizeVersionMap = hashmap => {
    const obj = {};
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
