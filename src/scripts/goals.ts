/** Metas pessoais: criar, concluir e remover. */
import { getGoals, setGoals } from './state';
import { onChange, uid } from './store';
import { icons } from './icons';

const COMPACT_LIMIT = 4;

function render(root: HTMLElement): void {
  const list = root.querySelector<HTMLElement>('[data-goals-list]');
  const summary = root.querySelector<HTMLElement>('[data-goals-summary]');
  const empty = root.querySelector<HTMLElement>('[data-goals-empty]');
  const more = root.querySelector<HTMLElement>('[data-goals-more]');
  if (!list) return;

  const goals = getGoals();
  const compact = root.dataset.compact === 'true';
  const sorted = compact ? [...goals].sort((a, b) => Number(a.done) - Number(b.done)) : goals;
  const visible = compact ? sorted.slice(0, COMPACT_LIMIT) : sorted;

  list.replaceChildren(
    ...visible.map((goal) => {
      const li = document.createElement('li');
      li.className = 'goal';
      const label = document.createElement('label');
      label.className = 'check';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = goal.done;
      input.dataset.toggle = goal.id;
      const box = document.createElement('span');
      box.className = 'check__box';
      box.innerHTML = icons.check(16);
      const text = document.createElement('span');
      text.className = 'check__text';
      text.textContent = goal.text;
      label.append(input, box, text);
      li.append(label);
      if (!compact) {
        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'icon-btn icon-btn--sm icon-btn--danger';
        del.dataset.remove = goal.id;
        del.setAttribute('aria-label', `Remover meta: ${goal.text}`);
        del.innerHTML = icons.trash(16);
        li.append(del);
      }
      return li;
    }),
  );

  const done = goals.filter((g) => g.done).length;
  if (summary) {
    summary.textContent =
      goals.length === 0 ? '' : `${done} de ${goals.length} ${goals.length === 1 ? 'meta concluída' : 'metas concluídas'}`;
  }
  if (empty) empty.hidden = goals.length > 0;
  if (more) more.hidden = !compact || goals.length <= COMPACT_LIMIT;
}

export function initGoals(): void {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-goals]'));
  if (roots.length === 0) return;
  const refresh = () => {
    const focused = (document.activeElement as HTMLElement | null)?.dataset.toggle;
    roots.forEach(render);
    if (focused) document.querySelector<HTMLElement>(`[data-toggle="${focused}"]`)?.focus();
  };
  refresh();
  onChange(['goals'], refresh);

  roots.forEach((root) => {
    const form = root.querySelector<HTMLFormElement>('form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.elements.namedItem('text') as HTMLInputElement;
      const text = input.value.trim();
      if (!text) return;
      setGoals([...getGoals(), { id: uid('goal'), text, done: false }]);
      input.value = '';
      input.focus();
    });

    root.addEventListener('change', (e) => {
      const input = (e.target as HTMLElement).closest<HTMLInputElement>('[data-toggle]');
      if (!input) return;
      setGoals(getGoals().map((g) => (g.id === input.dataset.toggle ? { ...g, done: input.checked } : g)));
    });

    root.addEventListener('click', (e) => {
      const del = (e.target as HTMLElement).closest<HTMLElement>('[data-remove]');
      if (del) setGoals(getGoals().filter((g) => g.id !== del.dataset.remove));
    });
  });
}
