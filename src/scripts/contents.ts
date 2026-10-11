/** Filtros da biblioteca de conteúdos (categorias + Espaço masculino), com suporte a ?categoria= e ?espaco=masculino. */
export function initContentFilters(): void {
  const group = document.querySelector<HTMLElement>('[data-content-filters]');
  const grid = document.getElementById('content-grid');
  if (!group || !grid) return;

  const empty = document.querySelector<HTMLElement>('[data-content-empty]');
  const notice = document.querySelector<HTMLElement>('[data-male-notice]');
  const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const validFilters = buttons.map((b) => b.dataset.filter);

  const apply = (filter: string) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    let visible = 0;
    grid.querySelectorAll<HTMLElement>('.content-card').forEach((card) => {
      const match =
        filter === 'todos' ||
        (filter === 'masculino' ? card.dataset.masculine === 'true' : card.dataset.category === filter);
      card.hidden = !match;
      if (match) visible += 1;
    });
    if (empty) empty.hidden = visible > 0;
    if (notice) notice.hidden = filter !== 'masculino';
  };

  const params = new URLSearchParams(location.search);
  const initial = params.get('espaco') === 'masculino' ? 'masculino' : (params.get('categoria') ?? 'todos');
  apply(validFilters.includes(initial) ? initial : 'todos');

  group.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-filter]');
    if (!btn?.dataset.filter) return;
    apply(btn.dataset.filter);
    const url = new URL(location.href);
    url.search = '';
    if (btn.dataset.filter === 'masculino') url.searchParams.set('espaco', 'masculino');
    else if (btn.dataset.filter !== 'todos') url.searchParams.set('categoria', btn.dataset.filter);
    history.replaceState(null, '', url);
  });
}
