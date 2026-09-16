/**
 * AETHER OS — 3D ELEMENTAL SETTINGS & SYSTEM CONFIGURATION
 * Dimensional atmosphere controls, sound chimes, timer rhythms,
 * circadian targets, and local data persistence lifecycle.
 */

import { store } from '../store/db.js';
import { ambientAudio } from '../audio/ambient.js';

export function renderSettingsView(container, navigate) {
  const prefs = store.getPreferences();

  container.innerHTML = `
    <div class="animate-fade-in" style="max-width: 840px; margin: 0 auto; perspective: 1200px;">
      <!-- Header -->
      <div style="margin-bottom: 28px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--el-crystal);">Cockpit Calibration</span>
        </div>
        <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 4px;">Settings & Environment</h1>
        <p style="font-size: 13.5px; color: var(--text-secondary);">Configure 3D elemental atmospheric density, soundscapes, timer defaults, and data lifecycle.</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- 1. Appearance & 3D Atmosphere -->
        <div class="glass-panel" style="padding: 24px; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass);">
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 18px; display: flex; align-items: center; gap: 10px;">
            <span>🎨</span> Atmosphere & Physical Rendering
          </h3>

          <div style="display: flex; flex-direction: column; gap: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
              <div>
                <div style="font-size: 14.5px; font-weight: 600;">Elemental Interface Theme</div>
                <div style="font-size: 12.5px; color: var(--text-tertiary);">Switch between Obsidian Dark and Titanium Dawn elemental schemes.</div>
              </div>
              <div style="display: flex; gap: 6px; background: rgba(15, 23, 42, 0.4); padding: 4px; border-radius: var(--radius-full); border: 1px solid var(--border-glass);">
                <button class="btn btn-ghost ${prefs.theme === 'dark' ? 'active' : ''}" id="btn-theme-dark" style="padding: 5px 16px; font-size: 12.5px; border-radius: var(--radius-full); ${prefs.theme === 'dark' ? 'background: var(--accent-primary); color: #fff; font-weight: 700; box-shadow: 0 2px 10px var(--accent-primary-glow);' : ''}">
                  🌙 Obsidian
                </button>
                <button class="btn btn-ghost ${prefs.theme === 'light' ? 'active' : ''}" id="btn-theme-light" style="padding: 5px 16px; font-size: 12.5px; border-radius: var(--radius-full); ${prefs.theme === 'light' ? 'background: var(--accent-primary); color: #fff; font-weight: 700; box-shadow: 0 2px 10px var(--accent-primary-glow);' : ''}">
                  ☀️ Titanium
                </button>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; flex-wrap: wrap; gap: 12px;">
              <div>
                <div style="font-size: 14.5px; font-weight: 600;">3D Spatial Atmosphere & Depth</div>
                <div style="font-size: 12.5px; color: var(--text-tertiary);">Control 3D orb rendering, particle bursts, and atmospheric time-of-day gradients.</div>
              </div>
              <div style="display: flex; gap: 6px; background: rgba(15, 23, 42, 0.4); padding: 4px; border-radius: var(--radius-full); border: 1px solid var(--border-glass);">
                <button class="btn btn-ghost ${prefs.effects3D === 'full' ? 'active' : ''}" id="btn-3d-full" style="padding: 5px 14px; font-size: 12px; border-radius: var(--radius-full); ${prefs.effects3D === 'full' ? 'background: var(--accent-primary); color: #fff; font-weight: 700; box-shadow: 0 2px 10px var(--accent-primary-glow);' : ''}">
                  Full 3D
                </button>
                <button class="btn btn-ghost ${prefs.effects3D === 'reduced' ? 'active' : ''}" id="btn-3d-reduced" style="padding: 5px 14px; font-size: 12px; border-radius: var(--radius-full); ${prefs.effects3D === 'reduced' ? 'background: var(--accent-primary); color: #fff; font-weight: 700; box-shadow: 0 2px 10px var(--accent-primary-glow);' : ''}">
                  Balanced
                </button>
                <button class="btn btn-ghost ${prefs.effects3D === 'off' ? 'active' : ''}" id="btn-3d-off" style="padding: 5px 14px; font-size: 12px; border-radius: var(--radius-full); ${prefs.effects3D === 'off' ? 'background: var(--accent-primary); color: #fff; font-weight: 700; box-shadow: 0 2px 10px var(--accent-primary-glow);' : ''}">
                  Minimal
                </button>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
              <div>
                <div style="font-size: 14.5px; font-weight: 600;">Harmonic Audio Chimes</div>
                <div style="font-size: 12.5px; color: var(--text-tertiary);">Play procedural harmonic crystalline chimes on task and session completion.</div>
              </div>
              <label style="position: relative; display: inline-block; width: 46px; height: 26px; cursor: pointer;">
                <input type="checkbox" id="settings-sound-toggle" ${prefs.soundEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                <span style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: ${prefs.soundEnabled ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)'}; border-radius: 26px; transition: .3s; border: 1px solid var(--border-glass); box-shadow: ${prefs.soundEnabled ? '0 0 10px var(--accent-primary-glow)' : 'none'};"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- 2. Productivity Defaults -->
        <div class="glass-panel" style="padding: 24px; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass);">
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 18px; display: flex; align-items: center; gap: 10px;">
            <span>⏱</span> Focus Rhythms & Defaults
          </h3>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 6px; display: block;">Default Pomodoro Focus (min)</label>
              <input type="number" id="pref-pomo-focus" class="glass-input" value="${prefs.defaultFocusDuration || 25}">
            </div>
            <div>
              <label style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 6px; display: block;">Short Break (min)</label>
              <input type="number" id="pref-pomo-short" class="glass-input" value="${prefs.defaultShortBreak || 5}">
            </div>
            <div>
              <label style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 6px; display: block;">Long Break (min)</label>
              <input type="number" id="pref-pomo-long" class="glass-input" value="${prefs.defaultLongBreak || 20}">
            </div>
            <div>
              <label style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 6px; display: block;">Default Focus Sprint (min)</label>
              <input type="number" id="pref-sprint-dur" class="glass-input" value="${prefs.defaultSprintDuration || 45}">
            </div>
          </div>

          <div style="margin-top: 18px;">
            <button class="btn btn-primary" id="btn-save-durations" style="box-shadow: 0 4px 16px var(--accent-primary-glow);">Save Rhythm Defaults</button>
          </div>
        </div>

        <!-- 3. Sleep & Circadian Targets -->
        <div class="glass-panel" style="padding: 24px; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass);">
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 18px; display: flex; align-items: center; gap: 10px;">
            <span>🌙</span> Sleep & Health Targets
          </h3>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 6px; display: block;">Nightly Sleep Target (Hours)</label>
              <input type="number" id="pref-sleep-target" class="glass-input" value="${prefs.sleepTargetHours || 8}">
            </div>
            <div>
              <label style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 6px; display: block;">Target Wake Time</label>
              <input type="time" id="pref-wake-target" class="glass-input" value="${prefs.wakeTargetTime || '07:15'}">
            </div>
          </div>
        </div>

        <!-- 4. Data Lifecycle & Persistence -->
        <div class="glass-panel" style="padding: 24px; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass);">
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; gap: 10px;">
            <span>💾</span> Data Lifecycle & Persistence
          </h3>

          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 20px;">
            AETHER OS stores all your protocols locally in your browser storage. Your data never leaves your device without explicit export.
          </p>

          <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px;">
            <button class="btn btn-secondary" id="btn-export-json">
              📥 Export Complete Backup (JSON)
            </button>
            <button class="btn btn-secondary" id="btn-export-csv">
              📊 Export Spreadsheet (CSV)
            </button>
            <label class="btn btn-ghost" style="cursor: pointer; display: flex; align-items: center; gap: 6px;">
              📤 Import Backup JSON
              <input type="file" id="file-import-json" accept=".json" style="display: none;">
            </label>
          </div>

          <div style="display: flex; gap: 12px; border-top: 1px solid var(--border-subtle); padding-top: 18px; flex-wrap: wrap;">
            <button class="btn btn-secondary" id="btn-restore-demo" style="color: var(--accent-cyan);">
              🔄 Reset to Sample Data (60 Days History)
            </button>
            <button class="btn btn-ghost" id="btn-clear-data" style="color: var(--priority-critical);">
              🗑 Clear All Data (Fresh Start)
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Theme Toggles
  const btnDark = container.querySelector('#btn-theme-dark');
  const btnLight = container.querySelector('#btn-theme-light');
  if (btnDark) {
    btnDark.addEventListener('click', () => {
      store.updatePreferences({ theme: 'dark' });
      document.documentElement.setAttribute('data-theme', 'dark');
      ambientAudio.playChime();
      renderSettingsView(container, navigate);
    });
  }
  if (btnLight) {
    btnLight.addEventListener('click', () => {
      store.updatePreferences({ theme: 'light' });
      document.documentElement.setAttribute('data-theme', 'light');
      ambientAudio.playChime();
      renderSettingsView(container, navigate);
    });
  }

  // 3D Effects buttons
  const btn3dFull = container.querySelector('#btn-3d-full');
  const btn3dReduced = container.querySelector('#btn-3d-reduced');
  const btn3dOff = container.querySelector('#btn-3d-off');

  if (btn3dFull) {
    btn3dFull.addEventListener('click', () => {
      store.updatePreferences({ effects3D: 'full' });
      ambientAudio.playChime();
      renderSettingsView(container, navigate);
    });
  }
  if (btn3dReduced) {
    btn3dReduced.addEventListener('click', () => {
      store.updatePreferences({ effects3D: 'reduced' });
      ambientAudio.playChime();
      renderSettingsView(container, navigate);
    });
  }
  if (btn3dOff) {
    btn3dOff.addEventListener('click', () => {
      store.updatePreferences({ effects3D: 'off' });
      renderSettingsView(container, navigate);
    });
  }

  // Bind Sound Toggle
  const soundCb = container.querySelector('#settings-sound-toggle');
  if (soundCb) {
    soundCb.addEventListener('change', () => {
      store.updatePreferences({ soundEnabled: soundCb.checked });
      if (soundCb.checked) ambientAudio.playChime();
      renderSettingsView(container, navigate);
    });
  }

  // Bind Durations Save
  const btnSave = container.querySelector('#btn-save-durations');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const defaultFocusDuration = Number(container.querySelector('#pref-pomo-focus').value) || 25;
      const defaultShortBreak = Number(container.querySelector('#pref-pomo-short').value) || 5;
      const defaultLongBreak = Number(container.querySelector('#pref-pomo-long').value) || 20;
      const defaultSprintDuration = Number(container.querySelector('#pref-sprint-dur').value) || 45;
      const sleepTargetHours = Number(container.querySelector('#pref-sleep-target').value) || 8;
      const wakeTargetTime = container.querySelector('#pref-wake-target').value || '07:15';

      store.updatePreferences({
        defaultFocusDuration,
        defaultShortBreak,
        defaultLongBreak,
        defaultSprintDuration,
        sleepTargetHours,
        wakeTargetTime
      });

      ambientAudio.playChime();
      alert('Preferences saved successfully.');
    });
  }

  // Export JSON
  const btnExpJson = container.querySelector('#btn-export-json');
  if (btnExpJson) {
    btnExpJson.addEventListener('click', () => {
      const jsonStr = store.exportJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aether-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Export CSV
  const btnExpCsv = container.querySelector('#btn-export-csv');
  if (btnExpCsv) {
    btnExpCsv.addEventListener('click', () => {
      const csvStr = store.exportCSV();
      const blob = new Blob([csvStr], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aether-tasks-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Import JSON
  const importFile = container.querySelector('#file-import-json');
  if (importFile) {
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const res = store.importJSON(ev.target.result);
          if (res.success) {
            ambientAudio.playChime();
            alert('Backup restored successfully!');
            renderSettingsView(container, navigate);
          } else {
            alert('Failed to import: ' + res.error);
          }
        };
        reader.readAsText(file);
      }
    });
  }

  // Restore Demo Data
  const btnDemo = container.querySelector('#btn-restore-demo');
  if (btnDemo) {
    btnDemo.addEventListener('click', () => {
      if (confirm('Restore rich 60-day historical demo dataset?')) {
        store.restoreDemoData();
        ambientAudio.playChime();
        renderSettingsView(container, navigate);
      }
    });
  }

  // Clear Data
  const btnClear = container.querySelector('#btn-clear-data');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all tasks and sessions? This cannot be undone.')) {
        store.clearAllData();
        renderSettingsView(container, navigate);
      }
    });
  }
}
