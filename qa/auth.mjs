/**
 * Teste funcional da autenticação local.
 * Uso: BASE=http://localhost:4321 node qa/auth.mjs
 */
import { chromium } from 'playwright';

const base = process.env.BASE ?? 'http://localhost:4321';
const JOAO = { name: 'João Teste', email: 'joao.teste@example.com', pass: 'Teste123!' };
const MARIA = { name: 'Maria Teste', email: 'maria.teste@example.com', pass: 'Teste123!' };

let failed = 0;
const check = (name, ok, extra = '') => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  -> ' + extra : ''}`);
};
const section = (t) => console.log(`\n# ${t}`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
ctx.setDefaultTimeout(8000);
const page = await ctx.newPage();
const consoleErrors = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
page.on('pageerror', (e) => consoleErrors.push(String(e)));
const nativeDialogs = [];
page.on('dialog', (d) => {
  nativeDialogs.push(d.type());
  d.accept();
});

const text = async (sel) => ((await page.locator(sel).first().textContent()) ?? '').trim();
const users = () => page.evaluate(() => JSON.parse(localStorage.getItem('avtcp:users') || '[]'));
const session = () => page.evaluate(() => JSON.parse(localStorage.getItem('avtcp:session') || 'null'));
const err = async (field, form = 'signup') =>
  ((await page.locator(`[data-${form}-form] [data-error-for="${field}"]`).textContent()) ?? '').trim();

async function openSignup() {
  await page.goto(base + '/login', { waitUntil: 'networkidle' });
  await page.click('#tab-signup');
}
async function signup({ name, email, pass }, confirm = pass) {
  await page.fill('#signup-name', name);
  await page.fill('#signup-email', email);
  await page.fill('#signup-pass', pass);
  await page.fill('#signup-confirm', confirm);
  await page.click('[data-signup-form] [type=submit]');
}
async function login(email, pass) {
  await page.goto(base + '/login', { waitUntil: 'networkidle' });
  await page.fill('#login-email', email);
  await page.fill('#login-pass', pass);
  await page.click('[data-login-form] [type=submit]');
}
async function logout() {
  await page.click('.user-button');
  await page.click('[data-logout]');
  await page.waitForURL('**/login');
}
const headerText = () => page.locator('.site-header').innerText();

try {
  section('0. Sem sessão: páginas protegidas levam ao login');
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  check('/ redireciona para /login', page.url().endsWith('/login'), page.url());
  await page.goto(base + '/metas', { waitUntil: 'networkidle' });
  check('/metas redireciona para /login', page.url().endsWith('/login'));

  section('1. Validações do cadastro');
  await openSignup();
  await page.click('[data-signup-form] [type=submit]');
  check('campos vazios: nome', (await err('name')) === 'Informe seu nome.', await err('name'));
  check('campos vazios: e-mail', (await err('email')) === 'Informe seu e-mail.');
  check('campos vazios: senha', (await err('password')).includes('pelo menos 8'));
  check('campos vazios: confirmação', (await err('confirm')) === 'Confirme sua senha.');
  await signup({ name: '    ', email: 'sem-arroba', pass: '123' }, '456');
  check('nome só com espaços rejeitado', (await err('name')) === 'Informe seu nome.');
  check('e-mail inválido rejeitado', (await err('email')).includes('e-mail válido'));
  check('senha curta rejeitada', (await err('password')).includes('pelo menos 8'));
  check('confirmação diferente rejeitada', (await err('confirm')) === 'As senhas não coincidem.');
  check('nenhum usuário criado nas validações', (await users()).length === 0);
  check('erros aparecem inline, sem alert() nativo', nativeDialogs.filter((t) => t === 'alert').length === 0);

  section('2. Cadastro do primeiro usuário (João)');
  await openSignup();
  await signup(JOAO);
  await page.waitForURL(base + '/');
  await page.waitForSelector('#toast-region .toast');
  check('redireciona para o início logado', page.url() === base + '/');
  check('confirmação visível', (await text('#toast-region')).includes('Conta criada com sucesso'), await text('#toast-region'));
  check('header: "Olá, João!"', (await text('.user-button__greeting')) === 'Olá, João!', await text('.user-button__greeting'));
  check('home logada mostra só o usuário cadastrado e nenhum nome pré-criado', !/sarah|demo\d/i.test(await page.locator('body').innerText()));
  let list = await users();
  check('1 usuário gravado', list.length === 1, JSON.stringify(list.map((u) => u.email)));
  check('usuário tem id, nome, e-mail, username, bio', !!(list[0]?.id && list[0].name === 'João Teste' && list[0].email === JOAO.email && list[0].username && list[0].bio));
  const dump = await page.evaluate(() => JSON.stringify({ ...localStorage }));
  check('senha NÃO está em texto no armazenamento', !dump.includes(JOAO.pass));
  check('há hash + sal', !!(list[0]?.passwordHash && list[0]?.salt), String(list[0]?.passwordHash).slice(0, 14));
  const joaoId = list[0].id;
  check('sessão aponta para João', (await session())?.userId === joaoId);

  await page.goto(base + '/perfil', { waitUntil: 'networkidle' });
  check('perfil: nome', (await text('#profile-name')) === 'João Teste');
  check('perfil: e-mail', (await text('.profile-head__user')).includes(JOAO.email), await text('.profile-head__user'));
  check('perfil: username', (await text('.profile-head__user')).includes('@joao.teste'));

  section('3. Uso da aplicação como João');
  await page.goto(base + '/metas', { waitUntil: 'networkidle' });
  await page.fill('#goals-page-field', 'Meta exclusiva do João');
  await page.click('[data-goals] [type=submit]');
  check('meta do João criada', (await text('[data-goals-list]')).includes('Meta exclusiva do João'));
  await page.goto(base + '/humor', { waitUntil: 'networkidle' });
  await page.click('[data-mood-id="feliz"]');
  await page.goto(base + '/gratidao', { waitUntil: 'networkidle' });
  await page.fill('#gratitude-page-field', 'Gratidão do João');
  await page.click('[data-gratitude] [type=submit]');
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.click('.shell__left [data-open-dialog="share-dialog"]');
  await page.fill('#share-text', 'Publicação do João');
  await page.click('#share-form [type=submit]');
  await page.waitForTimeout(300);
  check('publicação do João no feed', (await text('#home-feed')).includes('Publicação do João'));
  check('publicação usa o username do João', (await text('#home-feed')).includes('joao.teste'));

  section('4. Persistência: reload');
  await page.reload({ waitUntil: 'networkidle' });
  check('continua logado após reload', page.url() === base + '/' && (await text('.user-button__greeting')) === 'Olá, João!');
  await page.goto(base + '/metas', { waitUntil: 'networkidle' });
  check('meta do João persiste', (await text('[data-goals-list]')).includes('Meta exclusiva do João'));
  await page.goto(base + '/humor', { waitUntil: 'networkidle' });
  check('humor do João persiste', (await page.getAttribute('[data-mood-id="feliz"]', 'aria-pressed')) === 'true');

  section('5. Logout');
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await logout();
  check('logout leva ao /login', page.url().endsWith('/login'));
  await page.waitForSelector('#toast-region .toast');
  check('mensagem de saída', (await text('#toast-region')).includes('saiu da sua conta'), await text('#toast-region'));
  check('sessão encerrada', (await session()) === null);
  check('conta continua guardada após logout', (await users()).length === 1);
  await page.goto(base + '/metas', { waitUntil: 'networkidle' });
  check('/metas protegida após logout', page.url().endsWith('/login'));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  check('/ protegida após logout', page.url().endsWith('/login'));

  section('6. Validações do login');
  await page.goto(base + '/login', { waitUntil: 'networkidle' });
  await page.click('[data-login-form] [type=submit]');
  check('vazio: e-mail', (await err('email', 'login')) === 'Informe seu e-mail.');
  check('vazio: senha', (await err('password', 'login')) === 'Informe sua senha.');
  await login('ninguem@example.com', 'qualquer-coisa');
  check('e-mail inexistente', (await err('email', 'login')) === 'Não encontramos uma conta com este e-mail.', await err('email', 'login'));
  check('segue na tela de login', page.url().endsWith('/login') && (await session()) === null);
  await login(JOAO.email, 'SenhaErrada1');
  check('senha incorreta', (await err('password', 'login')) === 'E-mail ou senha incorretos.', await err('password', 'login'));
  check('segue deslogado', (await session()) === null);

  section('7. Cadastro com e-mail duplicado');
  await openSignup();
  await signup({ name: 'Outro João', email: 'JOAO.TESTE@example.com', pass: 'OutraSenha1!' });
  check('mensagem de e-mail duplicado', (await err('email')) === 'Já existe uma conta cadastrada com este e-mail.', await err('email'));
  check('nenhum usuário novo criado', (await users()).length === 1);
  check('sessão continua vazia', (await session()) === null);

  section('8. Login do usuário criado (mesmo e-mail e senha)');
  await login(JOAO.email, JOAO.pass);
  await page.waitForURL(base + '/');
  await page.waitForSelector('#toast-region .toast');
  check('entrou', page.url() === base + '/');
  check('mensagem de boas-vindas', (await text('#toast-region')).includes('Bem-vindo(a) de volta, João'), await text('#toast-region'));
  check('usuário carregado é o João', (await text('.user-button__greeting')) === 'Olá, João!');
  check('sessão aponta para o mesmo id', (await session())?.userId === joaoId);
  await page.goto(base + '/metas', { waitUntil: 'networkidle' });
  check('dados do João restaurados (meta)', (await text('[data-goals-list]')).includes('Meta exclusiva do João'));
  await page.goto(base + '/gratidao', { waitUntil: 'networkidle' });
  check('dados do João restaurados (gratidão)', (await text('[data-gratitude-list]')).includes('Gratidão do João'));
  await logout();
  await login('  JOAO.TESTE@Example.com ', JOAO.pass);
  await page.waitForURL(base + '/');
  check('login ignora maiúsculas e espaços no e-mail', (await text('.user-button__greeting')) === 'Olá, João!');
  await logout();

  section('9. Segundo usuário (Maria) e isolamento');
  await openSignup();
  await signup(MARIA);
  await page.waitForURL(base + '/');
  check('Maria logada', (await text('.user-button__greeting')) === 'Olá, Maria!');
  check('Maria não vê "João" no header', !(await headerText()).includes('João'));
  list = await users();
  check('2 usuários, ids diferentes', list.length === 2 && list[0].id !== list[1].id, JSON.stringify(list.map((u) => u.email)));
  check('João não foi sobrescrito', list.some((u) => u.email === JOAO.email && u.name === 'João Teste'));
  const mariaId = list.find((u) => u.email === MARIA.email).id;

  await page.goto(base + '/metas', { waitUntil: 'networkidle' });
  const mariaGoals = await text('[data-goals-list]');
  check('metas do João NÃO aparecem para Maria', !mariaGoals.includes('Meta exclusiva do João'));
  check('Maria começa com as metas padrão', mariaGoals.includes('Beber mais água'));
  await page.goto(base + '/gratidao', { waitUntil: 'networkidle' });
  check('gratidão do João NÃO aparece para Maria', !(await text('[data-gratitude-list]')).includes('Gratidão do João'));
  await page.goto(base + '/humor', { waitUntil: 'networkidle' });
  check('humor do João NÃO aparece para Maria', (await page.getAttribute('[data-mood-id="feliz"]', 'aria-pressed')) === 'false');
  await page.goto(base + '/perfil', { waitUntil: 'networkidle' });
  check('"Minhas publicações" da Maria não tem as do João', !(await text('#my-feed')).includes('Publicação do João'));
  await page.goto(base + '/comunidade', { waitUntil: 'networkidle' });
  const feed = await text('#community-feed');
  check('feed da comunidade é compartilhado (post do João visível, com o autor dele)', feed.includes('Publicação do João') && feed.includes('joao.teste'));
  await page.goto(base + '/meu-dia', { waitUntil: 'networkidle' });
  check('Meu dia da Maria sem a publicação do João', (await text('[data-day-post]')).includes('ainda não compartilhou'));

  await page.goto(base + '/metas', { waitUntil: 'networkidle' });
  await page.fill('#goals-page-field', 'Meta exclusiva da Maria');
  await page.click('[data-goals] [type=submit]');
  await page.goto(base + '/desafios', { waitUntil: 'networkidle' });
  await page.click('[data-challenge="comparacao"] [data-action]');
  check('desafio aceito pela Maria', (await text('[data-challenge="comparacao"] [data-status-pill]')) === 'Em andamento');
  await logout();

  section('10. Volta ao João: nada da Maria');
  await login(JOAO.email, JOAO.pass);
  await page.waitForURL(base + '/');
  check('João de novo', (await text('.user-button__greeting')) === 'Olá, João!');
  await page.goto(base + '/metas', { waitUntil: 'networkidle' });
  const joaoGoals = await text('[data-goals-list]');
  check('meta da Maria NÃO aparece para João', !joaoGoals.includes('Meta exclusiva da Maria'));
  check('meta do João continua lá', joaoGoals.includes('Meta exclusiva do João'));
  await page.goto(base + '/desafios', { waitUntil: 'networkidle' });
  check('desafio da Maria NÃO afeta o João', (await text('[data-challenge="comparacao"] [data-status-pill]')) === 'Disponível');

  section('11. "Restaurar dados" não apaga contas');
  await page.goto(base + '/perfil', { waitUntil: 'networkidle' });
  await page.click('[data-reset-demo]');
  await page.waitForURL(base + '/');
  check('continua logado como João após restaurar', (await text('.user-button__greeting')) === 'Olá, João!');
  check('contas intactas (2)', (await users()).length === 2);
  await page.goto(base + '/metas', { waitUntil: 'networkidle' });
  check('dados do João voltaram ao padrão', !(await text('[data-goals-list]')).includes('Meta exclusiva do João'));
  await logout();
  await login(MARIA.email, MARIA.pass);
  await page.waitForURL(base + '/');
  await page.goto(base + '/metas', { waitUntil: 'networkidle' });
  check('dados da Maria não foram tocados pela restauração do João', (await text('[data-goals-list]')).includes('Meta exclusiva da Maria'));
  await logout();

  section('12. Sem conta de demonstração / sem credenciais públicas');
  await page.goto(base + '/login', { waitUntil: 'networkidle' });
  const loginText = await page.locator('body').innerText();
  check('login sem bloco/botão/credenciais de demonstração', !/sarah|demonstra|demo\d|entrar como/i.test(loginText));
  check('login: e-mail, senha, botão Entrar e link Criar conta', (await page.locator('#login-email').count()) === 1 && (await page.locator('#login-pass').count()) === 1 && (await page.locator('[data-login-form] [type=submit]').innerText()) === 'Entrar' && (await page.locator('[data-goto-tab="1"]').count()) === 1);
  await page.click('[data-goto-tab="1"]');
  check('link "Criar conta" abre o cadastro', await page.locator('#panel-signup').isVisible());
  check('cadastro: nome, e-mail, senha e confirmação', (await page.locator('#panel-signup input').count()) === 4);
  await login('conta.antiga@exemplo.com', 'senha-antiga-123');
  check('conta inexistente não entra', (await err('email', 'login')) === 'Não encontramos uma conta com este e-mail.' && (await session()) === null);
  check('nenhuma conta pré-criada no armazenamento', (await users()).length === 2);

  // Sessão antiga apontando para a conta removida não pode manter ninguém logado.
  await page.evaluate(() => localStorage.setItem('avtcp:session', JSON.stringify({ userId: 'conta-removida' })));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  check('sessão órfã (conta inexistente) volta ao login', page.url().endsWith('/login'));

  // Páginas públicas sem sessão: botão Entrar no lugar do menu do usuário.
  await page.goto(base + '/sobre-nos', { waitUntil: 'networkidle' });
  check('visitante em /sobre-nos vê "Entrar"', await page.locator('[data-login-link]').isVisible());
  check('visitante não vê menu do usuário', !(await page.locator('[data-user-menu]').isVisible()));

  section('13. Console');
  check('nenhum confirm/alert inesperado (somente o confirm de "Restaurar")', nativeDialogs.filter((t) => t === 'alert').length === 0 && nativeDialogs.filter((t) => t === 'confirm').length === 1, JSON.stringify(nativeDialogs));
  const relevant = consoleErrors.filter((m) => !m.includes('404'));
  check('sem erros de console', relevant.length === 0, JSON.stringify(relevant));
} catch (e) {
  failed++;
  console.log('EXCEPTION', e.message.slice(0, 700));
}

await browser.close();
console.log(failed === 0 ? '\nTODOS OS TESTES DE AUTENTICAÇÃO PASSARAM' : `\n${failed} FALHA(S)`);
process.exit(failed === 0 ? 0 : 1);
