/** Busca simples por título, categoria e texto (conteúdos, desafios, recursos e comunidade). */
import { posts as mockPosts } from '../data/posts';
import { challenges } from '../data/challenges';
import { postCategories } from '../data/categories';
import { getUserPosts } from './state';
import { normalize } from '../utils/format';

interface Item {
  group: string;
  title: string;
  text: string;
  href: string;
}

const MAX_RESULTS = 12;

function readStaticItems(): Item[] {
  const el = document.getElementById('search-data');
  if (!el?.textContent) return [];
  try {
    return JSON.parse(el.textContent) as Item[];
  } catch {
    return [];
  }
}

function buildIndex(): Item[] {
  const catLabel = (id: string) => postCategories.find((c) => c.id === id)?.label ?? '';
  const mine = getUserPosts().map((p) => ({
    group: 'Comunidade',
    title: p.text.length > 70 ? `${p.text.slice(0, 67)}…` : p.text,
    text: `${p.author.username} ${catLabel(p.category)} ${p.text}`,
    href: `/comunidade#post-${p.id}`,
  }));
  const posts = mockPosts.map((p) => ({
    group: 'Comunidade',
    title: p.text.length > 70 ? `${p.text.slice(0, 67)}…` : p.text,
    text: `${p.author.username} ${catLabel(p.category)} ${p.text}`,
    href: `/comunidade#post-${p.id}`,
  }));
  const ch = challenges.map((c) => ({
    group: 'Desafios',
    title: c.title,
    text: c.description,
    href: `/desafios#desafio-${c.id}`,
  }));
  return [...readStaticItems(), ...ch, ...mine, ...posts];
}

export function initSearch(): void {
  const dialog = document.getElementById('search-dialog') as HTMLDialogElement | null;
  const input = document.getElementById('search-input') as HTMLInputElement | null;
  const results = document.getElementById('search-results');
  const status = document.getElementById('search-status');
  if (!dialog || !input || !results || !status) return;

  let index: Item[] = [];

  const run = () => {
    const query = normalize(input.value.trim());
    if (query.length < 2) {
      results.replaceChildren();
      status.textContent = 'Digite ao menos 2 letras para buscar.';
      return;
    }
    const terms = query.split(/\s+/);
    const scored = index
      .map((item) => {
        const title = normalize(item.title);
        const haystack = `${title} ${normalize(item.text)}`;
        if (!terms.every((t) => haystack.includes(t))) return null;
        return { item, score: terms.every((t) => title.includes(t)) ? 0 : 1 };
      })
      .filter((x): x is { item: Item; score: number } => x !== null)
      .sort((a, b) => a.score - b.score)
      .slice(0, MAX_RESULTS);

    if (scored.length === 0) {
      results.replaceChildren();
      status.textContent = 'Nada encontrado. Tente outra palavra.';
      return;
    }
    status.textContent = `${scored.length} ${scored.length === 1 ? 'resultado' : 'resultados'}`;

    const nodes: HTMLElement[] = [];
    let lastGroup = '';
    for (const { item } of scored) {
      if (item.group !== lastGroup) {
        const heading = document.createElement('li');
        heading.className = 'search-group';
        heading.setAttribute('aria-hidden', 'true');
        heading.textContent = item.group;
        nodes.push(heading);
        lastGroup = item.group;
      }
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'search-result';
      a.href = item.href;
      const title = document.createElement('strong');
      title.textContent = item.title;
      const text = document.createElement('small');
      text.textContent = `${item.group} · ${item.text}`;
      a.append(title, text);
      li.append(a);
      nodes.push(li);
    }
    results.replaceChildren(...nodes);
  };

  dialog.addEventListener('dialog:open', () => {
    index = buildIndex();
    input.value = '';
    run();
    input.focus();
  });
  input.addEventListener('input', run);
  results.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) dialog.close();
  });
}
