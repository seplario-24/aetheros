/**
 * AETHER OS — SETTINGS & DATA MANAGEMENT
 * Theme switching, timer defaults, sleep targets, JSON/CSV export,
 * JSON backup import, and local storage reset.
 */

import { store } from '../store/db.js';

export function renderSettingsView(container, navigate) {
  const prefs = store.getPreferences();

  container.innerHTML = `
    <div class="animate-fade-in" style="max-width: 800px;">
      <!-- Header -->
      <div style="margin-bottom: 28px;">
        <h1 style="font-size: 26px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 4px;">Settings & Preferences</h1>
        <p style="font-size: 13.5px; color: var(--text-secondary);">Configure your cockpit environment, timer rhythms, and data lifecycle.</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- 1. Appearance & Theme -->
        <div class="glass-panel" style="padding: 22px;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span>🎨</span> Appearance & Aesthetics
          </h3>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 14px; font-weight: 500;">Interface Theme</div>
                <div style="font-size: 12.5px; color: var(--text-tertiary);">Switch between Obsidian Dark and Titanium Light modes.</div>
              </div>
              <div style="display: flex; gap: 6px; background: var(--bg-surface-elevated); padding: 4px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle);">
                <button class="btn btn-ghost ${prefs.theme === 'dark' ? 'active' : ''}" id="btn-theme-dark" style="padding: 4px 14px; font-size: 12.5px; border-radius: var(--radius-full); ${prefs.theme === 'dark' ? 'background: var(--accent-primary); color: #fff; font-weight: 600;' : ''}">
                  🌙 Dark
                </button>
                <button class="btn btn-ghost ${prefs.theme === 'light' ? 'active' : ''}" id="btn-theme-light" style="padding: 4px 14px; font-size: 12.5px; border-radius: var(--radius-full); ${prefs.theme === 'light' ? 'background: var(--accent-primary); color: #fff; font-weight: 600;' : ''}">
                  ☀️ Light
                </button>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
              <div>
                <div style="font-size: 14px; font-weight: 500;">3D Spatial Atmosphere & Depth</div>
                <div style="font-size: 12.5px; color: var(--text-tertiary);">Control 3D orb rendering, particle density, and atmospheric color lighting.</div>
              </div>
              <div style="display: flex; gap: 6px; background: var(--bg-surface-elevated); padding: 4px; border-radius: var(--radius-full); border: 1px solid var(--border-subtle);">
                <button class="btn btn-ghost ${prefs.effects3D === 'full' ? 'active' : ''}" id="btn-3d-full" style="padding: 4px 12px; font-size: 12.5px; border-radius: var(--radius-full); ${prefs.effects3D === 'full' ? 'background: var(--accent-primary); color: #fff; font-weight: 600;' : ''}">
                  Full 3D
                </button>
                <button class="btn btn-ghost ${prefs.effects3D === 'reduced' ? 'active' : ''}" id="btn-3d-reduced" style="padding: 4px 12px; font-size: 12.5px; border-radius: var(--radius-full); ${prefs.effects3D === 'reduced' ? 'background: var(--accent-primary); color: #fff; font-weight: 600;' : ''}">
                  Reduced
                </button>
                <button class="btn btn-ghost ${prefs.effects3D === 'off' ? 'active' : ''}" id="btn-3d-off" style="padding: 4px 12px; font-size: 12.5px; border-radius: var(--radius-full); ${prefs.effects3D === 'off' ? 'background: var(--accent-primary); color: #fff; font-weight: 600;' : ''}">
                  Off
                </button>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
              <div>
                <div style="font-size: 14px; font-weight: 500;">Sound Effects & Harmonic Chimes</div>
                <div style="font-size: 12.5px; color: var(--text-tertiary);">Play procedural Web Audio chimes on session and task completion.</div>
              </div>
              <label style="position: relative; display: inline-block; width: 44px; height: 24px;">
                <input type="checkbox" id="settings-sound-toggle" ${prefs.soundEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${prefs.soundEnabled ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)'}; border-radius: 24px; transition: .3s; border: 1px solid var(--border-glass);"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- 2. Productivity Defaults -->
        <div class="glass-panel" style="padding: 22px;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span>⏱</span> Focus Rhythms & Defaults
          </h3>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="font-size: 12.5px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Default Pomodoro Focus (min)</label>
              <input type="number" id="pref-pomo-focus" class="glass-input" value="${prefs.defaultFocusDuration || 25}">
            </div>
            <div>
              <label style="font-size: 12.5px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Short Break (min)</label>
              <input type="number" id="pref-pomo-short" class="glass-input" value="${prefs.defaultShortBreak || 5}">
            </div>
            <div>
              <label style="font-size: 12.5px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Long Break (min)</label>
              <input type="number" id="pref-pomo-long" class="glass-input" value="${prefs.defaultLongBreak || 20}">
            </div>
            <div>
              <label style="font-size: 12.5px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Default Focus Sprint (min)</label>
              <input type="number" id="pref-sprint-dur" class="glass-input" value="${prefs.defaultSprintDuration || 45}">
            </div>
          </div>

          <div style="margin-top: 16px;">
            <button class="btn btn-secondary" id="btn-save-durations">Save Rhythm Defaults</button>
          </div>
        </div>

        <!-- 3. Sleep & Circadian Targets -->
        <div class="glass-panel" style="padding: 22px;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span>🌙</span> Sleep & Health Targets
          </h3>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="font-size: 12.5px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Nightly Sleep Target (Hours)</label>
              <input type="number" id="pref-sleep-target" class="glass-input" value="${prefs.sleepTargetHours || 8}">
            </div>
            <div>
              <label style="font-size: 12.5px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Target Wake Time</label>
              <input type="time" id="pref-wake-target" class="glass-input" value="${prefs.wakeTargetTime || '07:15'}">
            </div>
          </div>
        </div>

        <!-- 4. Data Management & Lifecycle -->
        <div class="glass-panel" style="padding: 22px;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span>💾</span> Data Lifecycle & Persistence
          </h3>

          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 18px;">
            AETHER OS stores all your data locally in browser storage (IndexedDB + LocalStorage). Your data never leaves your device without explicit export.
          </p>

          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px;">
            <button class="btn btn-secondary" id="btn-export-json">
              📥 Export Complete Backup (JSON)
            </button>
            <button class="btn btn-secondary" id="btn-export-csv">
              📊 Export Spreadsheet (CSV)
            </button>
            <label class="btn btn-ghost" style="cursor: pointer;">
              📤 Import Backup JSON
              <input type="file" id="file-import-json" accept=".json" style="display: none;">
            </label>
          </div>

          <div style="display: flex; gap: 10px; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
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
  container.querySelector('#btn-theme-dark').addEventListener('click', () => {
    store.updatePreferences({ theme: 'dark' });
    document.documentElement.setAttribute('data-theme', 'dark');
    renderSettingsView(container, navigate);
  });

  container.querySelector('#btn-theme-light').addEventListener('click', () => {
    store.updatePreferences({ theme: 'light' });
    document.documentElement.setAttribute('data-theme', 'light');
    renderSettingsView(container, navigate);
  });

  // Bind Sound Toggle
  const soundCb = container.querySelector('#settings-sound-toggle');
  soundCb.addEventListener('change', () => {
    store.updatePreferences({ soundEnabled: soundCb.checked });
    renderSettingsView(container, navigate);
  });

  // Bind Durations Save
  container.querySelector('#btn-save-durations').addEventListener('click', () => {
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

    alert('Preferences saved successfully.');
  });

  // Export JSON
  container.querySelector('#btn-export-json').addEventListener('click', () => {
    const jsonStr = store.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Export CSV
  container.querySelector('#btn-export-csv').addEventListener('click', () => {
    const csvStr = store.exportCSV();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import JSON
  const importFile = container.querySelector('#file-import-json');
  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = store.importJSON(ev.target.result);
        if (res.success) {
          alert('Backup restored successfully!');
          renderSettingsView(container, navigate);
        } else {
          alert('Failed to import: ' + res.error);
        }
      };
      reader.readAsText(file);
    }
  });

  // Restore Demo Data
  container.querySelector('#btn-restore-demo').addEventListener('click', () => {
    if (confirm('Restore rich 60-day historical demo dataset?')) {
      store.restoreDemoData();
      renderSettingsView(container, navigate);
    }
  });

  // Clear Data
  container.querySelector('#btn-clear-data').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all tasks and sessions? This cannot be undone.')) {
      store.clearAllData();
      renderSettingsView(container, navigate);
    }
  });
}
