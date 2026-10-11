export type ChallengeStatus = 'disponivel' | 'andamento' | 'concluido';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  /** Quantas etapas completam o desafio. */
  target: number;
  /** Se cada etapa pede um texto curto da pessoa. */
  needsText: boolean;
  /** Pergunta mostrada ao registrar uma etapa. */
  prompt?: string;
  weekly?: boolean;
}

export interface ChallengeState {
  status: ChallengeStatus;
  progress: number;
  entries: string[];
}

export const challenges: Challenge[] = [
  {
    id: 'autoestima',
    title: 'Desafio da Autoestima',
    description: 'Escreva 3 coisas que você gosta em você hoje.',
    target: 3,
    needsText: true,
    prompt: 'Uma coisa que eu gosto em mim é…',
    weekly: true,
  },
  {
    id: 'qualidade',
    title: 'Além da aparência',
    description: 'Escreva uma qualidade sua que não tenha relação com aparência.',
    target: 1,
    needsText: true,
    prompt: 'Uma qualidade minha que não tem a ver com aparência é…',
  },
  {
    id: 'prazer',
    title: 'Só porque eu gosto',
    description: 'Faça algo hoje simplesmente porque você gosta.',
    target: 1,
    needsText: false,
  },
  {
    id: 'comparacao',
    title: 'Um dia sem comparações',
    description: 'Passe um dia evitando comparações nas redes sociais.',
    target: 1,
    needsText: false,
  },
  {
    id: 'corpo',
    title: 'Gratidão ao corpo',
    description: 'Agradeça ao seu corpo por algo que ele permite que você faça.',
    target: 1,
    needsText: true,
    prompt: 'Meu corpo me permite…',
  },
];

/** Estado inicial de demonstração: um em andamento e um já concluído. */
export const seedChallengeStates: Record<string, ChallengeState> = {
  autoestima: { status: 'andamento', progress: 2, entries: ['A minha risada', 'A minha persistência'] },
  prazer: { status: 'concluido', progress: 1, entries: [] },
};

export const statusLabels: Record<ChallengeStatus, string> = {
  disponivel: 'Disponível',
  andamento: 'Em andamento',
  concluido: 'Concluído',
};
