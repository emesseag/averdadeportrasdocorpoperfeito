/**
 * Persistência local simples (localStorage) com fallback em memória
 * para navegadores com armazenamento bloqueado.
 *
 * Chaves globais (contas, sessão e feed da comunidade) ficam em `avtcp:<chave>`.
 * Todo o resto é pessoal e fica em `avtcp:user:<idDoUsuário>:<chave>`,
 * então cada conta enxerga apenas os próprios dados.
 */
const NS = 'avtcp:';
const GLOBAL_KEYS = new Set(['users', 'session', 'posts', 'comments']);
const memory = new Map<string, string>();

function rawGet(fullKey: string): string | null {
  try {
    const value = localStorage.getItem(fullKey);
    if (value !== null) return value;
  } catch {
    /* armazenamento indisponível */
  }
  return memory.get(fullKey) ?? null;
}

export function storageAvailable(): boolean {
  try {
    const probe = `${NS}probe`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** Id do usuário da sessão atual (ou "guest" sem sessão). */
export function currentUserId(): string {
  const raw = rawGet(`${NS}session`);
  if (!raw) return 'guest';
  try {
    const session = JSON.parse(raw) as { userId?: string } | null;
    return session?.userId ?? 'guest';
  } catch {
    return 'guest';
  }
}

function fullKey(key: string): string {
  return GLOBAL_KEYS.has(key) ? `${NS}${key}` : `${NS}user:${currentUserId()}:${key}`;
}

export function load<T>(key: string, fallback: T): T {
  const raw = rawGet(fullKey(key));
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  const full = fullKey(key);
  const raw = JSON.stringify(value);
  memory.set(full, raw);
  try {
    localStorage.setItem(full, raw);
  } catch {
    /* mantém apenas em memória */
  }
  window.dispatchEvent(new CustomEvent('store:change', { detail: { key } }));
}

/** Apaga apenas os dados pessoais do usuário atual. Contas, sessão e feed global não são tocados. */
export function clearCurrentUserData(): void {
  const prefix = `${NS}user:${currentUserId()}:`;
  for (const key of [...memory.keys()]) if (key.startsWith(prefix)) memory.delete(key);
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(prefix))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignora */
  }
}

export function onChange(keys: string[], fn: () => void): void {
  window.addEventListener('store:change', (event) => {
    const key = (event as CustomEvent<{ key: string }>).detail.key;
    if (keys.includes(key)) fn();
  });
}

export function todayKey(date = new Date()): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
