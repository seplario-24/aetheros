/**
 * AETHER OS — 3D ELEMENTAL TASK ARCHITECTURE
 * Floating physical task objects with category material strips,
 * particle explosion bursts on completion, priority elemental glows,
 * instant focus timer ignition, and subtask checklists.
 */

import { store } from '../store/db.js';
import { timerEngine } from '../engine/timer.js';
import { ambientAudio } from '../audio/ambient.js';

let activeCategoryFilter = 'all';
let activePriorityFilter = 'all';
let searchQuery = '';

export function renderTasksView(container, navigate) {
  const categories = store.getCategories();
  let tasks = store.getTasks();

  // Apply filters
  if (activeCategoryFilter !== 'all') {
    tasks = tasks.filter(t => t.categoryId === activeCategoryFilter);
  }
  if (activePriorityFilter !== 'all') {
    tasks = tasks.filter(t => t.priority === activePriorityFilter);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)));
  }

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Vitals calculations
  const totalPendingMinutes = pendingTasks.reduce((acc, t) => acc + (t.estimatedDuration || 0), 0);
  const pendingHours = (totalPendingMinutes / 60).toFixed(1);
  const criticalCount = pendingTasks.filter(t => t.priority === 'critical' || t.priority === 'high').length;
  const completedTodayCount = completedTasks.length;

  container.innerHTML = `
    <div class="animate-fade-in" style="perspective: 1200px;">
      <!-- Header Bar -->
      <div class="tasks-header-bar" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--el-water);">Tactile Execution</span>
          </div>
          <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 4px;">Tasks & Outcomes</h1>
          <p style="font-size: 13.5px; color: var(--text-secondary);">Manage, organize, and execute high-leverage outcomes with spatial depth.</p>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <input type="text" id="tasks-search-input" class="glass-input" style="width: 220px; padding: 8px 14px; font-size: 13px; border-radius: var(--radius-full);" placeholder="Search outcomes..." value="${searchQuery}">
          <button class="btn btn-primary" id="btn-tasks-new-task" style="box-shadow: 0 4px 16px var(--accent-primary-glow); display: flex; align-items: center; gap: 8px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Outcome (N)
          </button>
        </div>
      </div>

      <!-- 4 Elemental Floating Stat Cards -->
      <div class="stats-overview-grid" style="margin-bottom: 22px;">
        <!-- Water Element: Pending Tasks -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-water-glow); animation-delay: 0s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Pending Outcomes</div>
            <span style="font-size: 14px;">💧</span>
          </div>
          <div class="stat-value tabular-nums">${pendingTasks.length} <span style="font-size: 16px; color: var(--text-tertiary);">tasks</span></div>
          <div class="stat-caption">Ready for execution</div>
        </div>

        <!-- Light Element: Queued Duration -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-light-glow); animation-delay: 0.15s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Focus Work Queued</div>
            <span style="font-size: 14px;">⚡</span>
          </div>
          <div class="stat-value tabular-nums">${pendingHours} <span style="font-size: 16px; color: var(--text-tertiary);">hours</span></div>
          <div class="stat-caption">${totalPendingMinutes} total focus minutes</div>
        </div>

        <!-- Fire Element: High Leverage Urgency -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-fire-glow); animation-delay: 0.3s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">High Urgency Tasks</div>
            <span style="font-size: 14px;">🔥</span>
          </div>
          <div class="stat-value tabular-nums" style="color: var(--el-fire);">${criticalCount} <span style="font-size: 16px; color: var(--text-tertiary);">critical</span></div>
          <div class="stat-caption">Critical & High priority focus</div>
        </div>

        <!-- Earth Element: Completed Conquests -->
        <div class="glass-card stat-card spatial-floating-card animate-float" style="--stat-element-glow: var(--el-earth-glow); animation-delay: 0.45s;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="stat-header">Completed Today</div>
            <span style="font-size: 14px;">🌿</span>
          </div>
          <div class="stat-value tabular-nums" style="color: var(--accent-emerald);">${completedTodayCount} <span style="font-size: 16px; color: var(--text-tertiary);">done</span></div>
          <div class="stat-caption">Tangible progress logged</div>
        </div>
      </div>

      <!-- Filters Row -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
        <!-- Category Filter Pills -->
        <div class="tasks-filter-pills" style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="filter-pill ${activeCategoryFilter === 'all' ? 'active' : ''}" data-cat="all" style="border-radius: var(--radius-full); padding: 5px 14px; font-size: 12.5px;">All Categories</button>
          ${categories.map(c => `
            <button class="filter-pill ${activeCategoryFilter === c.id ? 'active' : ''}" data-cat="${c.id}" style="border-radius: var(--radius-full); padding: 5px 14px; font-size: 12.5px;">
              <span class="cat-dot" style="background: ${c.color};"></span>
              ${c.name}
            </button>
          `).join('')}
        </div>

        <!-- Priority Filter Pills -->
        <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-tertiary);">
          <span style="font-weight: 600;">Priority:</span>
          ${['all', 'critical', 'high', 'medium', 'low'].map(p => `
            <button class="btn btn-ghost ${activePriorityFilter === p ? 'active' : ''}" data-priority="${p}" style="padding: 3px 12px; font-size: 11.5px; border-radius: var(--radius-full); ${activePriorityFilter === p ? 'background: rgba(255, 255, 255, 0.12); color: #fff; font-weight: 700; border: 1px solid rgba(255, 255, 255, 0.2);' : ''}">
              ${p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Pending Tasks Section -->
      <div style="margin-bottom: 32px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <h3 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary);">
            Pending Outcomes (${pendingTasks.length})
          </h3>
        </div>

        <div class="task-items-list" id="pending-tasks-list" style="display: flex; flex-direction: column; gap: 12px;">
          ${pendingTasks.length === 0 ? `
            <div class="glass-panel" style="padding: 44px; text-align: center; color: var(--text-tertiary); border-radius: var(--radius-lg);">
              No pending outcomes in this view. Your mental horizon is completely clear!
            </div>
          ` : pendingTasks.map(t => renderTaskItem(t)).join('')}
        </div>
      </div>

      <!-- Completed Tasks Section -->
      ${completedTasks.length > 0 ? `
        <details style="margin-top: 24px;">
          <summary style="font-size: 13.5px; font-weight: 700; color: var(--text-tertiary); cursor: pointer; padding: 10px 0; outline: none;">
            ✓ Completed Outcomes (${completedTasks.length})
          </summary>
          <div class="task-items-list" style="margin-top: 14px; opacity: 0.8; display: flex; flex-direction: column; gap: 10px;">
            ${completedTasks.map(t => renderTaskItem(t)).join('')}
          </div>
        </details>
      ` : ''}
    </div>
  `;

  // Bind Events
  const btnNew = container.querySelector('#btn-tasks-new-task');
  if (btnNew) {
    btnNew.addEventListener('click', () => {
      window.aetherQuickAdd && window.aetherQuickAdd.open(activeCategoryFilter !== 'all' ? activeCategoryFilter : null);
    });
  }

  const searchInp = container.querySelector('#tasks-search-input');
  if (searchInp) {
    searchInp.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTasksView(container, navigate);
    });
  }

  container.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategoryFilter = btn.getAttribute('data-cat');
      renderTasksView(container, navigate);
    });
  });

  container.querySelectorAll('[data-priority]').forEach(btn => {
    btn.addEventListener('click', () => {
      activePriorityFilter = btn.getAttribute('data-priority');
      renderTasksView(container, navigate);
    });
  });

  // Task item interaction events + Particle Burst on Complete
  container.querySelectorAll('.btn-check-task').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = btn.getAttribute('data-task-id');
      const task = store.getTaskById(taskId);
      const cat = task ? store.getCategoryById(task.categoryId) : null;
      const updated = store.toggleTaskCompleted(taskId);

      if (updated && updated.completed) {
        const rect = btn.getBoundingClientRect();
        if (window.ParticleSystem && window.ParticleSystem.taskComplete) {
          window.ParticleSystem.taskComplete(rect.left + rect.width / 2, rect.top + rect.height / 2, cat ? cat.color : '#10b981');
        }
        ambientAudio.playChime();
      }
      renderTasksView(container, navigate);
    });
  });

  container.querySelectorAll('.btn-delete-task').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = btn.getAttribute('data-task-id');
      store.deleteTask(taskId);
      renderTasksView(container, navigate);
    });
  });

  container.querySelectorAll('.btn-edit-task').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = btn.getAttribute('data-task-id');
      const task = store.getTaskById(taskId);
      if (task) {
        const newTitle = prompt('Edit Outcome Title:', task.title);
        if (newTitle && newTitle.trim()) {
          store.updateTask(taskId, { title: newTitle.trim() });
          renderTasksView(container, navigate);
        }
      }
    });
  });

  container.querySelectorAll('.btn-start-focus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = btn.getAttribute('data-task-id');
      const task = store.getTaskById(taskId);
      if (task) {
        timerEngine.configure({
          mode: 'task',
          durationMinutes: task.estimatedDuration,
          task
        });
        timerEngine.start();
        navigate('focus');
      }
    });
  });

  // Subtask checkbox click
  container.querySelectorAll('.subtask-check').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const taskId = cb.getAttribute('data-task-id');
      const subtaskId = cb.getAttribute('data-subtask-id');
      const task = store.getTaskById(taskId);
      if (task && task.subtasks) {
        const sub = task.subtasks.find(s => s.id === subtaskId);
        if (sub) {
          sub.completed = cb.checked;
          store.updateTask(taskId, { subtasks: task.subtasks });
          if (cb.checked) ambientAudio.playChime();
        }
      }
    });
  });

  // Toggle subtasks expand
  container.querySelectorAll('.btn-toggle-subtasks').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = btn.getAttribute('data-task-id');
      const subList = container.querySelector(`#subtasks-list-${taskId}`);
      if (subList) {
        const isHidden = subList.style.display === 'none';
        subList.style.display = isHidden ? 'flex' : 'none';
      }
    });
  });
}

function formatDurationBadge(mins) {
  const m = Number(mins) || 0;
  if (m < 60) return `${m}m`;
  const hrs = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}

function renderTaskItem(task) {
  const cat = store.getCategoryById(task.categoryId);
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;

  let timeDisplay = '';
  if (task.scheduledStart) {
    const sDate = new Date(task.scheduledStart);
    timeDisplay = sDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return `
    <div class="glass-card task-card ${task.completed ? 'completed' : ''}" data-task-id="${task.id}" 
         style="flex-direction: column; align-items: stretch; gap: 8px; border-left: 4px solid ${cat.color}; box-shadow: 0 4px 20px rgba(0,0,0,0.25); position: relative; overflow: hidden; padding: 14px 18px;">
      
      <!-- Ambient Category Glow Accent -->
      <div style="position: absolute; top: 0; left: 0; width: 80px; height: 100%; background: linear-gradient(90deg, ${cat.color}18 0%, transparent 100%); pointer-events: none;"></div>

      <div style="display: flex; align-items: center; gap: 14px; position: relative; z-index: 1;">
        <!-- Tactile 3D Checkbox -->
        <button class="task-checkbox btn-check-task" data-task-id="${task.id}" 
                style="width: 22px; height: 22px; border-radius: 6px; border: 1.5px solid ${task.completed ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.25)'}; background: ${task.completed ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.05)'}; color: #fff; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: ${task.completed ? '0 0 10px var(--accent-emerald-glow)' : 'inset 0 1px 2px rgba(0,0,0,0.4)'}; transition: all var(--transition-fast);">
          ${task.completed ? '✓' : ''}
        </button>

        <div class="task-info-center" style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="task-title" style="font-size: 15px; font-weight: 600; color: ${task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)'}; ${task.completed ? 'text-decoration: line-through;' : ''}">${task.title}</span>
            ${task.energyLevel === 'high' ? '<span title="High Focus Requirement" style="font-size: 13px;">⚡</span>' : ''}
          </div>
          <div class="task-meta-row" style="display: flex; align-items: center; gap: 10px; margin-top: 5px; font-size: 12px; color: var(--text-tertiary); flex-wrap: wrap;">
            <span class="badge cat-badge" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); font-size: 11px; padding: 2px 8px; border-radius: var(--radius-full);">
              <span class="cat-dot" style="background: ${cat.color};"></span>
              ${cat.name}
            </span>
            <span title="Estimated Focus Duration">⏱ ${formatDurationBadge(task.estimatedDuration)}</span>
            ${timeDisplay ? `<span>🕒 ${timeDisplay}</span>` : ''}
            ${task.priority !== 'none' ? `<span class="badge priority-${task.priority}" style="font-size: 10.5px; text-transform: uppercase; font-weight: 700; padding: 2px 6px; border-radius: 4px;">${task.priority}</span>` : ''}
            ${subtasks.length > 0 ? `
              <button class="btn btn-ghost btn-toggle-subtasks" data-task-id="${task.id}" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.05);">
                ☑ ${completedSubtasks}/${subtasks.length} steps
              </button>
            ` : ''}
          </div>
        </div>

        <div class="task-actions-right" style="display: flex; align-items: center; gap: 8px;">
          ${!task.completed ? `
            <button class="btn btn-primary btn-start-focus" data-task-id="${task.id}" style="padding: 6px 14px; font-size: 12px; font-weight: 700; border-radius: var(--radius-full); box-shadow: 0 2px 10px var(--accent-primary-glow); display: flex; align-items: center; gap: 6px;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Focus
            </button>
          ` : ''}
          <button class="btn btn-ghost btn-icon btn-edit-task" data-task-id="${task.id}" title="Rename Outcome" style="width: 30px; height: 30px; color: var(--text-muted); font-size: 13px;">
            ✎
          </button>
          <button class="btn btn-ghost btn-icon btn-delete-task" data-task-id="${task.id}" title="Delete Outcome" style="width: 30px; height: 30px; color: var(--text-muted);">
            ✕
          </button>
        </div>
      </div>

      <!-- Expandable Subtasks Checklist -->
      ${subtasks.length > 0 ? `
        <div id="subtasks-list-${task.id}" style="display: none; flex-direction: column; gap: 8px; padding-left: 36px; padding-top: 10px; border-top: 1px solid var(--border-subtle); margin-top: 4px;">
          ${subtasks.map(s => `
            <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-secondary); cursor: pointer;">
              <input type="checkbox" class="subtask-check" data-task-id="${task.id}" data-subtask-id="${s.id}" ${s.completed ? 'checked' : ''} style="cursor: pointer;">
              <span style="${s.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${s.title}</span>
            </label>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}
