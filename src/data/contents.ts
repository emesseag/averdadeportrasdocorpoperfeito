/** Bloco de conteúdo: string = parágrafo, string[] = lista, { h } = subtítulo. */
export type Block = string | string[] | { h: string };

export interface Article {
  slug: string;
  title: string;
  summary: string;
  /** id de `contentCategories`. */
  category: string;
  minutes: number;
  /** Aparece também no filtro "Espaço masculino". */
  masculine?: boolean;
  body: Block[];
  takeaways: string[];
}

export const articles: Article[] = [
  {
    slug: 'corpo-nao-e-projeto',
    title: 'Seu corpo não é um projeto a ser corrigido',
    summary: 'Por que olhar para o corpo só como algo a "melhorar" nos afasta de uma relação saudável com ele.',
    category: 'autoestima',
    minutes: 4,
    body: [
      'Vivemos cercados de mensagens que sugerem que o corpo precisa de ajustes constantes: mais magro, mais definido, mais jovem. Com o tempo, passamos a nos ver como um projeto inacabado.',
      { h: 'O que é imagem corporal?' },
      'Imagem corporal é a forma como você pensa e se sente em relação ao seu corpo. Ela é construída por experiências, pela família, pela cultura e, hoje, bastante pelas redes sociais.',
      { h: 'Pequenos passos para uma relação mais gentil' },
      [
        'Repare em como você fala consigo diante do espelho e tente trocar a crítica por neutralidade ou respeito.',
        'Pense no que seu corpo permite que você faça: abraçar, caminhar, dançar, descansar.',
        'Vista roupas confortáveis que combinem com você, e não com um padrão.',
        'Converse com alguém de confiança quando a insatisfação pesar.',
      ],
      'Se pensamentos sobre o corpo estiverem tomando muito espaço, causando sofrimento ou mudando sua alimentação e sua rotina, procurar um profissional de saúde mental é um gesto de cuidado.',
    ],
    takeaways: [
      'Seu valor não depende da aparência.',
      'Neutralidade corporal também é um caminho válido.',
      'Pedir ajuda profissional faz parte do cuidado.',
    ],
  },
  {
    slug: 'o-que-os-filtros-nao-mostram',
    title: 'O que os filtros e as fotos editadas não mostram',
    summary: 'Ângulos, luz, edição e escolha: entenda por que as imagens das redes raramente refletem a vida real.',
    category: 'cidadania-digital',
    minutes: 4,
    body: [
      'Uma foto perfeita costuma ser a melhor de dezenas de tentativas, com luz favorável, ângulo escolhido e, muitas vezes, algum tipo de edição. O que vemos é um recorte, não o dia inteiro de alguém.',
      { h: 'Por que a comparação machuca' },
      'Quando comparamos nossa vida real, com cansaço, dúvidas e dias comuns, com o recorte brilhante de outra pessoa, o resultado quase sempre é a sensação de que estamos "atrás".',
      { h: 'Como cuidar do seu feed' },
      [
        'Pare de seguir ou silencie perfis que fazem você se sentir pior.',
        'Siga pessoas e temas que ampliem sua visão sobre diversidade de corpos.',
        'Defina horários de pausa das redes, principalmente antes de dormir.',
        'Lembre-se de que curtidas e comentários não medem seu valor.',
      ],
    ],
    takeaways: [
      'Redes mostram recortes, não a vida inteira.',
      'Você pode escolher o que consome.',
      'Pausas digitais fazem bem.',
    ],
  },
  {
    slug: 'respirar-antes-de-reagir',
    title: 'Respirar antes de reagir: um exercício de um minuto',
    summary: 'Uma técnica simples de respiração para os momentos de ansiedade ou autocrítica intensa.',
    category: 'saude-mental',
    minutes: 3,
    body: [
      'Quando a ansiedade aparece, o corpo costuma acelerar: coração mais rápido, respiração curta, pensamentos em cadeia. Respirar de forma mais lenta envia ao corpo o sinal de que ele pode desacelerar.',
      { h: 'Passo a passo' },
      [
        'Sente-se com a coluna confortável e solte os ombros.',
        'Inspire pelo nariz contando até 4.',
        'Segure o ar por 2 segundos.',
        'Solte pela boca contando até 6.',
        'Repita por cerca de 1 minuto, observando o corpo.',
      ],
      'Esse exercício não substitui acompanhamento profissional, mas pode ser um apoio no dia a dia. Se a ansiedade for frequente ou muito intensa, converse com um profissional de saúde.',
    ],
    takeaways: [
      'Respirar devagar ajuda o corpo a se acalmar.',
      'É um apoio, não um tratamento.',
      'Procure ajuda se o sofrimento for constante.',
    ],
  },
  {
    slug: 'sentimentos-tem-nome',
    title: 'Sentimentos têm nome: por que identificar o que você sente ajuda',
    summary: 'Dar nome às emoções é um primeiro passo para lidar com elas com mais calma.',
    category: 'saude-mental',
    minutes: 3,
    body: [
      'Dizer "estou mal" é um começo, mas quanto mais preciso for o nome, mais fácil é entender o que está acontecendo: é cansaço? Frustração? Medo de não ser aceito? Vergonha?',
      { h: 'Perguntas que podem ajudar' },
      [
        'O que eu estou sentindo agora, em uma palavra?',
        'Em que parte do corpo eu sinto isso?',
        'O que desencadeou esse sentimento?',
        'O que eu diria a um amigo que se sentisse assim?',
      ],
      'Registrar o seu humor todos os dias aqui na plataforma é uma forma simples de perceber padrões ao longo do tempo.',
    ],
    takeaways: [
      'Nomear emoções ajuda a compreendê-las.',
      'Todas as emoções têm espaço.',
      'Perceber padrões é autoconhecimento.',
    ],
  },
  {
    slug: 'comer-sem-culpa',
    title: 'Comer sem culpa: o que é alimentação consciente?',
    summary: 'Prestar atenção ao que, como e por que comemos, sem regras rígidas e sem punição.',
    category: 'alimentacao',
    minutes: 4,
    body: [
      'Alimentação consciente não é uma dieta. É a prática de prestar atenção ao momento da refeição: fome, saciedade, sabores, texturas e o que sentimos ao comer.',
      { h: 'Ideias para começar' },
      [
        'Faça pelo menos uma refeição por dia sem celular ou televisão.',
        'Mastigue com calma e perceba os sabores.',
        'Observe quando está com fome e quando está satisfeito(a).',
        'Evite classificar alimentos como "certos" ou "errados".',
      ],
      'Cada corpo tem necessidades diferentes. Qualquer mudança significativa na alimentação deve ser orientada por nutricionistas ou outros profissionais de saúde.',
    ],
    takeaways: [
      'Comer com atenção é diferente de fazer dieta.',
      'Culpa não é um bom ingrediente.',
      'Profissionais podem orientar mudanças com segurança.',
    ],
  },
  {
    slug: 'movimento-por-prazer',
    title: 'Movimento por prazer, não por punição',
    summary: 'Como encontrar uma forma de se mexer que combine com você e faça bem ao corpo e à mente.',
    category: 'saude-fisica',
    minutes: 3,
    body: [
      'Exercício não precisa ser castigo por ter comido ou um meio de "consertar" o corpo. Movimentar-se pode ser uma forma de cuidar da saúde, do humor e do sono.',
      { h: 'Como escolher' },
      [
        'Pense no que você gostava de fazer quando criança: correr, pular, dançar.',
        'Comece pequeno: 10 minutos de caminhada já contam.',
        'Convide alguém para se mexer junto, tornando o momento mais leve.',
        'Respeite dias de descanso e sinais de dor.',
      ],
      'Antes de iniciar uma atividade intensa, especialmente se você tem alguma condição de saúde, converse com um profissional.',
    ],
    takeaways: [
      'Movimento pode ser prazeroso.',
      'Descansar também é parte do processo.',
      'Escute o seu corpo.',
    ],
  },
  {
    slug: 'sono-e-bem-estar',
    title: 'Sono e bem-estar: por que dormir bem importa',
    summary: 'Hábitos simples que ajudam a ter noites mais tranquilas e dias com mais disposição.',
    category: 'saude-fisica',
    minutes: 3,
    body: [
      'Dormir bem influencia o humor, a concentração e até a forma como nos enxergamos. Noites mal dormidas costumam deixar tudo mais pesado, inclusive a autocrítica.',
      { h: 'Hábitos que ajudam' },
      [
        'Tente dormir e acordar em horários parecidos.',
        'Diminua telas e luzes fortes antes de deitar.',
        'Evite deixar o celular ao lado da cama e rolar o feed até tarde.',
        'Crie um pequeno ritual: alongar, respirar, anotar uma gratidão.',
      ],
      'Se você tem dificuldade persistente para dormir, procure orientação de um profissional de saúde.',
    ],
    takeaways: [
      'Sono é parte do autocuidado.',
      'Telas à noite atrapalham o descanso.',
      'Rituais simples ajudam o corpo a desacelerar.',
    ],
  },
  {
    slug: 'comentarios-que-machucam',
    title: 'Comentários sobre corpos: o que você diz importa',
    summary: 'Elogios e "brincadeiras" sobre aparência podem ferir. Veja como conversar com mais respeito.',
    category: 'cidadania-digital',
    minutes: 3,
    body: [
      'Comentários sobre peso, forma ou aparência de alguém, mesmo bem-intencionados, podem causar desconforto e reforçar a ideia de que o valor de uma pessoa está no corpo.',
      { h: 'Alternativas mais gentis' },
      [
        'Elogie atitudes, conquistas e qualidades, não só aparência.',
        'Evite comentar sobre o corpo de outras pessoas, principalmente em público.',
        'Se algo na internet te incomodar, use as ferramentas de denúncia da plataforma.',
        'Se for vítima de ofensas ou ameaças online, guarde provas e converse com alguém de confiança.',
      ],
      'Ambientes digitais respeitosos são construídos por pequenas escolhas diárias de cada pessoa.',
    ],
    takeaways: [
      'Palavras sobre o corpo têm peso.',
      'Elogie além da aparência.',
      'Existem formas de denunciar e pedir apoio.',
    ],
  },
  {
    slug: 'quando-procurar-ajuda',
    title: 'Quando procurar ajuda profissional',
    summary: 'Sinais de que pode ser a hora de conversar com alguém preparado para te apoiar.',
    category: 'ajuda',
    minutes: 4,
    body: [
      'Todo mundo tem dias ruins. Mas se o sofrimento é frequente, intenso ou está atrapalhando sua rotina, procurar apoio profissional é uma forma de cuidado.',
      { h: 'Alguns sinais de atenção' },
      [
        'Tristeza ou ansiedade que não passam por semanas.',
        'Pensamentos constantes e angustiantes sobre o corpo ou a comida.',
        'Isolamento de amigos e família.',
        'Mudanças fortes no sono ou na alimentação.',
      ],
      { h: 'Onde buscar apoio' },
      [
        'CVV: ligue 188 (24 horas, gratuito) ou acesse cvv.org.br.',
        'UBS e CAPS: serviços do SUS que atendem gratuitamente na sua cidade.',
        'SAMU: ligue 192 em situações de emergência.',
      ],
      'Esta plataforma não oferece atendimento médico ou psicológico e não substitui o cuidado profissional.',
    ],
    takeaways: [
      'Pedir ajuda é um ato de coragem.',
      'O CVV atende pelo 188, 24 horas por dia.',
      'Em emergência, ligue 192.',
    ],
  },
  {
    slug: 'pressao-estetica-masculina',
    title: 'Pressão estética também existe para os homens',
    summary: 'Músculos, altura, cabelo, barba: como padrões irreais afetam a autoestima masculina.',
    category: 'autoestima',
    minutes: 4,
    masculine: true,
    body: [
      'Muita gente acredita que insatisfação com o corpo é "coisa de mulher". Na prática, homens também lidam com cobranças por corpos musculosos, definidos e "perfeitos", e muitas vezes se sentem sem espaço para falar sobre isso.',
      { h: 'Como a pressão aparece' },
      [
        'Comparação constante com influenciadores e atletas.',
        'Treinos como obrigação, e não como prazer.',
        'Vergonha de mostrar o corpo ou de pedir ajuda.',
        'Piadas e comentários que reforçam o padrão.',
      ],
      'Reconhecer que isso acontece é o primeiro passo. Conversar com amigos, familiares ou profissionais pode aliviar a sensação de estar sozinho.',
    ],
    takeaways: [
      'Insegurança com o corpo não tem gênero.',
      'Falar sobre isso não diminui ninguém.',
      'Você não precisa enfrentar sozinho.',
    ],
  },
  {
    slug: 'musculacao-sem-obsessao',
    title: 'Musculação sem obsessão: treinar por saúde e prazer',
    summary: 'Como manter uma rotina de treino saudável sem transformar o espelho em um juiz.',
    category: 'saude-fisica',
    minutes: 4,
    masculine: true,
    body: [
      'Treinar pode fazer muito bem: ajuda na força, no sono, no humor e na autoconfiança. O problema começa quando o treino vira obrigação, comparação ou fonte de culpa.',
      { h: 'Sinais para observar' },
      [
        'Sentir culpa intensa ao faltar um treino.',
        'Treinar mesmo com dor ou muito cansaço.',
        'Checar o corpo no espelho várias vezes ao dia.',
        'Evitar compromissos sociais para não sair da rotina.',
      ],
      'Se algum desses sinais soar familiar, vale conversar com um profissional de educação física ou de saúde mental sobre como equilibrar sua rotina.',
    ],
    takeaways: [
      'Treino deve somar, não pesar.',
      'Descanso também faz parte do desempenho.',
      'Profissionais podem ajudar a encontrar equilíbrio.',
    ],
  },
  {
    slug: 'masculinidade-e-vulnerabilidade',
    title: 'Masculinidade e vulnerabilidade: falar sobre o que sente',
    summary: 'Por que demonstrar sentimentos não é fraqueza e como começar a conversar sobre eles.',
    category: 'saude-mental',
    minutes: 4,
    masculine: true,
    body: [
      'Muitos homens aprendem desde cedo que precisam "aguentar firme" e não demonstrar fragilidade. Isso pode dificultar pedir ajuda, mesmo quando o sofrimento é grande.',
      { h: 'Por onde começar' },
      [
        'Escolha uma pessoa de confiança para conversar.',
        'Comece com algo simples: "Hoje não estou bem".',
        'Escreva ou registre seu humor para entender melhor o que sente.',
        'Considere procurar um psicólogo: não é preciso estar em crise para isso.',
      ],
      'Cuidar da saúde emocional faz parte de ser forte. Em momentos de muito sofrimento, o CVV (188) está disponível 24 horas por dia.',
    ],
    takeaways: [
      'Sentir é humano.',
      'Falar sobre emoções fortalece relações.',
      'Ajuda profissional está ao alcance de todos.',
    ],
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);
