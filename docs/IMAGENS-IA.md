# IMAGENS — A VERDADE POR TRÁS DO CORPO PERFEITO

## Como utilizar este documento

Esta é a **fonte única de verdade** das imagens que ainda precisam ser geradas. Enquanto os arquivos não existirem, o site mostra `[ RESERVADO PARA FOTO ]` (componente `src/components/Placeholder.astro`) já no tamanho e na proporção finais.

**Varredura do projeto (feita no código):** existem exatamente **2** pontos que dependem de imagem. Não há `<img>`, `background-image` ou `url()` em nenhum outro lugar.

| # | Arquivo | Caminho no projeto | Página | Dimensões | Proporção | Fundo |
|---|---------|--------------------|--------|-----------|-----------|-------|
| 01 | `hero-home.webp` | `public/images/hero-home.webp` | Início (`/`) · Hero | **1200 × 1200 px** | **1:1** | **Transparente** |
| 02 | `sobre-nos-comunidade.webp` | `public/images/sobre-nos-comunidade.webp` | Sobre nós (`/sobre-nos`) · Introdução | **1440 × 1080 px** | **4:3** | Opaco (cena completa) |

O que **não** precisa de imagem (e continua assim de propósito):
- **Avatares:** iniciais sobre cores pastel.
- **Artigos e cards de conteúdo:** ícones lineares por categoria.
- **Coração, brilhos e símbolo ♂** do hero e do "Espaço masculino": ícones vetoriais (Lucide), já no código.
- **Logo:** SVG do próprio projeto.

### Passo a passo

1. Gere cada imagem com o prompt da seção correspondente (cada prompt funciona **sozinho**: já repete a direção artística e os personagens).
2. Gere a **Imagem 01 primeiro** e aprove os 6 personagens. Na Imagem 02, se o gerador permitir, use a 01 como imagem de referência de personagem.
3. Hero: remova o fundo branco (Photopea, Photoshop, remove.bg…) e exporte **WebP com transparência**.
4. Exporte em WebP (qualidade 80–85) e salve em `public/images/` com o **nome exato** da tabela.
5. Faça a substituição do placeholder conforme a seção "Como substituir o placeholder" de cada imagem.

### Dicas por ferramenta

- **Midjourney:** acrescente `--ar 1:1` (Imagem 01) ou `--ar 4:3` (Imagem 02) e `--no` com o *negative prompt*.
- **DALL·E / ChatGPT, Ideogram, Flux, Firefly:** selecione a proporção na interface (1:1 ou 4:3) e cole o *negative prompt* no campo próprio. Se não houver campo, adicione ao fim do prompt: `Avoid: …`.
- Gere várias variações. Revise **mãos, dentes, olhos e simetria** antes de aprovar.
- Confira os termos de uso comercial/escolar da ferramenta.

---

## Direção artística global

Vale para as **duas** imagens. É a mesma linguagem da referência visual do projeto (grupo de jovens diversos em ilustração digital polida, sobre fundo lilás suave).

**Linguagem visual**
- **Ilustração digital editorial semi-realista**, de personagens. **Não é fotografia.**
- Formas suaves e arredondadas, **proporções humanas naturais** (nada de cabeças gigantes ou corpos esticados).
- Sombreamento macio em camadas, com gradientes sutis (acabamento levemente 3D). Contornos finos, em tom um pouco mais escuro da própria cor. Sem textura de pele fotográfica, sem sombras duras.
- Clima: acolhedor, jovem, positivo, seguro. Sorrisos naturais, olhares gentis.
- Moderno e leve, como um app de bem-estar. Nada de visual clínico, hospitalar ou "fitness".

**Paleta** (dialoga com a interface)
- Lilás: `#8064D9` e `#F2EDFC`
- Azul: `#4169B2` e `#EEF4FC`
- Neutros: branco `#FFFFFF`, creme, cinza-carvão `#2B2B36`
- Apoio: rosa-antigo, verde-água (teal), verde-sálvia — suaves, sem neon e sem vermelho saturado
- Tons de pele **variados e naturais**

**Luz:** difusa e suave, vinda do canto superior esquerdo; leve luz de contorno lilás no lado direito dos personagens. Sem flash e sem contraste agressivo.

**Elenco fixo (os mesmos 6 personagens nas duas imagens)** — jovens adultos de ~22 a 29 anos, corpos e estilos diferentes, nenhum "corpo ideal":

| # | Nome | Descrição |
|---|------|-----------|
| 1 | **Amara** | Mulher, ~24 anos, pele negra retinta, cabelo crespo/cacheado volumoso, sorriso aberto. Regata rosa-antigo. Corpo mediano. |
| 2 | **Lívia** | Mulher, ~27 anos, pele parda, cabelo castanho-escuro ondulado até os ombros. Camiseta lilás. Corpo **mais cheio** (plus size), postura confiante. |
| 3 | **Helena** | Mulher, ~22 anos, pele clara, cabelo loiro liso na altura dos ombros. Camiseta creme. Corpo magro. |
| 4 | **Davi** | Homem, ~26 anos, pele negra, cabelo curto, barba rala. Camiseta preta. Corpo **robusto** (largo, não "sarado"). |
| 5 | **Théo** | Homem, ~23 anos, pele branca-oliva, cabelo castanho ondulado e despenteado. Camiseta azul-petróleo. Corpo mediano. |
| 6 | **Kenji** | Homem, ~29 anos, descendência asiática, cabelo preto curto, **óculos** redondos. Regata cinza sobre camiseta branca (ou camisa leve aberta). Corpo magro. |

Roupas: cotidianas, confortáveis, **sem estampas, logos ou textos**; sem barriga à mostra, sem top esportivo, sem roupa de banho.

---

## 01 — Hero Home

### Nome do arquivo
`hero-home.webp`

### Caminho
`public/images/hero-home.webp` (URL no site: `/images/hero-home.webp`)

### Dimensões
**1200 × 1200 px** · WebP com **canal alfa (fundo transparente)** · alvo de peso: até 250 KB.

### Aspect ratio
**1:1.**

Por que 1:1 e não 5:4 (valor da primeira versão do documento): medi o espaço real do hero no navegador. A área da imagem (`.hero__media`) é **quase quadrada**, de 0,75 a 1,09 de proporção:

| Largura da janela | Área da imagem (px) | Proporção |
|---|---|---|
| 1920 | 461 × 507 | 0,91 |
| 1440 | 401 × 491 | 0,82 |
| 1280 | 493 × 453 | 1,09 |
| 1024 | 365 × 481 | 0,76 |
| 834 | 392 × 488 | 0,80 |
| 390 (celular) | 316 × 316 | 1,00 |

Uma arte horizontal (5:4) apareceria bem menor e as seis pessoas ficariam minúsculas. Com 1:1 a imagem usa quase sempre toda a largura disponível. Para isso, o CSS do hero foi ajustado: `object-fit: contain` (a arte nunca é cortada) e, no celular, a área da imagem passou a ser 1:1.

### Onde será utilizada
Página inicial, **lado direito do hero** (título "Todos os corpos. Todas as histórias. Uma mesma verdade."). É a mesma composição da referência: grupo de jovens diversos, lado a lado, em primeiro plano.

### Composição necessária
- **6 pessoas**: 3 mulheres e 3 homens (o elenco fixo da "Direção artística global").
- Duas fileiras escalonadas: **3 pessoas ao fundo (um pouco mais altas) e 3 na frente**, intercaladas por gênero e tom de pele. Ombro com ombro, alguns com o braço sobre o ombro do outro.
- Todos de frente, da **cintura para cima**, sorrindo com naturalidade.
- Fundo **branco liso**, para ser removido e virar **transparente**.

### Área segura
Medida em % da altura/largura da imagem final (1200 × 1200):

| Região | Regra |
|---|---|
| **Topo: 0–18%** | **Totalmente vazio.** O código sobrepõe coração, brilhos e símbolo ♂ nessa faixa. |
| **Rostos e cabeças** | Entre **20% e 58%** da altura. |
| **Base: 70–100%** | Só tronco/roupa. No desktop a faixa "Espaço masculino" cobre de **21% a 29%** da altura da imagem (29% em 1440 px, o pior caso). Sem mãos, objetos ou detalhes importantes aí. |
| **Laterais** | Margem livre de **4%** em cada lado. O grupo ocupa ~**90% da largura**. |
| **Corpo** | Os corpos seguem até a **borda inferior** (cortados na cintura/tronco), sem "flutuar". |

### Prompt completo
Prompt em inglês (geradores seguem melhor). Copie tudo.

```
Digital editorial illustration, square 1:1 composition, of a group of six diverse young adults standing close together, shoulder to shoulder, arranged in two staggered rows: three people slightly behind and a little taller, three people in front, interleaved so the group feels balanced and natural. Shown from the waist up, all facing the viewer, warm natural smiles, relaxed friendly body language, a few of them with an arm gently around a friend's shoulder. Three women and three men, ages about 22 to 29.

Characters (keep them exactly like this):
1) Amara: woman, about 24, deep dark brown skin, big voluminous coily natural hair, open bright smile, dusty-rose tank top, average build.
2) Lívia: woman, about 27, medium brown skin, dark brown wavy shoulder-length hair, lilac t-shirt, fuller plus-size body, confident posture.
3) Helena: woman, about 22, fair skin, straight blonde shoulder-length hair, cream t-shirt, slim build.
4) Davi: man, about 26, dark skin, short hair and light stubble, black t-shirt, broad sturdy build (not a bodybuilder).
5) Théo: man, about 23, light olive skin, tousled wavy brown hair, teal t-shirt, average build.
6) Kenji: man, about 29, East Asian descent, short black hair, round glasses, light gray tank top over a white t-shirt, slim build.
Everyday casual clothes only: no logos, no prints, no text, no exposed midriff, no sports bras, no swimwear.

Art style: polished semi-realistic digital character illustration, soft rounded shapes, natural human proportions, smooth soft shading with subtle gradients and a gentle 3D-like finish, thin soft outlines in a slightly darker tone of each color, no photographic skin texture, no hard shadows. Modern, friendly, youthful, optimistic, welcoming and safe mood, like a wellness app illustration.

Color palette: soft lilac (#8064D9 and #F2EDFC), cool blue (#4169B2 and #EEF4FC), white, cream, dusty rose, teal and charcoal (#2B2B36), with natural varied skin tones. No neon, no saturated red.

Lighting: soft diffused light from the upper left, a gentle lilac rim light on the right edges of the characters, no strong cast shadows.

Composition and safe area: the group is centered and spans about 90% of the canvas width, with at least 4% empty margin on the left and right. The top 18% of the canvas is completely empty. All heads and faces sit between 20% and 58% of the canvas height. The bodies continue down to the bottom edge of the canvas and are cut at the waist / lower torso, so the bottom 30% contains only torsos and clothing: no hands, no props, no important details there. Nobody is cropped on the sides.

Background: one single flat solid pure white (#FFFFFF) background, no gradient, no floor, no ground shadow, no objects, no decorations, no frame, no text, so it can be cleanly removed to transparent.
```

### Negative prompt / restrições
```
photograph, photorealistic, 3d render of real people, text, letters, words, numbers, logo, watermark, signature, interface, buttons, frame, border, extra fingers, deformed hands, extra limbs, missing limbs, fused bodies, duplicated people, distorted faces, asymmetrical eyes, wrong anatomy, cropped heads, people cut at the sides, floor, ground shadow, background scenery, props, bodybuilder physique, six-pack abs, gym clothes, sports bra, exposed midriff, swimwear, lingerie, sexualized pose, revealing clothing, single body type, all people looking the same, before-and-after, measuring tape, scale, mirror, hospital or clinical look, doctor coat, neon colors, harsh shadows, dark moody lighting, brand logos, celebrity likeness, children
```
**Não gerar:** texto de qualquer tipo, logos, interface, moldura, anatomia errada, mãos deformadas, pessoas duplicadas, pessoas cortadas nas laterais, corpos musculosos/fitness, roupas curtas ou sexualizadas, padrão corporal único, ambiente clínico, balança/fita métrica/espelho.

### Comportamento no desktop
- **≥ 760 px:** a imagem fica na **metade direita** do hero (`.hero__media`: `position: absolute; right: 0; top: 0; bottom: 0; width: 50%`). O texto, os botões e o título ficam na metade esquerda. Nada da imagem deve ficar atrás do texto.
- `object-fit: contain; object-position: center bottom`: a arte aparece **inteira**, centralizada na horizontal e **ancorada na base**. Se o espaço for mais alto que largo (comum), sobra espaço transparente **em cima**, onde ficam coração/♂/brilhos.
- A faixa **"Espaço masculino"** (azul-marinho) cobre a parte de baixo da imagem (≈ 21–29% da altura da arte). É intencional e reproduz a referência: por isso a base da arte é só tronco.
- Tablet (760–1100 px): mesma estrutura; a faixa ocupa a largura toda do hero e esconde o texto auxiliar, cobrindo ~22–24% da base da arte.

### Comportamento no mobile
- **< 760 px:** coluna única: título, texto e botões → **imagem em 1:1** (largura do card menos 40 px) → faixa "Espaço masculino" **abaixo** da imagem (não sobrepõe).
- `object-fit: contain`: nada é cortado. Os ícones decorativos (coração/♂/brilhos) ficam ocultos.
- Como a faixa não cobre a imagem no celular, a parte inferior (torsos) aparece completa. Por isso torsos devem estar **bem acabados** (sem cortes estranhos nem objetos).

### Como substituir o placeholder
- **Arquivo:** `src/pages/index.astro`, dentro de `<div class="hero__media">` (hoje contém `<Placeholder file="hero-home.webp" … />`, que renderiza `[ RESERVADO PARA FOTO ]`).
- **Componente/estilo correspondente:** `.hero__media` e `.hero__media img` em `src/styles/pages.css` (já preparados: `position: absolute; inset: 0; width/height: 100%; object-fit: contain; object-position: center bottom`).
- **Troque** o `<Placeholder … />` por:

```astro
<img
  src="/images/hero-home.webp"
  alt="Ilustração de seis jovens diversos, três mulheres e três homens, de corpos e tons de pele variados, sorrindo juntos."
  width="1200"
  height="1200"
  fetchpriority="high"
/>
```
- Depois da troca, remova o `import Placeholder` de `index.astro` se ele não for mais usado nessa página.
- **Checklist de aceite:** (1) fundo realmente transparente; (2) sem halo branco nas bordas; (3) topo 18% vazio; (4) rostos acima de 58%; (5) 6 pessoas, 3 mulheres e 3 homens; (6) sem texto/logo.

---

## 02 — Sobre Nós

### Nome do arquivo
`sobre-nos-comunidade.webp`

### Caminho
`public/images/sobre-nos-comunidade.webp` (URL no site: `/images/sobre-nos-comunidade.webp`)

### Dimensões
**1440 × 1080 px** · WebP · **fundo opaco** (cena completa) · alvo de peso: até 200 KB.

> O documento anterior indicava 1200 × 900. A **proporção 4:3 está correta**. Medi o espaço no navegador: a imagem aparece em **4:3 exato (1,333)** em todas as larguras (de 308 × 231 no celular a 719 × 539 em 1920 px). Subi o tamanho para **1440 × 1080** para ficar nítida em telas Retina (2× de 719 px).

### Aspect ratio
**4:3.**

### Onde será utilizada
Página "Sobre nós", bloco de introdução: texto (título + parágrafo) à esquerda e a imagem à direita. Representa **comunidade, acolhimento, diversidade, conexão, autoestima e bem-estar**, com os mesmos seis personagens do hero.

### Composição necessária
- **Os mesmos 6 personagens** da Imagem 01, agora **sentados em roda**, numa sala de convivência clara e aconchegante.
- Conversa descontraída: dois rindo, um ouvindo com atenção segurando uma caneca, um gesticulando, um abraçando uma almofada, um com a mão no ombro de quem está ao lado.
- Cenário simples e limpo: parede lilás clara, janela grande com céu azul-claro, algumas plantas, tapete redondo creme, piso de madeira clara, almofadas nas cores da paleta.
- Cena **completa e opaca** (sem recorte). Sem texto em cartazes ou quadros.

### Área segura
| Região | Regra |
|---|---|
| **Proporção** | 4:3 exata, **nenhum corte** é aplicado no site. |
| **Grupo** | Centralizado, ocupando ~**70%** da largura e a metade inferior/central da altura. |
| **Rostos** | Dentro dos **80% centrais** (horizontal) e entre **25% e 70%** da altura. |
| **Topo** | ~20% de ar (parede/janela/plantas), sem rostos. |
| **Cantos** | Os cantos são arredondados no site (raio 18 px). Mantenha **5% de margem** sem informação importante, e ninguém encostado nas bordas. |
| **Texto da página** | Fica **ao lado** da imagem (coluna esquerda), nunca sobre ela. Não é preciso reservar espaço de texto dentro da arte. |

### Prompt completo
```
Digital editorial illustration, landscape 4:3 composition, of six diverse young adults sitting together in a loose circle on floor cushions and a low sofa in a bright, cozy community lounge, having a warm, relaxed conversation. Genuine smiles, friendly open body language, a feeling of belonging, acceptance and mutual support. Three women and three men, ages about 22 to 29.

Characters (keep them exactly like this, same people as the hero illustration):
1) Amara: woman, about 24, deep dark brown skin, big voluminous coily natural hair, dusty-rose tank top, average build, laughing with her hand on Lívia's shoulder.
2) Lívia: woman, about 27, medium brown skin, dark brown wavy shoulder-length hair, lilac t-shirt, fuller plus-size body, relaxed and confident, smiling.
3) Helena: woman, about 22, fair skin, straight blonde shoulder-length hair, cream t-shirt, slim build, sitting cross-legged hugging a cushion, smiling.
4) Davi: man, about 26, dark skin, short hair and light stubble, black t-shirt, broad sturdy build (not a bodybuilder), leaning forward listening attentively and holding a mug.
5) Théo: man, about 23, light olive skin, tousled wavy brown hair, teal t-shirt, average build, gesturing while he talks.
6) Kenji: man, about 29, East Asian descent, short black hair, round glasses, light gray tank top over a white t-shirt, slim build, laughing softly.
Everyday casual clothes only: no logos, no prints, no text, no exposed midriff, no sports bras, no swimwear.

Setting: a bright community lounge with a pale lilac wall (#F2EDFC), a large window showing a soft light blue sky (#EEF4FC), a few leafy green plants in simple pots, a round cream rug, light wooden floor, and cushions in lilac, blue, cream and sage. Simple, uncluttered, slightly softer and less detailed than the characters. No posters, no signs, no text, no screens.

Art style: polished semi-realistic digital character illustration, soft rounded shapes, natural human proportions, smooth soft shading with subtle gradients and a gentle 3D-like finish, thin soft outlines in a slightly darker tone of each color, no photographic skin texture, no hard shadows. Modern, friendly, youthful, optimistic, welcoming and safe mood, like a wellness app illustration.

Color palette: soft lilac (#8064D9 and #F2EDFC), cool blue (#4169B2 and #EEF4FC), white, cream, dusty rose, teal, sage green and charcoal (#2B2B36), with natural varied skin tones. No neon, no saturated red.

Lighting: soft diffused daylight coming from the window on the upper left, gentle lilac rim light on the characters, no strong cast shadows.

Composition and safe area: the group is centered, occupying about 70% of the canvas width and the central and lower half of the height, with about 20% calm empty space at the top (wall, window, plants). All faces are inside the central 80% of the width and between 25% and 70% of the height. Keep a 5% margin on all sides free of important information and nobody touching the edges. Eye-level, slightly wide medium shot. No text anywhere.
```

### Negative prompt / restrições
```
photograph, photorealistic, text, letters, words, numbers, logo, watermark, signature, posters with writing, signs, phone or computer screens, social media interface, frame, border, extra fingers, deformed hands, extra limbs, missing limbs, fused bodies, duplicated people, distorted faces, asymmetrical eyes, wrong anatomy, people cut by the edges, crowded cluttered room, bodybuilder physique, gym, sportswear, sports bra, exposed midriff, swimwear, lingerie, sexualized pose, revealing clothing, single body type, all people looking the same, hospital, clinic, therapy office with clipboard, doctor coat, before-and-after, measuring tape, scale, mirror, children, neon colors, harsh shadows, dark moody lighting, brand logos, celebrity likeness
```
**Não gerar:** texto/cartazes, logos, telas ou redes sociais, anatomia errada, pessoas cortadas pelas bordas, ambiente clínico/terapia com prancheta, corpos fitness, roupas curtas ou sexualizadas, padrão corporal único, balança/fita métrica/espelho.

### Comportamento no desktop
- **≥ 760 px:** bloco em **2 colunas** (`.about-intro`: `grid-template-columns: 1fr 1fr`, `align-items: center`). Texto à esquerda, imagem à direita, centralizada na vertical.
- A imagem renderiza com **largura da coluna** e altura derivada do **4:3** (de ~340 px em 760 px de janela a 719 px em 1920 px).
- `object-fit: cover; object-position: center` e `border-radius: var(--r-lg)` (18 px). Como o slot é 4:3 exato, **não há corte**; o `cover` só protege caso o slot mude.

### Comportamento no mobile
- **< 760 px:** 1 coluna. O texto vem primeiro e a imagem **abaixo**, em largura total do card (~308 px a 356 px) e proporção **4:3**.
- Sem corte. Os rostos continuam legíveis porque o grupo ocupa ~70% da largura.

### Como substituir o placeholder
- **Arquivo:** `src/pages/sobre-nos.astro`, dentro de `<section class="page-head about-intro">` (hoje contém `<Placeholder file="sobre-nos-comunidade.webp" … />`).
- **Estilo correspondente:** `.about-intro__img` em `src/styles/pages.css` (**já criado**: `width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: var(--r-lg)`). Não precisa escrever CSS novo.
- **Troque** o `<Placeholder … />` por:

```astro
<img
  class="about-intro__img"
  src="/images/sobre-nos-comunidade.webp"
  alt="Ilustração de seis jovens diversos conversando e sorrindo em uma roda, em uma sala acolhedora."
  width="1440"
  height="1080"
  loading="lazy"
/>
```
- Depois da troca, remova o `import Placeholder` de `sobre-nos.astro`.
- Quando as duas imagens estiverem no projeto, `src/components/Placeholder.astro` e o bloco `.photo-ph` em `components.css` ficam sem uso e podem ser removidos.
- **Checklist de aceite:** (1) proporção exata 4:3; (2) mesmos 6 personagens do hero; (3) sem texto/cartaz; (4) rostos dentro dos 80% centrais; (5) clima acolhedor, sem aparência clínica.

---

## Consistência entre as duas imagens

- **Mesmo elenco** (6 personagens, mesmas roupas e traços) e **mesma técnica** (ilustração digital semi-realista, sombreamento macio, contornos suaves).
- **Mesma paleta** (lilás/azul/creme/rosa-antigo/teal) e **mesma luz** (suave, do canto superior esquerdo, com contorno lilás).
- **Diferença intencional:** a 01 é um retrato do grupo em pé, sem cenário (recorte transparente); a 02 é uma cena com ambiente. Mesma gente, mesmo "mundo".
