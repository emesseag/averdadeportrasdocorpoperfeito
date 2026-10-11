/** Ponto de entrada: inicializa os comportamentos presentes na página. */
import { initDialogs, initDropdowns, initReveal, initUser } from './ui';
import { initShare } from './share';
import { initFeeds } from './feed';
import { initMood } from './mood';
import { initGratitude } from './gratitude';
import { initGoals } from './goals';
import { initChallenges } from './challenges';
import { initReminders } from './reminders';
import { initNotifications } from './notifications';
import { initSearch } from './search';
import { initAuth } from './auth';
import { initContentFilters } from './contents';

const steps = [
  initAuth,
  initReveal,
  initDialogs,
  initDropdowns,
  initUser,
  initShare,
  initFeeds,
  initMood,
  initGratitude,
  initGoals,
  initChallenges,
  initReminders,
  initNotifications,
  initSearch,
  initContentFilters,
];

for (const step of steps) {
  try {
    step();
  } catch (error) {
    console.error(`[init] ${step.name}`, error);
  }
}
