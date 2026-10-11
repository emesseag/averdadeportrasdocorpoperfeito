/** Comportamentos de interface compartilhados: diálogos, dropdowns, toast, reveal e dados do usuário. */
import { getCurrentUser, getProfile } from './state';
import { onChange } from './store';
import { initials, tintFor } from '../utils/format';

/* ---------- Diálogos ---------- */
export function openDialog(id: string): void {
  const dialog = document.getElementById(id);
  if (!(dialog instanceof HTMLDialogElement)) return;
  document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach((d) => {
    if (d !== dialog) d.close();
  });
  if (!dialog.open) dialog.showModal();
  dialog.dispatchEvent(new CustomEvent('dialog:open'));
}

export function initDialogs(): void {
  let pressedOnBackdrop = false;

  document.addEventListener('pointerdown', (e) => {
    pressedOnBackdrop = e.target instanceof HTMLDialogElement;
  });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const opener = target.closest<HTMLElement>('[data-open-dialog]');
    if (opener?.dataset.openDialog) {
      e.preventDefault();
      openDialog(opener.dataset.openDialog);
      return;
    }

    const closer = target.closest('[data-close-dialog]');
    if (closer) {
      closer.closest('dialog')?.close();
      return;
    }

    if (target instanceof HTMLDialogElement && target.open && pressedOnBackdrop) target.close();
  });

  // Fecha o menu lateral ao navegar por um link dentro dele.
  document.getElementById('drawer')?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) (e.currentTarget as HTMLDialogElement).close();
  });
}

/* ---------- Dropdowns ---------- */
export function initDropdowns(): void {
  const roots = document.querySelectorAll<HTMLElement>('[data-dropdown]');

  const setOpen = (root: HTMLElement, open: boolean) => {
    const btn = root.querySelector<HTMLElement>('[data-dropdown-btn]');
    const panel = root.querySelector<HTMLElement>('[data-dropdown-panel]');
    if (!btn || !panel) return;
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  };

  const closeAll = (except?: HTMLElement) =>
    roots.forEach((r) => {
      if (r !== except) setOpen(r, false);
    });

  roots.forEach((root) => {
    root.querySelector('[data-dropdown-btn]')?.addEventListener('click', () => {
      const panel = root.querySelector<HTMLElement>('[data-dropdown-panel]');
      const willOpen = panel?.hasAttribute('hidden') ?? false;
      closeAll(root);
      setOpen(root, willOpen);
    });
  });

  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('[data-dropdown]')) closeAll();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    roots.forEach((root) => {
      const btn = root.querySelector<HTMLElement>('[data-dropdown-btn]');
      if (btn?.getAttribute('aria-expanded') === 'true') {
        setOpen(root, false);
        btn.focus();
      }
    });
  });

  roots.forEach((root) =>
    root.addEventListener('focusout', (e) => {
      const next = (e as FocusEvent).relatedTarget as Node | null;
      if (next && !root.contains(next)) setOpen(root, false);
    }),
  );
}

/* ---------- Toast ---------- */
export function toast(message: string, action?: { label: string; href: string }): void {
  const region = document.getElementById('toast-region');
  if (!region) return;
  const el = document.createElement('div');
  el.className = 'toast';
  const text = document.createElement('span');
  text.textContent = message;
  el.append(text);
  if (action) {
    const link = document.createElement('a');
    link.href = action.href;
    link.textContent = action.label;
    el.append(link);
  }
  region.append(el);
  window.setTimeout(() => el.remove(), 4500);
}

/* ---------- Reveal ao entrar na tela ---------- */
let observer: IntersectionObserver | null = null;

export function observeReveal(root: ParentNode = document): void {
  const items = root.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  observer ??= new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer?.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
  );
  items.forEach((el) => observer?.observe(el));
}

export function setupStagger(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((container) => {
    Array.from(container.children).forEach((child, i) => {
      if (!(child instanceof HTMLElement)) return;
      child.setAttribute('data-reveal', '');
      child.style.setProperty('--i', String(Math.min(i, 8)));
    });
  });
}

export function initReveal(): void {
  setupStagger();
  observeReveal();
}

/* ---------- Dados do usuário no DOM ---------- */
export function renderUser(): void {
  const user = getProfile();
  const first = user.name.trim().split(/\s+/)[0] ?? user.name;
  document.querySelectorAll('[data-user-first]').forEach((el) => (el.textContent = first));
  document.querySelectorAll('[data-user-name]').forEach((el) => (el.textContent = user.name));
  document.querySelectorAll('[data-user-email]').forEach((el) => (el.textContent = getCurrentUser()?.email ?? ''));
  document.querySelectorAll('[data-user-username]').forEach((el) => (el.textContent = `@${user.username}`));
  document.querySelectorAll('[data-user-bio]').forEach((el) => (el.textContent = user.bio));
  document.querySelectorAll<HTMLElement>('[data-user-initials]').forEach((el) => {
    el.textContent = initials(user.name);
    el.className = el.className.replace(/\btint-\w+/g, '').trim() + ` tint-${tintFor(user.username)}`;
  });
}

export function initUser(): void {
  renderUser();
  onChange(['users', 'session'], renderUser);
  const hasUser = getCurrentUser() !== null;
  document.querySelectorAll<HTMLElement>('[data-user-menu]').forEach((el) => (el.hidden = !hasUser));
  document.querySelectorAll<HTMLElement>('[data-login-link]').forEach((el) => (el.hidden = hasUser));

  const message = takeFlash();
  if (message) window.setTimeout(() => toast(message), 150);
}

/* Mensagem única mostrada após um redirecionamento (login, cadastro, logout). */
const FLASH_KEY = 'avtcp:flash';

export function flash(message: string): void {
  try {
    sessionStorage.setItem(FLASH_KEY, message);
  } catch {
    /* sem armazenamento de sessão: segue sem mensagem */
  }
}

function takeFlash(): string | null {
  try {
    const message = sessionStorage.getItem(FLASH_KEY);
    if (message) sessionStorage.removeItem(FLASH_KEY);
    return message;
  } catch {
    return null;
  }
}
