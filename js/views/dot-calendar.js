/**
 * AETHER OS — 3D ELEMENTAL CONTRIBUTION LANDSCAPE
 * 365-day luminous activity terrain, multi-metric switching (Focus/Tasks/Score/Habits),
 * tactile day inspector dialog, and 3D terrain heights (translateZ).
 */

import { store } from '../store/db.js';

let activeMetric = 'focus'; // 'focus' | 'tasks' | 'score' | 'habits'

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

    // Productivity Score = min(100, focusMinutes * 0.25 + tasksDone * 12)
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
    <div class="animate-fade-in dot-calendar-container" style="perspective: 1200px;">
      <!-- Header -->
      <div class="dot-calendar-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--el-light);">Luminous Terrain</span>
          </div>
          <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 4px;">Year At A Glance</h1>
          <p style="font-size: 13.5px; color: var(--text-secondary);">365-day physical consistency landscape. Every focused day forms a glowing crystal tile.</p>
        </div>

        <!-- Metric Switcher Pills -->
        <div class="dot-metric-pills" style="display: flex; background: rgba(15, 23, 42, 0.4); padding: 4px; border-radius: var(--radius-full); border: 1px solid var(--border-glass); backdrop-filter: blur(12px);">
          <button class="btn btn-ghost ${activeMetric === 'focus' ? 'active' : ''}" data-metric="focus"
            style="padding: 6px 14px; font-size: 12px; border-radius: var(--radius-full); ${activeMetric === 'focus' ? 'background: var(--accent-primary); color: #fff; font-weight: 700; box-shadow: 0 2px 10px var(--accent-primary-glow);' : ''}">
            💧 Focus Time
          </button>
          <button class="btn btn-ghost ${activeMetric === 'tasks' ? 'active' : ''}" data-metric="tasks"
            style="padding: 6px 14px; font-size: 12px; border-radius: var(--radius-full); ${activeMetric === 'tasks' ? 'background: var(--accent-primary); color: #fff; font-weight: 700; box-shadow: 0 2px 10px var(--accent-primary-glow);' : ''}">
            💎 Outcomes
          </button>
          <button class="btn btn-ghost ${activeMetric === 'score' ? 'active' : ''}" data-metric="score"
            style="padding: 6px 14px; font-size: 12px; border-radius: var(--radius-full); ${activeMetric === 'score' ? 'background: var(--accent-primary); color: #fff; font-weight: 700; box-shadow: 0 2px 10px var(--accent-primary-glow);' : ''}">
            ⚡ Score Index
          </button>
          <button class="btn btn-ghost ${activeMetric === 'habits' ? 'active' : ''}" data-metric="habits"
            style="padding: 6px 14px; font-size: 12px; border-radius: var(--radius-full); ${activeMetric === 'habits' ? 'background: var(--accent-primary); color: #fff; font-weight: 700; box-shadow: 0 2px 10px var(--accent-primary-glow);' : ''}">
            🌿 Habits
          </button>
        </div>
      </div>

      <!-- 4 Elemental Floating Stat Cards -->
      <div class="stats-overview-grid" style="margin-bottom: 22px;">
        <!-- Fire Element: Current Streak -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-fire-glow); animation-delay: 0s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Active Focus Streak</div>
            <span style="font-size: 14px;">🔥</span>
          </div>
          <div class="stat-value" style="color: var(--accent-amber);">14 <span style="font-size: 15px; color: var(--text-tertiary);">days</span></div>
          <div class="stat-caption">Maintained uninterrupted flow</div>
        </div>

        <!-- Crystal Element: Longest Streak -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-crystal-glow); animation-delay: 0.15s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">All-Time Peak Record</div>
            <span style="font-size: 14px;">💎</span>
          </div>
          <div class="stat-value">28 <span style="font-size: 15px; color: var(--text-tertiary);">days</span></div>
          <div class="stat-caption">Personal consistency milestone</div>
        </div>

        <!-- Earth Element: Total Active Days -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-earth-glow); animation-delay: 0.3s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Active Harvest Days</div>
            <span style="font-size: 14px;">🌿</span>
          </div>
          <div class="stat-value">${totalActiveDays} <span style="font-size: 15px; color: var(--text-tertiary);">/ 365</span></div>
          <div class="stat-caption">${Math.round((totalActiveDays / 365) * 100)}% annual momentum</div>
        </div>

        <!-- Water Element: Total Focus Hours -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-water-glow); animation-delay: 0.45s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Total Yearly Volume</div>
            <span style="font-size: 14px;">💧</span>
          </div>
          <div class="stat-value tabular-nums">${yearlyHours} <span style="font-size: 15px; color: var(--text-tertiary);">hours</span></div>
          <div class="stat-caption">${totalTasksCompleted} completed outcomes</div>
        </div>
      </div>

      <!-- Matrix Canvas Card: 3D Landscape Canvas -->
      <div class="glass-panel" style="padding: 26px; position: relative; overflow: hidden; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 14px; font-weight: 700; color: #fff;">
              Year ${today.getFullYear()} Matrix (52 Weeks)
            </span>
          </div>
          <div class="dot-legend-row" style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-tertiary);">
            <span>Low</span>
            <span class="day-dot" style="cursor: default; width: 12px; height: 12px;"></span>
            <span class="day-dot lvl-1" style="cursor: default; width: 12px; height: 12px;"></span>
            <span class="day-dot lvl-2" style="cursor: default; width: 12px; height: 12px;"></span>
            <span class="day-dot lvl-3" style="cursor: default; width: 12px; height: 12px;"></span>
            <span class="day-dot lvl-4" style="cursor: default; width: 12px; height: 12px;"></span>
            <span>Intense</span>
          </div>
        </div>

        <div class="dot-grid-scroll-wrap" style="overflow-x: auto; padding-bottom: 12px;">
          <div class="dot-year-matrix" style="display: grid; grid-template-rows: repeat(7, 13px); grid-auto-flow: column; grid-auto-columns: 13px; gap: 4px; justify-content: start;">
            ${daysData.map(d => renderDayDot(d, activeMetric)).join('')}
          </div>
        </div>

        <div style="margin-top: 18px; font-size: 12px; color: var(--text-tertiary); display: flex; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
          <span>Hover any dot for instant breakdown. Click to open full Day Inspector.</span>
          <span style="font-family: var(--font-mono);">Today: ${today.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
    </div>

    <!-- Day Inspector Modal Container -->
    <div id="day-inspector-modal" class="modal-backdrop">
      <div class="modal-container" style="max-width: 520px; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(28px); border: 1px solid var(--border-glass);">
        <div class="modal-header">
          <h3 id="inspector-modal-date" style="font-size: 17px; font-weight: 700;"></h3>
          <button class="btn btn-ghost btn-icon" id="inspector-modal-close" style="width: 28px; height: 28px;">✕</button>
        </div>
        <div class="modal-body" id="inspector-modal-body" style="padding: 16px 0;"></div>
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
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 20px;">
            <div class="glass-card" style="padding: 12px 14px; border-bottom: 2px solid var(--accent-cyan);">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Focus Time</span>
              <div style="font-size: 20px; font-weight: 800; color: #fff; margin-top: 2px;">${fH}h ${fM}m</div>
            </div>
            <div class="glass-card" style="padding: 12px 14px; border-bottom: 2px solid var(--accent-primary);">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Outcomes Done</span>
              <div style="font-size: 20px; font-weight: 800; color: #fff; margin-top: 2px;">${item.tasksDone}</div>
            </div>
            <div class="glass-card" style="padding: 12px 14px; border-bottom: 2px solid var(--accent-amber);">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Productivity Index</span>
              <div style="font-size: 20px; font-weight: 800; color: var(--accent-amber); margin-top: 2px;">${item.score}/100</div>
            </div>
            <div class="glass-card" style="padding: 12px 14px; border-bottom: 2px solid var(--accent-emerald);">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Habits Logged</span>
              <div style="font-size: 20px; font-weight: 800; color: var(--accent-emerald); margin-top: 2px;">${habitRate.completed}/${habitRate.total} <span style="font-size: 12px; font-weight: 500; color: var(--text-tertiary);">(${Math.round(habitRate.rate * 100)}%)</span></div>
            </div>
          </div>

          <h4 style="font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; color: var(--text-secondary);">
            Protocol Checklist (${habitRate.completed}/${habitRate.total})
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 160px; overflow-y: auto; margin-bottom: 20px;">
            ${habits.map(h => {
              const status = store.getHabitStatus(h.id, dStr);
              let badgeBg = 'rgba(255,255,255,0.06)';
              let badgeColor = 'var(--text-tertiary)';
              let badgeBorder = '1px solid var(--border-subtle)';
              let symbol = '— Unlogged';

              if (status === 'completed') {
                badgeBg = 'rgba(16, 185, 129, 0.2)';
                badgeColor = 'var(--accent-emerald)';
                badgeBorder = '1px solid rgba(16, 185, 129, 0.4)';
                symbol = '✓ Complete';
              } else if (status === 'failed') {
                badgeBg = 'rgba(239, 68, 68, 0.2)';
                badgeColor = 'var(--accent-rose)';
                badgeBorder = '1px solid rgba(239, 68, 68, 0.4)';
                symbol = '✕ Missed';
              } else if (status === 'skipped') {
                badgeBg = 'rgba(245, 158, 11, 0.2)';
                badgeColor = 'var(--accent-amber)';
                badgeBorder = '1px solid rgba(245, 158, 11, 0.4)';
                symbol = 'S Rest';
              }

              return `
                <div class="glass-card" style="padding: 8px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 13px;">
                  <span style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 15px;">${h.icon || '🌱'}</span>
                    <span style="font-weight: 600;">${h.name}</span>
                  </span>
                  <span class="badge" style="background: ${badgeBg}; color: ${badgeColor}; border: ${badgeBorder}; font-size: 11px; padding: 2px 8px; border-radius: var(--radius-full);">
                    ${symbol}
                  </span>
                </div>
              `;
            }).join('')}
          </div>

          <h4 style="font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; color: var(--text-secondary);">
            Logged Deep Work Sessions (${daySessions.length})
          </h4>
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 150px; overflow-y: auto;">
            ${daySessions.length === 0 ? '<p style="color: var(--text-tertiary); font-size: 12.5px;">No focus sessions logged on this date.</p>' : daySessions.map(s => {
              const cat = store.getCategoryById(s.categoryId);
              return `
                <div class="glass-card" style="padding: 8px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; border-left: 3px solid ${cat.color};">
                  <span style="display: flex; align-items: center; gap: 8px;">
                    <span class="cat-dot" style="background: ${cat.color}"></span>
                    <span style="font-weight: 500;">${cat.name} (${s.mode})</span>
                  </span>
                  <span class="tabular-nums" style="font-weight: 700; font-family: var(--font-mono);">${s.actualDuration} min</span>
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
    tooltipText += `${d.tasksDone} outcomes completed`;
    if (d.tasksDone >= 6) level = 4;
    else if (d.tasksDone >= 4) level = 3;
    else if (d.tasksDone >= 2) level = 2;
    else if (d.tasksDone >= 1) level = 1;
  } else if (metric === 'habits') {
    const habitData = store.getDailyHabitCompletionRate(d.dateStr);
    tooltipText += `${habitData.completed}/${habitData.total} habits (${Math.round(habitData.rate * 100)}%)`;
    if (habitData.rate >= 0.8) level = 4;
    else if (habitData.rate >= 0.6) level = 3;
    else if (habitData.rate >= 0.3) level = 2;
    else if (habitData.rate > 0) level = 1;
  } else {
    tooltipText += `Productivity Score: ${d.score}/100`;
    if (d.score >= 80) level = 4;
    else if (d.score >= 55) level = 3;
    else if (d.score >= 30) level = 2;
    else if (d.score > 0) level = 1;
  }

  const lvlClass = level > 0 ? `lvl-${level}` : '';
  const todayHighlight = d.isToday ? 'style="border: 1.5px solid var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan);"' : '';

  return `<div class="day-dot ${lvlClass}" data-date="${d.dateStr}" title="${tooltipText}" ${todayHighlight}></div>`;
}
