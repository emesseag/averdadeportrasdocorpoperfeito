/** Categorias das publicações da comunidade. */
export interface PostCategory {
  id: string;
  label: string;
  /** Rótulo usado nos filtros da página Comunidade. */
  plural: string;
  tint: 'lilac' | 'sky' | 'mint' | 'peach' | 'rose';
}

export const postCategories: PostCategory[] = [
  { id: 'reflexao', label: 'Reflexão', plural: 'Reflexões', tint: 'lilac' },
  { id: 'conquista', label: 'Conquista', plural: 'Conquistas', tint: 'peach' },
  { id: 'gratidao', label: 'Gratidão', plural: 'Gratidão', tint: 'mint' },
  { id: 'desabafo', label: 'Desabafo', plural: 'Desabafos', tint: 'rose' },
  { id: 'motivacao', label: 'Motivação', plural: 'Motivação', tint: 'sky' },
];

/** Categorias de conteúdos e recursos (mesma lista nas duas áreas). */
export interface ContentCategory {
  id: string;
  label: string;
  icon: string;
  tint: 'lilac' | 'sky' | 'mint' | 'peach' | 'rose';
  description: string;
  /** Dicas gerais exibidas na página Recursos. */
  tips: string[];
}

export const contentCategories: ContentCategory[] = [
  {
    id: 'saude-fisica',
    label: 'Dicas de saúde física',
    icon: 'activity',
    tint: 'sky',
    description: 'Movimento, sono e rotina vistos como cuidado, não como castigo.',
    tips: [
      'Escolha movimentos que você goste: caminhar, dançar, alongar, pedalar.',
      'Dormir bem faz parte da saúde tanto quanto se exercitar.',
      'Respeite sinais de dor e cansaço. Descansar também é cuidar do corpo.',
    ],
  },
  {
    id: 'saude-mental',
    label: 'Saúde mental',
    icon: 'brain',
    tint: 'lilac',
    description: 'Entender emoções, respirar e perceber quando é hora de buscar apoio.',
    tips: [
      'Nomear o que você sente já ajuda a atravessar o momento.',
      'Pausas curtas e respiração lenta ajudam a acalmar a ansiedade.',
      'Conversar com alguém de confiança alivia o peso de carregar tudo sozinho(a).',
    ],
  },
  {
    id: 'alimentacao',
    label: 'Alimentação consciente',
    icon: 'salad',
    tint: 'mint',
    description: 'Comer com atenção, sem culpa e sem regras rígidas.',
    tips: [
      'Coma com calma e atenção, longe de telas sempre que possível.',
      'Evite rotular comidas como "boas" ou "ruins".',
      'Mudanças importantes na alimentação devem ser acompanhadas por profissionais de saúde.',
    ],
  },
  {
    id: 'cidadania-digital',
    label: 'Cidadania digital',
    icon: 'smartphone',
    tint: 'peach',
    description: 'Redes sociais, filtros, comparação e convivência respeitosa online.',
    tips: [
      'Lembre-se: fotos postadas costumam ser editadas, filtradas e escolhidas entre muitas.',
      'Siga perfis que fazem bem e silencie os que despertam comparação.',
      'Comentários sobre o corpo dos outros podem machucar. Pense antes de escrever.',
    ],
  },
  {
    id: 'autoestima',
    label: 'Autoestima e imagem corporal',
    icon: 'sparkles',
    tint: 'rose',
    description: 'Construir uma relação mais gentil com o próprio corpo e com quem você é.',
    tips: [
      'Valorize o que seu corpo permite que você faça, além de como ele parece.',
      'Troque a autocrítica por uma fala que você diria a um amigo querido.',
      'Perceba os gatilhos de comparação e dê um tempo deles.',
    ],
  },
  {
    id: 'ajuda',
    label: 'Onde pedir ajuda',
    icon: 'life-buoy',
    tint: 'sky',
    description: 'Serviços e caminhos para quem precisa conversar com um profissional.',
    tips: [
      'Pedir ajuda não é fraqueza. É uma forma de cuidado.',
      'Procure uma Unidade Básica de Saúde (UBS) ou um CAPS da sua cidade.',
      'Em situação de risco, ligue para o SAMU (192) ou procure o pronto-atendimento mais próximo.',
    ],
  },
];

export const categoryById = (id: string) => contentCategories.find((c) => c.id === id);
