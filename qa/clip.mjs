import { chromium } from 'playwright';
import { seedSession } from './seed.mjs';
const pages = ['/','/comunidade','/conteudos','/conteudos/corpo-nao-e-projeto','/desafios','/recursos','/sobre-nos','/perfil','/meu-dia','/humor','/gratidao','/metas','/lembretes','/login'];
const b = await chromium.launch();
for (const w of [1920, 1280, 1024, 834, 375]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  await seedSession(ctx);
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto((process.env.BASE ?? 'http://localhost:4321') + p, { waitUntil: 'networkidle' });
    const bad = await page.evaluate(() => {
      const W = document.documentElement.clientWidth; const out = [];
      document.querySelectorAll('body *').forEach((el) => {
        const cs = getComputedStyle(el); if (cs.position === 'fixed' || cs.display === 'none' || cs.display === 'contents') return;
        if (el.closest('dialog:not([open]), [hidden], template')) return;
        const r = el.getBoundingClientRect(); if (r.width === 0) return;
        if (r.right > W + 1 || r.left < -1) out.push(el.tagName + '.' + String(el.className).slice(0, 40) + ' ' + Math.round(r.left) + '-' + Math.round(r.right));
      });
      return out.slice(0, 4);
    });
    if (bad.length) console.log(w, p, bad);
  }
  await page.close();
}
await b.close(); console.log('clip check done');
