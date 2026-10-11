/** Acesso tipado aos dados guardados no navegador. */
import { load, save, todayKey } from './store';
import { defaultUser, type User, type UserProfile } from '../data/user';
import { seedGoals } from '../data/goals';
import { challenges, seedChallengeStates, type ChallengeState } from '../data/challenges';

export interface StoredPost {
  id: string;
  /** Dono da publicação (conta que publicou). */
  userId: string;
  author: { name: string; username: string };
  ts: number;
  category: string;
  text: string;
}

export interface StoredComment {
  id: string;
  author: string;
  text: string;
  ts: number;
}

export interface Gratitude {
  id: string;
  text: string;
  ts: number;
}

export interface Goal {
  id: string;
  text: string;
  done: boolean;
}

/* Contas e sessão (autenticação local, para fins acadêmicos) */
interface Session {
  userId: string;
}

export const getStoredUsersList = () => load<User[]>('users', []);
const getStoredUsers = getStoredUsersList;
export const setStoredUsers = (list: User[]) => save('users', list);

/** Contas cadastradas neste navegador. */
export const getUsers = (): User[] => getStoredUsers();

export const getSession = () => load<Session | null>('session', null);
export const setSession = (userId: string | null) => save('session', userId ? { userId } : null);

export function getCurrentUser(): User | null {
  const session = getSession();
  return session ? (getUsers().find((u) => u.id === session.userId) ?? null) : null;
}

/** Perfil da conta logada (ou o perfil padrão em páginas públicas sem sessão). */
export function getProfile(): UserProfile {
  const user = getCurrentUser();
  return user ? { name: user.name, username: user.username, bio: user.bio } : defaultUser;
}

export function setProfile(profile: UserProfile): void {
  const user = getCurrentUser();
  if (!user) return;
  setStoredUsers(
    getStoredUsers().map((u) => (u.id === user.id ? { ...u, name: profile.name, bio: profile.bio } : u)),
  );
}

/* Humor (um registro por dia) */
export const getMoods = () => load<Record<string, string>>('moods', {});
export const getMoodToday = () => getMoods()[todayKey()] ?? null;
export const setMoodToday = (id: string) => save('moods', { ...getMoods(), [todayKey()]: id });

/* Gratidão */
export const getGratitude = () => load<Gratitude[]>('gratitude', []);
export const setGratitude = (list: Gratitude[]) => save('gratitude', list);

/* Metas */
export const getGoals = (): Goal[] =>
  load<Goal[] | null>('goals', null) ?? seedGoals.map((text, i) => ({ id: `seed-${i}`, text, done: false }));
export const setGoals = (list: Goal[]) => save('goals', list);

/* Desafios */
export function getChallengeState(id: string): ChallengeState {
  const stored = load<Record<string, ChallengeState>>('challenges', {});
  return stored[id] ?? seedChallengeStates[id] ?? { status: 'disponivel', progress: 0, entries: [] };
}

export function setChallengeState(id: string, state: ChallengeState): void {
  const stored = load<Record<string, ChallengeState>>('challenges', {});
  // Persiste também os demais estados para que o seed não volte depois de uma alteração.
  const full: Record<string, ChallengeState> = {};
  for (const c of challenges) full[c.id] = stored[c.id] ?? getChallengeState(c.id);
  full[id] = state;
  save('challenges', full);
}

/* Comunidade */
export const getUserPosts = () => load<StoredPost[]>('posts', []);
export const setUserPosts = (list: StoredPost[]) => save('posts', list);
export const getLikes = () => load<string[]>('likes', []);
export const setLikes = (list: string[]) => save('likes', list);
export const getComments = () => load<Record<string, StoredComment[]>>('comments', {});
export const setComments = (map: Record<string, StoredComment[]>) => save('comments', map);

/* Notificações e lembretes */
export const getReadNotifications = () => load<string[]>('notifRead', []);
export const setReadNotifications = (ids: string[]) => save('notifRead', ids);
export const getEnabledReminders = () => load<string[]>('remindersOn', ['humor', 'gratidao']);
export const setEnabledReminders = (ids: string[]) => save('remindersOn', ids);

export function getRemindersDone(): string[] {
  const stored = load<{ date: string; ids: string[] }>('remindersDone', { date: '', ids: [] });
  return stored.date === todayKey() ? stored.ids : [];
}
export const setRemindersDone = (ids: string[]) => save('remindersDone', { date: todayKey(), ids });
