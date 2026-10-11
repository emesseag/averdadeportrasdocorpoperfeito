/** Sino de notificações: estado de leitura e ponto indicador. */
import { getMoodToday, getReadNotifications, setReadNotifications } from './state';
import { onChange } from './store';

function render(): void {
  const read = new Set(getReadNotifications());
  const moodDone = Boolean(getMoodToday());
  let unread = 0;
  document.querySelectorAll<HTMLElement>('[data-notif]').forEach((item) => {
    const id = item.dataset.notif ?? '';
    const hidden = id === 'n-humor' && moodDone;
    item.hidden = hidden;
    const isUnread = !read.has(id) && !hidden;
    item.dataset.unread = String(isUnread);
    if (isUnread) unread += 1;
  });
  document.querySelectorAll<HTMLElement>('[data-notif-dot]').forEach((dot) => (dot.hidden = unread === 0));
  document
    .querySelectorAll<HTMLElement>('[data-notif-empty]')
    .forEach((el) => (el.hidden = document.querySelectorAll('[data-notif]:not([hidden])').length > 0));
  document.querySelectorAll<HTMLElement>('[data-notif-bell]').forEach((btn) => {
    btn.setAttribute('aria-label', unread > 0 ? `Notificações (${unread} novas)` : 'Notificações');
  });
}

export function initNotifications(): void {
  render();
  onChange(['notifRead', 'moods'], render);

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const item = target.closest<HTMLElement>('[data-notif]');
    if (item?.dataset.notif) {
      setReadNotifications([...new Set([...getReadNotifications(), item.dataset.notif])]);
      return;
    }
    if (target.closest('[data-notif-readall]')) {
      const ids = Array.from(document.querySelectorAll<HTMLElement>('[data-notif]')).map((el) => el.dataset.notif ?? '');
      setReadNotifications(ids);
    }
  });
}
