import { chromium } from 'playwright';
const base = process.env.BASE ?? 'http://localhost:4322';
const browser = await chromium.launch();
const results = [];
const check = (name, ok, extra = '') => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} ${extra}`); };

async function run(width) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  ctx.setDefaultTimeout(5000);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  console.log(`--- ${width}px`);
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  check('sem sessão cai no login', page.url().endsWith('/login'));
  await page.click('#tab-signup');
  await page.fill('#signup-name', 'Pessoa Teste');
  await page.fill('#signup-email', 'pessoa.teste@example.com');
  await page.fill('#signup-pass', 'Teste123!');
  await page.fill('#signup-confirm', 'Teste123!');
  await page.click('[data-signup-form] [type=submit]');
  await page.waitForURL(base + '/');
  await page.waitForLoadState('networkidle');

  // Mood
  await page.click('#mood-title >> xpath=.. >> [data-mood-id="tranquilo"]');
  check('humor registrado', (await page.textContent('[data-mood-status]')).includes('Humor registrado 💜'));
  check('humor aria-pressed', (await page.getAttribute('[data-mood-id="tranquilo"]', 'aria-pressed')) === 'true');
  await page.reload({ waitUntil: 'networkidle' });
  check('humor persiste', (await page.getAttribute('[data-mood-id="tranquilo"]', 'aria-pressed')) === 'true');

  // Share
  const opener = width < 900 ? '.fab' : '.shell__left [data-open-dialog="share-dialog"]';
  await page.click(opener);
  check('modal abre', await page.isVisible('#share-dialog'));
  check('publicar desabilitado vazio', await page.isDisabled('#share-form [type=submit]'));
  await page.fill('#share-text', 'Teste de publicação com carinho');
  await page.check('input[name=category][value=gratidao]', { force: true });
  await page.click('#share-form [type=submit]');
  await page.waitForTimeout(300);
  check('modal fecha', !(await page.isVisible('#share-dialog')));
  check('post novo no feed home', (await page.textContent('#home-feed')).includes('Teste de publicação com carinho'));
  check('toast', (await page.textContent('#toast-region')).includes('Publicado'));

  // Like + comment
  const card = page.locator('#home-feed .post-card').first();
  const before = await card.locator('[data-like-count]').textContent();
  await card.locator('[data-like]').click();
  check('like soma 1', Number(await card.locator('[data-like-count]').textContent()) === Number(before) + 1);
  await card.locator('[data-comment-toggle]').click();
  await card.locator('input[name=text]').fill('Obrigada por compartilhar');
  await card.locator('input[name=text]').press('Enter');
  check('comentário aparece', (await card.locator('[data-comment-list]').textContent()).includes('Obrigada por compartilhar'));

  // Gratidão + metas
  await page.fill('#home-gratitude-field', 'Minha saúde');
  await page.click('[data-gratitude] button[type=submit]');
  check('gratidão registrada', (await page.textContent('[data-gratitude-list]')).includes('Minha saúde'));
  await page.locator('[data-goals] .check').first().click();
  check('meta concluída', (await page.textContent('[data-goals-summary]')).startsWith('1 de'));
  await page.fill('#home-goals-field', 'Meta nova');
  await page.click('[data-goals] button[type=submit]');
  check('meta criada', true);

  // Desafio semanal
  await page.click('[data-challenge="autoestima"] [data-action]');
  await page.fill('#challenge-text', 'Meu senso de humor');
  await page.click('#challenge-form [type=submit]');
  await page.waitForTimeout(300);
  check('desafio concluído', (await page.textContent('[data-challenge="autoestima"] [data-count]')) === '3/3');

  // Busca
  await page.click('[aria-label="Buscar"]');
  await page.fill('#search-input', 'comparação');
  await page.waitForTimeout(200);
  check('busca com resultados', (await page.locator('#search-results a').count()) > 0);
  await page.keyboard.press('Escape');

  // Notificações
  await page.click('[data-notif-bell]');
  check('notificações abrem', await page.isVisible('#notif-panel'));
  await page.keyboard.press('Escape');
  check('notificações fecham', !(await page.isVisible('#notif-panel')));

  // Drawer (mobile)
  if (width < 1100) {
    await page.click('[aria-label="Abrir menu"]');
    check('drawer abre', await page.isVisible('#drawer'));
    await page.click('#drawer a[href="/comunidade"]');
    await page.waitForURL('**/comunidade');
    check('drawer navega', true);
  } else {
    await page.click('.main-nav a[href="/comunidade"]');
    await page.waitForURL('**/comunidade');
  }

  // Comunidade: filtros
  await page.waitForSelector('#community-feed .post-card');
  await page.click('[data-filter="gratidao"]');
  const cats = await page.locator('#community-feed .post-card').evaluateAll((els) => els.map((e) => e.dataset.category));
  check('filtro gratidão', cats.length > 0 && cats.every((c) => c === 'gratidao'), JSON.stringify(cats));

  // Conteúdos filtros
  await page.goto(base + '/conteudos?espaco=masculino', { waitUntil: 'networkidle' });
  const visible = await page.locator('.content-card:not([hidden])').count();
  check('espaço masculino filtra', visible === 3, `visible=${visible}`);
  await page.click('.content-card:not([hidden]) >> nth=0');
  await page.waitForURL('**/conteudos/**');
  check('artigo abre', await page.isVisible('article h1'));

  // Desafios filtros
  await page.goto(base + '/desafios', { waitUntil: 'networkidle' });
  await page.click('[data-status-filter="concluido"]');
  check('filtro concluído', (await page.locator('.challenge-grid [data-challenge]:not([hidden])').count()) === 1);

  // Perfil
  await page.goto(base + '/perfil', { waitUntil: 'networkidle' });
  await page.click('[data-open-dialog="profile-dialog"]');
  await page.fill('#profile-name-input', 'Pessoa Editada');
  await page.click('#profile-form [type=submit]');
  await page.waitForTimeout(200);
  check('perfil editado', (await page.textContent('#profile-name')).includes('Pessoa Editada'));
  check('perfil lista meus posts', (await page.textContent('#my-feed')).includes('Teste de publicação'));

  // Lembretes -> Meu dia
  await page.goto(base + '/lembretes', { waitUntil: 'networkidle' });
  await page.locator('#rem-agua').check({ force: true });
  await page.goto(base + '/meu-dia', { waitUntil: 'networkidle' });
  check('meu dia tem lembrete', (await page.textContent('[data-day-reminders]')).includes('água'));
  check('meu dia mostra humor', (await page.textContent('[data-day-mood]')).includes('Tranquilo'));

  // Logout / login
  await page.click('.user-button');
  await page.click('[data-logout]');
  await page.waitForURL('**/login');
  await page.goto(base + '/metas');
  await page.waitForURL('**/login');
  check('guarda de sessão', true);
  await page.fill('#login-email', 'pessoa.teste@example.com');
  await page.fill('#login-pass', 'Teste123!');
  await page.click('[data-login-form] button[type=submit]');
  await page.waitForURL(base + '/');
  check('login volta ao início', true);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('sem overflow', overflow <= 0, `overflow=${overflow}`);
  check('sem erros de console', errors.length === 0, JSON.stringify(errors));
  await ctx.close();
}

for (const w of [1440, 390]) {
  try { await run(w); } catch (e) { console.log('EXCEPTION', w, e.message.slice(0,900)); results.push(false); }
}
await browser.close();
console.log(results.every(Boolean) ? 'ALL PASS' : 'SOME FAILED');
