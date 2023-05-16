const puppeteer = require('puppeteer');
const fs = require("fs");


(async () => {
    const browser = await puppeteer.launch(`headless: "new"`);
    const page = await browser.newPage();
    await page.goto('https://twitter.com/apastoraldream');
    fs.writeFileSync("./data/tweets.txt", "");
    var allTweets = new Set();
    var attemptCount = 0;
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight/3)');
    await page.waitForNetworkIdle({idleTime: 200});

    while (true) {
        await page.waitForNetworkIdle({idleTime: 350});
        var newTweets = new Set(await GetCurrentTweets(page));
        newTweets = difference(newTweets, allTweets);


        if (newTweets.size == 0) {
            attemptCount++;
            if (attemptCount > 5) {
                console.log("At end of tweets");
                break;
            }
        } else {
            attemptCount = 0;
        }

        allTweets = union(allTweets, newTweets);
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        fs.appendFile("./data/tweets.txt", Array.from(newTweets).join("\n").concat("\n"), function (err) {
            if (err) {
                return console.log(err);
            }
        });
        console.log(allTweets.size);
    }
    fs.writeFileSync("tweets.txt",fs.readFileSync("./data/tweets.txt").toString().trimEnd());
    await browser.close();
    process.exit();
})();

async function GetCurrentTweets(page) {
    var elements = await page.$$('[data-testid=tweetText]');
    var tweets = [];
    for (const element of elements) {
        let text = await page.evaluate(el => el.textContent, element);
        tweets.push(text);
    }
    return tweets;
}

function union(...sets) {
    return new Set([].concat(...sets.map(s => [...s])));
}
function difference(setA, setB) {
    let _difference = new Set(setA);
    for (let elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}