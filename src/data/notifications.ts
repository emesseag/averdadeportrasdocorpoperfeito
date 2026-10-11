export interface AppNotification {
  id: string;
  text: string;
  time: string;
  href: string;
  icon: string;
}

export const notifications: AppNotification[] = [
  { id: 'n-humor', text: 'Você ainda não registrou seu humor hoje.', time: 'Agora', href: '/humor', icon: 'smile' },
  { id: 'n-like', text: 'Alguém curtiu sua publicação.', time: '1h atrás', href: '/comunidade', icon: 'heart' },
  { id: 'n-desafio', text: 'Novo desafio disponível.', time: '3h atrás', href: '/desafios', icon: 'star' },
  { id: 'n-msg', text: 'Nova mensagem do dia disponível.', time: 'Hoje', href: '/', icon: 'sparkles' },
];
