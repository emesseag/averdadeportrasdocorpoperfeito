/** Check-in de humor, resumo em "Meu dia" e semana na página Humor. */
import { moods } from '../data/moods';
import { getMoods, getMoodToday, setMoodToday } from './state';
import { onChange, todayKey } from './store';

const labelOf = (id: string) => moods.find((m) => m.id === id)?.label ?? id;

function moodIcon(id: string): Node | null {
  const tpl = document.getElementById('mood-icons') as HTMLTemplateElement | null;
  return tpl?.content.querySelector(`[data-mood-icon="${id}"]`)?.cloneNode(true) ?? null;
}

function renderSelectors(): void {
  const today = getMoodToday();
  document.querySelectorAll<HTMLElement>('[data-mood]').forEach((root) => {
    root.querySelectorAll<HTMLElement>('[data-mood-id]').forEach((btn) =>
      btn.setAttribute('aria-pressed', String(btn.dataset.moodId === today)),
    );
    const status = root.querySelector<HTMLElement>('[data-mood-status]');
    if (!status) return;
    if (today) {
      status.dataset.state = 'done';
      status.textContent = `Humor registrado 💜 Hoje você está: ${labelOf(today)}.`;
    } else {
      status.dataset.state = 'idle';
      status.textContent = 'Escolha como você está. Leva só um segundo.';
    }
  });
}

function renderDaySummary(): void {
  const box = document.querySelector<HTMLElement>('[data-day-mood]');
  if (!box) return;
  const today = getMoodToday();
  if (!today) {
    const text = document.createElement('p');
    text.className = 'text-muted';
    text.append('Você ainda não registrou seu humor hoje.');
    box.replaceChildren(text);
    return;
  }
  const iconWrap = document.createElement('span');
  iconWrap.className = 'day-mood__icon';
  const icon = moodIcon(today);
  if (icon) iconWrap.append(icon);
  const text = document.createElement('div');
  const strong = document.createElement('strong');
  strong.textContent = labelOf(today);
  const small = document.createElement('p');
  small.className = 'text-muted';
  small.textContent = 'Humor registrado 💜';
  text.append(strong, small);
  box.replaceChildren(iconWrap, text);
}

function renderWeek(): void {
  const strip = document.querySelector<HTMLElement>('[data-week-strip]');
  if (!strip) return;
  const moodsByDay = getMoods();
  const items: HTMLElement[] = [];
  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = todayKey(date);
    const li = document.createElement('li');
    li.dataset.today = String(offset === 0);
    const weekday = document.createElement('span');
    weekday.textContent = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    li.append(weekday);
    const id = moodsByDay[key];
    const icon = id ? moodIcon(id) : null;
    if (icon) {
      li.append(icon);
      li.title = labelOf(id);
      const sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = labelOf(id);
      li.append(sr);
    } else {
      const dot = document.createElement('span');
      dot.className = 'empty-dot';
      const sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = 'Sem registro';
      li.append(dot, sr);
    }
    items.push(li);
  }
  strip.replaceChildren(...items);
}

export function initMood(): void {
  const render = () => {
    renderSelectors();
    renderDaySummary();
    renderWeek();
  };
  render();
  onChange(['moods'], render);

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-mood-id]');
    if (btn?.dataset.moodId) setMoodToday(btn.dataset.moodId);
  });
}
