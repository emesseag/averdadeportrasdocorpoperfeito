/** Mensagens do dia. Uma é escolhida por data (ver `messageOfTheDay`). */
export const dailyMessages: string[] = [
  'Comparação é o ladrão da alegria. Foque em você, no seu processo e nas suas conquistas!',
  'Seu corpo não é um projeto a ser corrigido. É a casa onde você vive todos os dias.',
  'Descansar também é cuidar de si. Hoje, permita-se desacelerar sem culpa.',
  'Você não precisa se parecer com ninguém para merecer respeito, carinho e espaço.',
  'Pequenos gestos de gentileza com você mesmo(a) constroem grandes mudanças ao longo do tempo.',
  'O que você sente importa. Se hoje está difícil, tudo bem pedir ajuda.',
  'Força não é ter o corpo perfeito, é ter mente forte para ser sua melhor versão todos os dias.',
  'Nenhuma foto editada conta a história inteira de uma pessoa. Valorize a sua.',
];

export function messageOfTheDay(date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((date.getTime() - start) / 86_400_000);
  return dailyMessages[dayOfYear % dailyMessages.length];
}

export const sidebarQuote =
  'Força não é ter o corpo perfeito, é ter mente forte para ser sua melhor versão todos os dias.';
