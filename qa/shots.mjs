import { chromium } from 'playwright';
import { seedSession } from './seed.mjs';

const base = process.env.BASE ?? 'http://localhost:4321';
const pages = (process.env.PAGES ?? '/').split(',');
const widths = (process.env.WIDTHS ?? '1440').split(',').map(Number);
const full = process.env.FULL !== '0';

const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 700 ? 800 : 900 } });
  await seedSession(ctx);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: '[data-reveal]{opacity:1!important;transform:none!important;transition:none!important}' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const name = `qa/${p === '/' ? 'home' : p.replace(/[\/?=&]/g, '_')}-${w}.png`;
    await page.screenshot({ path: name, fullPage: full });
    console.log(`${w} ${p} overflow=${overflow} -> ${name}`);
  }
  if (errors.length) console.log('ERRORS', w, errors);
  await ctx.close();
}
await browser.close();
