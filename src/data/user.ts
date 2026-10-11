export interface UserProfile {
  name: string;
  username: string;
  bio: string;
}

/** Conta cadastrada neste navegador (autenticação local, para fins acadêmicos). */
export interface User extends UserProfile {
  id: string;
  email: string;
  createdAt: number;
  /** Hash da senha com sal (nunca a senha em texto). */
  passwordHash?: string;
  salt?: string;
}

/** Perfil neutro usado em páginas públicas quando não há sessão. */
export const defaultUser: UserProfile = {
  name: 'Visitante',
  username: 'visitante',
  bio: '',
};
