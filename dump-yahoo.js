
const fs = require('fs');

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
        console.log(`HTML length: ${html.length}`);

        fs.writeFileSync('yahoo-debug.html', html);
        console.log('Saved to yahoo-debug.html');

    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

main();
