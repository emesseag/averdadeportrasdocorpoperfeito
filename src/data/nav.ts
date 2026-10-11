export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

/** Menu principal do header. */
export const mainNav: NavItem[] = [
  { label: 'Início', href: '/' },
  { label: 'Comunidade', href: '/comunidade' },
  { label: 'Conteúdos', href: '/conteudos' },
  { label: 'Desafios', href: '/desafios' },
  { label: 'Recursos', href: '/recursos' },
  { label: 'Sobre nós', href: '/sobre-nos' },
];

/** Atalhos da sidebar esquerda. */
export const shortcuts: NavItem[] = [
  { label: 'Meu dia', href: '/meu-dia', icon: 'sun' },
  { label: 'Metas', href: '/metas', icon: 'trending-up' },
  { label: 'Gratidão', href: '/gratidao', icon: 'heart' },
  { label: 'Humor', href: '/humor', icon: 'smile' },
  { label: 'Lembretes', href: '/lembretes', icon: 'bell' },
  { label: 'Comunidade', href: '/comunidade', icon: 'users-round' },
];

export const trustItems = [
  { icon: 'shield-check', title: 'Espaço seguro', text: 'Sem julgamentos' },
  { icon: 'users', title: 'Comunidade positiva', text: 'Incentive e seja incentivado' },
  { icon: 'heart-handshake', title: 'Conteúdos confiáveis', text: 'Informação que transforma' },
  { icon: 'lock', title: 'Privacidade garantida', text: 'Seus dados protegidos' },
];
