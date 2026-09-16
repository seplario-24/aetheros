/**
 * AETHER OS — IMMERSIVE FOCUS COCKPIT
 * 4 deep work modes, circular SVG progress ring, Zen fullscreen mode,
 * ambient soundscape controls, YouTube Music dock, and drift-free timer integration.
 */

import { store } from '../store/db.js';
import { timerEngine } from '../engine/timer.js';
import { ambientAudio } from '../audio/ambient.js';
import { musicController, FOCUS_STATIONS } from '../audio/music.js';

let unsubscribeTimer = null;

export function renderFocusView(container, navigate) {
  const tasks = store.getTasks().filter(t => !t.completed);
  const snap = timerEngine.getSnapshot();
  const currentTask = snap.activeTask || tasks[0] || null;

  container.innerHTML = `
    <div class="animate-fade-in focus-cockpit-view">
      <!-- Mode Switcher -->
      <div class="focus-mode-selector">
        <button class="focus-mode-btn ${snap.mode === 'task' ? 'active' : ''}" data-mode="task">Task Focus</button>
        <button class="focus-mode-btn ${snap.mode === 'pomodoro' ? 'active' : ''}" data-mode="pomodoro">Pomodoro (25/5)</button>
        <button class="focus-mode-btn ${snap.mode === 'sprint' ? 'active' : ''}" data-mode="sprint">Focus Sprint</button>
        <button class="focus-mode-btn ${snap.mode === 'ultradian' ? 'active' : ''}" data-mode="ultradian">Ultradian (90/20)</button>
      </div>

      <!-- Active Task Selector (if in task mode) -->
      <div style="margin-bottom: 24px; display: flex; align-items: center; gap: 10px; max-width: 400px; width: 100%;">
        <span style="font-size: 13px; color: var(--text-tertiary); white-space: nowrap;">Target:</span>
        <select id="focus-task-select" class="glass-input" style="font-size: 13.5px; padding: 6px 12px; cursor: pointer;">
          <option value="">-- No specific task (Pure Focus) --</option>
          ${tasks.map(t => `<option value="${t.id}" ${currentTask && currentTask.id === t.id ? 'selected' : ''}>${t.title} (${t.estimatedDuration}m)</option>`).join('')}
        </select>
      </div>

      <!-- Circular Timer Display: Floating Glass Clock -->
      <div class="glass-clock-stage ${snap.isRunning ? 'focus-running' : ''}" id="clock-stage">
        <div class="glass-clock-dial">
          <svg class="focus-progress-svg" viewBox="0 0 320 320">
            <circle cx="160" cy="160" r="140" fill="none" stroke="var(--border-subtle)" stroke-width="8"></circle>
            <circle id="timer-progress-ring" cx="160" cy="160" r="140" fill="none" stroke="var(--accent-primary)" stroke-width="8"
              stroke-dasharray="879.6" stroke-dashoffset="${879.6 * (1 - snap.progressRatio)}" stroke-linecap="round"
              style="transition: stroke-dashoffset 0.3s ease, stroke var(--transition-normal); filter: drop-shadow(0 0 8px var(--accent-primary-glow));">
            </circle>
          </svg>

          <div class="timer-inner-card">
            <span class="timer-phase-badge" id="timer-phase-label">
              ${snap.phase === 'focus' ? (snap.mode === 'ultradian' ? 'Deep Work Cycle' : 'Focus Phase') : snap.phase.replace('-', ' ')}
            </span>
            <div class="timer-time-text tabular-nums" id="timer-countdown-text">${snap.formattedTime}</div>
            <div class="timer-target-task" id="timer-target-name">
              ${currentTask ? currentTask.title : 'Deep Uninterrupted Work'}
            </div>
            ${snap.mode === 'pomodoro' ? `<span style="font-size: 11px; color: var(--text-tertiary);" id="pomodoro-cycle-label">Cycle ${snap.pomodoroCycle} of 4</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Physical Pomodoro Milestone Beads -->
      ${snap.mode === 'pomodoro' ? `
        <div class="pomodoro-beads-row" id="pomodoro-beads-wrap">
          ${[1, 2, 3, 4].map(num => {
            const isCompleted = snap.pomodoroCycle > num;
            const isActive = snap.pomodoroCycle === num && snap.isRunning;
            return `<div class="pomodoro-bead ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}" title="Cycle ${num} of 4"></div>`;
          }).join('')}
        </div>
      ` : ''}

      <!-- Controls Row -->
      <div class="focus-controls-row">
        <button class="btn btn-ghost btn-icon" id="btn-timer-stop" title="Reset Session" style="width: 44px; height: 44px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          </svg>
        </button>

        <button class="btn btn-primary btn-focus-primary" id="btn-timer-main-toggle">
          ${snap.isRunning ? `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
            Pause
          ` : `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start Focus
          `}
        </button>

        <button class="btn btn-secondary btn-icon" id="btn-timer-extend" title="Extend +5 Minutes" style="width: 44px; height: 44px; font-weight: 600; font-size: 13px;">
          +5m
        </button>

        <button class="btn btn-secondary btn-icon" id="btn-timer-finish" title="Finish Session Early" style="width: 44px; height: 44px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>

      <!-- Bottom Audio & Zen Bar -->
      <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center; margin-top: 10px;">
        <!-- Ambient Sound Switcher -->
        <div class="glass-card" style="padding: 6px 14px; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 13px;">🎧</span>
          <select id="focus-ambient-select" class="glass-input" style="border: none; background: transparent; padding: 2px 6px; font-size: 12.5px; cursor: pointer; width: 140px;">
            <option value="none">No Sound</option>
            <option value="rain" ${ambientAudio.currentTrack === 'rain' ? 'selected' : ''}>Rain & Thunder</option>
            <option value="binaural" ${ambientAudio.currentTrack === 'binaural' ? 'selected' : ''}>10Hz Binaural</option>
            <option value="cosmos" ${ambientAudio.currentTrack === 'cosmos' ? 'selected' : ''}>Cosmos Drone</option>
            <option value="forest" ${ambientAudio.currentTrack === 'forest' ? 'selected' : ''}>Forest Night</option>
          </select>
        </div>

        <!-- YouTube Music Quick Station -->
        <div class="glass-card" style="padding: 6px 14px; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 13px;">🎵</span>
          <select id="focus-music-station" class="glass-input" style="border: none; background: transparent; padding: 2px 6px; font-size: 12.5px; cursor: pointer; width: 160px;">
            ${FOCUS_STATIONS.map(s => `<option value="${s.id}">${s.title}</option>`).join('')}
          </select>
          <button class="btn btn-ghost btn-icon" id="btn-focus-music-open" title="Open in YouTube Music" style="width: 26px; height: 26px; font-size: 11px;">
            ↗
          </button>
        </div>

        <!-- Zen Distraction Free Fullscreen -->
        <button class="btn btn-secondary" id="btn-toggle-zen" style="padding: 6px 16px; font-size: 12.5px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
          </svg>
          Zen Mode
        </button>
      </div>
    </div>
  `;

  // Real-time Timer Listener
  if (unsubscribeTimer) unsubscribeTimer();
  unsubscribeTimer = timerEngine.subscribe((eventType, s) => {
    const timeEl = container.querySelector('#timer-countdown-text');
    const ringEl = container.querySelector('#timer-progress-ring');
    const phaseEl = container.querySelector('#timer-phase-label');
    const btnToggle = container.querySelector('#btn-timer-main-toggle');
    const clockStage = container.querySelector('#clock-stage');

    if (clockStage) {
      if (s.isRunning) clockStage.classList.add('focus-running');
      else clockStage.classList.remove('focus-running');
    }

    if (timeEl) timeEl.textContent = s.formattedTime;
    if (ringEl) ringEl.style.strokeDashoffset = String(879.6 * (1 - s.progressRatio));
    if (phaseEl) phaseEl.textContent = s.phase === 'focus' ? (s.mode === 'ultradian' ? 'Deep Work Cycle' : 'Focus Phase') : s.phase.replace('-', ' ');

    const beadsWrap = container.querySelector('#pomodoro-beads-wrap');
    if (beadsWrap && s.mode === 'pomodoro') {
      const beads = beadsWrap.querySelectorAll('.pomodoro-bead');
      beads.forEach((bead, idx) => {
        const num = idx + 1;
        bead.classList.toggle('completed', s.pomodoroCycle > num);
        bead.classList.toggle('active', s.pomodoroCycle === num && s.isRunning);
      });
    }

    if (btnToggle) {
      btnToggle.innerHTML = s.isRunning ? `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        Pause
      ` : `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Start Focus
      `;
    }
  });

  // Mode buttons
  container.querySelectorAll('.focus-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      const prefs = store.getPreferences();

      let dur = 25;
      if (mode === 'pomodoro') dur = prefs.defaultFocusDuration || 25;
      else if (mode === 'sprint') dur = prefs.defaultSprintDuration || 45;
      else if (mode === 'ultradian') dur = prefs.ultradianFocusDuration || 90;
      else if (currentTask) dur = currentTask.estimatedDuration;

      timerEngine.configure({
        mode,
        durationMinutes: dur,
        task: mode === 'task' ? currentTask : null,
        phase: 'focus'
      });

      renderFocusView(container, navigate);
    });
  });

  // Task Selector
  const taskSelect = container.querySelector('#focus-task-select');
  taskSelect.addEventListener('change', (e) => {
    const taskId = e.target.value;
    const task = store.getTaskById(taskId);
    timerEngine.configure({
      mode: 'task',
      durationMinutes: task ? task.estimatedDuration : 25,
      task
    });
    renderFocusView(container, navigate);
  });

  // Timer controls
  const btnToggle = container.querySelector('#btn-timer-main-toggle');
  btnToggle.addEventListener('click', () => {
    if (timerEngine.isRunning) timerEngine.pause();
    else timerEngine.start();
  });

  container.querySelector('#btn-timer-stop').addEventListener('click', () => {
    timerEngine.stop();
  });

  container.querySelector('#btn-timer-extend').addEventListener('click', () => {
    timerEngine.extend(5);
  });

  container.querySelector('#btn-timer-finish').addEventListener('click', () => {
    timerEngine.finishEarly();
  });

  // Ambient sound selector
  const ambientSelect = container.querySelector('#focus-ambient-select');
  ambientSelect.addEventListener('change', (e) => {
    ambientAudio.setTrack(e.target.value);
  });

  // Music station selector
  const musicSelect = container.querySelector('#focus-music-station');
  musicSelect.addEventListener('change', (e) => {
    musicController.selectStation(e.target.value);
  });

  container.querySelector('#btn-focus-music-open').addEventListener('click', () => {
    musicController.openExternalMusic();
  });

  // Zen Mode toggle
  container.querySelector('#btn-toggle-zen').addEventListener('click', () => {
    document.body.classList.toggle('zen-mode');
  });
}
