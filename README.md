# A Verdade Por Trás do Corpo Perfeito

Plataforma de autoestima, bem-estar e comunidade (projeto escolar): um **daily de bem-estar + comunidade**.
Mensagem do dia, check-in de humor, gratidão, metas, desafios, conteúdos educativos e publicações da comunidade, em uma interface leve e acolhedora.

## Como executar

Requer Node 20+.

```bash
npm install
npm run dev        # http://localhost:4321 (ou a próxima porta livre)
```

Outros comandos:

```bash
npm run build      # gera o site estático em dist/
npm run preview    # serve o build
npm run check      # checagem de tipos (astro check)
```

## Stack

Astro · TypeScript · HTML semântico · CSS com tokens · JavaScript nativo · ícones Lucide (`lucide-static`) · fonte Inter (`@fontsource-variable/inter`). Sem frameworks pesados e sem backend.

## Estrutura

```
src/
  layouts/AppLayout.astro      Shell: header, sidebars, rodapé, modais, scripts
  components/                  Header, SideNav, MobileDrawer, PostCard, MoodSelector,
                               ChallengeCard, ContentCard, TrustBar, diálogos, Icon…
  pages/                       Rotas (index, comunidade, conteudos, desafios, recursos,
                               sobre-nos, perfil, meu-dia, humor, gratidao, metas, lembretes, login)
  data/                        Dados mockados centralizados (posts, conteúdos, desafios,
                               mensagens, usuário, notificações, categorias…)
  scripts/                     Comportamento (um módulo por funcionalidade) + localStorage
  styles/                      tokens.css, base.css, layout.css, components.css, pages.css
docs/IMAGENS-IA.md             Imagens pendentes, com prompts e instruções de implementação
qa/                            Scripts Playwright (screenshots e testes de fluxo)
```

## Contas e persistência (localStorage)

> Autenticação implementada localmente para fins acadêmicos. **Não utilizar esta abordagem em produção.** Não há servidor: as contas ficam no `localStorage` do navegador e qualquer pessoa com acesso a ele pode ler ou apagar tudo.

- **Cadastro** (nome, e-mail, senha ≥ 8 caracteres, confirmação) cria a conta e já entra nela. E-mail duplicado é recusado.
- **Login** valida e-mail e senha; **logout** encerra a sessão e as páginas protegidas voltam a levar ao login.
- A senha é guardada apenas como **hash SHA-256 com sal** (Web Crypto), nunca em texto. Isso **não** a torna segura.
- Não há contas pré-criadas: cada pessoa cria a própria conta.
- **Dados por usuário:** humor, gratidão, metas, lembretes, desafios, curtidas, notificações lidas e perfil ficam em `avtcp:user:<id>:<chave>`.
- **Compartilhados no navegador:** lista de contas (`avtcp:users`), sessão (`avtcp:session`) e o feed da comunidade (`avtcp:posts`, `avtcp:comments`). Cada publicação guarda o `userId` do autor, e "Minhas publicações" mostra só as do usuário logado.
- **Perfil → Restaurar dados deste perfil** apaga apenas os dados e as publicações da conta atual. Contas e sessão não são tocadas.

## Imagens

As duas ilustrações do projeto ficam em `public/images/` (`hero-home.webp` e `sobre-nos-comunidade.webp`). Os prompts usados para gerá-las estão em [`docs/IMAGENS-IA.md`](docs/IMAGENS-IA.md).

## Testes (QA)

Com o servidor de desenvolvimento rodando:

```bash
node qa/auth.mjs             # cadastro, login, logout, persistência e isolamento entre usuários
node qa/flows.mjs            # fluxos funcionais (desktop e mobile)
WIDTHS=1440,390 PAGES=/,/comunidade node qa/shots.mjs   # screenshots + checagem de overflow
```

Os scripts usam Playwright (`npx playwright install chromium` na primeira vez). Todos aceitam `BASE=http://localhost:4321` (porta do servidor de desenvolvimento).
