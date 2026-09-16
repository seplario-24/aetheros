/**
 * AETHER OS — DEDICATED HABIT TRACKER
 * Unlimited habits, Monthly Matrix Grid (Habit × Day = Status),
 * 1-click state cycling (— → ✓ → ✕ → S → —), streak policies,
 * individual habit history calendars, and Today's rapid logging deck.
 */

import { store } from '../store/db.js';
import { ambientAudio } from '../audio/ambient.js';

let selectedMonth = new Date().toISOString().substring(0, 7); // 'YYYY-MM'
let activeTab = 'matrix'; // 'matrix' | 'today'
let groupByGroup = false;

export function renderHabitsView(container, navigate) {
  const habits = store.getHabits();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);

  // Parse Year and Month
  const [year, monthNum] = selectedMonth.split('-').map(Number);
  const monthDate = new Date(year, monthNum - 1, 1);
  const monthName = monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(year, monthNum, 0).getDate();

  // Summary vitals
  const todaySummary = store.getTodayHabitSummary();

  // Calculate monthly overall consistency
  let totalCompletedInMonth = 0;
  let totalDaysInMonthAllHabits = habits.length * daysInMonth;
  for (const h of habits) {
    const stats = store.getHabitStats(h.id, selectedMonth);
    totalCompletedInMonth += stats.completedCount;
  }
  const monthlyConsistencyPct = totalDaysInMonthAllHabits > 0
    ? Math.round((totalCompletedInMonth / totalDaysInMonthAllHabits) * 100)
    : 0;

  // Find longest streak among active habits
  let topStreak = 0;
  for (const h of habits) {
    const s = store.getHabitStats(h.id, selectedMonth);
    if (s.currentStreak > topStreak) topStreak = s.currentStreak;
  }

  // Weekday initials
  const dowLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  container.innerHTML = `
    <div class="animate-fade-in">
      <!-- Header Bar -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
        <div>
          <h1 style="font-size: 26px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 4px;">Habit Architecture</h1>
          <p style="font-size: 13.5px; color: var(--text-secondary);">Unlimited consistency matrix. Track and calibrate non-negotiable daily behaviors.</p>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- View Switcher -->
          <div style="display: flex; background: var(--bg-surface); padding: 4px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle);">
            <button class="btn btn-ghost ${activeTab === 'matrix' ? 'active' : ''}" id="btn-tab-matrix"
              style="padding: 6px 14px; font-size: 12.5px; border-radius: var(--radius-full); ${activeTab === 'matrix' ? 'background: var(--accent-primary); color: #fff; font-weight: 600;' : ''}">
              ⊞ Monthly Matrix
            </button>
            <button class="btn btn-ghost ${activeTab === 'today' ? 'active' : ''}" id="btn-tab-today"
              style="padding: 6px 14px; font-size: 12.5px; border-radius: var(--radius-full); ${activeTab === 'today' ? 'background: var(--accent-primary); color: #fff; font-weight: 600;' : ''}">
              ✓ Log Today
            </button>
          </div>

          <!-- Add Habit Button -->
          <button class="btn btn-primary" id="btn-open-add-habit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Habit
          </button>
        </div>
      </div>

      <!-- Vitals Cards -->
      <div class="stats-overview-grid" style="margin-bottom: 20px;">
        <div class="glass-card stat-card">
          <div class="stat-header">Today's Habits Completed</div>
          <div class="stat-value tabular-nums">${todaySummary.completed}<span style="font-size: 16px; color: var(--text-tertiary);">/${todaySummary.total}</span></div>
          <div class="stat-caption">${todaySummary.completionPct}% completion rate for today</div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-header">Monthly Consistency</div>
          <div class="stat-value tabular-nums">${monthlyConsistencyPct}%</div>
          <div class="stat-caption">${totalCompletedInMonth} completed logs in ${monthName.split(' ')[0]}</div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-header">Active Behaviors</div>
          <div class="stat-value tabular-nums">${habits.length} <span style="font-size: 16px; color: var(--text-tertiary);">habits</span></div>
          <div class="stat-caption">Unlimited tracking matrix</div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-header">Top Active Streak</div>
          <div class="stat-value tabular-nums" style="color: var(--accent-amber);">
            🔥 ${topStreak} <span style="font-size: 16px; color: var(--text-tertiary);">days</span>
          </div>
          <div class="stat-caption">Skip policy protects consistency</div>
        </div>
      </div>

      ${activeTab === 'matrix' ? renderMonthlyMatrixSection() : renderTodayDeckSection()}
    </div>

    <!-- Add Habit Modal Container -->
    <div id="add-habit-modal" class="modal-backdrop">
      <div class="modal-container" style="max-width: 580px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-primary);"></div>
            <h3 style="font-size: 16px; font-weight: 600;">Create New Habit</h3>
          </div>
          <button class="btn btn-ghost btn-icon" id="add-habit-close" style="width: 28px; height: 28px;">✕</button>
        </div>

        <div class="modal-body">
          <!-- Preset Templates -->
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Quick Templates</label>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button class="filter-pill habit-template-btn" data-template="morning">☀️ Healthy Morning</button>
              <button class="filter-pill habit-template-btn" data-template="deepwork">🧠 Deep Work</button>
              <button class="filter-pill habit-template-btn" data-template="fitness">🏃 Fitness & Cardio</button>
              <button class="filter-pill habit-template-btn" data-template="learning">📚 Student Mastery</button>
            </div>
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Habit Name</label>
            <input type="text" id="habit-name-input" class="glass-input" placeholder="e.g. Read 30 Minutes, Zone-2 Cardio, No Sugar" autofocus>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Category</label>
              <input type="text" id="habit-category-input" class="glass-input" value="Health" placeholder="Health, Learning, Fitness...">
            </div>

            <div>
              <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Group</label>
              <select id="habit-group-input" class="glass-input">
                <option value="Morning">Morning Protocol</option>
                <option value="Deep Work">Deep Work</option>
                <option value="Health">Health & Body</option>
                <option value="Growth">Growth & Learning</option>
                <option value="Evening">Evening Wind-Down</option>
              </select>
            </div>

            <div>
              <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Target Goal (Optional)</label>
              <input type="text" id="habit-target-input" class="glass-input" placeholder="e.g. 30 (min), 2500 (ml), 1 (binary)" value="30">
            </div>

            <div>
              <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Accent Color</label>
              <select id="habit-color-input" class="glass-input">
                <option value="#6366F1">Indigo (#6366F1)</option>
                <option value="#06B6D4">Cyan (#06B6D4)</option>
                <option value="#10B981">Emerald (#10B981)</option>
                <option value="#F59E0B">Amber (#F59E0B)</option>
                <option value="#EC4899">Pink (#EC4899)</option>
                <option value="#8B5CF6">Purple (#8B5CF6)</option>
              </select>
            </div>
          </div>

          <!-- Streak Policy & Reminder -->
          <div class="glass-card" style="padding: 12px 16px; display: flex; flex-direction: column; gap: 10px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
              <input type="checkbox" id="habit-skip-policy-input" checked>
              <span><strong>Skipped days preserve streak</strong> (Do not penalize planned rest/fasting days)</span>
            </label>

            <div style="display: flex; align-items: center; gap: 12px; border-top: 1px solid var(--border-subtle); padding-top: 8px;">
              <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" id="habit-reminder-toggle" checked>
                <span>Daily Reminder:</span>
              </label>
              <input type="time" id="habit-reminder-time" class="glass-input" value="08:00" style="width: 120px; padding: 4px 8px;">
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-ghost" id="add-habit-cancel">Cancel</button>
          <button class="btn btn-primary" id="add-habit-submit">Create Habit</button>
        </div>
      </div>
    </div>

    <!-- Habit Detail & History Modal -->
    <div id="habit-detail-modal" class="modal-backdrop">
      <div class="modal-container" style="max-width: 540px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div id="detail-modal-icon" class="habit-icon-orb"></div>
            <div>
              <h3 id="detail-modal-title" style="font-size: 16px; font-weight: 600;"></h3>
              <span id="detail-modal-cat" style="font-size: 11.5px; color: var(--text-tertiary);"></span>
            </div>
          </div>
          <button class="btn btn-ghost btn-icon" id="detail-modal-close" style="width: 28px; height: 28px;">✕</button>
        </div>

        <div class="modal-body" id="detail-modal-body"></div>

        <div class="modal-footer" style="justify-content: space-between;">
          <button class="btn btn-ghost" id="btn-archive-habit" style="color: var(--priority-critical);">Archive Habit</button>
          <button class="btn btn-primary" id="btn-detail-close">Done</button>
        </div>
      </div>
    </div>
  `;

  // Helper: Render Monthly Matrix
  function renderMonthlyMatrixSection() {
    return `
      <!-- Month Navigator & Grouping Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 12px;">
        <!-- Month Switcher -->
        <div style="display: flex; align-items: center; gap: 6px; background: var(--bg-surface); padding: 4px 8px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <button class="btn btn-ghost btn-icon" id="btn-month-prev" style="width: 28px; height: 28px;">‹</button>
          <span style="font-size: 14px; font-weight: 600; min-width: 150px; text-align: center;">${monthName}</span>
          <button class="btn btn-ghost btn-icon" id="btn-month-next" style="width: 28px; height: 28px;">›</button>
          <button class="btn btn-ghost" id="btn-month-today" style="font-size: 11.5px; padding: 2px 8px; border-radius: 4px; ${selectedMonth === currentMonthStr ? 'color: var(--accent-cyan); font-weight: 600;' : ''}">
            Current Month
          </button>
        </div>

        <!-- Legend -->
        <div style="display: flex; align-items: center; gap: 12px; font-size: 12px; color: var(--text-secondary);">
          <span style="display: flex; align-items: center; gap: 4px;"><strong style="color: var(--accent-emerald);">✓</strong> Completed</span>
          <span style="display: flex; align-items: center; gap: 4px;"><strong style="color: var(--priority-critical);">✕</strong> Failed</span>
          <span style="display: flex; align-items: center; gap: 4px;"><strong style="color: var(--accent-amber);">S</strong> Skipped</span>
          <span style="display: flex; align-items: center; gap: 4px;"><strong style="color: var(--text-muted);">—</strong> Unlogged</span>
        </div>
      </div>

      <!-- Matrix Scroll Viewport -->
      <div class="habit-matrix-scroll-wrap" id="habit-matrix-scroll">
        <table class="habit-matrix-table">
          <thead>
            <tr>
              <th class="habit-corner-cell">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.8px;">
                    Habit Name (${habits.length})
                  </span>
                  <span style="font-size: 11px; color: var(--text-tertiary);">1-Click Cycle</span>
                </div>
              </th>

              <!-- Day Number Columns -->
              ${Array.from({ length: daysInMonth }, (_, idx) => {
                const day = idx + 1;
                const dStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
                const dateObj = new Date(`${dStr}T00:00:00`);
                const dow = dowLetters[dateObj.getDay()];
                const isToday = dStr === todayStr;

                return `
                  <th class="habit-header-cell ${isToday ? 'is-today' : ''}" title="${dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}">
                    <span class="habit-header-dow">${dow}</span>
                    <span class="habit-header-num">${day}</span>
                  </th>
                `;
              }).join('')}

              <th class="habit-header-cell habit-summary-cell" style="text-align: center; min-width: 90px;">
                <span class="habit-header-dow">Monthly</span>
                <span class="habit-header-num">Rate</span>
              </th>
            </tr>
          </thead>

          <tbody>
            ${habits.length === 0 ? `
              <tr>
                <td colspan="${daysInMonth + 2}" style="padding: 40px; text-align: center; color: var(--text-tertiary);">
                  No habits active yet. Click "Add Habit" above to create your first consistency routine!
                </td>
              </tr>
            ` : habits.map(h => renderHabitRow(h, selectedMonth, daysInMonth, todayStr)).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Helper: Render Habit Row in Matrix
  function renderHabitRow(habit, monthStr, daysCount, todayStr) {
    const stats = store.getHabitStats(habit.id, monthStr);

    let cellsHtml = '';
    for (let d = 1; d <= daysCount; d++) {
      const dStr = `${monthStr}-${String(d).padStart(2, '0')}`;
      const rec = store.getHabitRecord(habit.id, dStr);
      const status = rec ? rec.status : 'unlogged';

      let symbol = '—';
      let statusClass = 'status-unlogged';
      if (status === 'completed') { symbol = '✓'; statusClass = 'status-completed'; }
      else if (status === 'failed') { symbol = '✕'; statusClass = 'status-failed'; }
      else if (status === 'skipped') { symbol = 'S'; statusClass = 'status-skipped'; }

      cellsHtml += `
        <td>
          <button class="habit-status-btn ${statusClass}"
            data-habit-id="${habit.id}"
            data-date="${dStr}"
            title="${habit.name} on ${dStr}: ${status.toUpperCase()} (Click to cycle)">
            ${symbol}
          </button>
        </td>
      `;
    }

    return `
      <tr>
        <td class="habit-name-cell" data-open-detail="${habit.id}">
          <div class="habit-title-row">
            <div class="habit-icon-orb" style="color: ${habit.color};">
              ${renderHabitIcon(habit.icon)}
            </div>
            <div style="overflow: hidden; min-width: 0;">
              <div class="habit-name-text">${habit.name}</div>
              <div style="font-size: 11px; color: var(--text-tertiary); display: flex; align-items: center; gap: 6px;">
                <span class="cat-dot" style="background: ${habit.color};"></span>
                <span>${habit.category}</span>
                ${habit.target > 1 ? `<span>• ${habit.target}${habit.targetType === 'minutes' ? 'm' : ''}</span>` : ''}
              </div>
            </div>
            ${stats.currentStreak > 0 ? `
              <span class="habit-streak-badge" title="${stats.currentStreak} day streak">
                🔥 ${stats.currentStreak}d
              </span>
            ` : ''}
          </div>
        </td>

        ${cellsHtml}

        <td class="habit-summary-cell" style="text-align: center;">
          <span class="badge" style="font-family: var(--font-mono); font-size: 11.5px; background: rgba(99, 102, 241, 0.12); color: var(--accent-primary);">
            ${stats.monthlyConsistency}%
          </span>
        </td>
      </tr>
    `;
  }

  // Helper: Render Today's Habit Quick Deck
  function renderTodayDeckSection() {
    return `
      <div class="glass-panel" style="padding: 24px; max-width: 680px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <h3 style="font-size: 16px; font-weight: 600;">Today's Routine Check — ${today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
            <span style="font-size: 12.5px; color: var(--text-secondary);">${todaySummary.completed} of ${todaySummary.total} completed (${todaySummary.completionPct}%)</span>
          </div>
          <div style="width: 120px; height: 6px; background: var(--bg-surface-elevated); border-radius: var(--radius-full); overflow: hidden;">
            <div style="width: ${todaySummary.completionPct}%; height: 100%; background: var(--accent-emerald); border-radius: var(--radius-full); transition: width 0.3s ease;"></div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${habits.map(h => {
            const rec = store.getHabitRecord(h.id, todayStr);
            const status = rec ? rec.status : 'unlogged';

            return `
              <div class="glass-card habit-quick-item">
                <div style="display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;">
                  <div class="habit-icon-orb" style="color: ${h.color}; width: 34px; height: 34px; font-size: 16px;">
                    ${renderHabitIcon(h.icon)}
                  </div>
                  <div style="overflow: hidden;">
                    <div style="font-size: 14px; font-weight: 600;">${h.name}</div>
                    <div style="font-size: 11.5px; color: var(--text-tertiary);">${h.category} • ${h.description || 'Daily Behavior'}</div>
                  </div>
                </div>

                <!-- 4-State Quick Selector -->
                <div style="display: flex; gap: 6px; flex-shrink: 0;">
                  <button class="btn btn-ghost btn-set-status ${status === 'completed' ? 'active' : ''}"
                    data-habit-id="${h.id}" data-date="${todayStr}" data-status="completed"
                    style="padding: 6px 12px; font-size: 13px; font-weight: 600; ${status === 'completed' ? 'background: rgba(16, 185, 129, 0.2); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.4);' : ''}">
                    ✓ Done
                  </button>

                  <button class="btn btn-ghost btn-set-status ${status === 'failed' ? 'active' : ''}"
                    data-habit-id="${h.id}" data-date="${todayStr}" data-status="failed"
                    style="padding: 6px 10px; font-size: 13px; font-weight: 600; ${status === 'failed' ? 'background: rgba(239, 68, 68, 0.2); color: var(--priority-critical); border: 1px solid rgba(239, 68, 68, 0.4);' : ''}">
                    ✕ Missed
                  </button>

                  <button class="btn btn-ghost btn-set-status ${status === 'skipped' ? 'active' : ''}"
                    data-habit-id="${h.id}" data-date="${todayStr}" data-status="skipped"
                    style="padding: 6px 10px; font-size: 12px; font-weight: 600; ${status === 'skipped' ? 'background: rgba(245, 158, 11, 0.2); color: var(--accent-amber); border: 1px solid rgba(245, 158, 11, 0.4);' : ''}">
                    S Skip
                  </button>

                  ${status !== 'unlogged' ? `
                    <button class="btn btn-ghost btn-set-status"
                      data-habit-id="${h.id}" data-date="${todayStr}" data-status="unlogged"
                      title="Clear status" style="padding: 6px 8px; font-size: 12px; color: var(--text-muted);">
                      —
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Bind View Tabs
  const tabMatrix = container.querySelector('#btn-tab-matrix');
  const tabToday = container.querySelector('#btn-tab-today');
  if (tabMatrix) tabMatrix.addEventListener('click', () => { activeTab = 'matrix'; renderHabitsView(container, navigate); });
  if (tabToday) tabToday.addEventListener('click', () => { activeTab = 'today'; renderHabitsView(container, navigate); });

  // Bind Month Navigation
  const btnMonthPrev = container.querySelector('#btn-month-prev');
  const btnMonthNext = container.querySelector('#btn-month-next');
  const btnMonthToday = container.querySelector('#btn-month-today');

  if (btnMonthPrev) {
    btnMonthPrev.addEventListener('click', () => {
      const d = new Date(year, monthNum - 2, 1);
      selectedMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      renderHabitsView(container, navigate);
    });
  }

  if (btnMonthNext) {
    btnMonthNext.addEventListener('click', () => {
      const d = new Date(year, monthNum, 1);
      selectedMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      renderHabitsView(container, navigate);
    });
  }

  if (btnMonthToday) {
    btnMonthToday.addEventListener('click', () => {
      selectedMonth = currentMonthStr;
      renderHabitsView(container, navigate);
    });
  }

  // 1-Click State Cycling on Matrix Cells
  container.querySelectorAll('.habit-status-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const habitId = btn.getAttribute('data-habit-id');
      const dateStr = btn.getAttribute('data-date');

      const updated = store.cycleHabitStatus(habitId, dateStr);
      if (updated && updated.status === 'completed') {
        ambientAudio.playChime();
      }
      renderHabitsView(container, navigate);
    });
  });

  // Direct Status Setting (Today Deck)
  container.querySelectorAll('.btn-set-status').forEach(btn => {
    btn.addEventListener('click', () => {
      const habitId = btn.getAttribute('data-habit-id');
      const dateStr = btn.getAttribute('data-date');
      const status = btn.getAttribute('data-status');

      const updated = store.setHabitStatus(habitId, dateStr, status);
      if (updated && updated.status === 'completed') {
        ambientAudio.playChime();
      }
      renderHabitsView(container, navigate);
    });
  });

  // Open Habit Detail Modal
  const detailModal = container.querySelector('#habit-detail-modal');
  const detailIcon = container.querySelector('#detail-modal-icon');
  const detailTitle = container.querySelector('#detail-modal-title');
  const detailCat = container.querySelector('#detail-modal-cat');
  const detailBody = container.querySelector('#detail-modal-body');
  const detailClose = container.querySelector('#detail-modal-close');
  const btnDone = container.querySelector('#btn-detail-close');
  const btnArchive = container.querySelector('#btn-archive-habit');

  let activeDetailHabitId = null;

  const closeDetail = () => {
    if (detailModal) detailModal.classList.remove('open');
    activeDetailHabitId = null;
  };

  if (detailClose) detailClose.addEventListener('click', closeDetail);
  if (btnDone) btnDone.addEventListener('click', closeDetail);
  if (detailModal) detailModal.addEventListener('click', (e) => { if (e.target === detailModal) closeDetail(); });

  if (btnArchive) {
    btnArchive.addEventListener('click', () => {
      if (activeDetailHabitId) {
        store.archiveHabit(activeDetailHabitId);
        closeDetail();
        renderHabitsView(container, navigate);
      }
    });
  }

  container.querySelectorAll('[data-open-detail]').forEach(cell => {
    cell.addEventListener('click', () => {
      const habitId = cell.getAttribute('data-open-detail');
      const habit = store.getHabitById(habitId);
      if (!habit) return;

      activeDetailHabitId = habitId;
      const stats = store.getHabitStats(habitId, selectedMonth);

      detailIcon.innerHTML = renderHabitIcon(habit.icon);
      detailIcon.style.color = habit.color;
      detailTitle.textContent = habit.name;
      detailCat.textContent = `${habit.category} • Streak Policy: ${habit.streakPolicy === 'preserve_on_skip' ? 'Skipped preserves streak' : 'Skipped breaks streak'}`;

      detailBody.innerHTML = `
        <!-- Vitals -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px;">
          <div class="glass-card" style="padding: 12px; text-align: center;">
            <span style="font-size: 11px; color: var(--text-tertiary);">Current Streak</span>
            <div style="font-size: 22px; font-weight: 700; color: var(--accent-amber);">🔥 ${stats.currentStreak}d</div>
          </div>
          <div class="glass-card" style="padding: 12px; text-align: center;">
            <span style="font-size: 11px; color: var(--text-tertiary);">Longest Streak</span>
            <div style="font-size: 22px; font-weight: 700; color: var(--accent-primary);">${stats.longestStreak}d</div>
          </div>
          <div class="glass-card" style="padding: 12px; text-align: center;">
            <span style="font-size: 11px; color: var(--text-tertiary);">Monthly Rate</span>
            <div style="font-size: 22px; font-weight: 700; color: var(--accent-emerald);">${stats.monthlyConsistency}%</div>
          </div>
        </div>

        <!-- Breakdown Counts -->
        <div class="glass-card" style="padding: 12px 16px; display: flex; justify-content: space-around; font-size: 12px; margin-bottom: 20px;">
          <div><strong style="color: var(--accent-emerald);">${stats.completedCount}</strong> Completed</div>
          <div><strong style="color: var(--priority-critical);">${stats.failedCount}</strong> Failed</div>
          <div><strong style="color: var(--accent-amber);">${stats.skippedCount}</strong> Skipped</div>
          <div><strong style="color: var(--text-muted);">${stats.unloggedCount}</strong> Unlogged</div>
        </div>

        <!-- Monthly Mini Calendar -->
        <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text-secondary);">
          ${monthName} Matrix Calendar
        </h4>
        <div class="habit-detail-cal-grid" style="margin-bottom: 20px;">
          ${dowLetters.map(l => `<span style="font-size: 10.5px; font-weight: 700; color: var(--text-muted);">${l}</span>`).join('')}
          ${renderDetailMonthGrid(habitId, selectedMonth, daysInMonth)}
        </div>

        <!-- Weekly Pattern Detection -->
        <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text-secondary);">
          Weekly Consistency Patterns
        </h4>
        <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 70px; border-bottom: 1px solid var(--border-subtle); padding-top: 10px; gap: 8px;">
          ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dName, i) => {
            const count = stats.dayOfWeekCounts[i] || 0;
            const maxC = Math.max(...stats.dayOfWeekCounts, 1);
            const hPct = Math.min(100, Math.max(10, (count / maxC) * 100));

            return `
              <div style="display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; justify-content: flex-end;" title="${dName}: ${count} completions">
                <div style="width: 100%; max-width: 18px; height: ${hPct}%; background: var(--accent-primary); border-radius: 3px 3px 0 0;"></div>
                <span style="font-size: 9.5px; color: var(--text-muted); margin-top: 4px;">${dName}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;

      detailModal.classList.add('open');
    });
  });

  // Add Habit Modal
  const addModal = container.querySelector('#add-habit-modal');
  const btnOpenAdd = container.querySelector('#btn-open-add-habit');
  const btnCloseAdd = container.querySelector('#add-habit-close');
  const btnCancelAdd = container.querySelector('#add-habit-cancel');
  const btnSubmitAdd = container.querySelector('#add-habit-submit');

  const habitNameInp = container.querySelector('#habit-name-input');
  const habitCatInp = container.querySelector('#habit-category-input');
  const habitGroupInp = container.querySelector('#habit-group-input');
  const habitTargetInp = container.querySelector('#habit-target-input');
  const habitColorInp = container.querySelector('#habit-color-input');
  const habitSkipPolicyInp = container.querySelector('#habit-skip-policy-input');
  const habitReminderToggle = container.querySelector('#habit-reminder-toggle');
  const habitReminderTime = container.querySelector('#habit-reminder-time');

  const openAddModal = () => {
    if (habitNameInp) habitNameInp.value = '';
    if (addModal) addModal.classList.add('open');
    if (habitNameInp) setTimeout(() => habitNameInp.focus(), 50);
  };
  const closeAddModal = () => {
    if (addModal) addModal.classList.remove('open');
  };

  if (btnOpenAdd) btnOpenAdd.addEventListener('click', openAddModal);
  if (btnCloseAdd) btnCloseAdd.addEventListener('click', closeAddModal);
  if (btnCancelAdd) btnCancelAdd.addEventListener('click', closeAddModal);
  if (addModal) addModal.addEventListener('click', (e) => { if (e.target === addModal) closeAddModal(); });

  // Template pre-fill
  container.querySelectorAll('.habit-template-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tmpl = btn.getAttribute('data-template');
      if (!habitNameInp) return;
      if (tmpl === 'morning') {
        habitNameInp.value = 'Morning Sunlight & Hydration';
        if (habitCatInp) habitCatInp.value = 'Health';
        if (habitGroupInp) habitGroupInp.value = 'Morning';
        if (habitTargetInp) habitTargetInp.value = '15';
        if (habitColorInp) habitColorInp.value = '#F59E0B';
      } else if (tmpl === 'deepwork') {
        habitNameInp.value = '60m Pure Focus Block';
        if (habitCatInp) habitCatInp.value = 'Deep Work';
        if (habitGroupInp) habitGroupInp.value = 'Deep Work';
        if (habitTargetInp) habitTargetInp.value = '60';
        if (habitColorInp) habitColorInp.value = '#6366F1';
      } else if (tmpl === 'fitness') {
        habitNameInp.value = 'Zone-2 Heart Rate Run';
        if (habitCatInp) habitCatInp.value = 'Fitness';
        if (habitGroupInp) habitGroupInp.value = 'Health';
        if (habitTargetInp) habitTargetInp.value = '45';
        if (habitColorInp) habitColorInp.value = '#F97316';
      } else if (tmpl === 'learning') {
        habitNameInp.value = 'Read Research Paper';
        if (habitCatInp) habitCatInp.value = 'Learning';
        if (habitGroupInp) habitGroupInp.value = 'Growth';
        if (habitTargetInp) habitTargetInp.value = '30';
        if (habitColorInp) habitColorInp.value = '#06B6D4';
      }
    });
  });

  if (btnSubmitAdd) {
    btnSubmitAdd.addEventListener('click', () => {
      if (!habitNameInp) return;
      const name = habitNameInp.value.trim();
      if (!name) {
        habitNameInp.focus();
        return;
      }

      store.addHabit({
        name,
        category: habitCatInp ? habitCatInp.value.trim() || 'General' : 'General',
        group: habitGroupInp ? habitGroupInp.value : 'Daily Focus',
        target: habitTargetInp ? Number(habitTargetInp.value) || 1 : 1,
        targetType: habitTargetInp && Number(habitTargetInp.value) > 1 ? 'minutes' : 'binary',
        color: habitColorInp ? habitColorInp.value : '#6366F1',
        streakPolicy: habitSkipPolicyInp && habitSkipPolicyInp.checked ? 'preserve_on_skip' : 'break_on_skip',
        reminderEnabled: habitReminderToggle ? habitReminderToggle.checked : false,
        reminderTime: habitReminderTime ? habitReminderTime.value : '08:00'
      });

      closeAddModal();
      renderHabitsView(container, navigate);
    });
  }
}

function renderHabitIcon(iconName) {
  switch (iconName) {
    case 'activity':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`;
    case 'book-open':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`;
    case 'sun':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line></svg>`;
    case 'code':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
    case 'droplet':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`;
    case 'moon':
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    default:
      return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle></svg>`;
  }
}

function renderDetailMonthGrid(habitId, monthStr, daysInMonth) {
  const [year, month] = monthStr.split('-').map(Number);
  const firstDow = new Date(year, month - 1, 1).getDay();

  let cells = [];

  // Empty leading days
  for (let i = 0; i < firstDow; i++) {
    cells.push(`<div class="habit-detail-cal-day" style="opacity: 0.15; border: none;"></div>`);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${monthStr}-${String(d).padStart(2, '0')}`;
    const rec = store.getHabitRecord(habitId, dStr);
    const status = rec ? rec.status : 'unlogged';

    let border = 'var(--border-subtle)';
    let bg = 'transparent';
    let text = `${d}`;

    if (status === 'completed') {
      bg = 'rgba(16, 185, 129, 0.2)';
      border = 'rgba(16, 185, 129, 0.45)';
      text = '✓';
    } else if (status === 'failed') {
      bg = 'rgba(239, 68, 68, 0.15)';
      border = 'rgba(239, 68, 68, 0.4)';
      text = '✕';
    } else if (status === 'skipped') {
      bg = 'rgba(245, 158, 11, 0.15)';
      border = 'rgba(245, 158, 11, 0.4)';
      text = 'S';
    }

    cells.push(`
      <div class="habit-detail-cal-day" style="background: ${bg}; border-color: ${border};" title="${dStr}: ${status}">
        <span style="font-weight: 700; font-size: 11.5px;">${text}</span>
      </div>
    `);
  }

  return cells.join('');
}
