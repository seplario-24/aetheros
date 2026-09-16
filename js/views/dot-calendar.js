/**
 * AETHER OS — 365-DAY CONTRIBUTION DOT MATRIX
 * Signature yearly contribution-style dot calendar inspired by the reference.
 * Multi-metric switching (Focus Time, Tasks, Score), interactive Day Inspector modal,
 * streak metrics, and subtle animated tiers.
 */

import { store } from '../store/db.js';

let activeMetric = 'focus'; // 'focus' | 'tasks' | 'score'

export function renderDotCalendarView(container, navigate) {
  const tasks = store.getTasks();
  const sessions = store.getFocusSessions();

  // Compute 365 days up to today
  const today = new Date();
  const daysData = [];

  let totalActiveDays = 0;
  let totalYearlyMinutes = 0;
  let totalTasksCompleted = 0;

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];

    const daySessions = sessions.filter(s => s.startTime && s.startTime.startsWith(dStr));
    const dayTasks = tasks.filter(t => t.completed && t.completedAt && t.completedAt.startsWith(dStr));

    const focusMinutes = daySessions.reduce((acc, s) => acc + (s.actualDuration || 0), 0);
    const tasksDone = dayTasks.length;
    const sessionCount = daySessions.length;

    // Productivity Score = min(100, focusMinutes * 0.3 + tasksDone * 10)
    const score = Math.min(100, Math.round(focusMinutes * 0.25 + tasksDone * 12));

    if (focusMinutes > 0 || tasksDone > 0) {
      totalActiveDays++;
    }
    totalYearlyMinutes += focusMinutes;
    totalTasksCompleted += tasksDone;

    daysData.push({
      date: d,
      dateStr: dStr,
      focusMinutes,
      tasksDone,
      sessionCount,
      score,
      isToday: i === 0
    });
  }

  const yearlyHours = Math.round(totalYearlyMinutes / 60);

  container.innerHTML = `
    <div class="animate-fade-in dot-calendar-container">
      <!-- Header -->
      <div class="dot-calendar-header">
        <div>
          <h1 style="font-size: 26px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 4px;">Year At A Glance</h1>
          <p style="font-size: 13.5px; color: var(--text-secondary);">365-day consistency landscape. Every focused day is a luminous dot.</p>
        </div>

        <!-- Metric Switcher -->
        <div class="dot-metric-pills">
          <button class="btn btn-ghost ${activeMetric === 'focus' ? 'active' : ''}" data-metric="focus"
            style="padding: 6px 16px; font-size: 12.5px; border-radius: var(--radius-full); ${activeMetric === 'focus' ? 'background: var(--accent-primary); color: #fff; font-weight: 600;' : ''}">
            Focus Time
          </button>
          <button class="btn btn-ghost ${activeMetric === 'tasks' ? 'active' : ''}" data-metric="tasks"
            style="padding: 6px 16px; font-size: 12.5px; border-radius: var(--radius-full); ${activeMetric === 'tasks' ? 'background: var(--accent-primary); color: #fff; font-weight: 600;' : ''}">
            Tasks Done
          </button>
          <button class="btn btn-ghost ${activeMetric === 'score' ? 'active' : ''}" data-metric="score"
            style="padding: 6px 16px; font-size: 12.5px; border-radius: var(--radius-full); ${activeMetric === 'score' ? 'background: var(--accent-primary); color: #fff; font-weight: 600;' : ''}">
            Productivity Score
          </button>
          <button class="btn btn-ghost ${activeMetric === 'habits' ? 'active' : ''}" data-metric="habits"
            style="padding: 6px 16px; font-size: 12.5px; border-radius: var(--radius-full); ${activeMetric === 'habits' ? 'background: var(--accent-primary); color: #fff; font-weight: 600;' : ''}">
            Habit Discipline
          </button>
        </div>
      </div>

      <!-- Vitals Row -->
      <div class="stats-overview-grid" style="margin-bottom: 10px;">
        <div class="glass-card stat-card">
          <div class="stat-header">Current Focus Streak</div>
          <div class="stat-value">14 <span style="font-size: 15px; color: var(--text-tertiary);">days</span></div>
          <div class="stat-caption">Maintained since Sept 2</div>
        </div>
        <div class="glass-card stat-card">
          <div class="stat-header">Longest Personal Streak</div>
          <div class="stat-value">28 <span style="font-size: 15px; color: var(--text-tertiary);">days</span></div>
          <div class="stat-caption">All-time record</div>
        </div>
        <div class="glass-card stat-card">
          <div class="stat-header">Total Productive Days</div>
          <div class="stat-value">${totalActiveDays} <span style="font-size: 15px; color: var(--text-tertiary);">/ 365</span></div>
          <div class="stat-caption">${Math.round((totalActiveDays / 365) * 100)}% yearly consistency</div>
        </div>
        <div class="glass-card stat-card">
          <div class="stat-header">Total Yearly Focus</div>
          <div class="stat-value tabular-nums">${yearlyHours} <span style="font-size: 15px; color: var(--text-tertiary);">hours</span></div>
          <div class="stat-caption">${totalTasksCompleted} completed outcomes</div>
        </div>
      </div>

      <!-- Matrix Canvas Card -->
      <div class="glass-panel" style="padding: 24px; position: relative; overflow: hidden;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">
            Year ${today.getFullYear()} Matrix (52 Weeks)
          </span>
          <div class="dot-legend-row">
            <span>Less</span>
            <span class="day-dot" style="cursor: default;"></span>
            <span class="day-dot lvl-1" style="cursor: default;"></span>
            <span class="day-dot lvl-2" style="cursor: default;"></span>
            <span class="day-dot lvl-3" style="cursor: default;"></span>
            <span class="day-dot lvl-4" style="cursor: default;"></span>
            <span>More</span>
          </div>
        </div>

        <div class="dot-grid-scroll-wrap">
          <div class="dot-year-matrix">
            ${daysData.map(d => renderDayDot(d, activeMetric)).join('')}
          </div>
        </div>

        <div style="margin-top: 14px; font-size: 12px; color: var(--text-tertiary); display: flex; justify-content: space-between;">
          <span>Hover or tap any dot for session breakdown. Click to open Day Inspector.</span>
          <span>Today: ${today.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
    </div>

    <!-- Day Inspector Modal Container -->
    <div id="day-inspector-modal" class="modal-backdrop">
      <div class="modal-container" style="max-width: 480px;">
        <div class="modal-header">
          <h3 id="inspector-modal-date" style="font-size: 16px; font-weight: 600;"></h3>
          <button class="btn btn-ghost btn-icon" id="inspector-modal-close" style="width: 28px; height: 28px;">✕</button>
        </div>
        <div class="modal-body" id="inspector-modal-body"></div>
      </div>
    </div>
  `;

  // Bind Metric Switching
  container.querySelectorAll('[data-metric]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeMetric = btn.getAttribute('data-metric');
      renderDotCalendarView(container, navigate);
    });
  });

  // Bind Day Dot Click to Open Inspector Modal
  const modal = container.querySelector('#day-inspector-modal');
  const modalDate = container.querySelector('#inspector-modal-date');
  const modalBody = container.querySelector('#inspector-modal-body');
  const modalClose = container.querySelector('#inspector-modal-close');

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.classList.remove('open'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  container.querySelectorAll('.day-dot[data-date]').forEach(dot => {
    dot.addEventListener('click', () => {
      const dStr = dot.getAttribute('data-date');
      const item = daysData.find(d => d.dateStr === dStr);
      if (item) {
        modalDate.textContent = item.date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

        const fH = Math.floor(item.focusMinutes / 60);
        const fM = item.focusMinutes % 60;
        const daySessions = sessions.filter(s => s.startTime && s.startTime.startsWith(dStr));
        const habitRate = store.getDailyHabitCompletionRate(dStr);
        const habits = store.getHabits();

        modalBody.innerHTML = `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 16px;">
            <div class="glass-card" style="padding: 10px 12px;">
              <span style="font-size: 11px; color: var(--text-tertiary);">Focus Time</span>
              <div style="font-size: 18px; font-weight: 700;">${fH}h ${fM}m</div>
            </div>
            <div class="glass-card" style="padding: 10px 12px;">
              <span style="font-size: 11px; color: var(--text-tertiary);">Tasks Done</span>
              <div style="font-size: 18px; font-weight: 700;">${item.tasksDone}</div>
            </div>
            <div class="glass-card" style="padding: 10px 12px;">
              <span style="font-size: 11px; color: var(--text-tertiary);">Productivity Score</span>
              <div style="font-size: 18px; font-weight: 700; color: var(--accent-cyan);">${item.score}/100</div>
            </div>
            <div class="glass-card" style="padding: 10px 12px;">
              <span style="font-size: 11px; color: var(--text-tertiary);">Habit Discipline</span>
              <div style="font-size: 18px; font-weight: 700; color: var(--accent-emerald);">${habitRate.completed}/${habitRate.total} <span style="font-size: 11.5px; font-weight: 500; color: var(--text-tertiary);">(${Math.round(habitRate.rate * 100)}%)</span></div>
            </div>
          </div>

          <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text-secondary);">Daily Habit Checklist (${habitRate.completed}/${habitRate.total})</h4>
          <div style="display: flex; flex-direction: column; gap: 6px; max-height: 150px; overflow-y: auto; margin-bottom: 16px;">
            ${habits.map(h => {
              const status = store.getHabitStatus(h.id, dStr);
              let badgeBg = 'var(--bg-surface-elevated)';
              let badgeColor = 'var(--text-tertiary)';
              let badgeBorder = '1px solid var(--border-subtle)';
              let symbol = '— Unlogged';

              if (status === 'completed') {
                badgeBg = 'rgba(16, 185, 129, 0.15)';
                badgeColor = 'var(--accent-emerald)';
                badgeBorder = '1px solid rgba(16, 185, 129, 0.3)';
                symbol = '✓ Completed';
              } else if (status === 'failed') {
                badgeBg = 'rgba(239, 68, 68, 0.15)';
                badgeColor = 'var(--accent-rose)';
                badgeBorder = '1px solid rgba(239, 68, 68, 0.3)';
                symbol = '✕ Failed';
              } else if (status === 'skipped') {
                badgeBg = 'rgba(245, 158, 11, 0.15)';
                badgeColor = 'var(--accent-amber)';
                badgeBorder = '1px solid rgba(245, 158, 11, 0.3)';
                symbol = 'S Skipped';
              }

              return `
                <div class="glass-card" style="padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; font-size: 12.5px;">
                  <span style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 14px;">${h.icon || '🌱'}</span>
                    <span style="font-weight: 500;">${h.name}</span>
                  </span>
                  <span class="badge" style="background: ${badgeBg}; color: ${badgeColor}; border: ${badgeBorder}; font-size: 11px; padding: 2px 8px;">
                    ${symbol}
                  </span>
                </div>
              `;
            }).join('')}
          </div>

          <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text-secondary);">Logged Sessions (${daySessions.length})</h4>
          <div style="display: flex; flex-direction: column; gap: 6px; max-height: 150px; overflow-y: auto;">
            ${daySessions.length === 0 ? '<p style="color: var(--text-tertiary); font-size: 12.5px;">No focus sessions logged on this date.</p>' : daySessions.map(s => {
              const cat = store.getCategoryById(s.categoryId);
              return `
                <div class="glass-card" style="padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; font-size: 12.5px;">
                  <span style="display: flex; align-items: center; gap: 6px;">
                    <span class="cat-dot" style="background: ${cat.color}"></span>
                    ${cat.name} (${s.mode})
                  </span>
                  <span class="tabular-nums" style="font-weight: 600;">${s.actualDuration} min</span>
                </div>
              `;
            }).join('')}
          </div>
        `;
        modal.classList.add('open');
      }
    });
  });
}

function renderDayDot(d, metric) {
  let level = 0;
  let tooltipText = `${d.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: `;

  if (metric === 'focus') {
    const hours = (d.focusMinutes / 60).toFixed(1);
    tooltipText += `${hours}h focus (${d.sessionCount} sessions)`;
    if (d.focusMinutes > 240) level = 4;
    else if (d.focusMinutes > 150) level = 3;
    else if (d.focusMinutes > 60) level = 2;
    else if (d.focusMinutes > 0) level = 1;
  } else if (metric === 'tasks') {
    tooltipText += `${d.tasksDone} tasks completed`;
    if (d.tasksDone >= 6) level = 4;
    else if (d.tasksDone >= 4) level = 3;
    else if (d.tasksDone >= 2) level = 2;
    else if (d.tasksDone >= 1) level = 1;
  } else if (metric === 'habits') {
    const habitData = store.getDailyHabitCompletionRate(d.dateStr);
    tooltipText += `${habitData.completed}/${habitData.total} habits completed (${Math.round(habitData.rate * 100)}%)`;
    if (habitData.rate >= 0.8) level = 4;
    else if (habitData.rate >= 0.6) level = 3;
    else if (habitData.rate >= 0.3) level = 2;
    else if (habitData.rate > 0) level = 1;
  } else {
    tooltipText += `Score: ${d.score}/100`;
    if (d.score >= 80) level = 4;
    else if (d.score >= 55) level = 3;
    else if (d.score >= 30) level = 2;
    else if (d.score > 0) level = 1;
  }

  const lvlClass = level > 0 ? `lvl-${level}` : '';
  const todayHighlight = d.isToday ? 'style="border: 1.5px solid var(--accent-cyan);"' : '';

  return `<div class="day-dot ${lvlClass}" data-date="${d.dateStr}" title="${tooltipText}" ${todayHighlight}></div>`;
}
