/**
 * AETHER OS — IMMERSIVE 3D FOCUS COCKPIT
 * Glass sphere timer stage, orbital pomodoro crystal beads,
 * elemental deep work modes (Water/Fire/Light/Crystal), 
 * interactive particle ignition, and realistic 3D soundscape console.
 */

import { store } from '../store/db.js';
import { timerEngine } from '../engine/timer.js';
import { ambientAudio } from '../audio/ambient.js';
import { musicController, FOCUS_STATIONS } from '../audio/music.js';

let unsubscribeTimer = null;

const SOUND_CONFIG = {
  none: {
    id: 'none',
    title: 'Silent Void',
    icon: '🔇',
    badge: 'Mute',
    badgeClass: 'badge-mute',
    desc: 'Pure stillness, zero distraction'
  },
  rain: {
    id: 'rain',
    title: 'Rain & Thunder',
    icon: '🌧️',
    badge: 'Hydro',
    badgeClass: 'badge-hydro',
    desc: 'Hydro Element • Gentle storm & distant thunder'
  },
  binaural: {
    id: 'binaural',
    title: '10Hz Alpha Waves',
    icon: '🧠',
    badge: 'Mind',
    badgeClass: 'badge-mind',
    desc: 'Mind Element • Dual 10Hz beat for cognitive flow'
  },
  cosmos: {
    id: 'cosmos',
    title: 'Cosmic Drone',
    icon: '🌌',
    badge: 'Aether',
    badgeClass: 'badge-aether',
    desc: 'Aether Element • Sub-bass 55Hz celestial resonance'
  },
  forest: {
    id: 'forest',
    title: 'Forest Canopy',
    icon: '🌲',
    badge: 'Earth',
    badgeClass: 'badge-earth',
    desc: 'Earth Element • Woodland breeze & soothing pines'
  }
};

export function renderFocusView(container, navigate) {
  const tasks = store.getTasks().filter(t => !t.completed);
  const snap = timerEngine.getSnapshot();
  const currentTask = snap.activeTask || (snap.mode === 'task' ? tasks[0] : null);

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

  const currentSound = SOUND_CONFIG[ambientAudio.currentTrack] || SOUND_CONFIG.none;
  const currentStation = musicController.getCurrentStation() || FOCUS_STATIONS[0];
  const volumePct = Math.round(ambientAudio.volume * 100);

  // Calculate runner dot position
  const angle = (snap.progressRatio * 2 * Math.PI) - (Math.PI / 2);
  const runnerX = 160 + 140 * Math.cos(angle);
  const runnerY = 160 + 140 * Math.sin(angle);

  container.innerHTML = `
    <div class="animate-fade-in focus-cockpit-view" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: calc(100vh - 130px); position: relative; perspective: 1200px; padding: 20px 10px;">
      
      <!-- Ambient Elemental Glow Behind Sphere -->
      <div style="position: absolute; top: 46%; left: 50%; transform: translate(-50%, -50%); width: 460px; height: 460px; border-radius: 50%; background: ${modeElementGlow}; filter: blur(90px); opacity: ${snap.isRunning ? '0.5' : '0.22'}; pointer-events: none; transition: opacity 0.8s ease, background 0.8s ease; z-index: 0;"></div>

      <!-- Mode Selector: Tactile Elemental Pills -->
      <div class="focus-mode-selector" style="position: relative; z-index: 2; display: flex; gap: 6px; margin-bottom: 20px; background: rgba(15, 23, 42, 0.6); padding: 5px; border-radius: var(--radius-full); border: 1px solid rgba(255, 255, 255, 0.15); backdrop-filter: blur(20px); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.2);">
        <button class="focus-mode-btn ${snap.mode === 'task' ? 'active' : ''}" data-mode="task" style="display: flex; align-items: center; gap: 7px; color: ${snap.mode === 'task' ? '#fff' : '#cbd5e1'};">
          <span>💧</span>
          <span>Task Flow</span>
        </button>
        <button class="focus-mode-btn ${snap.mode === 'pomodoro' ? 'active' : ''}" data-mode="pomodoro" style="display: flex; align-items: center; gap: 7px; color: ${snap.mode === 'pomodoro' ? '#fff' : '#cbd5e1'};">
          <span>🔥</span>
          <span>Pomodoro (25/5)</span>
        </button>
        <button class="focus-mode-btn ${snap.mode === 'sprint' ? 'active' : ''}" data-mode="sprint" style="display: flex; align-items: center; gap: 7px; color: ${snap.mode === 'sprint' ? '#fff' : '#cbd5e1'};">
          <span>⚡</span>
          <span>Sprint (45m)</span>
        </button>
        <button class="focus-mode-btn ${snap.mode === 'ultradian' ? 'active' : ''}" data-mode="ultradian" style="display: flex; align-items: center; gap: 7px; color: ${snap.mode === 'ultradian' ? '#fff' : '#cbd5e1'};">
          <span>💎</span>
          <span>Ultradian (90m)</span>
        </button>
      </div>

      <!-- Active Task Selector: 3D Tactile Target Capsule -->
      <div class="focus-target-pill-container" style="position: relative; z-index: 20; margin-bottom: 24px; max-width: 440px; width: 100%;">
        <div class="focus-target-bar" id="focus-target-trigger" style="display: flex; align-items: center; justify-content: space-between; gap: 10px; background: rgba(15, 23, 42, 0.65); padding: 7px 16px; border-radius: var(--radius-full); border: 1px solid rgba(255, 255, 255, 0.16); backdrop-filter: blur(20px); box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.25); cursor: pointer; transition: all var(--transition-fast);">
          <div style="display: flex; align-items: center; gap: 8px; overflow: hidden;">
            <span style="font-size: 14px;">🎯</span>
            <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--el-crystal); white-space: nowrap;">Target:</span>
            <span style="width: 1px; height: 12px; background: rgba(255,255,255,0.2);"></span>
            <span id="focus-target-display-title" style="font-size: 13px; font-weight: 600; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${currentTask ? `${currentTask.title} (${currentTask.estimatedDuration}m)` : 'Pure Deep Work (No Target)'}
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 4px; color: #94A3B8; font-size: 11px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        <!-- Task Target Popover Drawer -->
        <div class="task-target-drawer" id="task-target-drawer">
          <div class="task-target-item ${!currentTask ? 'active' : ''}" data-task-id="">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>✨</span>
              <span style="font-weight: 600; color: #FFFFFF;">Pure Deep Work Flow</span>
            </div>
            <span style="font-size: 11px; color: #94A3B8; font-family: var(--font-mono);">No Target</span>
          </div>
          ${tasks.map(t => `
            <div class="task-target-item ${currentTask && currentTask.id === t.id ? 'active' : ''}" data-task-id="${t.id}">
              <div style="display: flex; align-items: center; gap: 8px; overflow: hidden;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: ${t.priority === 'high' ? 'var(--el-coral)' : t.priority === 'medium' ? 'var(--accent-amber)' : 'var(--el-water)'}; flex-shrink: 0; box-shadow: 0 0 8px currentColor;"></span>
                <span style="font-weight: 600; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.title}</span>
              </div>
              <span style="font-size: 11px; color: #94A3B8; font-family: var(--font-mono);">${t.estimatedDuration}m</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Centerpiece: Glass Sphere Clock Stage with 3D Parallax Tilt -->
      <div class="glass-clock-stage ${snap.isRunning ? 'focus-running' : ''}" id="clock-stage" style="position: relative; z-index: 2; width: 330px; height: 330px; margin-bottom: 26px; cursor: default;">
        <div class="glass-clock-dial" style="width: 100%; height: 100%; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center; background: radial-gradient(120% 120% at 30% 20%, rgba(255, 255, 255, 0.14) 0%, rgba(15, 23, 42, 0.75) 65%, rgba(10, 15, 30, 0.95) 100%); border: 1px solid rgba(255, 255, 255, 0.22); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6), inset 0 2px 6px rgba(255, 255, 255, 0.4), inset 0 -6px 20px rgba(0, 0, 0, 0.7); transform-style: preserve-3d; transition: transform 0.15s ease-out, box-shadow 0.4s ease;">
          
          <!-- Specular Lens Glint -->
          <div style="position: absolute; top: 12px; left: 40px; width: 95px; height: 48px; border-radius: 50%; background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 75%); transform: rotate(-25deg); pointer-events: none; filter: blur(2px);"></div>

          <!-- Circular SVG Progress Ring with Glowing Runner Bead -->
          <svg class="focus-progress-svg" viewBox="0 0 320 320" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform: rotate(-90deg); overflow: visible;">
            <circle cx="160" cy="160" r="140" fill="none" stroke="rgba(255, 255, 255, 0.07)" stroke-width="8"></circle>
            <circle id="timer-progress-ring" cx="160" cy="160" r="140" fill="none" stroke="var(--accent-primary)" stroke-width="8"
              stroke-dasharray="879.6" stroke-dashoffset="${879.6 * (1 - snap.progressRatio)}" stroke-linecap="round"
              style="transition: stroke-dashoffset 0.4s cubic-bezier(0.16, 1, 0.3, 1), stroke var(--transition-normal); filter: drop-shadow(0 0 12px var(--accent-primary-glow));">
            </circle>
            <circle id="timer-runner-bead" cx="${runnerX}" cy="${runnerY}" r="7" fill="#FFFFFF"
              style="filter: drop-shadow(0 0 10px var(--accent-primary-glow)); transition: cx 0.4s ease, cy 0.4s ease; opacity: ${snap.progressRatio > 0.005 ? '1' : '0'};">
            </circle>
          </svg>

          <!-- Core Typography & Stage Info -->
          <div class="timer-inner-card" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 20px; z-index: 2; pointer-events: none;">
            <span class="timer-phase-badge" id="timer-phase-label">
              ${snap.phase === 'focus' ? (snap.mode === 'ultradian' ? 'Deep Work Cycle' : 'Focus Phase') : snap.phase.replace('-', ' ')}
            </span>
            <div class="timer-time-text tabular-nums" id="timer-countdown-text">
              ${snap.formattedTime}
            </div>
            <div class="timer-target-task" id="timer-target-name">
              ${currentTask ? currentTask.title : 'Pure Deep Work'}
            </div>
            ${snap.mode === 'pomodoro' ? `<span style="font-size: 11.5px; font-family: var(--font-mono); font-weight: 700; color: #CBD5E1; margin-top: 6px; letter-spacing: 0.5px;" id="pomodoro-cycle-label">Cycle ${snap.pomodoroCycle} of 4</span>` : ''}
          </div>
        </div>
      </div>

      <!-- Physical Pomodoro Orbital Beads -->
      ${snap.mode === 'pomodoro' ? `
        <div class="pomodoro-beads-row" id="pomodoro-beads-wrap" style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px; z-index: 2;">
          ${[1, 2, 3, 4].map(num => {
            const isCompleted = snap.pomodoroCycle > num;
            const isActive = snap.pomodoroCycle === num && snap.isRunning;
            return `
              <div class="pomodoro-bead ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}" 
                   title="Pomodoro Cycle ${num} of 4"
                   style="width: 17px; height: 17px; border-radius: 50%; background: ${isCompleted ? 'var(--accent-emerald)' : isActive ? 'var(--el-coral)' : 'rgba(255, 255, 255, 0.15)'}; box-shadow: ${isCompleted ? '0 0 14px var(--accent-emerald-glow), inset 0 2px 4px rgba(255,255,255,0.7)' : isActive ? '0 0 16px var(--el-coral-glow), inset 0 2px 4px rgba(255,255,255,0.9)' : 'inset 0 1px 2px rgba(0,0,0,0.6)'}; border: 1px solid rgba(255,255,255,0.25); transition: all var(--transition-normal); transform: scale(${isActive ? '1.3' : '1'});">
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- Dimensional Tactile Controls Row -->
      <div class="focus-controls-row" style="display: flex; align-items: center; gap: 14px; margin-bottom: 28px; z-index: 2;">
        <!-- Circular Reset Symbol Button (Replacing plain box) -->
        <button class="btn btn-ghost btn-icon" id="btn-timer-stop" title="Reset Focus Session (R)" style="width: 48px; height: 48px; border-radius: 50%; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(255,255,255,0.18); box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2); color: #FFFFFF; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <polyline points="3 3 3 8 8 8"></polyline>
          </svg>
        </button>

        <!-- Start Focus / Pause Flow Toggle -->
        <button class="btn btn-primary btn-focus-primary" id="btn-timer-main-toggle" style="padding: 13px 36px; font-size: 15px; font-weight: 700; border-radius: var(--radius-full); box-shadow: 0 10px 28px var(--accent-primary-glow), inset 0 1px 2px rgba(255, 255, 255, 0.5); display: flex; align-items: center; gap: 10px; cursor: pointer;">
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
            Start Focus
          `}
        </button>

        <!-- Mark Lap Button -->
        <button class="btn btn-secondary btn-icon" id="btn-timer-lap" title="Mark Lap / Split Milestone (L)" style="width: 48px; height: 48px; border-radius: 50%; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(255,255,255,0.18); box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2); color: var(--accent-cyan); cursor: pointer; display: flex; align-items: center; justify-content: center;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
          </svg>
        </button>

        <!-- Extend +5m Button -->
        <button class="btn btn-secondary btn-icon" id="btn-timer-extend" title="Extend +5 Minutes" style="width: 48px; height: 48px; border-radius: 50%; font-weight: 700; font-size: 13px; font-family: var(--font-mono); background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(255,255,255,0.18); box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2); color: #FFFFFF; cursor: pointer;">
          +5m
        </button>

        <!-- Complete Early Button -->
        <button class="btn btn-secondary btn-icon" id="btn-timer-finish" title="Complete Session Early" style="width: 48px; height: 48px; border-radius: 50%; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(255,255,255,0.18); box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2); color: var(--accent-emerald); cursor: pointer;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>

      <!-- Realistic 3D Tactile Soundscape & Audio Rack Dock -->
      <div class="focus-sound-console" id="focus-sound-console">
        
        <!-- 3D Procedural Soundscape Trigger Pod -->
        <div class="sound-trigger-pod ${ambientAudio.currentTrack !== 'none' ? 'active-playing' : ''}" id="sound-trigger-pod" title="Open 3D Elemental Sound Rack">
          <span id="sound-current-icon" style="font-size: 16px;">${currentSound.icon}</span>
          <span id="sound-current-label" style="font-weight: 600; letter-spacing: -0.2px;">${currentSound.title}</span>
          <div class="audio-visualizer-bars">
            <span class="visualizer-bar"></span>
            <span class="visualizer-bar"></span>
            <span class="visualizer-bar"></span>
            <span class="visualizer-bar"></span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left: 2px; color: #94A3B8;"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>

        <!-- 3D Holographic Sound Popover Matrix -->
        <div class="sound-matrix-popover" id="sound-matrix-popover">
          <div class="sound-matrix-header">
            <h4><span>🎧</span> Procedural Soundscapes</h4>
            <span style="font-size: 10.5px; font-weight: 700; color: var(--el-crystal); text-transform: uppercase; letter-spacing: 1px;">Synthesizer Core</span>
          </div>
          <div class="sound-card-grid">
            ${Object.values(SOUND_CONFIG).map(s => `
              <div class="sound-card-item ${ambientAudio.currentTrack === s.id ? 'active' : ''}" data-sound="${s.id}">
                <div class="sound-icon-orb">${s.icon}</div>
                <div class="sound-card-info">
                  <span class="sound-card-title">${s.title}</span>
                  <span class="sound-card-desc">${s.desc}</span>
                </div>
                <span class="sound-card-badge">${s.badge}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 3D Volume Slider & Mute Toggle -->
        <div class="volume-control-wrap">
          <button id="btn-sound-mute-toggle" style="background: none; border: none; cursor: pointer; padding: 2px; color: #94A3B8; display: flex; align-items: center; transition: color 0.2s;" title="Toggle Mute">
            <span id="volume-icon-display" style="font-size: 13px;">${ambientAudio.volume === 0 ? '🔇' : '🔉'}</span>
          </button>
          <input type="range" id="focus-volume-slider" class="volume-slider-3d" min="0" max="100" value="${volumePct}" title="Soundscape Volume: ${volumePct}%">
          <span id="volume-pct-label" style="font-size: 11px; font-family: var(--font-mono); color: #CBD5E1; min-width: 26px; font-weight: 600;">${volumePct}%</span>
        </div>

        <div style="width: 1px; height: 18px; background: rgba(255, 255, 255, 0.18);"></div>

        <!-- 3D Music Station Trigger Pod -->
        <div class="sound-trigger-pod" id="music-trigger-pod" title="Open YouTube Music Stations">
          <span style="font-size: 14px;">🎵</span>
          <span id="music-current-label" style="font-weight: 600; letter-spacing: -0.2px;">${currentStation.title.split('—')[0].trim()}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left: 2px; color: #94A3B8;"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>

        <!-- 3D Music Station Popover -->
        <div class="music-matrix-popover" id="music-matrix-popover">
          <div class="sound-matrix-header">
            <h4><span>🎵</span> Focus Radio Stations</h4>
            <span style="font-size: 10.5px; font-weight: 700; color: #a855f7; text-transform: uppercase; letter-spacing: 1px;">YouTube Music</span>
          </div>
          <div class="sound-card-grid">
            ${FOCUS_STATIONS.map(st => `
              <div class="sound-card-item ${currentStation.id === st.id ? 'active' : ''}" data-station="${st.id}">
                <div class="sound-icon-orb" style="font-size: 15px;">📻</div>
                <div class="sound-card-info">
                  <span class="sound-card-title">${st.title}</span>
                  <span class="sound-card-desc">${st.genre}</span>
                </div>
                <a href="${st.streamUrl}" target="_blank" rel="noopener noreferrer" class="sound-card-badge" style="text-decoration: none; display: flex; align-items: center; gap: 4px;" title="Open in YouTube Music">
                  <span>Open</span> ↗
                </a>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Direct YouTube Music Launch Button -->
        <button class="btn btn-ghost btn-icon" id="btn-focus-music-open" title="Open Selected Station in YouTube Music" style="width: 28px; height: 28px; border-radius: 50%; font-size: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF; cursor: pointer;">
          ↗
        </button>

        <div style="width: 1px; height: 18px; background: rgba(255, 255, 255, 0.18);"></div>

        <!-- Zen Distraction Free Fullscreen Button -->
        <button class="btn btn-ghost" id="btn-toggle-zen" style="padding: 5px 14px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; border-radius: var(--radius-full); background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); color: #FFFFFF; cursor: pointer;" title="Toggle Distraction-Free Zen View">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
          </svg>
          Zen View
        </button>
      </div>

      <!-- Live Focus Laps & Interval Splits Panel -->
      <div class="focus-laps-panel" id="focus-laps-panel" style="margin-top: 24px; max-width: 480px; width: 100%; z-index: 2; display: ${snap.laps && snap.laps.length > 0 ? 'block' : 'none'};">
        <div class="glass-card" style="padding: 16px 20px; border-radius: var(--radius-lg); background: rgba(15, 23, 42, 0.75); border: 1px solid var(--border-glass); backdrop-filter: blur(20px); box-shadow: var(--shadow-glass);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 15px;">🏁</span>
              <span style="font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #FFFFFF;">
                Session Laps (<span id="laps-count-text">${snap.laps ? snap.laps.length : 0}</span>)
              </span>
            </div>
            <button class="btn btn-ghost" id="btn-clear-laps" style="font-size: 11px; padding: 2px 8px; border-radius: var(--radius-full); color: var(--text-tertiary);" title="Clear Recorded Laps">
              Clear
            </button>
          </div>
          
          <div id="focus-laps-list" style="display: flex; flex-direction: column; gap: 6px; max-height: 180px; overflow-y: auto;">
            ${(snap.laps || []).map((l) => `
              <div class="glass-card" style="padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; font-size: 12.5px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-weight: 700; color: var(--accent-cyan); font-family: var(--font-mono);">Lap ${l.lapNumber}</span>
                  <span style="font-size: 11px; color: var(--text-tertiary);">${l.timestamp}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 14px; font-family: var(--font-mono);">
                  <span style="color: #FFFFFF; font-weight: 600;">+${l.formattedSplit}</span>
                  <span style="color: var(--text-tertiary); font-size: 11px;">Total: ${l.formattedTotal}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // --------------------------------------------------------------------------
  // 3D Parallax Tilt Effect on Glass Clock Dial
  // --------------------------------------------------------------------------
  const clockStage = container.querySelector('#clock-stage');
  const clockDial = container.querySelector('.glass-clock-dial');
  if (clockStage && clockDial) {
    clockStage.addEventListener('mousemove', (e) => {
      const rect = clockStage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      clockDial.style.transform = `perspective(800px) rotateY(${dx * 12}deg) rotateX(${-dy * 12}deg) translateZ(8px)`;
    });
    clockStage.addEventListener('mouseleave', () => {
      clockDial.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    });
  }

  // --------------------------------------------------------------------------
  // Real-time Timer Listener
  // --------------------------------------------------------------------------
  if (unsubscribeTimer) unsubscribeTimer();
  unsubscribeTimer = timerEngine.subscribe((eventType, s) => {
    const timeEl = container.querySelector('#timer-countdown-text');
    const ringEl = container.querySelector('#timer-progress-ring');
    const runnerEl = container.querySelector('#timer-runner-bead');
    const phaseEl = container.querySelector('#timer-phase-label');
    const btnToggle = container.querySelector('#btn-timer-main-toggle');
    const stage = container.querySelector('#clock-stage');

    if (stage) {
      if (s.isRunning) stage.classList.add('focus-running');
      else stage.classList.remove('focus-running');
    }

    if (timeEl) timeEl.textContent = s.formattedTime;
    if (ringEl) ringEl.style.strokeDashoffset = String(879.6 * (1 - s.progressRatio));

    if (runnerEl) {
      const a = (s.progressRatio * 2 * Math.PI) - (Math.PI / 2);
      runnerEl.setAttribute('cx', String(160 + 140 * Math.cos(a)));
      runnerEl.setAttribute('cy', String(160 + 140 * Math.sin(a)));
      runnerEl.style.opacity = s.progressRatio > 0.005 ? '1' : '0';
    }

    if (phaseEl) {
      phaseEl.textContent = s.phase === 'focus' 
        ? (s.mode === 'ultradian' ? 'Deep Work Cycle' : 'Focus Phase') 
        : s.phase.replace('-', ' ');
    }

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
        Start Focus
      `;
    }

    // Update session laps table
    updateLapsUI(s.laps);
  });

  function updateLapsUI(laps) {
    const lapsPanel = container.querySelector('#focus-laps-panel');
    const lapsCount = container.querySelector('#laps-count-text');
    const lapsList = container.querySelector('#focus-laps-list');

    if (!lapsPanel || !lapsList) return;

    if (!laps || laps.length === 0) {
      lapsPanel.style.display = 'none';
      lapsList.innerHTML = '';
      if (lapsCount) lapsCount.textContent = '0';
      return;
    }

    lapsPanel.style.display = 'block';
    if (lapsCount) lapsCount.textContent = String(laps.length);

    lapsList.innerHTML = laps.map(l => `
      <div class="glass-card" style="padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; font-size: 12.5px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 700; color: var(--accent-cyan); font-family: var(--font-mono);">Lap ${l.lapNumber}</span>
          <span style="font-size: 11px; color: var(--text-tertiary);">${l.timestamp}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 14px; font-family: var(--font-mono);">
          <span style="color: #FFFFFF; font-weight: 600;">+${l.formattedSplit}</span>
          <span style="color: var(--text-tertiary); font-size: 11px;">Total: ${l.formattedTotal}</span>
        </div>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // Mode Selector Buttons
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Target Task Drawer & Selection
  // --------------------------------------------------------------------------
  const targetTrigger = container.querySelector('#focus-target-trigger');
  const targetDrawer = container.querySelector('#task-target-drawer');

  if (targetTrigger && targetDrawer) {
    targetTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      targetDrawer.classList.toggle('open');
      closeSoundPopovers();
    });

    targetDrawer.querySelectorAll('.task-target-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = item.getAttribute('data-task-id');
        const task = taskId ? store.getTaskById(taskId) : null;

        timerEngine.configure({
          mode: task ? 'task' : (snap.mode === 'task' ? 'pomodoro' : snap.mode),
          durationMinutes: task ? task.estimatedDuration : 25,
          task
        });

        targetDrawer.classList.remove('open');
        renderFocusView(container, navigate);
      });
    });
  }

  // --------------------------------------------------------------------------
  // Timer Action Buttons (Ignite, Stop, Extend, Finish)
  // --------------------------------------------------------------------------
  const btnToggle = container.querySelector('#btn-timer-main-toggle');
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
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
      ambientAudio.playChime();
    });
  }

  const btnLap = container.querySelector('#btn-timer-lap');
  if (btnLap) {
    btnLap.addEventListener('click', () => {
      const lap = timerEngine.markLap();
      if (lap && window.ParticleSystem && window.ParticleSystem.tileBloom) {
        const rect = btnLap.getBoundingClientRect();
        window.ParticleSystem.tileBloom(rect.left + rect.width / 2, rect.top + rect.height / 2, '#06b6d4');
      }
      ambientAudio.playChime();
    });
  }

  const btnClearLaps = container.querySelector('#btn-clear-laps');
  if (btnClearLaps) {
    btnClearLaps.addEventListener('click', () => {
      timerEngine.clearLaps();
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

  // Keyboard shortcuts: Space (toggle), L (lap), R (reset)
  const handleFocusKeydown = (e) => {
    const isInput = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable);
    if (isInput) return;

    if (e.key.toLowerCase() === 'l') {
      e.preventDefault();
      if (btnLap) btnLap.click();
    } else if (e.key.toLowerCase() === 'r') {
      e.preventDefault();
      if (btnStop) btnStop.click();
    } else if (e.code === 'Space') {
      e.preventDefault();
      if (btnToggle) btnToggle.click();
    }
  };
  window.addEventListener('keydown', handleFocusKeydown);

  // --------------------------------------------------------------------------
  // 3D Procedural Soundscape Matrix & Volume Controls
  // --------------------------------------------------------------------------
  const soundTrigger = container.querySelector('#sound-trigger-pod');
  const soundPopover = container.querySelector('#sound-matrix-popover');
  const soundCurrentIcon = container.querySelector('#sound-current-icon');
  const soundCurrentLabel = container.querySelector('#sound-current-label');

  const musicTrigger = container.querySelector('#music-trigger-pod');
  const musicPopover = container.querySelector('#music-matrix-popover');
  const musicCurrentLabel = container.querySelector('#music-current-label');

  function closeSoundPopovers() {
    if (soundPopover) soundPopover.classList.remove('open');
    if (musicPopover) musicPopover.classList.remove('open');
  }

  if (soundTrigger && soundPopover) {
    soundTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      soundPopover.classList.toggle('open');
      if (musicPopover) musicPopover.classList.remove('open');
      if (targetDrawer) targetDrawer.classList.remove('open');
    });

    soundPopover.querySelectorAll('.sound-card-item').forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const soundId = card.getAttribute('data-sound');
        ambientAudio.setTrack(soundId);

        // Update active class on cards
        soundPopover.querySelectorAll('.sound-card-item').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Update trigger pod visual state
        const cfg = SOUND_CONFIG[soundId] || SOUND_CONFIG.none;
        if (soundCurrentIcon) soundCurrentIcon.textContent = cfg.icon;
        if (soundCurrentLabel) soundCurrentLabel.textContent = cfg.title;

        if (soundId !== 'none') {
          soundTrigger.classList.add('active-playing');
          const rect = card.getBoundingClientRect();
          if (window.ParticleSystem && window.ParticleSystem.tileBloom) {
            window.ParticleSystem.tileBloom(rect.left + rect.width / 2, rect.top + rect.height / 2);
          }
        } else {
          soundTrigger.classList.remove('active-playing');
        }

        setTimeout(() => {
          soundPopover.classList.remove('open');
        }, 180);
      });
    });
  }

  // Volume Slider & Mute Toggle
  const volumeSlider = container.querySelector('#focus-volume-slider');
  const volumePctLabel = container.querySelector('#volume-pct-label');
  const volumeIconDisplay = container.querySelector('#volume-icon-display');
  const btnMuteToggle = container.querySelector('#btn-sound-mute-toggle');

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const frac = val / 100;
      ambientAudio.setVolume(frac);
      if (volumePctLabel) volumePctLabel.textContent = `${val}%`;
      if (volumeIconDisplay) volumeIconDisplay.textContent = val === 0 ? '🔇' : '🔉';
    });
  }

  if (btnMuteToggle) {
    let prevVolume = ambientAudio.volume > 0 ? ambientAudio.volume : 0.5;
    btnMuteToggle.addEventListener('click', () => {
      if (ambientAudio.volume > 0) {
        prevVolume = ambientAudio.volume;
        ambientAudio.setVolume(0);
        if (volumeSlider) volumeSlider.value = 0;
        if (volumePctLabel) volumePctLabel.textContent = '0%';
        if (volumeIconDisplay) volumeIconDisplay.textContent = '🔇';
      } else {
        ambientAudio.setVolume(prevVolume);
        const p = Math.round(prevVolume * 100);
        if (volumeSlider) volumeSlider.value = p;
        if (volumePctLabel) volumePctLabel.textContent = `${p}%`;
        if (volumeIconDisplay) volumeIconDisplay.textContent = '🔉';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3D Music Station Popover & Controls
  // --------------------------------------------------------------------------
  if (musicTrigger && musicPopover) {
    musicTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      musicPopover.classList.toggle('open');
      if (soundPopover) soundPopover.classList.remove('open');
      if (targetDrawer) targetDrawer.classList.remove('open');
    });

    musicPopover.querySelectorAll('.sound-card-item').forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const stationId = card.getAttribute('data-station');
        musicController.selectStation(stationId);

        musicPopover.querySelectorAll('.sound-card-item').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const st = musicController.getCurrentStation();
        if (musicCurrentLabel && st) {
          musicCurrentLabel.textContent = st.title.split('—')[0].trim();
        }

        setTimeout(() => {
          musicPopover.classList.remove('open');
        }, 180);
      });
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

  // Global click-outside listener to close any open popover
  function handleDocumentClick(e) {
    if (!container.contains(e.target)) return;
    if (soundPopover && !soundPopover.contains(e.target) && !soundTrigger.contains(e.target)) {
      soundPopover.classList.remove('open');
    }
    if (musicPopover && !musicPopover.contains(e.target) && !musicTrigger.contains(e.target)) {
      musicPopover.classList.remove('open');
    }
    if (targetDrawer && !targetDrawer.contains(e.target) && !targetTrigger.contains(e.target)) {
      targetDrawer.classList.remove('open');
    }
  }

  document.removeEventListener('click', handleDocumentClick);
  document.addEventListener('click', handleDocumentClick);
}
