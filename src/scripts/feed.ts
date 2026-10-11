/** Feed de publicações: renderização, filtros, curtidas, comentários e exclusão (perfil). */
import { posts as mockPosts, type PostComment } from '../data/posts';
import { postCategories } from '../data/categories';
import {
  getComments,
  getLikes,
  getCurrentUser,
  getProfile,
  getUserPosts,
  setComments,
  setLikes,
  setUserPosts,
} from './state';
import { onChange, uid } from './store';
import { ago, initials, tintFor } from '../utils/format';
import { observeReveal, toast } from './ui';
import { icons } from './icons';

interface ViewPost {
  id: string;
  name: string;
  username: string;
  time: string;
  category: string;
  text: string;
  baseLikes: number;
  seedComments: PostComment[];
  own: boolean;
}

function allPosts(): ViewPost[] {
  const me = getCurrentUser()?.id;
  const mine: ViewPost[] = getUserPosts()
    .sort((a, b) => b.ts - a.ts)
    .map((p) => ({
      id: p.id,
      name: p.author.name,
      username: p.author.username,
      time: ago(p.ts),
      category: p.category,
      text: p.text,
      baseLikes: 0,
      seedComments: [],
      own: p.userId === me,
    }));
  const seeds: ViewPost[] = mockPosts.map((p) => ({
    id: p.id,
    name: p.author.name,
    username: p.author.username,
    time: p.time,
    category: p.category,
    text: p.text,
    baseLikes: p.likes,
    seedComments: p.comments,
    own: false,
  }));
  return [...mine, ...seeds];
}

const categoryOf = (id: string) => postCategories.find((c) => c.id === id) ?? postCategories[0];

function selectPosts(feed: HTMLElement): ViewPost[] {
  const filter = feed.dataset.filter ?? 'todos';
  const limit = Number(feed.dataset.limit ?? 0);
  let list = allPosts();
  if (feed.dataset.owner === 'me') list = list.filter((p) => p.own);
  if (filter !== 'todos') list = list.filter((p) => p.category === filter);
  return limit > 0 ? list.slice(0, limit) : list;
}

function commentsFor(post: ViewPost) {
  const stored = getComments()[post.id] ?? [];
  return [
    ...post.seedComments.map((c) => ({ author: c.author, text: c.text, time: c.time })),
    ...stored.map((c) => ({ author: c.author, text: c.text, time: ago(c.ts) })),
  ];
}

function buildCard(post: ViewPost): HTMLElement | null {
  const tpl = document.getElementById('post-template') as HTMLTemplateElement | null;
  const card = tpl?.content.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
  if (!card) return null;
  const cat = categoryOf(post.category);

  card.id = `post-${post.id}`;
  card.dataset.postId = post.id;
  card.dataset.category = post.category;
  card.className = card.className.replace(/\btint-\w+/, `tint-${cat.tint}`);

  const avatar = card.querySelector<HTMLElement>('.avatar');
  if (avatar) {
    avatar.textContent = initials(post.name);
    avatar.className = avatar.className.replace(/\btint-\w+/, `tint-${tintFor(post.username)}`);
  }
  card.querySelector('.post-card__name')!.textContent = post.username;
  card.querySelector('.post-card__time')!.textContent = post.time;
  card.querySelector('.post-card__cat')!.textContent = cat.label;
  card.querySelector('.post-card__text')!.textContent = post.text;
  card.querySelector('[data-like]')?.setAttribute('aria-label', `Curtir publicação de ${post.username}`);
  card.querySelector('[data-comment-toggle]')?.setAttribute('aria-controls', `comments-${post.id}`);
  const panel = card.querySelector<HTMLElement>('[data-comments]');
  if (panel) panel.id = `comments-${post.id}`;
  return card;
}

function renderComments(card: HTMLElement, post: ViewPost): void {
  const list = card.querySelector<HTMLElement>('[data-comment-list]');
  if (!list) return;
  const comments = commentsFor(post);
  list.replaceChildren(
    ...comments.map((c) => {
      const li = document.createElement('li');
      const who = document.createElement('strong');
      who.textContent = c.author;
      const when = document.createElement('small');
      when.textContent = ` · ${c.time}`;
      li.append(who, ' ', c.text, when);
      return li;
    }),
  );
  const count = card.querySelector('[data-comment-count]');
  if (count) count.textContent = comments.length > 0 ? `(${comments.length})` : '';
}

function hydrateCard(card: HTMLElement, post: ViewPost, feed: HTMLElement): void {
  const liked = getLikes().includes(post.id);
  const like = card.querySelector<HTMLElement>('[data-like]');
  like?.setAttribute('aria-pressed', String(liked));
  const count = card.querySelector('[data-like-count]');
  if (count) count.textContent = String(post.baseLikes + (liked ? 1 : 0));
  renderComments(card, post);

  if (feed.dataset.owner === 'me' && !card.querySelector('[data-delete]')) {
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'icon-btn icon-btn--sm icon-btn--danger';
    del.dataset.delete = '';
    del.setAttribute('aria-label', 'Excluir publicação');
    del.innerHTML = icons.trash(18);
    card.querySelector('.post-card__foot')?.append(del);
  }
}

function renderFeed(feed: HTMLElement): void {
  const list = selectPosts(feed);
  const currentIds = Array.from(feed.querySelectorAll<HTMLElement>(':scope > [data-post-id]'))
    .map((el) => el.dataset.postId)
    .join(',');

  if (currentIds !== list.map((p) => p.id).join(',')) {
    const cards = list.map(buildCard).filter((c): c is HTMLElement => c !== null);
    cards.forEach((card, i) => {
      card.setAttribute('data-reveal', '');
      card.style.setProperty('--i', String(Math.min(i, 8)));
    });
    feed.replaceChildren(...cards);
    observeReveal(feed);
  }

  const empty = document.querySelector<HTMLElement>(`[data-feed-empty="${feed.id}"]`);
  if (empty) empty.hidden = list.length > 0;

  list.forEach((post) => {
    const card = feed.querySelector<HTMLElement>(`[data-post-id="${post.id}"]`);
    if (card) hydrateCard(card, post, feed);
  });
}

export function initFeeds(): void {
  const feeds = Array.from(document.querySelectorAll<HTMLElement>('[data-feed]'));
  if (feeds.length === 0) return;
  const refresh = () => feeds.forEach(renderFeed);
  refresh();

  if (location.hash.startsWith('#post-')) {
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'center' });
  }

  onChange(['posts', 'likes', 'comments', 'users', 'session'], refresh);

  // Filtros
  document.querySelectorAll<HTMLElement>('[data-feed-filters]').forEach((group) => {
    const feed = document.getElementById(group.dataset.feedFilters ?? '');
    if (!feed) return;
    group.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-filter]');
      if (!btn) return;
      group.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      feed.dataset.filter = btn.dataset.filter;
      renderFeed(feed);
    });
  });

  // Interações dentro dos cards
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const card = target.closest<HTMLElement>('.post-card[data-post-id]');
    if (!card) return;
    const id = card.dataset.postId!;

    if (target.closest('[data-like]')) {
      const likes = getLikes();
      setLikes(likes.includes(id) ? likes.filter((l) => l !== id) : [...likes, id]);
      return;
    }

    const toggle = target.closest<HTMLElement>('[data-comment-toggle]');
    if (toggle) {
      const panel = card.querySelector<HTMLElement>('[data-comments]');
      if (!panel) return;
      const open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) panel.querySelector<HTMLInputElement>('input')?.focus();
      return;
    }

    if (target.closest('[data-delete]')) {
      setUserPosts(getUserPosts().filter((p) => p.id !== id));
      toast('Publicação excluída.');
    }
  });

  document.addEventListener('submit', (e) => {
    const form = (e.target as HTMLElement).closest<HTMLFormElement>('[data-comment-form]');
    if (!form) return;
    e.preventDefault();
    const card = form.closest<HTMLElement>('.post-card[data-post-id]');
    const input = form.elements.namedItem('text') as HTMLInputElement | null;
    const text = input?.value.trim();
    if (!card || !input || !text) return;
    const id = card.dataset.postId!;
    const map = getComments();
    map[id] = [...(map[id] ?? []), { id: uid('c'), author: getProfile().username, text, ts: Date.now() }];
    setComments(map);
    input.value = '';
    input.focus();
  });
}
