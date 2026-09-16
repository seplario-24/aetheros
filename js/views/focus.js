/**
 * AETHER OS — IMMERSIVE 3D FOCUS COCKPIT
 * Glass sphere timer stage, orbital pomodoro crystal beads,
 * elemental deep work modes (Water/Fire/Light/Crystal), 
 * interactive particle ignition, and floating ambient soundscape dock.
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

  // Elemental color identity based on mode
  let modeElementGlow = 'var(--el-water-glow)';
  let modeElementBorder = 'var(--el-water-glass)';
  if (snap.mode === 'pomodoro') {
    modeElementGlow = 'var(--el-coral-glow)';
    modeElementBorder = 'var(--el-coral-glass)';
  } else if (snap.mode === 'sprint') {
    modeElementGlow = 'var(--el-light-glow)';
    modeElementBorder = 'var(--el-light-glass)';
  } else if (snap.mode === 'ultradian') {
    modeElementGlow = 'var(--el-crystal-glow)';
    modeElementBorder = 'var(--el-crystal-glass)';
  }

  container.innerHTML = `
    <div class="animate-fade-in focus-cockpit-view" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: calc(100vh - 130px); position: relative; perspective: 1200px;">
      
      <!-- Ambient Elemental Glow Behind Sphere -->
      <div style="position: absolute; top: 46%; left: 50%; transform: translate(-50%, -50%); width: 440px; height: 440px; border-radius: 50%; background: ${modeElementGlow}; filter: blur(80px); opacity: ${snap.isRunning ? '0.45' : '0.2'}; pointer-events: none; transition: opacity 0.8s ease, background 0.8s ease; z-index: 0;"></div>

      <!-- Mode Selector: Tactile Elemental Pills -->
      <div class="focus-mode-selector" style="position: relative; z-index: 2; display: flex; gap: 8px; margin-bottom: 22px; background: rgba(15, 23, 42, 0.4); padding: 5px; border-radius: var(--radius-full); border: 1px solid var(--border-glass); backdrop-filter: blur(16px); box-shadow: var(--shadow-glass);">
        <button class="focus-mode-btn ${snap.mode === 'task' ? 'active' : ''}" data-mode="task" style="display: flex; align-items: center; gap: 6px;">
          <span>💧</span>
          <span>Task Flow</span>
        </button>
        <button class="focus-mode-btn ${snap.mode === 'pomodoro' ? 'active' : ''}" data-mode="pomodoro" style="display: flex; align-items: center; gap: 6px;">
          <span>🔥</span>
          <span>Pomodoro (25/5)</span>
        </button>
        <button class="focus-mode-btn ${snap.mode === 'sprint' ? 'active' : ''}" data-mode="sprint" style="display: flex; align-items: center; gap: 6px;">
          <span>⚡</span>
          <span>Sprint (45m)</span>
        </button>
        <button class="focus-mode-btn ${snap.mode === 'ultradian' ? 'active' : ''}" data-mode="ultradian" style="display: flex; align-items: center; gap: 6px;">
          <span>💎</span>
          <span>Ultradian (90m)</span>
        </button>
      </div>

      <!-- Active Task Selector (Tactile Glass Pill) -->
      <div style="position: relative; z-index: 2; margin-bottom: 26px; display: flex; align-items: center; gap: 10px; max-width: 440px; width: 100%; background: var(--bg-glass); padding: 6px 14px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-tertiary); white-space: nowrap;">Target:</span>
        <select id="focus-task-select" class="glass-input" style="font-size: 13px; padding: 4px 8px; border: none; background: transparent; cursor: pointer; flex: 1; outline: none;">
          <option value="" style="background: #0f172a; color: #fff;">-- No specific task (Pure Flow) --</option>
          ${tasks.map(t => `<option value="${t.id}" style="background: #0f172a; color: #fff;" ${currentTask && currentTask.id === t.id ? 'selected' : ''}>${t.title} (${t.estimatedDuration}m)</option>`).join('')}
        </select>
      </div>

      <!-- Centerpiece: Glass Sphere Clock Stage -->
      <div class="glass-clock-stage ${snap.isRunning ? 'focus-running' : ''}" id="clock-stage" style="position: relative; z-index: 2; width: 330px; height: 330px; margin-bottom: 28px;">
        <div class="glass-clock-dial" style="width: 100%; height: 100%; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center; background: radial-gradient(120% 120% at 30% 20%, rgba(255, 255, 255, 0.12) 0%, rgba(15, 23, 42, 0.7) 70%, rgba(10, 15, 30, 0.9) 100%); border: 1px solid rgba(255, 255, 255, 0.18); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), inset 0 2px 6px rgba(255, 255, 255, 0.35), inset 0 -6px 18px rgba(0, 0, 0, 0.6);">
          
          <!-- Specular Lens Glint -->
          <div style="position: absolute; top: 12px; left: 40px; width: 90px; height: 45px; border-radius: 50%; background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 75%); transform: rotate(-25deg); pointer-events: none; filter: blur(2px);"></div>

          <!-- Circular SVG Progress Ring -->
          <svg class="focus-progress-svg" viewBox="0 0 320 320" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform: rotate(-90deg);">
            <circle cx="160" cy="160" r="140" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-width="8"></circle>
            <circle id="timer-progress-ring" cx="160" cy="160" r="140" fill="none" stroke="var(--accent-primary)" stroke-width="8"
              stroke-dasharray="879.6" stroke-dashoffset="${879.6 * (1 - snap.progressRatio)}" stroke-linecap="round"
              style="transition: stroke-dashoffset 0.4s cubic-bezier(0.16, 1, 0.3, 1), stroke var(--transition-normal); filter: drop-shadow(0 0 10px var(--accent-primary-glow));">
            </circle>
          </svg>

          <!-- Core Typography & Stage Info -->
          <div class="timer-inner-card" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 20px; z-index: 2; pointer-events: none;">
            <span class="timer-phase-badge" id="timer-phase-label" style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: var(--radius-full); background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12); color: var(--text-secondary); margin-bottom: 8px;">
              ${snap.phase === 'focus' ? (snap.mode === 'ultradian' ? 'Deep Work Cycle' : 'Focus Phase') : snap.phase.replace('-', ' ')}
            </span>
            <div class="timer-time-text tabular-nums" id="timer-countdown-text" style="font-size: 58px; font-weight: 800; letter-spacing: -2px; line-height: 1; font-family: var(--font-mono); text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); color: #fff;">
              ${snap.formattedTime}
            </div>
            <div class="timer-target-task" id="timer-target-name" style="font-size: 13.5px; font-weight: 500; color: var(--text-secondary); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 10px;">
              ${currentTask ? currentTask.title : 'Pure Deep Work'}
            </div>
            ${snap.mode === 'pomodoro' ? `<span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-tertiary); margin-top: 4px;" id="pomodoro-cycle-label">Cycle ${snap.pomodoroCycle} of 4</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Physical Pomodoro Orbital Beads -->
      ${snap.mode === 'pomodoro' ? `
        <div class="pomodoro-beads-row" id="pomodoro-beads-wrap" style="display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 24px; z-index: 2;">
          ${[1, 2, 3, 4].map(num => {
            const isCompleted = snap.pomodoroCycle > num;
            const isActive = snap.pomodoroCycle === num && snap.isRunning;
            return `
              <div class="pomodoro-bead ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}" 
                   title="Pomodoro Cycle ${num} of 4"
                   style="width: 16px; height: 16px; border-radius: 50%; background: ${isCompleted ? 'var(--accent-emerald)' : isActive ? 'var(--el-coral)' : 'rgba(255, 255, 255, 0.12)'}; box-shadow: ${isCompleted ? '0 0 12px var(--accent-emerald-glow), inset 0 2px 4px rgba(255,255,255,0.6)' : isActive ? '0 0 14px var(--el-coral-glow), inset 0 2px 4px rgba(255,255,255,0.8)' : 'inset 0 1px 2px rgba(0,0,0,0.5)'}; border: 1px solid rgba(255,255,255,0.2); transition: all var(--transition-normal); transform: scale(${isActive ? '1.25' : '1'});">
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- Dimensional Tactile Controls Row -->
      <div class="focus-controls-row" style="display: flex; align-items: center; gap: 14px; margin-bottom: 30px; z-index: 2;">
        <button class="btn btn-ghost btn-icon" id="btn-timer-stop" title="Reset Session" style="width: 48px; height: 48px; border-radius: 50%; background: var(--bg-surface); border: 1px solid var(--border-glass); box-shadow: var(--shadow-sm);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          </svg>
        </button>

        <button class="btn btn-primary btn-focus-primary" id="btn-timer-main-toggle" style="padding: 12px 36px; font-size: 15px; font-weight: 700; border-radius: var(--radius-full); box-shadow: 0 8px 24px var(--accent-primary-glow), inset 0 1px 2px rgba(255, 255, 255, 0.4); display: flex; align-items: center; gap: 10px;">
          ${snap.isRunning ? `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
            Pause Flow
          ` : `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Ignite Focus
          `}
        </button>

        <button class="btn btn-secondary btn-icon" id="btn-timer-extend" title="Extend +5 Minutes" style="width: 48px; height: 48px; border-radius: 50%; font-weight: 700; font-size: 13px; font-family: var(--font-mono); background: var(--bg-surface); border: 1px solid var(--border-glass); box-shadow: var(--shadow-sm);">
          +5m
        </button>

        <button class="btn btn-secondary btn-icon" id="btn-timer-finish" title="Complete Session Early" style="width: 48px; height: 48px; border-radius: 50%; background: var(--bg-surface); border: 1px solid var(--border-glass); box-shadow: var(--shadow-sm);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>

      <!-- Floating Glass Soundscape & Zen Dock -->
      <div class="music-glass-player" style="position: relative; z-index: 2; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center; padding: 10px 20px; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(20px); border-radius: var(--radius-full); border: 1px solid var(--border-glass); box-shadow: var(--shadow-glass);">
        <!-- Ambient Generator Pill -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 15px;">🎧</span>
          <select id="focus-ambient-select" class="glass-input" style="border: none; background: transparent; padding: 3px 6px; font-size: 12.5px; cursor: pointer; outline: none; width: 135px; color: var(--text-primary);">
            <option value="none" style="background: #0f172a;">No Sound</option>
            <option value="rain" style="background: #0f172a;" ${ambientAudio.currentTrack === 'rain' ? 'selected' : ''}>Rain & Thunder</option>
            <option value="binaural" style="background: #0f172a;" ${ambientAudio.currentTrack === 'binaural' ? 'selected' : ''}>10Hz Binaural</option>
            <option value="cosmos" style="background: #0f172a;" ${ambientAudio.currentTrack === 'cosmos' ? 'selected' : ''}>Cosmic Flow</option>
            <option value="forest" style="background: #0f172a;" ${ambientAudio.currentTrack === 'forest' ? 'selected' : ''}>Forest Canopy</option>
          </select>
        </div>

        <div style="width: 1px; height: 18px; background: var(--border-subtle);"></div>

        <!-- YouTube Music Quick Station -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 15px;">🎵</span>
          <select id="focus-music-station" class="glass-input" style="border: none; background: transparent; padding: 3px 6px; font-size: 12.5px; cursor: pointer; outline: none; width: 145px; color: var(--text-primary);">
            ${FOCUS_STATIONS.map(s => `<option value="${s.id}" style="background: #0f172a;">${s.title}</option>`).join('')}
          </select>
          <button class="btn btn-ghost btn-icon" id="btn-focus-music-open" title="Open YouTube Music" style="width: 26px; height: 26px; font-size: 11px;">
            ↗
          </button>
        </div>

        <div style="width: 1px; height: 18px; background: var(--border-subtle);"></div>

        <!-- Zen Distraction Free Fullscreen Button -->
        <button class="btn btn-ghost" id="btn-toggle-zen" style="padding: 4px 12px; font-size: 12px; display: flex; align-items: center; gap: 6px; border-radius: var(--radius-full);">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
          </svg>
          Zen View
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
        Pause Flow
      ` : `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Ignite Focus
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
  if (taskSelect) {
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
  }

  // Timer controls
  const btnToggle = container.querySelector('#btn-timer-main-toggle');
  if (btnToggle) {
    btnToggle.addEventListener('click', (e) => {
      if (timerEngine.isRunning) {
        timerEngine.pause();
      } else {
        const rect = btnToggle.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        if (window.ParticleSystem && window.ParticleSystem.focusStart) {
          window.ParticleSystem.focusStart(cx, cy);
        }
        ambientAudio.playChime();
        timerEngine.start();
      }
    });
  }

  const btnStop = container.querySelector('#btn-timer-stop');
  if (btnStop) {
    btnStop.addEventListener('click', () => {
      timerEngine.stop();
    });
  }

  const btnExtend = container.querySelector('#btn-timer-extend');
  if (btnExtend) {
    btnExtend.addEventListener('click', () => {
      timerEngine.extend(5);
      ambientAudio.playChime();
    });
  }

  const btnFinish = container.querySelector('#btn-timer-finish');
  if (btnFinish) {
    btnFinish.addEventListener('click', () => {
      timerEngine.finishEarly();
      ambientAudio.playChime();
    });
  }

  // Ambient sound selector
  const ambientSelect = container.querySelector('#focus-ambient-select');
  if (ambientSelect) {
    ambientSelect.addEventListener('change', (e) => {
      ambientAudio.setTrack(e.target.value);
    });
  }

  // Music station selector
  const musicSelect = container.querySelector('#focus-music-station');
  if (musicSelect) {
    musicSelect.addEventListener('change', (e) => {
      musicController.selectStation(e.target.value);
    });
  }

  const btnMusicOpen = container.querySelector('#btn-focus-music-open');
  if (btnMusicOpen) {
    btnMusicOpen.addEventListener('click', () => {
      musicController.openExternalMusic();
    });
  }

  // Zen Mode toggle
  const btnZen = container.querySelector('#btn-toggle-zen');
  if (btnZen) {
    btnZen.addEventListener('click', () => {
      document.body.classList.toggle('zen-mode');
    });
  }
}
