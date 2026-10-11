/**
 * Contas locais para demonstração.
 *
 * Autenticação implementada localmente para fins acadêmicos. NÃO UTILIZAR ESTA ABORDAGEM EM PRODUÇÃO.
 * As contas ficam no localStorage do navegador, sem servidor. A senha é guardada
 * apenas como hash com sal (SHA-256 via Web Crypto quando disponível), o que NÃO
 * a torna segura: qualquer pessoa com acesso ao navegador pode ler ou apagar tudo.
 */
import type { User } from '../data/user';
import { getCurrentUser, getSession, getStoredUsersList, getUsers, setSession, setStoredUsers } from './state';
import { uid } from './store';
import { slugify } from '../utils/format';

export const MIN_PASSWORD = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const isValidEmail = (email: string) => EMAIL_RE.test(normalizeEmail(email));

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = `${salt}:${password}`;
  const subtle = globalThis.crypto?.subtle;
  if (subtle) {
    const digest = await subtle.digest('SHA-256', new TextEncoder().encode(data));
    const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
    return `sha256:${hex}`;
  }
  // Contexto sem Web Crypto (HTTP fora de localhost): hash simples de contingência.
  let h = 5381;
  for (let i = 0; i < data.length; i++) h = ((h << 5) + h + data.charCodeAt(i)) | 0;
  return `djb2:${(h >>> 0).toString(16)}`;
}

function uniqueUsername(name: string, taken: Set<string>): string {
  const base = slugify(name) || 'pessoa';
  let candidate = base;
  for (let n = 2; taken.has(candidate); n++) candidate = `${base}.${n}`;
  return candidate;
}

export function emailExists(email: string): boolean {
  const wanted = normalizeEmail(email);
  return getUsers().some((u) => normalizeEmail(u.email) === wanted);
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

/** Cria a conta (sem validar: a validação visual é feita no formulário). */
export async function createAccount({ name, email, password }: SignupInput): Promise<User> {
  const stored = getStoredUsersList();
  const taken = new Set(getUsers().map((u) => u.username));
  const salt = uid('salt');
  const user: User = {
    id: uid('user'),
    name: name.trim().replace(/\s+/g, ' '),
    email: normalizeEmail(email),
    username: uniqueUsername(name, taken),
    bio: 'Novo(a) por aqui, aprendendo a me olhar com carinho.',
    createdAt: Date.now(),
    salt,
    passwordHash: await hashPassword(password, salt),
  };
  setStoredUsers([...stored, user]);
  return user;
}

export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; reason: 'no-account' | 'wrong-password' };

export async function authenticate(email: string, password: string): Promise<AuthResult> {
  const user = getUsers().find((u) => normalizeEmail(u.email) === normalizeEmail(email));
  if (!user) return { ok: false, reason: 'no-account' };
  const attempt = await hashPassword(password, user.salt ?? '');
  return attempt === user.passwordHash ? { ok: true, user } : { ok: false, reason: 'wrong-password' };
}

export function startSession(user: User): void {
  setSession(user.id);
}

export function endSession(): void {
  setSession(null);
}

export const isLoggedIn = () => getCurrentUser() !== null && getSession() !== null;
