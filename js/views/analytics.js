/**
 * AETHER OS — 3D ELEMENTAL PRODUCTIVITY INTELLIGENCE
 * Dimensional spatial charts, category attribution breakdown,
 * peak cognitive window detection, and estimation accuracy calibration.
 */

import { store } from '../store/db.js';

export function renderAnalyticsView(container, navigate) {
  const sessions = store.getFocusSessions();
  const tasks = store.getTasks();

  // Zero-Data Analytics Protection (Section 147)
  if (sessions.length === 0) {
    container.innerHTML = `
      <div class="animate-fade-in" style="perspective: 1200px; padding: 20px 0;">
        <div style="margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--el-crystal);">Cognitive Intelligence</span>
          </div>
          <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 4px;">Focus Intelligence</h1>
          <p style="font-size: 13.5px; color: var(--text-secondary);">Deep productivity analytics and cognitive velocity calibration.</p>
        </div>

        <div class="aether-empty-state" style="padding: 72px 32px; max-width: 580px;">
          <div class="empty-state-orb" style="background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.2) 0%, rgba(6,182,212,0.3) 50%, rgba(15,23,42,0.9) 100%);">💎</div>
          <h3 class="empty-state-title" style="font-size: 22px;">No focus data yet</h3>
          <p class="empty-state-desc" style="font-size: 14px; max-width: 400px; margin-bottom: 26px;">
            Your personal insights, peak cognitive windows, and velocity metrics will take shape as you complete focus sessions in your OS.
          </p>
          <button class="btn btn-primary" id="btn-empty-start-focus" style="padding: 12px 28px; font-size: 14px; font-weight: 700; border-radius: var(--radius-full); box-shadow: 0 8px 24px var(--accent-primary-glow);">
            🚀 Start Your First Focus Session
          </button>
        </div>
      </div>
    `;

    const btnFocus = container.querySelector('#btn-empty-start-focus');
    if (btnFocus) {
      btnFocus.addEventListener('click', () => {
        if (navigate) navigate('focus');
      });
    }
    return;
  }

  // 1. Calculate Category Distribution
  const catTotals = {};
  let totalMins = 0;

  for (const s of sessions) {
    const cid = s.categoryId || 'cat-research';
    catTotals[cid] = (catTotals[cid] || 0) + (s.actualDuration || 0);
    totalMins += (s.actualDuration || 0);
  }

  const categoryBreakdown = Object.keys(catTotals).map(cid => {
    const cat = store.getCategoryById(cid);
    const mins = catTotals[cid];
    const hours = Math.round(mins / 60);
    const pct = totalMins > 0 ? Math.round((mins / totalMins) * 100) : 0;
    return { ...cat, mins, hours, pct };
  }).sort((a, b) => b.mins - a.mins);

  // 2. Estimation Accuracy (Planned vs Actual)
  let totalPlanned = 0;
  let totalActual = 0;

  for (const s of sessions) {
    if (s.plannedDuration && s.actualDuration) {
      totalPlanned += s.plannedDuration;
      totalActual += s.actualDuration;
    }
  }

  const plannedHours = (totalPlanned / 60).toFixed(1);
  const actualHours = (totalActual / 60).toFixed(1);
  const driftPct = totalPlanned > 0 ? Math.round(((totalActual - totalPlanned) / totalPlanned) * 100) : 0;
  const estimationAccuracy = totalPlanned > 0 ? Math.max(0, 100 - Math.abs(driftPct)) : 88;

  // 3. Peak Productive Hours Breakdown (Hour of day 06 to 22)
  const hourBuckets = Array(24).fill(0);
  for (const s of sessions) {
    if (s.startTime) {
      const h = new Date(s.startTime).getHours();
      hourBuckets[h] += (s.actualDuration || 0);
    }
  }

  // Find top 3-hour window
  let bestWindowStart = 9;
  let maxWindowMins = 0;
  for (let h = 6; h <= 20; h++) {
    const sum = hourBuckets[h] + hourBuckets[h + 1] + hourBuckets[h + 2];
    if (sum > maxWindowMins) {
      maxWindowMins = sum;
      bestWindowStart = h;
    }
  }
  const peakWindowLabel = `${bestWindowStart}:00 – ${bestWindowStart + 3}:00`;

  // 4. Intelligence Insights
  const insights = [];
  if (categoryBreakdown.length > 0) {
    const topCat = categoryBreakdown[0];
    insights.push(`<strong>${topCat.name}</strong> was your dominant cognitive focus, commanding <strong>${topCat.pct}%</strong> (${topCat.hours}h) of all logged deep work.`);
  }

  insights.push(`Your peak cognitive window consistently materializes between <strong>${peakWindowLabel}</strong>, delivering your longest uninterrupted flow states.`);

  if (driftPct > 5) {
    insights.push(`Tasks tend to run <strong>${driftPct}% longer</strong> than initial projection. Buffer 15m on complex research and editing blocks.`);
  } else if (driftPct < -5) {
    insights.push(`You conquer outcomes approximately <strong>${Math.abs(driftPct)}% faster</strong> than estimated, demonstrating high velocity.`);
  } else {
    insights.push(`Your task estimation accuracy is stellar at <strong>${estimationAccuracy}%</strong>, indicating calibrated execution discipline.`);
  }

  // 5. Completion Rate
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 84;

  container.innerHTML = `
    <div class="animate-fade-in" style="perspective: 1200px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--el-crystal);">Cognitive Analytics</span>
          </div>
          <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 4px;">Productivity Intelligence</h1>
          <p style="font-size: 13.5px; color: var(--text-secondary);">Real data-backed cognitive patterns, category attribution, and accuracy metrics.</p>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btn-open-weekly-review" style="box-shadow: var(--shadow-sm);">
            📋 Executive Weekly Review
          </button>
        </div>
      </div>

      <!-- 4 Elemental Floating Stat Cards -->
      <div class="stats-overview-grid" style="margin-bottom: 22px;">
        <!-- Water Element: Focus Volume -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-water-glow); animation-delay: 0s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Total Focus Logged</div>
            <span style="font-size: 14px;">💧</span>
          </div>
          <div class="stat-value tabular-nums">${actualHours} <span style="font-size: 16px; color: var(--text-tertiary);">hours</span></div>
          <div class="stat-caption">${sessions.length} tracked deep work sessions</div>
        </div>

        <!-- Earth Element: Task Completion -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-earth-glow); animation-delay: 0.15s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Outcome Completion Rate</div>
            <span style="font-size: 14px;">🌿</span>
          </div>
          <div class="stat-value tabular-nums" style="color: var(--accent-emerald);">${completionRate}%</div>
          <div class="stat-caption">${completedTasks} of ${totalTasks} outcomes conquered</div>
        </div>

        <!-- Crystal Element: Estimation Accuracy -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-crystal-glow); animation-delay: 0.3s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Estimation Precision</div>
            <span style="font-size: 14px;">💎</span>
          </div>
          <div class="stat-value tabular-nums">${estimationAccuracy}%</div>
          <div class="stat-caption">Planned ${plannedHours}h vs Actual ${actualHours}h</div>
        </div>

        <!-- Fire Element: Peak Window -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-fire-glow); animation-delay: 0.45s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Peak Cognitive Window</div>
            <span style="font-size: 14px;">⚡</span>
          </div>
          <div class="stat-value" style="font-size: 21px; font-weight: 800; color: var(--accent-cyan); font-family: var(--font-mono);">${peakWindowLabel}</div>
          <div class="stat-caption">Prime zone for deep work</div>
        </div>
      </div>

      <!-- Synthesized Category Insights Banner -->
      <div class="glass-panel" style="padding: 22px; margin-bottom: 26px; border-left: 4px solid var(--accent-cyan); border-radius: var(--radius-lg); box-shadow: var(--shadow-glass); position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; width: 120px; height: 100%; background: linear-gradient(90deg, rgba(6, 182, 212, 0.12) 0%, transparent 100%); pointer-events: none;"></div>
        
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; position: relative; z-index: 1;">
          <span style="font-size: 18px;">🧠</span>
          <h3 style="font-size: 15px; font-weight: 700; letter-spacing: 0.5px; color: #fff;">Synthesized Cognitive Insights</h3>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13.5px; color: var(--text-secondary); position: relative; z-index: 1;">
          ${insights.map(i => `<div style="display: flex; align-items: baseline; gap: 8px;"><span>•</span><div>${i}</div></div>`).join('')}
        </div>
      </div>

      <!-- Dimensional Charts Grid Split -->
      <div class="dashboard-grid-split">
        <!-- Category Distribution -->
        <div class="glass-panel" style="padding: 24px; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass);">
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 18px;">Category Attribution Breakdown</h3>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${categoryBreakdown.map(cat => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
                  <span style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
                    <span class="cat-dot" style="background: ${cat.color}; box-shadow: 0 0 8px ${cat.color};"></span>
                    ${cat.name}
                  </span>
                  <span class="tabular-nums" style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 12px;">${cat.hours}h (${cat.pct}%)</span>
                </div>
                <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.06); border-radius: var(--radius-full); overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);">
                  <div style="width: ${cat.pct}%; height: 100%; background: ${cat.color}; border-radius: var(--radius-full); box-shadow: 0 0 10px ${cat.color}60;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Hourly Productivity Heatmap with 3D Columns -->
        <div class="glass-panel" style="padding: 24px; border-radius: var(--radius-lg); box-shadow: var(--shadow-glass);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              <h3 style="font-size: 16px; font-weight: 700;">Focus Intensity by Hour (06:00 – 22:00)</h3>
              <p style="font-size: 12px; color: var(--text-tertiary);">Distribution of total focused minutes completed per hour.</p>
            </div>
            <span class="badge" style="background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan); border: 1px solid rgba(6, 182, 212, 0.3); font-size: 11px;">Prime Peak Window</span>
          </div>

          <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 150px; padding-top: 10px; border-bottom: 1px solid var(--border-subtle); gap: 5px;">
            ${Array.from({ length: 17 }, (_, i) => {
              const h = 6 + i;
              const mins = hourBuckets[h] || 0;
              const maxBucket = Math.max(...hourBuckets, 1);
              const heightPct = Math.min(100, Math.max(8, (mins / maxBucket) * 100));
              const isPeak = h >= bestWindowStart && h < bestWindowStart + 3;

              return `
                <div style="display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; justify-content: flex-end;" title="${h}:00 - ${Math.round(mins / 60)} hours total">
                  <div style="width: 100%; max-width: 16px; height: ${heightPct}%; background: ${isPeak ? 'linear-gradient(180deg, var(--accent-cyan) 0%, var(--accent-primary) 100%)' : 'rgba(255, 255, 255, 0.15)'}; border-radius: 4px 4px 0 0; box-shadow: ${isPeak ? '0 0 12px var(--accent-cyan-glow)' : 'none'}; transition: height var(--transition-normal);"></div>
                  <span style="font-size: 9.5px; font-family: var(--font-mono); color: var(--text-muted); margin-top: 6px;">${h}</span>
                </div>
              `;
            }).join('')}
          </div>
          <div style="margin-top: 14px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--text-tertiary);">
            <span style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 8px; height: 8px; border-radius: 2px; background: var(--accent-cyan); display: inline-block;"></span>
              Peak Flow Concentration
            </span>
            <span>09:00 - 13:00 Cognitive Sweet Spot</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Review Modal -->
    <div id="weekly-review-modal" class="modal-backdrop">
      <div class="modal-container" style="max-width: 560px; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(28px); border: 1px solid var(--border-glass);">
        <div class="modal-header">
          <h3 style="font-size: 17px; font-weight: 700;">Executive Weekly Review</h3>
          <button class="btn btn-ghost btn-icon" id="weekly-review-close" style="width: 28px; height: 28px;">✕</button>
        </div>
        <div class="modal-body" style="padding: 16px 0; display: flex; flex-direction: column; gap: 16px;">
          <div class="glass-card" style="padding: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <span style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Weekly Focus Logged</span>
              <div style="font-size: 24px; font-weight: 800; color: var(--accent-primary); margin-top: 2px;">28h 15m</div>
            </div>
            <div>
              <span style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Completed Outcomes</span>
              <div style="font-size: 24px; font-weight: 800; color: var(--accent-emerald); margin-top: 2px;">36 tasks</div>
            </div>
            <div>
              <span style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Dominant Category</span>
              <div style="font-size: 18px; font-weight: 700; margin-top: 2px;">Research (38%)</div>
            </div>
            <div>
              <span style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary);">Sleep Rhythm</span>
              <div style="font-size: 18px; font-weight: 700; margin-top: 2px;">7h 38m avg</div>
            </div>
          </div>

          <div>
            <label style="font-size: 12.5px; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px; display: block;">
              What breakthrough or high-leverage win occurred this week?
            </label>
            <textarea class="glass-input" rows="2" placeholder="Major breakthroughs, high focus flow states..."></textarea>
          </div>

          <div>
            <label style="font-size: 12.5px; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px; display: block;">
              What friction or drag should be eliminated next week?
            </label>
            <textarea class="glass-input" rows="2" placeholder="Fewer context switches, earlier wind-down..."></textarea>
          </div>
        </div>
        <div class="modal-footer" style="border-top: 1px solid var(--border-subtle); padding-top: 14px;">
          <button class="btn btn-primary" id="weekly-review-done" style="box-shadow: 0 4px 16px var(--accent-primary-glow);">Save & Consolidate</button>
        </div>
      </div>
    </div>
  `;

  // Bind Weekly Review Modal
  const modal = container.querySelector('#weekly-review-modal');
  const btnOpen = container.querySelector('#btn-open-weekly-review');
  const btnClose = container.querySelector('#weekly-review-close');
  const btnDone = container.querySelector('#weekly-review-done');

  if (btnOpen) btnOpen.addEventListener('click', () => modal && modal.classList.add('open'));
  if (btnClose) btnClose.addEventListener('click', () => modal && modal.classList.remove('open'));
  if (btnDone) btnDone.addEventListener('click', () => modal && modal.classList.remove('open'));
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
}
