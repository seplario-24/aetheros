import { store } from '../js/store/db.js';
import { renderDotCalendarView } from '../js/views/dot-calendar.js';

console.log('--- 1. Testing Store Seed & Historical Backfill ---');
const state = store.getState();
console.log('Focus sessions count:', state.focusSessions.length);
console.log('Tasks count:', state.tasks.length);
console.log('Habit records count:', state.habitRecords.length);

const earliestSession = state.focusSessions.reduce((min, s) => {
  return !min || s.startTime < min ? s.startTime : min;
}, null);
console.log('Earliest session timestamp:', earliestSession);

const latestSession = state.focusSessions.reduce((max, s) => {
  return !max || s.startTime > max ? s.startTime : max;
}, null);
console.log('Latest session timestamp:', latestSession);

if (!earliestSession || !earliestSession.startsWith('2026-01-')) {
  throw new Error('Seed data does not start in January 2026!');
}

console.log('\n--- 2. Testing Systematic 2026 Dot Calendar View Rendering ---');
const mockContainer = {
  innerHTML: '',
  querySelectorAll(selector) {
    // Basic mock for data attributes
    return [];
  },
  querySelector(selector) {
    return null;
  }
};

renderDotCalendarView(mockContainer, () => {});
const html = mockContainer.innerHTML;

console.log('Rendered HTML size:', html.length, 'characters');

// Assertions
const checks = [
  { name: 'Contains Year 2026 Matrix title', passed: html.includes('Year 2026 Matrix') },
  { name: 'Contains 105 Days Left in 2026', passed: html.includes('105') && html.includes('Days Left in 2026') },
  { name: 'Contains 71.2% Year Completed', passed: html.includes('71.2%') && html.includes('Year Completed') },
  { name: 'Contains 365 Days Total badge', passed: html.includes('365 Days Total') },
  { name: 'Contains 53 Weeks in header', passed: html.includes('53 Weeks') },
  { name: 'Contains today-dot beacon', passed: html.includes('today-dot') },
  { name: 'Contains future-dot upcoming indicators', passed: html.includes('future-dot') },
  { name: 'Contains spacer-dot for week alignment', passed: html.includes('spacer-dot') },
  { name: 'Contains Month labels Jan through Dec', passed: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].every(m => html.toUpperCase().includes(m)) },
  { name: 'Contains Day Inspector modal', passed: html.includes('day-inspector-modal') }
];

let allPassed = true;
for (const c of checks) {
  console.log(`[${c.passed ? 'PASS' : 'FAIL'}] ${c.name}`);
  if (!c.passed) allPassed = false;
}

if (!allPassed) {
  console.error('\nOne or more verification checks failed!');
  process.exit(1);
}

console.log('\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!');
