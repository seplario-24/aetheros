/**
 * AETHER OS — COMMAND CENTER (HOME VIEW)
 * 3D Elemental World: Spatial home composition with elemental floating cards,
 * physical task objects, crystal habit tiles, and dimensional stat widgets.
 */

import { store, MOTIVATIONAL_QUOTES } from '../store/db.js';
import { timerEngine } from '../engine/timer.js';
import { ambientAudio } from '../audio/ambient.js';

// Elemental color identity per stat type
const STAT_ELEMENTS = {
  tasks:   { glow: 'var(--el-crystal-glow)',  color: 'var(--el-crystal)',  bg: 'var(--el-crystal-glass)',  icon: '◈' },
  focus:   { glow: 'var(--el-water-glow)',    color: 'var(--el-water)',    bg: 'var(--el-water-glass)',    icon: '◉' },
  sleep:   { glow: 'var(--el-air-glow)',      color: 'var(--el-air)',      bg: 'var(--el-air-glass)',      icon: '☽' },
  streak:  { glow: 'var(--el-fire-glow)',     color: 'var(--el-fire)',     bg: 'var(--el-fire-glass)',     icon: '◆' }
};

export function renderHomeView(container, navigate) {
  const prefs = store.getPreferences();
  const tasks = store.getTasks();
  const focusSessions = store.getFocusSessions();
  const sleepRecords = store.getSleepRecords();

  const now = new Date();
  const todayIso = now.toISOString().split('T')[0];
  const habitSummary = store.getTodayHabitSummary();
  const habits = store.getHabits();

  // Dynamic greeting
  const hour = now.getHours();
  let greeting = 'Good morning';
  let greetEmoji = '🌅';
  if (hour >= 12 && hour < 17) { greeting = 'Good afternoon'; greetEmoji = '☀️'; }
  else if (hour >= 17 && hour < 22) { greeting = 'Good evening'; greetEmoji = '🌆'; }
  else if (hour >= 22 || hour < 5)  { greeting = 'Late night focus'; greetEmoji = '🌙'; }

  // Today's tasks
  const todayTasks = tasks.filter(t => {
    if (t.scheduledStart && t.scheduledStart.startsWith(todayIso)) return true;
    if (t.createdAt && t.createdAt.startsWith(todayIso)) return true;
    return false;
  });

  const completedCount = todayTasks.filter(t => t.completed).length;
  const totalCount = todayTasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Focus time today
  const todaySessions = focusSessions.filter(s => s.startTime && s.startTime.startsWith(todayIso));
  const totalFocusMinutes = todaySessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0);
  const focusHours = Math.floor(totalFocusMinutes / 60);
  const focusMins = totalFocusMinutes % 60;
  const focusStr = focusHours > 0 ? `${focusHours}h ${focusMins}m` : `${totalFocusMinutes}m`;

  // Sleep
  const todaySleep = sleepRecords.find(r => r.date === todayIso) || sleepRecords[0];
  const sleepDurationMins = todaySleep ? todaySleep.durationMinutes : 450;
  const sHours = Math.floor(sleepDurationMins / 60);
  const sMins = sleepDurationMins % 60;

  // Up next task
  const incompleteTasks = todayTasks.filter(t => !t.completed);
  const upNextTask = incompleteTasks.find(t => t.priority === 'critical') ||
                     incompleteTasks.find(t => t.priority === 'high') ||
                     incompleteTasks[0] || null;

  let contextualSub = `${incompleteTasks.length} task${incompleteTasks.length === 1 ? '' : 's'} remaining today.`;
  if (totalFocusMinutes > 0) contextualSub += ` ${focusStr} of deep focus logged.`;

  const quotesList = (Array.isArray(MOTIVATIONAL_QUOTES) && MOTIVATIONAL_QUOTES.length > 0)
    ? MOTIVATIONAL_QUOTES
    : [{ quote: "Focus on the work, not the clock.", author: "Productivity Principle" }];
  const qIdx = (typeof prefs.quoteIndex === 'number' && !isNaN(prefs.quoteIndex)) ? prefs.quoteIndex : 0;
  const currentQuote = quotesList[Math.abs(qIdx) % quotesList.length] || quotesList[0];

  // Up-next category glow
  const upNextCat = upNextTask ? store.getCategoryById(upNextTask.categoryId) : null;
  const upNextGlow = upNextCat ? upNextCat.color + '30' : 'var(--el-crystal-soft)';

  container.innerHTML = `
    <div class="animate-fade-in-scale home-3d-world">

      <!-- ─── Hero Section — Spatial greeting ─── -->
      <div class="home-hero-section">
        <div class="home-greeting-wrap">
          <div class="home-greeting-eyebrow">
            ${greetEmoji}
            <span>${now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 class="greeting-title">${greeting}, ${prefs.userName}.</h1>
          <p class="greeting-subtitle">${contextualSub}</p>
        </div>
        <div class="home-quote-float">
          <span class="elemental-quote-mark">"</span>
          <p class="elemental-quote">${currentQuote.quote || currentQuote.text || 'Focus on the essential.'}</p>
          <span style="font-size: 11px; color: var(--text-muted); margin-top: 6px; display: block;">— ${currentQuote.author || 'Productivity Protocol'}</span>
        </div>
      </div>

      <!-- ─── Elemental Stat Cards ─── -->
      <div class="stats-overview-grid" style="margin-bottom: 24px;">

        <!-- Daily Progress — Crystal element -->
        <div class="spatial-floating-card stat-card animate-float"
             style="--stat-element-glow: var(--el-crystal-glow); animation-delay: 0s;">
          <div class="stat-header">
            <span style="display: flex; align-items: center; gap: 7px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--el-crystal); box-shadow: 0 0 8px var(--el-crystal-glow); display:inline-block;"></span>
              Daily Progress
            </span>
            <span style="font-size: 13px; font-weight: 700; color: var(--el-crystal);">${progressPct}%</span>
          </div>
          <div class="stat-value" style="color: var(--el-crystal);">
            ${completedCount}<span style="font-size: 16px; font-weight: 500; color: var(--text-tertiary);">/${totalCount} tasks</span>
          </div>
          <div class="progress-track-3d">
            <div class="progress-fill-3d" style="width: ${progressPct}%; background: linear-gradient(90deg, var(--el-crystal) 0%, var(--el-air) 100%);"></div>
          </div>
        </div>

        <!-- Focus Time — Water element -->
        <div class="spatial-floating-card stat-card animate-float"
             style="--stat-element-glow: var(--el-water-glow); animation-delay: 0.15s;">
          <div class="stat-header">
            <span style="display: flex; align-items: center; gap: 7px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--el-water); box-shadow: 0 0 8px var(--el-water-glow); display:inline-block;"></span>
              Focus Time
            </span>
            <span class="badge" style="background: var(--el-water-glass); color: var(--el-water); font-size: 10px; border: 1px solid var(--el-water-soft);">Deep Work</span>
          </div>
          <div class="stat-value tabular-nums" style="color: var(--el-water);">${focusStr}</div>
          <div class="stat-caption">${todaySessions.length} session${todaySessions.length === 1 ? '' : 's'} recorded</div>
        </div>

        <!-- Sleep — Air element -->
        <div class="spatial-floating-card stat-card animate-float"
             style="--stat-element-glow: var(--el-air-glow); animation-delay: 0.3s;">
          <div class="stat-header">
            <span style="display: flex; align-items: center; gap: 7px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--el-air); box-shadow: 0 0 8px var(--el-air-glow); display:inline-block;"></span>
              Sleep
            </span>
            <span class="badge" style="background: var(--el-air-glass); color: var(--el-air); font-size: 10px; border: 1px solid var(--el-air-soft);">Rested</span>
          </div>
          <div class="stat-value tabular-nums" style="color: var(--el-air);">${sHours}h ${sMins}m</div>
          <div class="stat-caption">Woke at ${todaySleep ? todaySleep.wakeTime : '07:15'}</div>
        </div>

        <!-- Streak — Fire element -->
        <div class="spatial-floating-card stat-card animate-float"
             style="--stat-element-glow: var(--el-fire-glow); animation-delay: 0.45s;">
          <div class="stat-header">
            <span style="display: flex; align-items: center; gap: 7px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--el-fire); box-shadow: 0 0 8px var(--el-fire-glow); display:inline-block;"></span>
              Focus Streak
            </span>
            <span style="color: var(--el-fire); font-size: 18px;">🔥</span>
          </div>
          <div class="stat-value" style="color: var(--el-fire);">
            14 <span style="font-size: 16px; font-weight: 500; color: var(--text-tertiary);">days</span>
          </div>
          <div class="stat-caption">Best: 21 days</div>
        </div>

      </div>

      <!-- ─── Up Next Spotlight — Dimensional Slab ─── -->
      ${upNextTask ? `
        <div class="spatial-floating-card up-next-spotlight"
             style="--up-next-glow: ${upNextCat ? upNextCat.color + '28' : 'var(--el-crystal-soft)'}; margin-bottom: 24px;">

          <!-- Category elemental material strip -->
          <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: ${upNextCat ? upNextCat.color : 'var(--el-crystal)'}; border-radius: var(--radius-lg) 0 0 var(--radius-lg); box-shadow: 4px 0 16px ${upNextCat ? upNextCat.color + '40' : 'var(--el-crystal-glow)'}; pointer-events: none;"></div>

          <div class="up-next-left" style="padding-left: 16px;">
            <div class="up-next-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Up Next For Focus
            </div>
            <div class="up-next-title">${upNextTask.title}</div>
            <div class="up-next-meta">
              <span class="badge cat-badge">
                <span class="cat-dot" style="background: ${upNextCat ? upNextCat.color : 'var(--el-crystal)'}"></span>
                ${upNextCat ? upNextCat.name : 'Task'}
              </span>
              <span>⏱ ${upNextTask.estimatedDuration} min</span>
              <span class="badge priority-${upNextTask.priority}">${upNextTask.priority}</span>
            </div>
          </div>

          <button class="btn btn-primary btn-focus-trigger" data-task-id="${upNextTask.id}"
                  style="padding: 13px 28px; font-size: 14px; border-radius: var(--radius-full); z-index: 2; flex-shrink: 0;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start Focus
          </button>
        </div>
      ` : `
        <div class="spatial-floating-card up-next-spotlight" style="justify-content: center; text-align: center; padding: 32px; margin-bottom: 24px;">
          <div>
            <div style="font-size: 36px; margin-bottom: 12px;">✦</div>
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 6px;">All tasks complete</h3>
            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 18px;">You've conquered your planned objectives. Your time is yours.</p>
            <button class="btn btn-secondary" id="btn-home-quick-add">+ Schedule New Task</button>
          </div>
        </div>
      `}

      <!-- ─── Today's Habit Discipline Widget ─── -->
      <div class="glass-panel home-habit-widget">
        <div class="home-habit-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="habit-icon-orb" style="background: var(--el-crystal-glass); border: 1px solid var(--el-crystal-soft); color: var(--el-crystal); width: 34px; height: 34px; font-size: 16px;">⚡</div>
            <div>
              <h3 style="font-size: 15px; font-weight: 700; margin: 0;">Today's Habit Discipline</h3>
              <p style="font-size: 11.5px; color: var(--text-tertiary); margin: 0;">Tap to cycle: — → ✓ → ✕ → S</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="badge" style="background: var(--el-earth-glass); color: var(--el-earth); border: 1px solid var(--el-earth-soft); font-weight: 700;">
              ${habitSummary.completed} / ${habitSummary.total} · ${habitSummary.completionRate}%
            </span>
            <button class="btn btn-ghost" id="btn-open-habit-matrix" style="font-size: 12px; padding: 5px 12px;">Open Matrix →</button>
          </div>
        </div>
        <div class="home-habit-progress-wrap">
          <div class="home-habit-progress-fill" style="width: ${habitSummary.completionRate}%;"></div>
        </div>
        <div class="home-habit-strip">
          ${habits.map(h => {
            const status = store.getHabitStatus(h.id, todayIso);
            const stats = store.getHabitStats(h.id);
            const symbol = status === 'completed' ? '✓' : status === 'failed' ? '✕' : status === 'skipped' ? 'S' : '—';
            return `
              <div class="home-habit-pill" data-habit-id="${h.id}">
                <div class="home-habit-pill-left">
                  <span style="font-size: 17px;">${h.icon || '🌱'}</span>
                  <div style="min-width: 0;">
                    <div class="home-habit-pill-name" title="${h.name}">${h.name}</div>
                    <div class="home-habit-pill-streak">🔥 ${stats.currentStreak}d</div>
                  </div>
                </div>
                <button class="habit-status-btn status-${status} btn-home-habit-cycle"
                        data-habit-id="${h.id}" data-date="${todayIso}"
                        title="Cycle status: currently ${status}"
                        style="width: 30px; height: 30px; font-size: 12px; border-radius: 8px;">
                  ${symbol}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ─── Two-Column Spatial Layout ─── -->
      <div class="dashboard-grid-split">

        <!-- Today's Priority Agenda — Physical floating task objects -->
        <div class="glass-panel" style="padding: 22px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <h3 style="font-size: 15.5px; font-weight: 700;">Today's Priority Agenda</h3>
              <span class="badge" style="background: var(--bg-surface-elevated); color: var(--text-secondary);">${todayTasks.length}</span>
            </div>
            <button class="btn btn-ghost" id="btn-view-all-tasks" style="font-size: 12.5px;">View All →</button>
          </div>

          <div class="task-items-list" id="home-tasks-container">
            ${todayTasks.length === 0 ? `
              <div style="padding: 36px; text-align: center; color: var(--text-tertiary);">
                <div style="font-size: 32px; margin-bottom: 10px; opacity: 0.5;">◇</div>
                No tasks today. Press <span class="kbd-shortcut">N</span> to add one.
              </div>
            ` : todayTasks.map(task => {
              const cat = store.getCategoryById(task.categoryId);
              return `
                <div class="glass-card task-card ${task.completed ? 'completed' : ''}" data-task-id="${task.id}"
                     style="border-left: 3px solid ${cat.color}; border-left-color: ${cat.color}; position: relative;">
                  <button class="task-checkbox btn-check-task" data-task-id="${task.id}" aria-label="Toggle task">
                    ${task.completed ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>` : ''}
                  </button>
                  <div class="task-info-center">
                    <span class="task-title">${task.title}</span>
                    <div class="task-meta-row">
                      <span class="badge cat-badge">
                        <span class="cat-dot" style="background: ${cat.color}; box-shadow: 0 0 5px ${cat.color}80;"></span>
                        ${cat.name}
                      </span>
                      <span>⏱ ${task.estimatedDuration}m</span>
                      ${task.priority !== 'none' ? `<span class="badge priority-${task.priority}">${task.priority}</span>` : ''}
                    </div>
                  </div>
                  <div class="task-actions-right">
                    ${!task.completed ? `
                      <button class="btn btn-ghost btn-icon btn-start-task-focus" data-task-id="${task.id}" title="Start Focus">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      </button>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right column: Focus Rhythm + Deep Work Modes -->
        <div style="display: flex; flex-direction: column; gap: 18px;">

          <!-- 7-Day Focus Rhythm — Spatial 3D bars -->
          <div class="glass-panel" style="padding: 22px;">
            <h3 style="font-size: 15px; font-weight: 700; margin-bottom: 16px;">Weekly Focus Rhythm</h3>
            <div class="chart-3d-container" style="height: 100px;">
              ${getWeeklySparklineData(focusSessions).map((d, i) => `
                <div class="chart-3d-bar-wrap">
                  <div class="chart-3d-bar"
                       style="height: ${Math.max(6, (d.minutes / 240) * 80)}px;
                              background: ${d.isToday
                                ? 'linear-gradient(180deg, var(--el-crystal) 0%, var(--el-crystal-deep) 100%)'
                                : 'linear-gradient(180deg, var(--border-glass) 0%, var(--bg-surface-elevated) 100%)'};
                              box-shadow: ${d.isToday ? '0 4px 16px var(--el-crystal-glow)' : 'none'};"
                       title="${d.dayName}: ${Math.round(d.minutes / 60)}h focus">
                  </div>
                  <div class="chart-3d-label"
                       style="color: ${d.isToday ? 'var(--el-crystal)' : 'var(--text-muted)'};
                              font-weight: ${d.isToday ? '700' : '500'};">
                    ${d.dayName}
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="margin-top: 14px; display: flex; justify-content: space-between; font-size: 11.5px; color: var(--text-tertiary);">
              <span>Daily avg: ~3h 45m</span>
              <span style="color: var(--el-earth);">↑ +12% vs last week</span>
            </div>
          </div>

          <!-- Deep Work Modes — Physical control objects -->
          <div class="glass-panel" style="padding: 22px; display: flex; flex-direction: column; gap: 10px;">
            <h3 style="font-size: 15px; font-weight: 700; margin-bottom: 4px;">Deep Work Modes</h3>

            <button class="btn btn-secondary btn-launch-pomodoro"
                    style="justify-content: flex-start; padding: 13px 16px; border-left: 3px solid var(--el-fire); gap: 12px;">
              <span style="font-size: 18px;">🍅</span>
              <div style="text-align: left;">
                <div style="font-weight: 700; font-size: 13px;">25m Pomodoro</div>
                <div style="font-size: 11px; color: var(--text-tertiary);">Classic 25 min work + 5 min break</div>
              </div>
            </button>

            <button class="btn btn-secondary btn-launch-ultradian"
                    style="justify-content: flex-start; padding: 13px 16px; border-left: 3px solid var(--el-crystal); gap: 12px;">
              <span style="font-size: 18px;">⚡</span>
              <div style="text-align: left;">
                <div style="font-weight: 700; font-size: 13px;">90m Ultradian Sprint</div>
                <div style="font-size: 11px; color: var(--text-tertiary);">Deep biological 90m cycle + 20m rest</div>
              </div>
            </button>

            <button class="btn btn-ghost btn-launch-bored"
                    style="justify-content: flex-start; padding: 11px 16px; color: var(--el-water); border-left: 3px solid var(--el-water); gap: 12px;">
              <span style="font-size: 18px;">🧩</span>
              <div style="text-align: left;">
                <div style="font-weight: 700; font-size: 13px;">I'm Bored — 2m Mind Game</div>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  `;

  // ── EVENT BINDINGS ──

  // Task completion with particle burst
  container.querySelectorAll('.btn-check-task').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = btn.getAttribute('data-task-id');
      const updated = store.toggleTaskCompleted(taskId);
      if (updated && updated.completed) {
        ambientAudio.playChime();
        // Particle wow moment
        const card = container.querySelector(`[data-task-id="${taskId}"].task-card`);
        if (card && window.ParticleSystem) {
          window.ParticleSystem.burst(card, '#10B981', 14);
        }
      }
    });
  });

  container.querySelectorAll('.btn-focus-trigger, .btn-start-task-focus').forEach(btn => {
    btn.addEventListener('click', () => {
      const taskId = btn.getAttribute('data-task-id');
      const task = store.getTaskById(taskId);
      if (task) {
        timerEngine.configure({ mode: 'task', durationMinutes: task.estimatedDuration, task });
        timerEngine.start();
        if (window.ParticleSystem) window.ParticleSystem.focusStart('var(--el-crystal)', 20);
        navigate('focus');
      }
    });
  });

  // Open Edit Task Modal on clicking Up-Next priority spotlight
  const upNextLeft = container.querySelector('.up-next-left');
  if (upNextLeft && upNextTask) {
    upNextLeft.style.cursor = 'pointer';
    upNextLeft.title = 'Click to edit outcome details';
    upNextLeft.addEventListener('click', () => {
      window.aetherEditTask?.open(upNextTask);
    });
  }

  // Open Edit Task Modal on clicking task info in Home tasks list
  container.querySelectorAll('#home-tasks-container .task-info-center').forEach(info => {
    info.style.cursor = 'pointer';
    info.title = 'Click to edit outcome details';
    info.addEventListener('click', () => {
      const card = info.closest('.task-card');
      if (card) {
        const taskId = card.getAttribute('data-task-id');
        const task = store.getTaskById(taskId);
        if (task && window.aetherEditTask) {
          window.aetherEditTask.open(task);
        }
      }
    });
  });

  const btnViewAll = container.querySelector('#btn-view-all-tasks');
  if (btnViewAll) btnViewAll.addEventListener('click', () => navigate('tasks'));

  const btnQuickAdd = container.querySelector('#btn-home-quick-add');
  if (btnQuickAdd) btnQuickAdd.addEventListener('click', () => window.aetherQuickAdd?.open());

  const btnPomo = container.querySelector('.btn-launch-pomodoro');
  if (btnPomo) btnPomo.addEventListener('click', () => {
    timerEngine.configure({ mode: 'pomodoro', durationMinutes: 25 });
    timerEngine.start();
    navigate('focus');
  });

  const btnUltra = container.querySelector('.btn-launch-ultradian');
  if (btnUltra) btnUltra.addEventListener('click', () => {
    timerEngine.configure({ mode: 'ultradian', durationMinutes: 90 });
    timerEngine.start();
    navigate('focus');
  });

  const btnBored = container.querySelector('.btn-launch-bored');
  if (btnBored) btnBored.addEventListener('click', () => navigate('games'));

  const btnMatrix = container.querySelector('#btn-open-habit-matrix');
  if (btnMatrix) btnMatrix.addEventListener('click', () => navigate('habits'));

  container.querySelectorAll('.btn-home-habit-cycle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const habitId = btn.getAttribute('data-habit-id');
      const date = btn.getAttribute('data-date');
      const newStatus = store.cycleHabitStatus(habitId, date);
      if (newStatus === 'completed') {
        ambientAudio.playChime();
        const pill = container.querySelector(`[data-habit-id="${habitId}"].home-habit-pill`);
        if (pill && window.ParticleSystem) window.ParticleSystem.tileBloom(pill, '#10B981');
      }
      renderHomeView(container, navigate);
    });
  });
}

function getWeeklySparklineData(sessions) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];

    const daySessions = sessions.filter(s => s.startTime && s.startTime.startsWith(dStr));
    const totalMins = daySessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0);

    result.push({
      dateStr: dStr,
      dayName: days[d.getDay()].slice(0, 2),
      minutes: totalMins || (i > 0 ? 100 + (i * 40) % 100 : 60),
      isToday: i === 0
    });
  }

  return result;
}
