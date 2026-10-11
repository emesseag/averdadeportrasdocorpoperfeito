/** Registro de gratidão. */
import { getGratitude, setGratitude } from './state';
import { onChange, todayKey, uid } from './store';
import { shortDateTime } from '../utils/format';
import { icons } from './icons';

function render(root: HTMLElement): void {
  const list = root.querySelector<HTMLElement>('[data-gratitude-list]');
  const empty = root.querySelector<HTMLElement>('[data-gratitude-empty]');
  if (!list) return;
  const todayOnly = root.dataset.scope === 'today';
  const limit = Number(root.dataset.limit ?? 0);
  let entries = getGratitude().sort((a, b) => b.ts - a.ts);
  if (todayOnly) entries = entries.filter((e) => todayKey(new Date(e.ts)) === todayKey());
  if (limit > 0) entries = entries.slice(0, limit);

  list.replaceChildren(
    ...entries.map((entry) => {
      const li = document.createElement('li');
      li.className = 'entry';
      li.dataset.id = entry.id;
      li.insertAdjacentHTML('afterbegin', icons.heart(18));
      const body = document.createElement('div');
      body.className = 'entry__body';
      body.append(entry.text);
      const when = document.createElement('small');
      when.textContent = shortDateTime(entry.ts);
      body.append(when);
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'icon-btn icon-btn--sm icon-btn--danger';
      del.dataset.delete = entry.id;
      del.setAttribute('aria-label', 'Remover gratidão');
      del.innerHTML = icons.trash(16);
      li.append(body, del);
      return li;
    }),
  );
  if (empty) empty.hidden = entries.length > 0;
}

export function initGratitude(): void {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-gratitude]'));
  if (roots.length === 0) return;
  const refresh = () => roots.forEach(render);
  refresh();
  onChange(['gratitude'], refresh);

  roots.forEach((root) => {
    const form = root.querySelector<HTMLFormElement>('form');
    const field = form?.elements.namedItem('text') as HTMLInputElement | HTMLTextAreaElement | null;

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = field?.value.trim();
      if (!text || !field) return;
      setGratitude([{ id: uid('g'), text, ts: Date.now() }, ...getGratitude()]);
      field.value = '';
      const status = root.querySelector<HTMLElement>('[data-gratitude-status]');
      if (status) status.textContent = 'Gratidão registrada 💜';
    });

    root.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const prompt = target.closest<HTMLElement>('[data-prompt]');
      if (prompt && field) {
        field.value = `${prompt.dataset.prompt} `;
        field.focus();
        return;
      }
      const del = target.closest<HTMLElement>('[data-delete]');
      if (del) setGratitude(getGratitude().filter((g) => g.id !== del.dataset.delete));
    });
  });
}
