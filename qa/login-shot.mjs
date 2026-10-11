import { chromium } from 'playwright';
const base = process.env.BASE ?? 'http://localhost:4321';
const b = await chromium.launch();
for (const w of [1440, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: w > 500 ? 860 : 800 } });
  await p.goto(base + '/login', { waitUntil: 'networkidle' });
  await p.screenshot({ path: `qa/login-${w}.png`, fullPage: true });
  await p.close();
}
await b.close();
