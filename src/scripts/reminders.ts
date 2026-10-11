/** Lembretes gentis (página Lembretes) e checklist do dia (Meu dia), mais a publicação de hoje. */
import { reminders } from '../data/reminders';
import {
  getCurrentUser,
  getEnabledReminders,
  getRemindersDone,
  getUserPosts,
  setEnabledReminders,
  setRemindersDone,
} from './state';
import { onChange, todayKey } from './store';
import { icons } from './icons';
import { longDate } from '../utils/format';

function renderToggles(): void {
  const enabled = getEnabledReminders();
  document.querySelectorAll<HTMLInputElement>('[data-reminder-toggle]').forEach((input) => {
    input.checked = enabled.includes(input.dataset.reminderToggle ?? '');
  });
}

function renderChecklist(): void {
  const list = document.querySelector<HTMLElement>('[data-day-reminders]');
  if (!list) return;
  const enabled = reminders.filter((r) => getEnabledReminders().includes(r.id));
  const done = getRemindersDone();
  const empty = document.querySelector<HTMLElement>('[data-day-reminders-empty]');
  if (empty) empty.hidden = enabled.length > 0;
  list.replaceChildren(
    ...enabled.map((r) => {
      const li = document.createElement('li');
      li.className = 'goal';
      const label = document.createElement('label');
      label.className = 'check';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = done.includes(r.id);
      input.dataset.reminderDone = r.id;
      const box = document.createElement('span');
      box.className = 'check__box';
      box.innerHTML = icons.check(16);
      const text = document.createElement('span');
      text.className = 'check__text';
      text.textContent = r.label;
      label.append(input, box, text);
      li.append(label);
      return li;
    }),
  );
}

function renderTodayPost(): void {
  const box = document.querySelector<HTMLElement>('[data-day-post]');
  if (!box) return;
  const me = getCurrentUser()?.id;
  const today = getUserPosts()
    .filter((p) => p.userId === me && todayKey(new Date(p.ts)) === todayKey())
    .sort((a, b) => b.ts - a.ts)[0];
  const text = box.querySelector<HTMLElement>('[data-day-post-text]');
  const cta = box.querySelector<HTMLElement>('[data-day-post-cta]');
  const link = box.querySelector<HTMLElement>('[data-day-post-link]');
  if (text) {
    text.textContent = today ? `“${today.text}”` : 'Você ainda não compartilhou nada hoje.';
    text.classList.toggle('text-muted', !today);
  }
  if (cta) cta.hidden = Boolean(today);
  if (link) link.hidden = !today;
}

export function initReminders(): void {
  document.querySelectorAll('[data-day-date]').forEach((el) => (el.textContent = longDate()));

  const render = () => {
    renderToggles();
    renderChecklist();
    renderTodayPost();
  };
  render();
  onChange(['remindersOn', 'remindersDone', 'posts'], render);

  document.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    const toggleId = target.dataset?.reminderToggle;
    if (toggleId) {
      const set = new Set(getEnabledReminders());
      if (target.checked) set.add(toggleId);
      else set.delete(toggleId);
      setEnabledReminders([...set]);
      return;
    }
    const doneId = target.dataset?.reminderDone;
    if (doneId) {
      const set = new Set(getRemindersDone());
      if (target.checked) set.add(doneId);
      else set.delete(doneId);
      setRemindersDone([...set]);
    }
  });
}
