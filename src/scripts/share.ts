/** Modal "Compartilhe algo com a comunidade". */
import { getCurrentUser, getUserPosts, setUserPosts } from './state';
import { uid } from './store';
import { toast } from './ui';

const MIN_LENGTH = 3;

export function initShare(): void {
  const dialog = document.getElementById('share-dialog') as HTMLDialogElement | null;
  const form = document.getElementById('share-form') as HTMLFormElement | null;
  if (!dialog || !form) return;

  const textarea = form.elements.namedItem('text') as HTMLTextAreaElement;
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const counter = form.querySelector<HTMLElement>('[data-counter]')!;

  const sync = () => {
    counter.textContent = `${textarea.value.length}/${textarea.maxLength}`;
    submit.disabled = textarea.value.trim().length < MIN_LENGTH;
  };

  textarea.addEventListener('input', sync);
  dialog.addEventListener('dialog:open', () => {
    form.reset();
    sync();
    textarea.focus();
  });
  sync();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = textarea.value.trim();
    if (text.length < MIN_LENGTH) return;
    const user = getCurrentUser();
    if (!user) {
      location.href = '/login';
      return;
    }
    const category = (new FormData(form).get('category') as string | null) ?? 'reflexao';
    setUserPosts([
      {
        id: uid('u'),
        userId: user.id,
        author: { name: user.name, username: user.username },
        ts: Date.now(),
        category,
        text,
      },
      ...getUserPosts(),
    ]);
    dialog.close();
    const onCommunity = location.pathname.replace(/\/$/, '') === '/comunidade';
    toast('Publicado na comunidade 💜', onCommunity ? undefined : { label: 'Ver', href: '/comunidade' });
  });
}
