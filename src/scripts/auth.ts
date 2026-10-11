/** Login, cadastro, logout, edição de perfil e restauração dos dados do perfil atual (autenticação local). */
import {
  authenticate,
  createAccount,
  emailExists,
  endSession,
  isValidEmail,
  MIN_PASSWORD,
  startSession,
} from './accounts';
import { clearCurrentUserData, storageAvailable } from './store';
import { getCurrentUser, getProfile, getUserPosts, setProfile, setUserPosts } from './state';
import { flash, toast } from './ui';

/* ---------- Mensagens de erro integradas ao formulário ---------- */
function setFieldError(form: HTMLFormElement, field: string, message: string | null): void {
  const input = form.elements.namedItem(field) as HTMLInputElement | null;
  const out = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
  if (!input || !out) return;
  out.textContent = message ?? '';
  out.hidden = !message;
  if (message) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
}

function setFormError(form: HTMLFormElement, message: string | null): void {
  const out = form.querySelector<HTMLElement>('[data-form-error]');
  if (!out) return;
  out.textContent = message ?? '';
  out.hidden = !message;
}

function clearErrors(form: HTMLFormElement): void {
  form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => {
    el.textContent = '';
    el.hidden = true;
  });
  form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  setFormError(form, null);
}

const value = (form: HTMLFormElement, name: string) => (form.elements.namedItem(name) as HTMLInputElement).value;

function focusFirstInvalid(form: HTMLFormElement): void {
  form.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus();
}

/* ---------- Página de login / criar conta ---------- */
function initAuthPage(): void {
  const root = document.querySelector<HTMLElement>('[data-auth]');
  if (!root) return;

  // Quem já está logado não precisa ver o login de novo.
  if (getCurrentUser()) {
    location.replace('/');
    return;
  }

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[role="tabpanel"]'));

  const select = (tab: HTMLButtonElement) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => (p.hidden = p.id !== tab.getAttribute('aria-controls')));
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(next);
      next.focus();
    });
  });
  if (location.hash === '#criar-conta') select(tabs[1]);
  root.querySelectorAll<HTMLElement>('[data-goto-tab]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const target = tabs[Number(btn.dataset.gotoTab)];
      select(target);
      root.querySelector<HTMLInputElement>(`#${target.getAttribute('aria-controls')} input`)?.focus();
    }),
  );

  if (!storageAvailable()) {
    const warn = root.querySelector<HTMLElement>('[data-storage-warning]');
    if (warn) warn.hidden = false;
  }

  const finish = (name: string, message: string) => {
    flash(message.replace('{nome}', name.trim().split(/\s+/)[0] ?? name));
    location.href = '/';
  };

  /* Login */
  const login = root.querySelector<HTMLFormElement>('[data-login-form]');
  login?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(login);
    const email = value(login, 'email');
    const password = value(login, 'password');
    let invalid = false;
    if (!email.trim()) {
      setFieldError(login, 'email', 'Informe seu e-mail.');
      invalid = true;
    } else if (!isValidEmail(email)) {
      setFieldError(login, 'email', 'Informe um e-mail válido, como nome@exemplo.com.');
      invalid = true;
    }
    if (!password) {
      setFieldError(login, 'password', 'Informe sua senha.');
      invalid = true;
    }
    if (invalid) return focusFirstInvalid(login);

    const result = await authenticate(email, password);
    if (!result.ok) {
      if (result.reason === 'no-account') {
        setFieldError(login, 'email', 'Não encontramos uma conta com este e-mail.');
      } else {
        setFieldError(login, 'password', 'E-mail ou senha incorretos.');
      }
      return focusFirstInvalid(login);
    }
    startSession(result.user);
    finish(result.user.name, 'Bem-vindo(a) de volta, {nome}! 💜');
  });

  /* Cadastro */
  const signup = root.querySelector<HTMLFormElement>('[data-signup-form]');
  signup?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(signup);
    const name = value(signup, 'name').trim();
    const email = value(signup, 'email');
    const password = value(signup, 'password');
    const confirm = value(signup, 'confirm');
    let invalid = false;

    if (name.length < 2) {
      setFieldError(signup, 'name', name ? 'Digite seu nome completo.' : 'Informe seu nome.');
      invalid = true;
    }
    if (!email.trim()) {
      setFieldError(signup, 'email', 'Informe seu e-mail.');
      invalid = true;
    } else if (!isValidEmail(email)) {
      setFieldError(signup, 'email', 'Informe um e-mail válido, como nome@exemplo.com.');
      invalid = true;
    } else if (emailExists(email)) {
      setFieldError(signup, 'email', 'Já existe uma conta cadastrada com este e-mail.');
      invalid = true;
    }
    if (password.length < MIN_PASSWORD) {
      setFieldError(signup, 'password', `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`);
      invalid = true;
    }
    if (!confirm) {
      setFieldError(signup, 'confirm', 'Confirme sua senha.');
      invalid = true;
    } else if (confirm !== password) {
      setFieldError(signup, 'confirm', 'As senhas não coincidem.');
      invalid = true;
    }
    if (invalid) return focusFirstInvalid(signup);

    const user = await createAccount({ name, email, password });
    startSession(user);
    finish(user.name, 'Conta criada com sucesso! Bem-vindo(a), {nome} 💜');
  });
}

/* ---------- Edição de perfil ---------- */
function initProfile(): void {
  const form = document.getElementById('profile-form') as HTMLFormElement | null;
  const dialog = document.getElementById('profile-dialog') as HTMLDialogElement | null;
  if (!form || !dialog) return;
  const name = form.elements.namedItem('name') as HTMLInputElement;
  const bio = form.elements.namedItem('bio') as HTMLTextAreaElement;

  dialog.addEventListener('dialog:open', () => {
    const profile = getProfile();
    name.value = profile.name;
    bio.value = profile.bio;
    name.focus();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nextName = name.value.trim();
    if (!nextName) return;
    setProfile({ ...getProfile(), name: nextName, bio: bio.value.trim() });
    dialog.close();
    toast('Perfil atualizado 💜');
  });
}

/* ---------- Proteção de páginas e ações globais ---------- */
export function initAuth(): void {
  const isPublic = document.documentElement.hasAttribute('data-public');
  if (!isPublic && storageAvailable() && !getCurrentUser()) {
    // Sessão ausente ou apontando para uma conta que não existe mais.
    endSession();
    location.replace('/login');
    return;
  }

  initAuthPage();
  initProfile();

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    if (target.closest('[data-logout]')) {
      endSession();
      flash('Você saiu da sua conta. Até logo! 💜');
      location.href = '/login';
      return;
    }

    if (target.closest('[data-reset-demo]')) {
      const user = getCurrentUser();
      const ok = window.confirm(
        'Restaurar os dados deste perfil? Humor, gratidões, metas, lembretes, desafios, curtidas e as suas publicações serão apagados. ' +
          'Sua conta e as contas de outras pessoas neste navegador continuam intactas.',
      );
      if (!ok || !user) return;
      setUserPosts(getUserPosts().filter((p) => p.userId !== user.id));
      clearCurrentUserData();
      flash('Dados do perfil restaurados.');
      location.href = '/';
    }
  });

}
