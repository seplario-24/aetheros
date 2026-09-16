/**
 * AETHER OS — SYSTEMATIC 365-DAY YEAR DOT MATRIX
 * High-performance, luminous annual consistency terrain from January 1 to December 31.
 * Features real-time year countdown, completion percentage meter, multi-metric switching,
 * 53-week aligned month headers, tactile Day Inspector, and annual automatic refresh.
 */

import { store } from '../store/db.js';

let activeMetric = 'focus'; // 'focus' | 'tasks' | 'score' | 'habits'
let selectedYear = new Date().getFullYear(); // Defaults to current year (2026)

export function renderDotCalendarView(container, navigate) {
  const currentYear = new Date().getFullYear();
  
  // Auto-refresh to current year if system year rolls over
  if (!selectedYear) {
    selectedYear = currentYear;
  }

  const tasks = store.getTasks();
  const sessions = store.getFocusSessions();

  // Normalize today at midnight for day comparisons
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayIso = now.toISOString().split('T')[0];

  // Year configuration
  const isLeap = (selectedYear % 4 === 0 && selectedYear % 100 !== 0) || (selectedYear % 400 === 0);
  const totalDaysInYear = isLeap ? 366 : 365;
  const startOfYear = new Date(selectedYear, 0, 1);
  const firstDayOfWeek = startOfYear.getDay(); // 0 = Sun, 4 = Thu for 2026

  // Calculate year progress for selectedYear
  let elapsedDays = 0;
  let daysLeftInYear = 0;
  let yearCompletionPct = 0;

  if (selectedYear < currentYear) {
    elapsedDays = totalDaysInYear;
    daysLeftInYear = 0;
    yearCompletionPct = 100;
  } else if (selectedYear > currentYear) {
    elapsedDays = 0;
    daysLeftInYear = totalDaysInYear;
    yearCompletionPct = 0;
  } else {
    // Current year: calculate exact day-of-year index
    const diffMs = todayMidnight.getTime() - startOfYear.getTime();
    elapsedDays = Math.min(totalDaysInYear, Math.max(1, Math.floor(diffMs / 86400000) + 1));
    daysLeftInYear = Math.max(0, totalDaysInYear - elapsedDays);
    yearCompletionPct = parseFloat(((elapsedDays / totalDaysInYear) * 100).toFixed(1));
  }

  // Generate all 365/366 days of the selected year from Jan 1 to Dec 31
  const daysData = [];
  let totalActiveDays = 0;
  let totalYearlyMinutes = 0;
  let totalTasksCompleted = 0;

  for (let dayIdx = 0; dayIdx < totalDaysInYear; dayIdx++) {
    const d = new Date(selectedYear, 0, 1 + dayIdx);
    const yStr = d.getFullYear();
    const mStr = String(d.getMonth() + 1).padStart(2, '0');
    const dtStr = String(d.getDate()).padStart(2, '0');
    const dStr = `${yStr}-${mStr}-${dtStr}`;

    const dMidnight = new Date(yStr, d.getMonth(), d.getDate());
    const isToday = dMidnight.getTime() === todayMidnight.getTime();
    const isFuture = dMidnight.getTime() > todayMidnight.getTime();
    const isPast = dMidnight.getTime() < todayMidnight.getTime();

    // Query historical and live store data
    const daySessions = sessions.filter(s => s.startTime && s.startTime.startsWith(dStr));
    const dayTasks = tasks.filter(t => t.completed && t.completedAt && t.completedAt.startsWith(dStr));

    const focusMinutes = daySessions.reduce((acc, s) => acc + (s.actualDuration || 0), 0);
    const tasksDone = dayTasks.length;
    const sessionCount = daySessions.length;

    // Productivity Score = min(100, focusMinutes * 0.25 + tasksDone * 12)
    const score = Math.min(100, Math.round(focusMinutes * 0.25 + tasksDone * 12));

    if (!isFuture && (focusMinutes > 0 || tasksDone > 0)) {
      totalActiveDays++;
    }
    if (!isFuture) {
      totalYearlyMinutes += focusMinutes;
      totalTasksCompleted += tasksDone;
    }

    // Days away calculation for future days
    const daysAway = isFuture ? Math.round((dMidnight.getTime() - todayMidnight.getTime()) / 86400000) : 0;

    daysData.push({
      date: d,
      dateStr: dStr,
      dayOfYear: dayIdx + 1,
      focusMinutes,
      tasksDone,
      sessionCount,
      score,
      isToday,
      isFuture,
      isPast,
      daysAway
    });
  }

  const yearlyHours = Math.round(totalYearlyMinutes / 60);
  const activeDaysDenominator = selectedYear === currentYear ? elapsedDays : (selectedYear < currentYear ? totalDaysInYear : 1);
  const consistencyRate = Math.round((totalActiveDays / activeDaysDenominator) * 100);

  // Month starting column calculation (1-indexed for CSS grid-column)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthHeaders = [];
  for (let m = 0; m < 12; m++) {
    const mDate = new Date(selectedYear, m, 1);
    const diffFromStart = Math.floor((mDate.getTime() - startOfYear.getTime()) / 86400000);
    const slotIdx = firstDayOfWeek + diffFromStart;
    const colIdx = Math.floor(slotIdx / 7) + 1; // 1-indexed column
    monthHeaders.push({ name: monthNames[m], col: colIdx });
  }

  // Trailing spacers to fill the final week column to 7 rows
  const totalSlotsUsed = firstDayOfWeek + totalDaysInYear;
  const trailingSpacersCount = (7 - (totalSlotsUsed % 7)) % 7;

  container.innerHTML = `
    <div class="animate-fade-in dot-calendar-container" style="perspective: 1200px;">
      <!-- Header with Year Navigation & Metric Switcher -->
      <div class="dot-calendar-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.12); padding: 3px 10px; border-radius: var(--radius-full); border: 1px solid rgba(6, 182, 212, 0.3);">
              Annual Dot Matrix
            </span>
            <span style="font-size: 13px; color: var(--text-tertiary);">Systematic 1st Jan – 31st Dec Calendar</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.8px; margin: 0; color: #FFFFFF;">
              Year ${selectedYear} Matrix
            </h1>
            
            <!-- Year Navigator Controls -->
            <div style="display: flex; align-items: center; gap: 4px; background: rgba(15, 23, 42, 0.6); padding: 2px 6px; border-radius: var(--radius-full); border: 1px solid var(--border-glass);">
              <button class="btn btn-ghost" id="dot-prev-year" title="Previous Year" style="padding: 4px 10px; font-size: 12px; border-radius: var(--radius-full); color: var(--text-secondary);">
                ◀ ${selectedYear - 1}
              </button>
              <button class="btn btn-ghost active" id="dot-curr-year" style="padding: 4px 12px; font-size: 12px; border-radius: var(--radius-full); background: var(--accent-primary); color: #fff; font-weight: 700;">
                ${selectedYear === currentYear ? '★ ' + selectedYear : selectedYear}
              </button>
              <button class="btn btn-ghost" id="dot-next-year" title="Next Year" style="padding: 4px 10px; font-size: 12px; border-radius: var(--radius-full); color: var(--text-secondary);">
                ${selectedYear + 1} ▶
              </button>
            </div>

            ${selectedYear !== currentYear ? `
              <button class="btn btn-ghost" id="dot-jump-today" style="padding: 4px 10px; font-size: 11px; border-radius: var(--radius-full); color: var(--accent-cyan); border: 1px solid rgba(6, 182, 212, 0.4);">
                Return to ${currentYear}
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Metric Switcher Pills -->
        <div class="dot-metric-pills" style="display: flex; background: rgba(15, 23, 42, 0.6); padding: 4px; border-radius: var(--radius-full); border: 1px solid var(--border-glass); backdrop-filter: blur(12px);">
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

      <!-- Executive Year Countdown & Completion Meter Card -->
      <div class="year-progress-card" style="margin-bottom: 22px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 14px;">
          <div>
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-cyan); margin-bottom: 4px;">
              ${selectedYear === currentYear ? 'Countdown & Annual Progress' : `Year ${selectedYear} Status`}
            </div>
            <div style="display: flex; align-items: baseline; gap: 12px;">
              <span style="font-size: 32px; font-weight: 800; color: #FFFFFF; font-family: var(--font-mono); letter-spacing: -1px;">
                ${selectedYear === currentYear ? `${daysLeftInYear}` : (selectedYear < currentYear ? '0' : `${totalDaysInYear}`)}
              </span>
              <span style="font-size: 16px; font-weight: 600; color: var(--text-secondary);">
                ${selectedYear === currentYear ? `Days Left in ${selectedYear}` : (selectedYear < currentYear ? `Days Left (Concluded)` : `Days Left in Upcoming Year`)}
              </span>
            </div>
            <div style="font-size: 12.5px; color: var(--text-tertiary); margin-top: 2px;">
              ${selectedYear === currentYear ? `Day ${elapsedDays} of ${totalDaysInYear} • Year ends Thursday, Dec 31, ${selectedYear}` : (selectedYear < currentYear ? `Complete 365-day archive for ${selectedYear}` : `Upcoming calendar starts Friday, Jan 1, ${selectedYear}`)}
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-emerald); margin-bottom: 4px;">
              Year Completed
            </div>
            <div style="display: flex; align-items: baseline; justify-content: flex-end; gap: 4px;">
              <span style="font-size: 32px; font-weight: 800; color: var(--accent-emerald); font-family: var(--font-mono); letter-spacing: -1px;">
                ${yearCompletionPct}%
              </span>
            </div>
            <div style="font-size: 12.5px; color: var(--text-tertiary); margin-top: 2px;">
              ${selectedYear === currentYear ? `${(100 - yearCompletionPct).toFixed(1)}% remaining to build your legacy` : (selectedYear < currentYear ? '100% historical completion' : '0.0% elapsed')}
            </div>
          </div>
        </div>

        <!-- 3D Progress Bar Track -->
        <div class="year-progress-track">
          <div class="year-progress-fill" style="width: ${yearCompletionPct}%;"></div>
        </div>

        <!-- Timeline milestones -->
        <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; color: var(--text-tertiary); font-family: var(--font-mono);">
          <span>Jan 1, ${selectedYear} (0%)</span>
          <span style="color: var(--accent-cyan); font-weight: 600;">
            ${selectedYear === currentYear ? `Today: ${now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} (${yearCompletionPct}%)` : ''}
          </span>
          <span>Dec 31, ${selectedYear} (100%)</span>
        </div>
      </div>

      <!-- 4 Elemental Floating Stat Cards -->
      <div class="stats-overview-grid" style="margin-bottom: 22px;">
        <!-- Fire Element: Days Remaining -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-fire-glow); animation-delay: 0s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Days Remaining</div>
            <span style="font-size: 15px;">🔥</span>
          </div>
          <div class="stat-value" style="color: var(--accent-amber);">${daysLeftInYear} <span style="font-size: 15px; color: var(--text-tertiary);">days</span></div>
          <div class="stat-caption">${selectedYear === currentYear ? `${Math.ceil(daysLeftInYear / 7)} weeks until ${selectedYear + 1}` : `Year ${selectedYear} countdown`}</div>
        </div>

        <!-- Water Element: Year Completion -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-water-glow); animation-delay: 0.15s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Annual Progress</div>
            <span style="font-size: 15px;">💧</span>
          </div>
          <div class="stat-value" style="color: var(--accent-cyan);">${yearCompletionPct}%</div>
          <div class="stat-caption">${elapsedDays} of ${totalDaysInYear} days recorded</div>
        </div>

        <!-- Earth Element: Active Harvest Days -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-earth-glow); animation-delay: 0.3s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Active Harvest Days</div>
            <span style="font-size: 15px;">🌿</span>
          </div>
          <div class="stat-value">${totalActiveDays} <span style="font-size: 15px; color: var(--text-tertiary);">/ ${activeDaysDenominator}</span></div>
          <div class="stat-caption">${consistencyRate}% active consistency</div>
        </div>

        <!-- Crystal Element: Total Yearly Volume -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-crystal-glow); animation-delay: 0.45s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Total Focus Volume</div>
            <span style="font-size: 15px;">💎</span>
          </div>
          <div class="stat-value tabular-nums">${yearlyHours} <span style="font-size: 15px; color: var(--text-tertiary);">hours</span></div>
          <div class="stat-caption">${totalTasksCompleted} outcomes completed</div>
        </div>
      </div>

      <!-- Matrix Canvas Card: 3D Landscape Canvas -->
      <div class="glass-panel" style="padding: 26px; position: relative; overflow: hidden; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 15px; font-weight: 700; color: #fff;">
              ${selectedYear} Dot Matrix (53 Weeks • Jan 1 – Dec 31)
            </span>
            <span style="font-size: 12px; color: var(--text-tertiary); background: rgba(255, 255, 255, 0.05); padding: 2px 8px; border-radius: var(--radius-full);">
              ${totalDaysInYear} Days Total
            </span>
          </div>
          
          <div class="dot-legend-row" style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-tertiary);">
            <span>Past/Rest</span>
            <span class="day-dot" style="cursor: default; width: 12px; height: 12px; background: rgba(255, 255, 255, 0.06);"></span>
            <span class="day-dot lvl-1" style="cursor: default; width: 12px; height: 12px;"></span>
            <span class="day-dot lvl-2" style="cursor: default; width: 12px; height: 12px;"></span>
            <span class="day-dot lvl-3" style="cursor: default; width: 12px; height: 12px;"></span>
            <span class="day-dot lvl-4" style="cursor: default; width: 12px; height: 12px;"></span>
            <span style="margin-right: 6px;">Intense</span>
            
            <span style="display: flex; align-items: center; gap: 4px; margin-left: 6px;">
              <span class="day-dot today-dot" style="cursor: default; width: 12px; height: 12px; background: var(--accent-cyan);"></span>
              <span>Today</span>
            </span>
            
            <span style="display: flex; align-items: center; gap: 4px; margin-left: 6px;">
              <span class="day-dot future-dot" style="cursor: default; width: 12px; height: 12px;"></span>
              <span>Upcoming</span>
            </span>
          </div>
        </div>

        <!-- Systematic Scrollable Grid with Month Headers & Weekday Labels -->
        <div class="dot-grid-scroll-wrap" style="overflow-x: auto; padding-bottom: 12px;">
          <div style="display: flex; gap: 10px; width: max-content;">
            
            <!-- Weekday Row Indicators -->
            <div class="dot-weekday-labels" style="display: grid; grid-template-rows: repeat(7, 15px); gap: 5px; padding-top: 26px; font-size: 10px; font-weight: 600; color: var(--text-tertiary); text-align: right; user-select: none; width: 26px;">
              <span style="line-height: 15px;">Sun</span>
              <span style="line-height: 15px; color: var(--text-secondary);">Mon</span>
              <span style="line-height: 15px;">Tue</span>
              <span style="line-height: 15px; color: var(--text-secondary);">Wed</span>
              <span style="line-height: 15px;">Thu</span>
              <span style="line-height: 15px; color: var(--text-secondary);">Fri</span>
              <span style="line-height: 15px;">Sat</span>
            </div>

            <!-- Main Calendar Block -->
            <div>
              <!-- 53 Columns Month Headers mathematically aligned -->
              <div class="dot-months-row" style="display: grid; grid-template-columns: repeat(53, 15px); gap: 5px; margin-bottom: 8px; font-size: 11px; font-weight: 700; color: var(--text-secondary); user-select: none; height: 18px;">
                ${monthHeaders.map(mh => `
                  <span style="grid-column: ${mh.col}; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.5px; font-size: 10.5px;">
                    ${mh.name}
                  </span>
                `).join('')}
              </div>

              <!-- 53 Columns x 7 Rows Dot Matrix -->
              <div class="dot-year-matrix" style="display: grid; grid-template-rows: repeat(7, 15px); grid-auto-flow: column; grid-auto-columns: 15px; gap: 5px; width: max-content; transform-style: preserve-3d;">
                <!-- Leading offset spacers for first week -->
                ${Array(firstDayOfWeek).fill(0).map(() => `
                  <div class="day-dot spacer-dot"></div>
                `).join('')}

                <!-- All days of the year (1st Jan to 31st Dec) -->
                ${daysData.map(d => renderDayDot(d, activeMetric)).join('')}

                <!-- Trailing offset spacers for final week -->
                ${Array(trailingSpacersCount).fill(0).map(() => `
                  <div class="day-dot spacer-dot"></div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Information Bar -->
        <div style="margin-top: 18px; font-size: 12px; color: var(--text-tertiary); display: flex; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 12px; flex-wrap: wrap; gap: 10px;">
          <span>Hover any dot for instant activity tooltip. Click to open comprehensive Day Inspector.</span>
          <span style="font-family: var(--font-mono); color: var(--accent-cyan);">
            Active Year: ${selectedYear} • Systematic 365-Day Cycle • Refreshes Annually
          </span>
        </div>
      </div>
    </div>

    <!-- Day Inspector Modal Container -->
    <div id="day-inspector-modal" class="modal-backdrop">
      <div class="modal-container" style="max-width: 540px; background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(28px); border: 1px solid var(--border-glass); border-radius: var(--radius-lg);">
        <div class="modal-header">
          <div>
            <h3 id="inspector-modal-date" style="font-size: 17px; font-weight: 700; color: #fff;"></h3>
            <div id="inspector-modal-sub" style="font-size: 12px; color: var(--accent-cyan); font-family: var(--font-mono); margin-top: 2px;"></div>
          </div>
          <button class="btn btn-ghost btn-icon" id="inspector-modal-close" style="width: 28px; height: 28px;">✕</button>
        </div>
        <div class="modal-body" id="inspector-modal-body" style="padding: 16px 0;"></div>
      </div>
    </div>
  `;

  // Bind Metric Switching Pills
  container.querySelectorAll('[data-metric]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeMetric = btn.getAttribute('data-metric');
      renderDotCalendarView(container, navigate);
    });
  });

  // Bind Year Navigator Buttons
  const prevBtn = container.querySelector('#dot-prev-year');
  const nextBtn = container.querySelector('#dot-next-year');
  const jumpBtn = container.querySelector('#dot-jump-today');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      selectedYear--;
      renderDotCalendarView(container, navigate);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      selectedYear++;
      renderDotCalendarView(container, navigate);
    });
  }
  if (jumpBtn) {
    jumpBtn.addEventListener('click', () => {
      selectedYear = currentYear;
      renderDotCalendarView(container, navigate);
    });
  }

  // Bind Day Dot Click to Open Inspector Modal
  const modal = container.querySelector('#day-inspector-modal');
  const modalDate = container.querySelector('#inspector-modal-date');
  const modalSub = container.querySelector('#inspector-modal-sub');
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
      if (!item) return;

      const fullDateStr = item.date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      modalDate.textContent = fullDateStr;

      if (item.isToday) {
        modalSub.textContent = `★ Today • Day ${item.dayOfYear} of ${totalDaysInYear} (${daysLeftInYear} days left in ${selectedYear})`;
      } else if (item.isFuture) {
        modalSub.textContent = `Upcoming Day • In ${item.daysAway} days (${daysLeftInYear} days remaining in ${selectedYear})`;
      } else {
        modalSub.textContent = `Day ${item.dayOfYear} of ${totalDaysInYear} in ${selectedYear}`;
      }

      if (item.isFuture) {
        modalBody.innerHTML = `
          <div class="glass-card" style="padding: 24px; text-align: center; margin-bottom: 16px; border: 1px dashed var(--accent-cyan);">
            <div style="font-size: 32px; margin-bottom: 8px;">⏳</div>
            <h4 style="font-size: 16px; font-weight: 700; color: #FFFFFF; margin-bottom: 6px;">Upcoming Day in ${selectedYear}</h4>
            <p style="font-size: 13.5px; color: var(--text-secondary); max-width: 380px; margin: 0 auto 16px;">
              This date is ${item.daysAway} days ahead. There are ${daysLeftInYear} days remaining in the year to build momentum.
            </p>
            <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 12px; color: var(--accent-cyan); background: rgba(6, 182, 212, 0.1); padding: 6px 14px; border-radius: var(--radius-full);">
              <span>💡 Tip:</span> Schedule future deep work milestones in your Tasks cockpit.
            </div>
          </div>
        `;
        modal.classList.add('open');
        return;
      }

      // Past or Today: render full rich metrics
      const fH = Math.floor(item.focusMinutes / 60);
      const fM = item.focusMinutes % 60;
      const daySessions = sessions.filter(s => s.startTime && s.startTime.startsWith(dStr));
      const dayTasks = tasks.filter(t => t.completed && t.completedAt && t.completedAt.startsWith(dStr));
      const habitRate = store.getDailyHabitCompletionRate(dStr);
      const habits = store.getHabits();

      modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(115px, 1fr)); gap: 10px; margin-bottom: 20px;">
          <div class="glass-card" style="padding: 12px 14px; border-bottom: 2px solid var(--accent-cyan);">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Focus Time</span>
            <div style="font-size: 19px; font-weight: 800; color: #fff; margin-top: 2px;">${fH}h ${fM}m</div>
          </div>
          <div class="glass-card" style="padding: 12px 14px; border-bottom: 2px solid var(--accent-primary);">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Outcomes</span>
            <div style="font-size: 19px; font-weight: 800; color: #fff; margin-top: 2px;">${item.tasksDone}</div>
          </div>
          <div class="glass-card" style="padding: 12px 14px; border-bottom: 2px solid var(--accent-amber);">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Productivity</span>
            <div style="font-size: 19px; font-weight: 800; color: var(--accent-amber); margin-top: 2px;">${item.score}/100</div>
          </div>
          <div class="glass-card" style="padding: 12px 14px; border-bottom: 2px solid var(--accent-emerald);">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Habits Rate</span>
            <div style="font-size: 19px; font-weight: 800; color: var(--accent-emerald); margin-top: 2px;">${habitRate.completed}/${habitRate.total} <span style="font-size: 11px; font-weight: 500; color: var(--text-tertiary);">(${Math.round(habitRate.rate * 100)}%)</span></div>
          </div>
        </div>

        <h4 style="font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; color: var(--text-secondary);">
          Protocol Checklist (${habitRate.completed}/${habitRate.total})
        </h4>
        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 150px; overflow-y: auto; margin-bottom: 18px;">
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
          Logged Focus Sessions (${daySessions.length})
        </h4>
        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 140px; overflow-y: auto; margin-bottom: 18px;">
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

        ${dayTasks.length > 0 ? `
          <h4 style="font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; color: var(--text-secondary);">
            Completed Outcomes (${dayTasks.length})
          </h4>
          <div style="display: flex; flex-direction: column; gap: 6px; max-height: 120px; overflow-y: auto;">
            ${dayTasks.map(t => `
              <div class="glass-card" style="padding: 6px 12px; font-size: 12.5px; display: flex; align-items: center; gap: 8px;">
                <span style="color: var(--accent-emerald);">✓</span>
                <span style="font-weight: 500;">${t.title}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      `;
      modal.classList.add('open');
    });
  });
}

function renderDayDot(d, metric) {
  // If future date, render future dot
  if (d.isFuture) {
    const tooltipText = `${d.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • Upcoming (${d.daysAway} days away)`;
    return `<div class="day-dot future-dot" data-date="${d.dateStr}" title="${tooltipText}"></div>`;
  }

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
    if (d.tasksDone >= 4) level = 4;
    else if (d.tasksDone >= 3) level = 3;
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
  const todayClass = d.isToday ? 'today-dot' : '';

  return `<div class="day-dot ${lvlClass} ${todayClass}" data-date="${d.dateStr}" title="${tooltipText}"></div>`;
}
