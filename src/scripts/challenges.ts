/** Desafios: aceitar, registrar etapas, concluir e refazer. Sem pontos, ranking ou competição. */
import { challenges, statusLabels, type Challenge, type ChallengeState } from '../data/challenges';
import { getChallengeState, setChallengeState } from './state';
import { onChange } from './store';
import { openDialog, toast } from './ui';
import { icons } from './icons';

const find = (id: string) => challenges.find((c) => c.id === id);

function actionLabel(c: Challenge, st: ChallengeState): string {
  if (st.status === 'disponivel') return 'Aceitar desafio';
  if (st.status === 'concluido') return 'Concluído 💜';
  if (c.needsText) return c.target > 1 ? 'Continuar desafio' : 'Escrever agora';
  return 'Marcar como concluído';
}

function renderCard(card: HTMLElement): void {
  const c = find(card.dataset.challenge ?? '');
  if (!c) return;
  const st = getChallengeState(c.id);
  const pct = Math.round((st.progress / c.target) * 100);

  const pill = card.querySelector<HTMLElement>('[data-status-pill]');
  if (pill) {
    pill.dataset.status = st.status;
    pill.textContent = statusLabels[st.status];
  }
  card.dataset.status = st.status;

  const bar = card.querySelector<HTMLElement>('[data-progress]');
  bar?.setAttribute('aria-valuenow', String(st.progress));
  bar?.querySelector<HTMLElement>('.progress__bar')?.style.setProperty('--value', `${pct}%`);
  const count = card.querySelector('[data-count]');
  if (count) count.textContent = `${st.progress}/${c.target}`;

  const action = card.querySelector<HTMLButtonElement>('[data-action]');
  if (action) {
    action.textContent = actionLabel(c, st);
    action.disabled = st.status === 'concluido';
    action.classList.toggle('btn--done', st.status === 'concluido');
    action.classList.toggle('btn--primary', st.status !== 'concluido');
  }
  const reset = card.querySelector<HTMLElement>('[data-reset]');
  if (reset) reset.hidden = st.status === 'disponivel';

  const entries = card.querySelector<HTMLElement>('[data-entries]');
  if (entries) {
    entries.hidden = st.entries.length === 0;
    entries.replaceChildren(
      ...st.entries.map((text) => {
        const li = document.createElement('li');
        li.insertAdjacentHTML('afterbegin', icons.sparkles(16));
        li.append(text);
        return li;
      }),
    );
  }
}

function openEntryDialog(c: Challenge): void {
  const dialog = document.getElementById('challenge-dialog') as HTMLDialogElement | null;
  const form = document.getElementById('challenge-form') as HTMLFormElement | null;
  if (!dialog || !form) return;
  form.dataset.challengeId = c.id;
  const st = getChallengeState(c.id);
  dialog.querySelector('[data-dialog-title]')!.textContent = c.title;
  dialog.querySelector('[data-dialog-step]')!.textContent =
    c.target > 1 ? `Etapa ${Math.min(st.progress + 1, c.target)} de ${c.target}` : c.description;
  dialog.querySelector('[data-dialog-prompt]')!.textContent = c.prompt ?? 'Escreva aqui';
  (form.elements.namedItem('text') as HTMLInputElement).value = '';
  openDialog('challenge-dialog');
  (form.elements.namedItem('text') as HTMLInputElement).focus();
}

const celebrate = () => toast('Desafio concluído. Que orgulho de você 💜');

let statusFilter = 'todos';

/** Filtro por situação na página Desafios (aplica-se à grade "Outros desafios"). */
function applyStatusFilter(): void {
  const grid = document.querySelector<HTMLElement>('.challenge-grid');
  if (!grid) return;
  let visible = 0;
  grid.querySelectorAll<HTMLElement>('[data-challenge]').forEach((card) => {
    const match = statusFilter === 'todos' || card.dataset.status === statusFilter;
    card.hidden = !match;
    if (match) visible += 1;
  });
  const empty = document.querySelector<HTMLElement>('[data-challenge-empty]');
  if (empty) empty.hidden = visible > 0;
}

export function initChallenges(): void {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-challenge]'));
  const refresh = () => {
    document.querySelectorAll<HTMLElement>('[data-challenge]').forEach(renderCard);
    applyStatusFilter();
  };
  document.querySelector<HTMLElement>('[data-status-filters]')?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-status-filter]');
    if (!btn) return;
    statusFilter = btn.dataset.statusFilter ?? 'todos';
    document
      .querySelectorAll('[data-status-filter]')
      .forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    applyStatusFilter();
  });
  if (cards.length > 0) {
    refresh();
    onChange(['challenges'], refresh);
  }

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const card = target.closest<HTMLElement>('[data-challenge]');
    if (!card) return;
    const c = find(card.dataset.challenge ?? '');
    if (!c) return;
    const st = getChallengeState(c.id);

    if (target.closest('[data-reset]')) {
      setChallengeState(c.id, { status: 'disponivel', progress: 0, entries: [] });
      return;
    }
    if (!target.closest('[data-action]')) return;

    if (st.status === 'disponivel') {
      setChallengeState(c.id, { status: 'andamento', progress: 0, entries: [] });
      toast('Desafio aceito. Vá no seu ritmo 💜');
    } else if (st.status === 'andamento') {
      if (c.needsText) {
        openEntryDialog(c);
      } else {
        setChallengeState(c.id, { ...st, status: 'concluido', progress: c.target });
        celebrate();
      }
    }
  });

  const form = document.getElementById('challenge-form') as HTMLFormElement | null;
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const c = find(form.dataset.challengeId ?? '');
    const input = form.elements.namedItem('text') as HTMLInputElement;
    const text = input.value.trim();
    if (!c || !text) return;
    const st = getChallengeState(c.id);
    const entries = [...st.entries, text];
    const done = entries.length >= c.target;
    setChallengeState(c.id, {
      status: done ? 'concluido' : 'andamento',
      progress: Math.min(entries.length, c.target),
      entries,
    });
    (form.closest('dialog') as HTMLDialogElement | null)?.close();
    if (done) celebrate();
    else toast(`Registrado! Faltam ${c.target - entries.length} 💜`);
  });
}
