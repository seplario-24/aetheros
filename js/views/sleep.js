/**
 * AETHER OS — 3D ELEMENTAL CIRCADIAN SLEEP SANCTUARY
 * Centerpiece 3D moon orb with celestial lighting, nocturnal atmosphere,
 * 7-day volumetric duration chart, and morning/evening momentum protocols.
 */

import { store } from '../store/db.js';
import { ambientAudio } from '../audio/ambient.js';

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

  const lastNightMins = todayRecord ? todayRecord.durationMinutes : 450;
  const lastNightHours = Math.floor(lastNightMins / 60);
  const lastNightRemainingMins = lastNightMins % 60;

  container.innerHTML = `
    <div class="animate-fade-in" style="perspective: 1200px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--el-air);">Circadian Sanctuary</span>
          </div>
          <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 4px;">Circadian Rhythm & Recovery</h1>
          <p style="font-size: 13.5px; color: var(--text-secondary);">Protect biological recovery foundation and morning/evening momentum protocols.</p>
        </div>
      </div>

      <!-- Celestial Centerpiece: Floating 3D Moon Orb Stage -->
      <div class="glass-panel" style="padding: 28px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 24px; position: relative; overflow: hidden; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass);">
        
        <!-- Ambient Moon Glow Backdrop -->
        <div style="position: absolute; top: 50%; left: 30%; transform: translate(-50%, -50%); width: 280px; height: 280px; border-radius: 50%; background: radial-gradient(circle, rgba(147, 197, 253, 0.25) 0%, transparent 70%); filter: blur(50px); pointer-events: none;"></div>

        <!-- 3D Moon Orb -->
        <div class="sleep-moon-stage animate-float" style="display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1;">
          <div class="sleep-moon-orb" style="width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #e0e7ff 0%, #a5b4fc 45%, #4338ca 85%, #1e1b4b 100%); box-shadow: 0 0 40px rgba(165, 180, 252, 0.4), inset -10px -10px 25px rgba(0, 0, 0, 0.7), inset 5px 5px 12px rgba(255, 255, 255, 0.8); position: relative;">
            <!-- Subtle Moon Surface Texture Dots -->
            <div style="position: absolute; top: 35px; left: 45px; width: 22px; height: 18px; border-radius: 50%; background: rgba(67, 56, 202, 0.25); filter: blur(2px);"></div>
            <div style="position: absolute; top: 65px; left: 75px; width: 30px; height: 26px; border-radius: 50%; background: rgba(67, 56, 202, 0.3); filter: blur(3px);"></div>
            <div style="position: absolute; top: 80px; left: 35px; width: 16px; height: 14px; border-radius: 50%; background: rgba(67, 56, 202, 0.2); filter: blur(2px);"></div>
          </div>
          <span style="margin-top: 14px; font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--el-air);">Restorative Orbit</span>
        </div>

        <!-- Moon Sleep Data Overview -->
        <div style="position: relative; z-index: 1; max-width: 360px;">
          <span style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-tertiary);">Last Recorded Session</span>
          <div style="font-size: 42px; font-weight: 800; letter-spacing: -1.5px; font-family: var(--font-mono); color: #fff; margin: 4px 0 8px;">
            ${lastNightHours}h ${lastNightRemainingMins}m
          </div>
          <div style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 14px;">
            ${todayRecord ? todayRecord.sleepTime : '23:30'} → ${todayRecord ? todayRecord.wakeTime : '07:15'} • Quality Rating: 
            <span style="color: var(--accent-amber); font-weight: 700;">${'★'.repeat(todayRecord ? todayRecord.quality : 4)}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <span class="badge" style="background: rgba(99, 102, 241, 0.15); color: var(--el-air); border: 1px solid rgba(99, 102, 241, 0.3); font-size: 11.5px; padding: 4px 10px; border-radius: var(--radius-full);">Deep Slow Wave Rest</span>
            <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.3); font-size: 11.5px; padding: 4px 10px; border-radius: var(--radius-full);">Optimal Window</span>
          </div>
        </div>
      </div>

      <!-- 4 Elemental Sleep Vitals -->
      <div class="stats-overview-grid" style="margin-bottom: 24px;">
        <!-- Air Element: Last Night's Sleep -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-air-glow); animation-delay: 0s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Last Night's Sleep</div>
            <span style="font-size: 14px;">🌙</span>
          </div>
          <div class="stat-value tabular-nums">${lastNightHours}h ${lastNightRemainingMins}m</div>
          <div class="stat-caption">Biological recharge foundation</div>
        </div>

        <!-- Water Element: 7-Day Average -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-water-glow); animation-delay: 0.15s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">7-Day Sleep Average</div>
            <span style="font-size: 14px;">💧</span>
          </div>
          <div class="stat-value tabular-nums">${avgHours}h ${avgMinutes}m</div>
          <div class="stat-caption">Target: ${prefs.sleepTargetHours}h per night</div>
        </div>

        <!-- Light Element: Wake Anchor -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-light-glow); animation-delay: 0.3s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Target Wake-Up Time</div>
            <span style="font-size: 14px;">☀️</span>
          </div>
          <div class="stat-value tabular-nums">${prefs.wakeTargetTime}</div>
          <div class="stat-caption">Circadian Anchor Baseline</div>
        </div>

        <!-- Crystal Element: Schedule Consistency -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-crystal-glow); animation-delay: 0.45s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Circadian Consistency</div>
            <span style="font-size: 14px;">💎</span>
          </div>
          <div class="stat-value" style="color: var(--accent-emerald);">92%</div>
          <div class="stat-caption">Minimal schedule variance</div>
        </div>
      </div>

      <!-- Main Layout Split -->
      <div class="dashboard-grid-split">
        <!-- Sleep Logger & 7-Day Chart Column -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Log Today's Sleep Card -->
          <div class="glass-panel" style="padding: 22px; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass);">
            <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 16px;">Log Sleep & Wake Interval</h3>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <div>
                <label style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 6px; display: block;">Bedtime</label>
                <input type="time" id="sleep-bedtime-input" class="glass-input" value="${todayRecord ? todayRecord.sleepTime : '23:15'}">
              </div>
              <div>
                <label style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 6px; display: block;">Wake Time</label>
                <input type="time" id="sleep-waketime-input" class="glass-input" value="${todayRecord ? todayRecord.wakeTime : '07:15'}">
              </div>
              <div>
                <label style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 6px; display: block;">Quality Rating</label>
                <select id="sleep-quality-input" class="glass-input">
                  <option value="5">★★★★★ Deep</option>
                  <option value="4" selected>★★★★☆ Rested</option>
                  <option value="3">★★★☆☆ Moderate</option>
                  <option value="2">★★☆☆☆ Light</option>
                  <option value="1">★☆☆☆☆ Broken</option>
                </select>
              </div>
            </div>

            <button class="btn btn-primary" id="btn-save-sleep" style="width: 100%; box-shadow: 0 4px 16px var(--accent-primary-glow);">
              Save Sleep Interval
            </button>
          </div>

          <!-- 7-Day Volumetric Sleep Duration Chart -->
          <div class="glass-panel" style="padding: 22px; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="font-size: 15px; font-weight: 700;">7-Day Sleep Duration Volume</h3>
              <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-tertiary);">8h Baseline</span>
            </div>

            <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 130px; border-bottom: 1px solid var(--border-subtle); padding-top: 10px; gap: 8px; position: relative;">
              <!-- 8h Baseline Target Guide -->
              <div style="position: absolute; bottom: 80%; left: 0; right: 0; border-top: 1px dashed rgba(255, 255, 255, 0.15); pointer-events: none;"></div>

              ${recent7.slice().reverse().map(r => {
                const hrs = r.durationMinutes / 60;
                const heightPct = Math.min(100, Math.max(15, (hrs / 10) * 100));
                const d = new Date(r.date + 'T00:00:00');
                const dayLabel = d.toLocaleDateString(undefined, { weekday: 'narrow' });
                return `
                  <div style="display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; justify-content: flex-end;" title="${r.date}: ${hrs.toFixed(1)}h">
                    <div style="width: 100%; max-width: 24px; height: ${heightPct}%; background: linear-gradient(180deg, var(--accent-cyan) 0%, var(--el-air) 100%); border-radius: 4px 4px 0 0; box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);"></div>
                    <span style="font-size: 11px; margin-top: 8px; color: var(--text-tertiary); font-weight: 600;">${dayLabel}</span>
                  </div>
                `;
              }).join('')}
            </div>
            <div style="margin-top: 12px; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary);">
              <span>Target: 8.0h Per Night</span>
              <span style="color: var(--accent-emerald); font-weight: 600;">High Synchronization</span>
            </div>
          </div>
        </div>

        <!-- Momentum Protocols Column -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Morning Routine -->
          <div class="glass-panel" style="padding: 22px; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass); border-left: 4px solid var(--el-light);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <div>
                <h3 style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                  <span>☀️</span> ${morningRoutine.title || 'Morning Momentum Protocol'}
                </h3>
                <span style="font-size: 12px; color: var(--text-tertiary);">Scheduled Window: ${morningRoutine.scheduledTime}</span>
              </div>
              <button class="btn btn-secondary btn-edit-routine" data-routine-id="${morningRoutine.id}" style="font-size: 12px; padding: 6px 12px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.16); color: #fff; cursor: pointer;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                <span>Edit Protocol</span>
              </button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${(morningRoutine.steps && morningRoutine.steps.length > 0) ? morningRoutine.steps.map(s => `
                <label style="display: flex; align-items: center; gap: 12px; font-size: 13.5px; cursor: pointer; padding: 6px 10px; border-radius: var(--radius-sm); background: rgba(255, 255, 255, 0.03);">
                  <input type="checkbox" class="routine-checkbox" data-routine-id="${morningRoutine.id}" data-step-id="${s.id}" ${s.completed ? 'checked' : ''} style="cursor: pointer;">
                  <span style="${s.completed ? 'text-decoration: line-through; opacity: 0.5;' : 'font-weight: 500;'}">${s.text}</span>
                </label>
              `).join('') : `
                <div style="padding: 16px; text-align: center; color: var(--text-tertiary); font-size: 13px; background: rgba(255,255,255,0.02); border-radius: var(--radius-sm); border: 1px dashed rgba(255,255,255,0.1);">
                  No custom routine steps added yet. Click "Edit Protocol" above to configure your steps.
                </div>
              `}
            </div>
          </div>

          <!-- Evening Decompression -->
          <div class="glass-panel" style="padding: 22px; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass); border-left: 4px solid var(--el-air);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
              <div>
                <h3 style="font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                  <span>🌙</span> ${nightRoutine.title || 'Evening Decompression Protocol'}
                </h3>
                <span style="font-size: 12px; color: var(--text-tertiary);">Scheduled Window: ${nightRoutine.scheduledTime}</span>
              </div>
              <button class="btn btn-secondary btn-edit-routine" data-routine-id="${nightRoutine.id}" style="font-size: 12px; padding: 6px 12px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.16); color: #fff; cursor: pointer;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                <span>Edit Protocol</span>
              </button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${(nightRoutine.steps && nightRoutine.steps.length > 0) ? nightRoutine.steps.map(s => `
                <label style="display: flex; align-items: center; gap: 12px; font-size: 13.5px; cursor: pointer; padding: 6px 10px; border-radius: var(--radius-sm); background: rgba(255, 255, 255, 0.03);">
                  <input type="checkbox" class="routine-checkbox" data-routine-id="${nightRoutine.id}" data-step-id="${s.id}" ${s.completed ? 'checked' : ''} style="cursor: pointer;">
                  <span style="${s.completed ? 'text-decoration: line-through; opacity: 0.5;' : 'font-weight: 500;'}">${s.text}</span>
                </label>
              `).join('') : `
                <div style="padding: 16px; text-align: center; color: var(--text-tertiary); font-size: 13px; background: rgba(255,255,255,0.02); border-radius: var(--radius-sm); border: 1px dashed rgba(255,255,255,0.1);">
                  No custom routine steps added yet. Click "Edit Protocol" above to configure your steps.
                </div>
              `}
            </div>
          </div>
        </div>
      </div>

      <!-- 3D Routine & Protocol Editor Modal -->
      <div id="routine-editor-modal" class="routine-modal-backdrop" aria-hidden="true">
        <div class="routine-modal-card" role="dialog" aria-modal="true">
          <!-- Modal Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span id="modal-routine-icon" style="font-size: 24px; filter: drop-shadow(0 2px 8px rgba(255,255,255,0.3));">☀️</span>
              <div>
                <h2 id="modal-routine-heading" style="font-size: 18px; font-weight: 800; color: #fff; margin: 0; letter-spacing: -0.4px;">Edit Protocol</h2>
                <span style="font-size: 12px; color: var(--text-tertiary);">Customize ritual steps & schedule</span>
              </div>
            </div>
            <button id="modal-routine-close-btn" class="routine-step-delete-btn" style="padding: 6px;" title="Close modal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <!-- Protocol Details Inputs -->
          <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
            <div>
              <label style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 6px; display: block; letter-spacing: 0.5px;">Protocol Title</label>
              <input type="text" id="modal-routine-title-input" class="glass-input" style="width: 100%; font-size: 13.5px;" placeholder="e.g. Morning Momentum Protocol">
            </div>
            <div>
              <label style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 6px; display: block; letter-spacing: 0.5px;">Scheduled Window / Target Time</label>
              <input type="text" id="modal-routine-time-input" class="glass-input" style="width: 100%; font-size: 13.5px;" placeholder="e.g. 07:15 or 22:30">
            </div>
          </div>

          <!-- Protocol Steps Section -->
          <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <label style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); letter-spacing: 0.5px;">Protocol Action Steps</label>
              <span id="modal-routine-step-count" style="font-size: 11px; font-family: var(--font-mono); color: var(--text-tertiary);">0 steps</span>
            </div>

            <!-- Steps List Container -->
            <div id="modal-routine-steps-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto; padding-right: 4px; margin-bottom: 12px;"></div>

            <!-- Add Step Input Row -->
            <div style="display: flex; gap: 8px;">
              <input type="text" id="modal-new-step-text" class="glass-input" style="flex: 1; font-size: 13px;" placeholder="Add a new action step (e.g. 10m sunlight)...">
              <button id="modal-btn-add-step" class="btn btn-secondary" style="white-space: nowrap; font-size: 12px; padding: 8px 14px; display: inline-flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18);">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Add Step</span>
              </button>
            </div>
          </div>

          <!-- Modal Actions Footer -->
          <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
            <button id="modal-routine-cancel-btn" class="btn btn-secondary" style="font-size: 13px; padding: 8px 18px;">Cancel</button>
            <button id="modal-routine-save-btn" class="btn btn-primary" style="font-size: 13px; padding: 8px 22px; box-shadow: 0 4px 16px var(--accent-primary-glow);">Save Protocol</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Save Sleep
  const btnSave = container.querySelector('#btn-save-sleep');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const bedtime = container.querySelector('#sleep-bedtime-input').value;
      const waketime = container.querySelector('#sleep-waketime-input').value;
      const quality = Number(container.querySelector('#sleep-quality-input').value);

      ambientAudio.playChime();
      store.recordSleep(todayIso, bedtime, waketime, quality);
      renderSleepView(container, navigate);
    });
  }

  // Bind Routine Checkboxes
  container.querySelectorAll('.routine-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const routineId = cb.getAttribute('data-routine-id');
      const stepId = cb.getAttribute('data-step-id');
      if (cb.checked) ambientAudio.playChime();
      store.toggleRoutineStep(routineId, stepId, todayIso);
      renderSleepView(container, navigate);
    });
  });

  // --------------------------------------------------------------------------
  // 3D Protocol Editor Modal Controller
  // --------------------------------------------------------------------------
  let activeEditingRoutine = null;

  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  const modal = container.querySelector('#routine-editor-modal');
  const modalHeading = container.querySelector('#modal-routine-heading');
  const modalIcon = container.querySelector('#modal-routine-icon');
  const modalTitleInput = container.querySelector('#modal-routine-title-input');
  const modalTimeInput = container.querySelector('#modal-routine-time-input');
  const modalStepsList = container.querySelector('#modal-routine-steps-list');
  const modalStepCount = container.querySelector('#modal-routine-step-count');
  const modalNewStepText = container.querySelector('#modal-new-step-text');
  const modalBtnAddStep = container.querySelector('#modal-btn-add-step');
  const modalCancelBtn = container.querySelector('#modal-routine-cancel-btn');
  const modalCloseBtn = container.querySelector('#modal-routine-close-btn');
  const modalSaveBtn = container.querySelector('#modal-routine-save-btn');

  function openRoutineModal(routineId) {
    const routine = store.getRoutineById(routineId) || routines.find(r => r.id === routineId);
    if (!routine) return;

    activeEditingRoutine = {
      id: routine.id,
      title: routine.title || (routine.timeOfDay === 'morning' ? 'Morning Momentum Protocol' : 'Evening Decompression Protocol'),
      timeOfDay: routine.timeOfDay,
      scheduledTime: routine.scheduledTime || '',
      steps: (routine.steps || []).map(s => ({ ...s }))
    };

    const isMorning = activeEditingRoutine.timeOfDay === 'morning';
    modalIcon.textContent = isMorning ? '☀️' : '🌙';
    modalHeading.textContent = `Edit ${isMorning ? 'Morning Momentum' : 'Evening Decompression'} Protocol`;
    modalTitleInput.value = activeEditingRoutine.title;
    modalTimeInput.value = activeEditingRoutine.scheduledTime;
    modalNewStepText.value = '';

    renderModalSteps();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => modalTitleInput.focus(), 50);
  }

  function closeRoutineModal() {
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    activeEditingRoutine = null;
  }

  function renderModalSteps() {
    if (!activeEditingRoutine || !modalStepsList) return;
    const steps = activeEditingRoutine.steps;
    modalStepCount.textContent = `${steps.length} step${steps.length === 1 ? '' : 's'}`;

    if (steps.length === 0) {
      modalStepsList.innerHTML = `
        <div style="text-align: center; padding: 18px; color: var(--text-tertiary); font-size: 12.5px; font-style: italic;">
          No action steps yet. Add your first step below.
        </div>
      `;
      return;
    }

    modalStepsList.innerHTML = steps.map((step, idx) => `
      <div class="routine-step-edit-item" data-step-idx="${idx}">
        <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-tertiary); min-width: 18px;">${idx + 1}.</span>
        <input type="text" class="routine-step-input" data-step-idx="${idx}" value="${escapeHtml(step.text)}" placeholder="Step description...">
        <button type="button" class="routine-step-delete-btn" data-step-idx="${idx}" title="Delete step">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `).join('');

    // Bind step text editing
    modalStepsList.querySelectorAll('.routine-step-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = Number(e.target.getAttribute('data-step-idx'));
        if (activeEditingRoutine && activeEditingRoutine.steps[idx]) {
          activeEditingRoutine.steps[idx].text = e.target.value;
        }
      });
    });

    // Bind step delete buttons
    modalStepsList.querySelectorAll('.routine-step-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-step-idx'));
        if (activeEditingRoutine && activeEditingRoutine.steps[idx] !== undefined) {
          activeEditingRoutine.steps.splice(idx, 1);
          renderModalSteps();
        }
      });
    });
  }

  function handleAddStep() {
    if (!activeEditingRoutine || !modalNewStepText) return;
    const text = modalNewStepText.value.trim();
    if (!text) return;

    activeEditingRoutine.steps.push({
      id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text,
      completed: false
    });

    modalNewStepText.value = '';
    renderModalSteps();
    modalNewStepText.focus();
  }

  function handleSaveRoutine() {
    if (!activeEditingRoutine) return;
    const updatedTitle = modalTitleInput.value.trim() || activeEditingRoutine.title;
    const updatedTime = modalTimeInput.value.trim() || activeEditingRoutine.scheduledTime;

    // Filter out any blank steps
    const cleanedSteps = activeEditingRoutine.steps
      .map(s => ({ ...s, text: s.text.trim() }))
      .filter(s => s.text.length > 0);

    store.updateRoutine(activeEditingRoutine.id, {
      title: updatedTitle,
      scheduledTime: updatedTime,
      steps: cleanedSteps
    });

    ambientAudio.playChime();
    closeRoutineModal();
    renderSleepView(container, navigate);
  }

  // Bind Edit Protocol buttons
  container.querySelectorAll('.btn-edit-routine').forEach(btn => {
    btn.addEventListener('click', () => {
      const routineId = btn.getAttribute('data-routine-id');
      openRoutineModal(routineId);
    });
  });

  // Bind modal step addition
  if (modalBtnAddStep) {
    modalBtnAddStep.addEventListener('click', handleAddStep);
  }
  if (modalNewStepText) {
    modalNewStepText.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddStep();
      }
    });
  }

  // Bind modal actions
  if (modalSaveBtn) modalSaveBtn.addEventListener('click', handleSaveRoutine);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeRoutineModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeRoutineModal);

  // Close on clicking backdrop outside card
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeRoutineModal();
    });
  }
}

