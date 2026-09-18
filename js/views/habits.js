/**
 * AETHER OS — 3D ELEMENTAL HABIT ARCHITECTURE
 * Physical 3D tile mosaic, streak crystal bars, tactile 1-click state cycling,
 * particle blooms on completion, and today's rapid routine deck.
 */

import { store } from '../store/db.js';
import { ambientAudio } from '../audio/ambient.js';

let selectedMonth = new Date().toISOString().substring(0, 7); // 'YYYY-MM'
let activeTab = 'matrix'; // 'matrix' | 'today'

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
    <div class="animate-fade-in" style="perspective: 1200px;">
      <!-- Header Bar -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--el-fire);">Elemental Discipline</span>
          </div>
          <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 4px;">Habit Architecture</h1>
          <p style="font-size: 13.5px; color: var(--text-secondary);">Physical consistency matrix. Calibrate and solidify non-negotiable daily protocols.</p>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <!-- View Switcher -->
          <div style="display: flex; background: rgba(15, 23, 42, 0.4); padding: 4px; border-radius: var(--radius-full); border: 1px solid var(--border-glass); backdrop-filter: blur(12px);">
            <button class="btn btn-ghost ${activeTab === 'matrix' ? 'active' : ''}" id="btn-tab-matrix"
              style="padding: 6px 16px; font-size: 12.5px; border-radius: var(--radius-full); ${activeTab === 'matrix' ? 'background: var(--accent-primary); color: #fff; font-weight: 700; box-shadow: 0 2px 10px var(--accent-primary-glow);' : ''}">
              ⊞ 3D Matrix
            </button>
            <button class="btn btn-ghost ${activeTab === 'today' ? 'active' : ''}" id="btn-tab-today"
              style="padding: 6px 16px; font-size: 12.5px; border-radius: var(--radius-full); ${activeTab === 'today' ? 'background: var(--accent-primary); color: #fff; font-weight: 700; box-shadow: 0 2px 10px var(--accent-primary-glow);' : ''}">
              ✓ Today's Deck
            </button>
          </div>

          <!-- Add Habit Button -->
          <button class="btn btn-primary" id="btn-open-add-habit" style="box-shadow: 0 4px 16px var(--accent-primary-glow);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Habit
          </button>
        </div>
      </div>

      <!-- 4 Elemental Floating Stat Cards -->
      <div class="stats-overview-grid" style="margin-bottom: 22px;">
        <!-- Water Element: Today's Logs -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-water-glow); animation-delay: 0s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Today's Flow</div>
            <span style="font-size: 14px;">💧</span>
          </div>
          <div class="stat-value tabular-nums">${todaySummary.completed}<span style="font-size: 16px; color: var(--text-tertiary);">/${todaySummary.total}</span></div>
          <div class="stat-caption">${todaySummary.completionPct}% completed for today</div>
        </div>

        <!-- Crystal Element: Monthly Consistency -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-crystal-glow); animation-delay: 0.15s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Monthly Calibration</div>
            <span style="font-size: 14px;">💎</span>
          </div>
          <div class="stat-value tabular-nums">${monthlyConsistencyPct}%</div>
          <div class="stat-caption">${totalCompletedInMonth} completed logs in ${monthName.split(' ')[0]}</div>
        </div>

        <!-- Earth Element: Active Behaviors -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-earth-glow); animation-delay: 0.3s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Active Protocols</div>
            <span style="font-size: 14px;">🌿</span>
          </div>
          <div class="stat-value tabular-nums">${habits.length} <span style="font-size: 16px; color: var(--text-tertiary);">habits</span></div>
          <div class="stat-caption">Disciplined daily foundation</div>
        </div>

        <!-- Fire Element: Top Streak + Crystal Shard -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-fire-glow); animation-delay: 0.45s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Top Active Streak</div>
            <span style="font-size: 14px;">🔥</span>
          </div>
          <div class="stat-value tabular-nums" style="color: var(--accent-amber);">
            ${topStreak} <span style="font-size: 16px; color: var(--text-tertiary);">days</span>
          </div>
          <div style="margin-top: 8px;">
            <div class="streak-crystal-wrap" style="height: 6px; background: rgba(255,255,255,0.06); border-radius: var(--radius-full); overflow: hidden; position: relative;">
              <div class="streak-crystal-fill" style="width: ${Math.min(100, (topStreak / 30) * 100)}%; height: 100%; background: linear-gradient(90deg, var(--el-fire) 0%, var(--el-light) 100%); border-radius: var(--radius-full);"></div>
            </div>
          </div>
        </div>
      </div>

      ${activeTab === 'matrix' ? renderMonthlyMatrixSection() : renderTodayDeckSection()}
    </div>

    <!-- Add Habit Modal Container -->
    <div id="add-habit-modal" class="modal-backdrop">
      <div class="modal-container" style="max-width: 580px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(28px); border: 1px solid var(--border-glass); box-shadow: 0 25px 60px rgba(0,0,0,0.6);">
        <div class="modal-header" style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: var(--accent-primary); box-shadow: 0 0 10px var(--accent-primary-glow);"></div>
            <h3 style="font-size: 17px; font-weight: 700;">Initiate New Habit</h3>
          </div>
          <button class="btn btn-ghost btn-icon" id="add-habit-close" style="width: 28px; height: 28px;">✕</button>
        </div>

        <div class="modal-body" style="padding: 20px 0; display: flex; flex-direction: column; gap: 16px;">
          <!-- Preset Templates -->
          <div>
            <label style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-tertiary); margin-bottom: 8px; display: block;">Quick Protocol Blueprints</label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="filter-pill habit-template-btn" data-template="morning" style="background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.3); color: #fbbf24;">☀️ Healthy Morning</button>
              <button class="filter-pill habit-template-btn" data-template="deepwork" style="background: rgba(99, 102, 241, 0.12); border-color: rgba(99, 102, 241, 0.3); color: #818cf8;">🧠 Deep Work Flow</button>
              <button class="filter-pill habit-template-btn" data-template="fitness" style="background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.3); color: #f87171;">🏃 Zone-2 Cardio</button>
              <button class="filter-pill habit-template-btn" data-template="learning" style="background: rgba(6, 182, 212, 0.12); border-color: rgba(6, 182, 212, 0.3); color: #22d3ee;">📚 Deep Learning</button>
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
              <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Target Goal</label>
              <input type="text" id="habit-target-input" class="glass-input" placeholder="e.g. 30 (min), 1 (binary)" value="30">
            </div>

            <div>
              <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Elemental Accent Color</label>
              <select id="habit-color-input" class="glass-input">
                <option value="#6366F1">Crystal Violet (#6366F1)</option>
                <option value="#06B6D4">Water Cyan (#06B6D4)</option>
                <option value="#10B981">Earth Emerald (#10B981)</option>
                <option value="#F59E0B">Light Amber (#F59E0B)</option>
                <option value="#F43F5E">Fire Coral (#F43F5E)</option>
                <option value="#8B5CF6">Cosmic Purple (#8B5CF6)</option>
              </select>
            </div>
          </div>

          <!-- Streak Policy & Reminder -->
          <div class="glass-card" style="padding: 14px; display: flex; flex-direction: column; gap: 10px; border-left: 3px solid var(--accent-cyan);">
            <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer;">
              <input type="checkbox" id="habit-skip-policy-input" checked>
              <span><strong>Rest Protection</strong> (Skipped planned rest days preserve streak)</span>
            </label>

            <div style="display: flex; align-items: center; gap: 12px; border-top: 1px solid var(--border-subtle); padding-top: 10px;">
              <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer;">
                <input type="checkbox" id="habit-reminder-toggle" checked>
                <span>Daily Prompt:</span>
              </label>
              <input type="time" id="habit-reminder-time" class="glass-input" value="08:00" style="width: 120px; padding: 4px 8px;">
            </div>
          </div>
        </div>

        <div class="modal-footer" style="border-top: 1px solid var(--border-subtle); padding-top: 14px;">
          <button class="btn btn-ghost" id="add-habit-cancel">Cancel</button>
          <button class="btn btn-primary" id="add-habit-submit">Solidify Protocol</button>
        </div>
      </div>
    </div>

    <!-- Habit Detail & History Modal -->
    <div id="habit-detail-modal" class="modal-backdrop">
      <div class="modal-container" style="max-width: 560px; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(28px); border: 1px solid var(--border-glass);">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div id="detail-modal-icon" class="habit-icon-orb" style="width: 38px; height: 38px; font-size: 18px;"></div>
            <div>
              <h3 id="detail-modal-title" style="font-size: 17px; font-weight: 700;"></h3>
              <span id="detail-modal-cat" style="font-size: 11.5px; color: var(--text-tertiary);"></span>
            </div>
          </div>
          <button class="btn btn-ghost btn-icon" id="detail-modal-close" style="width: 28px; height: 28px;">✕</button>
        </div>

        <div class="modal-body" id="detail-modal-body" style="padding: 16px 0;"></div>

        <div class="modal-footer" style="justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
        <!-- Month Switcher -->
        <div style="display: flex; align-items: center; gap: 6px; background: rgba(15, 23, 42, 0.4); padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid var(--border-glass); backdrop-filter: blur(12px);">
          <button class="btn btn-ghost btn-icon" id="btn-month-prev" style="width: 28px; height: 28px;">‹</button>
          <span style="font-size: 13.5px; font-weight: 700; min-width: 150px; text-align: center; font-family: var(--font-mono);">${monthName}</span>
          <button class="btn btn-ghost btn-icon" id="btn-month-next" style="width: 28px; height: 28px;">›</button>
          <button class="btn btn-ghost" id="btn-month-today" style="font-size: 11.5px; padding: 2px 10px; border-radius: var(--radius-full); ${selectedMonth === currentMonthStr ? 'color: var(--accent-cyan); font-weight: 700; background: rgba(6, 182, 212, 0.15);' : ''}">
            Current
          </button>
        </div>

        <!-- 3D Legend -->
        <div style="display: flex; align-items: center; gap: 14px; font-size: 12px; color: var(--text-secondary); background: rgba(15, 23, 42, 0.3); padding: 5px 14px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle);">
          <span style="display: flex; align-items: center; gap: 5px;"><strong style="color: var(--accent-emerald);">✓</strong> Complete</span>
          <span style="display: flex; align-items: center; gap: 5px;"><strong style="color: var(--priority-critical);">✕</strong> Missed</span>
          <span style="display: flex; align-items: center; gap: 5px;"><strong style="color: var(--accent-amber);">S</strong> Rest/Skip</span>
          <span style="display: flex; align-items: center; gap: 5px;"><strong style="color: var(--text-muted);">—</strong> Empty</span>
        </div>
      </div>

      <!-- Matrix Scroll Viewport with 3D Depth -->
      <div class="habit-matrix-scroll-wrap glass-panel" id="habit-matrix-scroll" style="padding: 16px; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass);">
        <table class="habit-matrix-table">
          <thead>
            <tr>
              <th class="habit-corner-cell" style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 11.5px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.8px;">
                    Habits (${habits.length})
                  </span>
                  <span style="font-size: 11px; color: var(--text-tertiary);">Cycle</span>
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
                  <th class="habit-header-cell ${isToday ? 'is-today' : ''}" title="${dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}" style="${isToday ? 'border-bottom: 2px solid var(--accent-cyan);' : ''}">
                    <span class="habit-header-dow" style="${isToday ? 'color: var(--accent-cyan); font-weight: 700;' : ''}">${dow}</span>
                    <span class="habit-header-num" style="${isToday ? 'color: var(--accent-cyan); font-weight: 800;' : ''}">${day}</span>
                  </th>
                `;
              }).join('')}

              <th class="habit-header-cell habit-summary-cell" style="text-align: center; min-width: 80px;">
                <span class="habit-header-dow">Rate</span>
                <span class="habit-header-num">%</span>
              </th>
            </tr>
          </thead>

          <tbody>
            ${habits.length === 0 ? `
              <tr>
                <td colspan="${daysInMonth + 2}" style="padding: 50px; text-align: center; color: var(--text-tertiary);">
                  No habit protocols active. Click "Add Habit" above to forge your consistency matrix!
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
      <tr class="habit-matrix-row">
        <td class="habit-name-cell" data-open-detail="${habit.id}">
          <div class="habit-title-row">
            <div class="habit-icon-orb" style="color: ${habit.color}; width: 28px; height: 28px; font-size: 14px; background: radial-gradient(circle, ${habit.color}25 0%, transparent 80%); box-shadow: 0 0 10px ${habit.color}30;">
              ${renderHabitIcon(habit.icon)}
            </div>
            <div style="overflow: hidden; min-width: 0; flex: 1;">
              <div class="habit-name-text" style="font-weight: 600;">${habit.name}</div>
              <div style="font-size: 11px; color: var(--text-tertiary); display: flex; align-items: center; gap: 6px;">
                <span class="cat-dot" style="background: ${habit.color};"></span>
                <span>${habit.category}</span>
                ${habit.target > 1 ? `<span>• ${habit.target}${habit.targetType === 'minutes' ? 'm' : ''}</span>` : ''}
              </div>
            </div>
            ${stats.currentStreak > 0 ? `
              <span class="habit-streak-badge" title="${stats.currentStreak} day streak" style="font-family: var(--font-mono); font-size: 11px; padding: 2px 7px; border-radius: var(--radius-full); background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);">
                🔥 ${stats.currentStreak}d
              </span>
            ` : ''}
          </div>
        </td>

        ${cellsHtml}

        <td class="habit-summary-cell" style="text-align: center;">
          <span class="badge" style="font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; background: rgba(99, 102, 241, 0.15); color: var(--accent-primary); border: 1px solid rgba(99, 102, 241, 0.3);">
            ${stats.monthlyConsistency}%
          </span>
        </td>
      </tr>
    `;
  }

  // Helper: Render Today's Habit Quick Deck
  function renderTodayDeckSection() {
    return `
      <div class="glass-panel" style="padding: 26px; max-width: 720px; margin: 0 auto; box-shadow: var(--shadow-glass); border-radius: var(--radius-lg);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px;">
          <div>
            <h3 style="font-size: 17px; font-weight: 700;">Today's Protocol Check — ${today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
            <span style="font-size: 13px; color: var(--text-secondary);">${todaySummary.completed} of ${todaySummary.total} completed (${todaySummary.completionPct}%)</span>
          </div>
          <div style="width: 140px; height: 8px; background: rgba(255, 255, 255, 0.08); border-radius: var(--radius-full); overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
            <div style="width: ${todaySummary.completionPct}%; height: 100%; background: linear-gradient(90deg, var(--el-water) 0%, var(--accent-emerald) 100%); border-radius: var(--radius-full); transition: width 0.4s ease; box-shadow: 0 0 10px var(--accent-emerald-glow);"></div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${habits.length === 0 ? `
            <div class="glass-card" style="padding: 36px; text-align: center; color: var(--text-tertiary);">
              No habit protocols active today. Click "Add Habit" above to forge your consistency matrix!
            </div>
          ` : habits.map(h => {
            const rec = store.getHabitRecord(h.id, todayStr);
            const status = rec ? rec.status : 'unlogged';

            return `
              <div class="glass-card habit-quick-item" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 14px; border-left: 4px solid ${h.color}; box-shadow: var(--shadow-sm);">
                <div style="display: flex; align-items: center; gap: 14px; min-width: 0; flex: 1;">
                  <div class="habit-icon-orb" style="color: ${h.color}; width: 38px; height: 38px; font-size: 17px; background: radial-gradient(circle, ${h.color}25 0%, transparent 80%); box-shadow: 0 0 10px ${h.color}30;">
                    ${renderHabitIcon(h.icon)}
                  </div>
                  <div style="overflow: hidden;">
                    <div style="font-size: 14.5px; font-weight: 700;">${h.name}</div>
                    <div style="font-size: 12px; color: var(--text-tertiary);">${h.category} • ${h.description || 'Daily Behavior'}</div>
                  </div>
                </div>

                <!-- 4-State Quick Selector -->
                <div style="display: flex; gap: 8px; flex-shrink: 0;">
                  <button class="btn btn-ghost btn-set-status ${status === 'completed' ? 'active' : ''}"
                    data-habit-id="${h.id}" data-date="${todayStr}" data-status="completed"
                    style="padding: 7px 14px; font-size: 12.5px; font-weight: 700; border-radius: var(--radius-full); ${status === 'completed' ? 'background: rgba(16, 185, 129, 0.25); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.5); box-shadow: 0 0 12px var(--accent-emerald-glow);' : ''}">
                    ✓ Done
                  </button>

                  <button class="btn btn-ghost btn-set-status ${status === 'failed' ? 'active' : ''}"
                    data-habit-id="${h.id}" data-date="${todayStr}" data-status="failed"
                    style="padding: 7px 12px; font-size: 12.5px; font-weight: 700; border-radius: var(--radius-full); ${status === 'failed' ? 'background: rgba(239, 68, 68, 0.25); color: var(--priority-critical); border: 1px solid rgba(239, 68, 68, 0.5);' : ''}">
                    ✕ Miss
                  </button>

                  <button class="btn btn-ghost btn-set-status ${status === 'skipped' ? 'active' : ''}"
                    data-habit-id="${h.id}" data-date="${todayStr}" data-status="skipped"
                    style="padding: 7px 12px; font-size: 12px; font-weight: 700; border-radius: var(--radius-full); ${status === 'skipped' ? 'background: rgba(245, 158, 11, 0.25); color: var(--accent-amber); border: 1px solid rgba(245, 158, 11, 0.5);' : ''}">
                    S Rest
                  </button>

                  ${status !== 'unlogged' ? `
                    <button class="btn btn-ghost btn-set-status"
                      data-habit-id="${h.id}" data-date="${todayStr}" data-status="unlogged"
                      title="Clear status" style="padding: 7px 10px; font-size: 12px; color: var(--text-muted); border-radius: var(--radius-full);">
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

  // 1-Click State Cycling on Matrix Cells + Particle Bloom
  container.querySelectorAll('.habit-status-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const habitId = btn.getAttribute('data-habit-id');
      const dateStr = btn.getAttribute('data-date');

      const updated = store.cycleHabitStatus(habitId, dateStr);
      if (updated && updated.status === 'completed') {
        const rect = btn.getBoundingClientRect();
        if (window.ParticleSystem && window.ParticleSystem.tileBloom) {
          window.ParticleSystem.tileBloom(rect.left + rect.width / 2, rect.top + rect.height / 2, '#10b981');
        }
        ambientAudio.playChime();
      }
      renderHabitsView(container, navigate);
    });
  });

  // Direct Status Setting (Today Deck) + Particle Bloom
  container.querySelectorAll('.btn-set-status').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const habitId = btn.getAttribute('data-habit-id');
      const dateStr = btn.getAttribute('data-date');
      const status = btn.getAttribute('data-status');

      const updated = store.setHabitStatus(habitId, dateStr, status);
      if (updated && updated.status === 'completed') {
        const rect = btn.getBoundingClientRect();
        if (window.ParticleSystem && window.ParticleSystem.tileBloom) {
          window.ParticleSystem.tileBloom(rect.left + rect.width / 2, rect.top + rect.height / 2, '#10b981');
        }
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
      detailCat.textContent = `${habit.category} • Streak Policy: ${habit.streakPolicy === 'preserve_on_skip' ? 'Rest preserves streak' : 'Rest breaks streak'}`;

      detailBody.innerHTML = `
        <!-- Vitals Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px;">
          <div class="glass-card" style="padding: 14px; text-align: center; border-bottom: 2px solid var(--accent-amber);">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Current Streak</span>
            <div style="font-size: 24px; font-weight: 800; color: var(--accent-amber); margin-top: 4px;">🔥 ${stats.currentStreak}d</div>
          </div>
          <div class="glass-card" style="padding: 14px; text-align: center; border-bottom: 2px solid var(--accent-primary);">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Record Streak</span>
            <div style="font-size: 24px; font-weight: 800; color: var(--accent-primary); margin-top: 4px;">${stats.longestStreak}d</div>
          </div>
          <div class="glass-card" style="padding: 14px; text-align: center; border-bottom: 2px solid var(--accent-emerald);">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Monthly Rate</span>
            <div style="font-size: 24px; font-weight: 800; color: var(--accent-emerald); margin-top: 4px;">${stats.monthlyConsistency}%</div>
          </div>
        </div>

        <!-- Streak Crystal Shard Indicator -->
        <div class="glass-card" style="padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">💎</span>
            <span style="font-size: 12.5px; font-weight: 600;">Crystal Streak Tier</span>
          </div>
          <div style="flex: 1; max-width: 240px;">
            <div style="height: 8px; background: rgba(255,255,255,0.06); border-radius: var(--radius-full); overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
              <div style="width: ${Math.min(100, (stats.currentStreak / 30) * 100)}%; height: 100%; background: linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-cyan) 100%); border-radius: var(--radius-full); box-shadow: 0 0 10px var(--accent-primary-glow);"></div>
            </div>
          </div>
          <span style="font-family: var(--font-mono); font-size: 11.5px; color: var(--text-tertiary);">${stats.currentStreak}/30d goal</span>
        </div>

        <!-- Breakdown Counts -->
        <div class="glass-card" style="padding: 12px 16px; display: flex; justify-content: space-around; font-size: 12.5px; margin-bottom: 20px;">
          <div><strong style="color: var(--accent-emerald); font-size: 14px;">${stats.completedCount}</strong> Completed</div>
          <div><strong style="color: var(--priority-critical); font-size: 14px;">${stats.failedCount}</strong> Missed</div>
          <div><strong style="color: var(--accent-amber); font-size: 14px;">${stats.skippedCount}</strong> Rest</div>
          <div><strong style="color: var(--text-muted); font-size: 14px;">${stats.unloggedCount}</strong> Unlogged</div>
        </div>

        <!-- Monthly Mini Calendar -->
        <h4 style="font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; color: var(--text-secondary);">
          ${monthName} Log Mosaic
        </h4>
        <div class="habit-detail-cal-grid" style="margin-bottom: 20px;">
          ${dowLetters.map(l => `<span style="font-size: 10.5px; font-weight: 700; color: var(--text-muted);">${l}</span>`).join('')}
          ${renderDetailMonthGrid(habitId, selectedMonth, daysInMonth)}
        </div>

        <!-- Weekly Pattern Detection -->
        <h4 style="font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; color: var(--text-secondary);">
          Weekly Consistency Rhythm
        </h4>
        <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 74px; border-bottom: 1px solid var(--border-subtle); padding-top: 10px; gap: 8px;">
          ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dName, i) => {
            const count = stats.dayOfWeekCounts[i] || 0;
            const maxC = Math.max(...stats.dayOfWeekCounts, 1);
            const hPct = Math.min(100, Math.max(12, (count / maxC) * 100));

            return `
              <div style="display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; justify-content: flex-end;" title="${dName}: ${count} completions">
                <div style="width: 100%; max-width: 20px; height: ${hPct}%; background: var(--accent-primary); border-radius: 4px 4px 0 0; box-shadow: 0 0 8px var(--accent-primary-glow);"></div>
                <span style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">${dName}</span>
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
        if (habitColorInp) habitColorInp.value = '#F43F5E';
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
      bg = 'rgba(16, 185, 129, 0.25)';
      border = 'rgba(16, 185, 129, 0.5)';
      text = '✓';
    } else if (status === 'failed') {
      bg = 'rgba(239, 68, 68, 0.2)';
      border = 'rgba(239, 68, 68, 0.5)';
      text = '✕';
    } else if (status === 'skipped') {
      bg = 'rgba(245, 158, 11, 0.2)';
      border = 'rgba(245, 158, 11, 0.5)';
      text = 'S';
    }

    cells.push(`
      <div class="habit-detail-cal-day" style="background: ${bg}; border-color: ${border}; border-radius: 4px;" title="${dStr}: ${status}">
        <span style="font-weight: 700; font-size: 11.5px;">${text}</span>
      </div>
    `);
  }

  return cells.join('');
}
