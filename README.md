# Yet another user agent parser

As of time of writing (27th May 2018), the fastest user agent parser.

```sh
$ node benchmark/parse.js
indexed-useragent v1.0.0 x 78,738 ops/sec ±1.09% (89 runs sampled)
        useragent v2.3.0 x 9,534 ops/sec ±0.93% (90 runs sampled)
 useragent_parser v1.0.0 x 60,147 ops/sec ±0.53% (93 runs sampled)
 useragent-parser v0.1.1 x 21,355 ops/sec ±1.03% (89 runs sampled)
        ua-parser v0.3.5 x 41,847 ops/sec ±1.15% (89 runs sampled)
Fastest is indexed-useragent v1.0.0
```

## Examples

```js
const {parse} = require("trie-uaparser");

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
```

## Differences with existing user agent parsers

Most of the user agents parser use multiple regular expressions, each of them associated to a particular software/os.

This library instead, split the user agent into tokens and determines the software/os using a [trie](https://en.wikipedia.org/wiki/Trie) data structure.

It leads to:

### Speed

Search using [trie](https://en.wikipedia.org/wiki/Trie) data structure will always be faster than looping through regexes execution. 
And if you have lots of data to analyse, speed is not only a nice thing to have.

### Evolution

Adding a new pattern does not conflict with existing patterns.

In regexes based parsers, 
to detect Edge in "Mozilla/5.0 (Windows NT 10.0; Win64; x64; ServiceUI 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299", 
/edge/ has to be tested before /chrome/ 
to detect Safari without conflicting with Edge, /safari/ has to be between /chrome/ and /edge/ 

The more patterns you add, the harder it is to make it play well with existing patterns.

More over, adding a new pattern has a small impact on speed because it is similar to add an entry in a hashmap which is not the case for regexes based parsers.
