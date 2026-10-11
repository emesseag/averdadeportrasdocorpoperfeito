export interface PostComment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface Post {
  id: string;
  author: { name: string; username: string };
  /** Texto de tempo já formatado (publicações mockadas). */
  time: string;
  category: string;
  text: string;
  likes: number;
  comments: PostComment[];
}

/** Publicações de exemplo. As três primeiras aparecem em "Inspiração da Comunidade". */
export const posts: Post[] = [
  {
    id: 'p1',
    author: { name: 'Larissa Souza', username: 'lari.souza' },
    time: '2h atrás',
    category: 'reflexao',
    text: 'Hoje eu me olhei com mais carinho e menos cobrança. Pequenas mudanças, grandes descobertas.',
    likes: 24,
    comments: [
      { id: 'p1c1', author: 'ana_clara', text: 'Que lindo, Lari! Preciso lembrar disso também.', time: '1h atrás' },
    ],
  },
  {
    id: 'p2',
    author: { name: 'Mateus Ribeiro', username: 'mateusfit' },
    time: '3h atrás',
    category: 'motivacao',
    text: 'Treino por mim, não por aprovação. Meu corpo é meu lar, não um projeto de outra pessoa.',
    likes: 41,
    comments: [],
  },
  {
    id: 'p3',
    author: { name: 'Ana Clara Lima', username: 'ana_clara' },
    time: '6h atrás',
    category: 'gratidao',
    text: 'Gratidão pelo meu corpo que me carrega todos os dias, com todas as suas imperfeições.',
    likes: 28,
    comments: [
      { id: 'p3c1', author: 'lari.souza', text: 'Sim! Ele merece muito carinho.', time: '4h atrás' },
      { id: 'p3c2', author: 'mateusfit', text: 'Palavras que todo mundo precisa ler.', time: '3h atrás' },
    ],
  },
  {
    id: 'p4',
    author: { name: 'Bruna Oliveira', username: 'bruna.oli' },
    time: '8h atrás',
    category: 'conquista',
    text: 'Passei o dia inteiro sem me comparar com ninguém nas redes. Foi mais leve do que eu imaginava.',
    likes: 33,
    comments: [],
  },
  {
    id: 'p5',
    author: { name: 'Júlia Mendes', username: 'ju.mendes' },
    time: 'Ontem',
    category: 'desabafo',
    text: 'Hoje foi um dia difícil com o espelho. Estou escrevendo aqui para lembrar que amanhã é outro dia, e que sentir isso não me torna menos forte.',
    likes: 52,
    comments: [
      { id: 'p5c1', author: 'ana_clara', text: 'Você não está sozinha. Um abraço!', time: 'Ontem' },
    ],
  },
  {
    id: 'p6',
    author: { name: 'Pedro Henrique', username: 'pedro.h' },
    time: 'Ontem',
    category: 'reflexao',
    text: 'Aprendi que homens também podem falar sobre insegurança com o próprio corpo. Falar não diminui ninguém.',
    likes: 37,
    comments: [],
  },
  {
    id: 'p7',
    author: { name: 'Camila Duarte', username: 'camila.d' },
    time: '2 dias atrás',
    category: 'conquista',
    text: 'Fui à praia sem me preocupar com o que os outros iriam pensar. Melhor tarde do mês!',
    likes: 64,
    comments: [],
  },
  {
    id: 'p8',
    author: { name: 'Rafael Costa', username: 'rafa.costa' },
    time: '2 dias atrás',
    category: 'motivacao',
    text: 'Progresso não é linear e não precisa ser visível para os outros. Seguimos no nosso ritmo.',
    likes: 29,
    comments: [],
  },
  {
    id: 'p9',
    author: { name: 'Beatriz Nunes', username: 'bia.nunes' },
    time: '3 dias atrás',
    category: 'gratidao',
    text: 'Grata pelas minhas pernas, que me levaram para caminhar com a minha avó hoje.',
    likes: 46,
    comments: [],
  },
  {
    id: 'p10',
    author: { name: 'Thiago Martins', username: 'thi.martins' },
    time: '4 dias atrás',
    category: 'desabafo',
    text: 'Estou cansado de ver "corpo ideal" em todo lugar. Deixei de seguir alguns perfis e já me sinto melhor.',
    likes: 31,
    comments: [],
  },
];
