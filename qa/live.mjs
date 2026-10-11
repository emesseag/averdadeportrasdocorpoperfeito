import { chromium } from 'playwright';
import { seedSession } from './seed.mjs';
const base = process.env.BASE;
const b = await chromium.launch();
const pages = ['/', '/login', '/comunidade', '/conteudos', '/conteudos/corpo-nao-e-projeto', '/desafios', '/recursos', '/sobre-nos', '/perfil', '/meu-dia', '/humor', '/gratidao', '/metas', '/lembretes'];
let bad = 0;
for (const w of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 500 ? 900 : 800 } });
  await seedSession(ctx);
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  page.on('pageerror', (e) => errs.push(String(e)));
  page.on('requestfailed', (r) => errs.push('FALHOU ' + r.url()));
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const h1 = (await page.locator('h1').first().textContent())?.trim().slice(0, 40);
    if (ov > 0) bad++;
    console.log(`${w} ${p.padEnd(34)} overflow=${ov} h1="${h1}"`);
  }
  // Imagens
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const hero = await page.evaluate(() => { const i = document.querySelector('.hero__media img'); return i && { ok: i.complete && i.naturalWidth > 0, w: i.naturalWidth, h: i.naturalHeight, shown: Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height), fit: getComputedStyle(i).objectFit }; });
  console.log(w, 'hero img', JSON.stringify(hero)); if (!hero?.ok) bad++;
  await page.screenshot({ path: `qa/live-home-${w}.png` });
  await page.goto(base + '/sobre-nos', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('.about-intro__img')?.scrollIntoView());
  await page.waitForTimeout(400);
  const about = await page.evaluate(() => { const i = document.querySelector('.about-intro__img'); const r = i.getBoundingClientRect(); return { ok: i.complete && i.naturalWidth > 0, natural: i.naturalWidth + 'x' + i.naturalHeight, ratio: +(r.width / r.height).toFixed(3) }; });
  console.log(w, 'sobre img', JSON.stringify(about)); if (!about.ok || Math.abs(about.ratio - 1.333) > 0.01) bad++;
  await page.screenshot({ path: `qa/live-sobre-${w}.png` });
  if (w === 390) {
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await page.click('[aria-label="Abrir menu"]');
    const open = await page.locator('#drawer').isVisible();
    const items = await page.locator('#drawer a').count();
    await page.screenshot({ path: 'qa/live-menu-390.png' });
    console.log(w, 'menu mobile aberto:', open, 'links:', items); if (!open) bad++;
  }
  console.log(w, 'erros de console/requisições:', JSON.stringify(errs.filter((e) => !e.includes('favicon'))));
  if (errs.length) bad++;
  await ctx.close();
}
await b.close();
console.log(bad === 0 ? 'LIVE OK' : 'LIVE COM PROBLEMAS: ' + bad);
