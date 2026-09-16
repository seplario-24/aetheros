/**
 * AETHER OS — SLEEP & ROUTINE COCKPIT
 * Bedtime & Wake-up logger, duration calculator, 7-day sleep consistency chart,
 * Morning & Night routine checklist execution.
 */

import { store } from '../store/db.js';

export function renderSleepView(container, navigate) {
  const sleepRecords = store.getSleepRecords();
  const routines = store.getRoutines();
  const prefs = store.getPreferences();

  const todayIso = new Date().toISOString().split('T')[0];
  const todayRecord = sleepRecords.find(r => r.date === todayIso) || sleepRecords[0];

  // Calculate 7-day averages
  const recent7 = sleepRecords.slice(0, 7);
  const avgMins = recent7.length > 0
    ? Math.round(recent7.reduce((s, r) => s + r.durationMinutes, 0) / recent7.length)
    : 450;
  const avgHours = Math.floor(avgMins / 60);
  const avgMinutes = avgMins % 60;

  const morningRoutine = routines.find(r => r.timeOfDay === 'morning') || routines[0];
  const nightRoutine = routines.find(r => r.timeOfDay === 'night') || routines[1];

  container.innerHTML = `
    <div class="animate-fade-in">
      <!-- Header -->
      <div style="margin-bottom: 24px;">
        <h1 style="font-size: 26px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 4px;">Circadian Rhythm & Routines</h1>
        <p style="font-size: 13.5px; color: var(--text-secondary);">Protect your biological recovery foundation and morning/night momentum protocols.</p>
      </div>

      <!-- Sleep Vitals Cards -->
      <div class="stats-overview-grid">
        <div class="glass-card stat-card">
          <div class="stat-header">Last Night's Sleep</div>
          <div class="stat-value tabular-nums">
            ${Math.floor((todayRecord ? todayRecord.durationMinutes : 450) / 60)}h ${(todayRecord ? todayRecord.durationMinutes : 450) % 60}m
          </div>
          <div class="stat-caption">${todayRecord ? todayRecord.sleepTime : '23:30'} → ${todayRecord ? todayRecord.wakeTime : '07:15'}</div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-header">7-Day Sleep Average</div>
          <div class="stat-value tabular-nums">${avgHours}h ${avgMinutes}m</div>
          <div class="stat-caption">Target: ${prefs.sleepTargetHours}h / night</div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-header">Target Wake-up Time</div>
          <div class="stat-value tabular-nums">${prefs.wakeTargetTime}</div>
          <div class="stat-caption">Circadian Anchor</div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-header">Sleep Consistency</div>
          <div class="stat-value" style="color: var(--accent-emerald);">92%</div>
          <div class="stat-caption">Low schedule variance</div>
        </div>
      </div>

      <!-- Main Layout Split -->
      <div class="dashboard-grid-split">
        <!-- Sleep Logger & 7-Day Chart -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Log Today's Sleep Card -->
          <div class="glass-panel" style="padding: 22px;">
            <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 16px;">Log Sleep & Wake Session</h3>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <div>
                <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Bedtime</label>
                <input type="time" id="sleep-bedtime-input" class="glass-input" value="${todayRecord ? todayRecord.sleepTime : '23:15'}">
              </div>
              <div>
                <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Wake Time</label>
                <input type="time" id="sleep-waketime-input" class="glass-input" value="${todayRecord ? todayRecord.wakeTime : '07:15'}">
              </div>
              <div>
                <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Quality Rating</label>
                <select id="sleep-quality-input" class="glass-input">
                  <option value="5">★★★★★ Exceptional</option>
                  <option value="4" selected>★★★★☆ Rested</option>
                  <option value="3">★★★☆☆ Moderate</option>
                  <option value="2">★★☆☆☆ Fragmented</option>
                  <option value="1">★☆☆☆☆ Poor</option>
                </select>
              </div>
            </div>

            <button class="btn btn-primary" id="btn-save-sleep" style="width: 100%;">
              Save Sleep Log
            </button>
          </div>

          <!-- 7-Day Sleep Duration Chart -->
          <div class="glass-panel" style="padding: 22px;">
            <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 14px;">7-Day Sleep Duration</h3>
            <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 120px; border-bottom: 1px solid var(--border-subtle); padding-top: 10px; gap: 8px;">
              ${recent7.slice().reverse().map(r => {
                const hrs = r.durationMinutes / 60;
                const heightPct = Math.min(100, Math.max(15, (hrs / 10) * 100));
                const d = new Date(r.date + 'T00:00:00');
                const dayLabel = d.toLocaleDateString(undefined, { weekday: 'narrow' });
                return `
                  <div style="display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; justify-content: flex-end;" title="${r.date}: ${hrs.toFixed(1)}h">
                    <div style="width: 100%; max-width: 22px; height: ${heightPct}%; background: var(--accent-emerald); border-radius: 4px 4px 0 0; opacity: 0.85;"></div>
                    <span style="font-size: 11px; margin-top: 6px; color: var(--text-tertiary);">${dayLabel}</span>
                  </div>
                `;
              }).join('')}
            </div>
            <div style="margin-top: 10px; display: flex; justify-content: space-between; font-size: 11.5px; color: var(--text-tertiary);">
              <span>8h Target Baseline</span>
              <span style="color: var(--accent-emerald);">Consistent Rhythm</span>
            </div>
          </div>
        </div>

        <!-- Routines Checklist Column -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Morning Routine -->
          <div class="glass-panel" style="padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <h3 style="font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                  <span>☀️</span> Morning Momentum Protocol
                </h3>
                <span style="font-size: 12px; color: var(--text-tertiary);">Scheduled: ${morningRoutine.scheduledTime}</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${morningRoutine.steps.map(s => `
                <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer;">
                  <input type="checkbox" class="routine-checkbox" data-routine-id="${morningRoutine.id}" data-step-id="${s.id}" ${s.completed ? 'checked' : ''}>
                  <span style="${s.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${s.text}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Evening Decompression -->
          <div class="glass-panel" style="padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div>
                <h3 style="font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                  <span>🌙</span> Evening Decompression Protocol
                </h3>
                <span style="font-size: 12px; color: var(--text-tertiary);">Scheduled: ${nightRoutine.scheduledTime}</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${nightRoutine.steps.map(s => `
                <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer;">
                  <input type="checkbox" class="routine-checkbox" data-routine-id="${nightRoutine.id}" data-step-id="${s.id}" ${s.completed ? 'checked' : ''}>
                  <span style="${s.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${s.text}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Save Sleep
  container.querySelector('#btn-save-sleep').addEventListener('click', () => {
    const bedtime = container.querySelector('#sleep-bedtime-input').value;
    const waketime = container.querySelector('#sleep-waketime-input').value;
    const quality = Number(container.querySelector('#sleep-quality-input').value);

    store.recordSleep(todayIso, bedtime, waketime, quality);
    renderSleepView(container, navigate);
  });

  // Bind Routine Checkboxes
  container.querySelectorAll('.routine-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const routineId = cb.getAttribute('data-routine-id');
      const stepId = cb.getAttribute('data-step-id');
      store.toggleRoutineStep(routineId, stepId, todayIso);
      renderSleepView(container, navigate);
    });
  });
}
