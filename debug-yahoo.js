
const url = "https://search.yahoo.co.jp/realtime";

async function main() {
    console.log(`Fetching ${url}...`);
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            cache: 'no-store'
        });

        const html = await res.text();

        // Extract Next.js Data
        const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
        if (!match) {
            console.error("Failed to find __NEXT_DATA__");
            return;
        }

        const jsonStr = match[1];
        const data = JSON.parse(jsonStr);

        const pageData = data.props?.pageProps?.pageData;
        const buzzTrend = pageData?.buzzTrend;

        if (!buzzTrend) {
            console.error("No buzzTrend found in JSON");
            return;
        }

        console.log("buzzTrend keys:", Object.keys(buzzTrend));
        if (buzzTrend.hotBuzz) {
            console.log("hotBuzz keys:", Object.keys(buzzTrend.hotBuzz));
            console.log("hotBuzz items length:", buzzTrend.hotBuzz.items?.length);
        } else {
            console.log("hotBuzz is missing/null");
        }

        if (buzzTrend.otherItems) {
            console.log("otherItems length:", buzzTrend.otherItems.length);
            console.log("--- otherItems sample ---");
            buzzTrend.otherItems.forEach(item => console.log(`[${item.query}]`));
        }

        console.log("\n--- Hot Buzz (Rising) ---");
        const hotBuzz = buzzTrend.hotBuzzResponse?.items || buzzTrend.hotBuzz?.items || [];
        hotBuzz.forEach(item => {
            console.log(`[${item.query}]`);
        });

        console.log("\n--- Trend Ranking ---");
        const items = buzzTrend.items || [];
        items.slice(0, 10).forEach((item, index) => {
            console.log(`${index + 1}. [${item.query}] (${item.tweetCount} tweets)`);
        });

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
