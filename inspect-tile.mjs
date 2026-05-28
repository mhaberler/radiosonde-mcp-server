import { chromium } from 'playwright';

const URL = 'https://www.windy.com/?13.072,-59.492,4,p:radiosonde,m:d2paexu';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

let done = false;
page.on('response', async (resp) => {
  if (done) return;
  const url = resp.url();
  if (!url.includes('/pois/v2/radiosonde/tiles/')) return;
  try {
    const text = await resp.text();
    console.log(text);
    done = true;
  } catch {}
});

await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
await page.waitForTimeout(6000);
await browser.close();
