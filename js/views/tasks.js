/**
 * AETHER OS — ADVANCED TODO LIST SYSTEM
 * Filter by priority, category, energy, subtask checklists,
 * inline editing, and instant focus timer triggers.
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

  container.innerHTML = `
    <div class="animate-fade-in">
      <!-- Header & Search Bar -->
      <div class="tasks-header-bar">
        <div>
          <h1 style="font-size: 26px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 4px;">Tasks & Outcomes</h1>
          <p style="font-size: 13.5px; color: var(--text-secondary);">Manage, organize, and execute your high-leverage priorities.</p>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <input type="text" id="tasks-search-input" class="glass-input" style="width: 240px; padding: 8px 14px; font-size: 13px;" placeholder="Search tasks..." value="${searchQuery}">
          <button class="btn btn-primary" id="btn-tasks-new-task">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Task (N)
          </button>
        </div>
      </div>

      <!-- Filters Row -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
        <!-- Category Filter Pills -->
        <div class="tasks-filter-pills">
          <button class="filter-pill ${activeCategoryFilter === 'all' ? 'active' : ''}" data-cat="all">All Categories</button>
          ${categories.map(c => `
            <button class="filter-pill ${activeCategoryFilter === c.id ? 'active' : ''}" data-cat="${c.id}">
              <span class="cat-dot" style="background: ${c.color};"></span>
              ${c.name}
            </button>
          `).join('')}
        </div>

        <!-- Priority Filter Pills -->
        <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-tertiary);">
          <span>Priority:</span>
          ${['all', 'critical', 'high', 'medium', 'low'].map(p => `
            <button class="btn btn-ghost ${activePriorityFilter === p ? 'active' : ''}" data-priority="${p}" style="padding: 2px 10px; font-size: 11.5px; border-radius: var(--radius-full); ${activePriorityFilter === p ? 'background: var(--bg-surface-elevated); color: var(--text-primary); font-weight: 600;' : ''}">
              ${p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Pending Tasks Section -->
      <div style="margin-bottom: 32px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <h3 style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-secondary);">
            Pending Tasks (${pendingTasks.length})
          </h3>
        </div>

        <div class="task-items-list" id="pending-tasks-list">
          ${pendingTasks.length === 0 ? `
            <div class="glass-panel" style="padding: 36px; text-align: center; color: var(--text-tertiary);">
              No pending tasks match this criteria. All clear!
            </div>
          ` : pendingTasks.map(t => renderTaskItem(t)).join('')}
        </div>
      </div>

      <!-- Completed Tasks Section -->
      ${completedTasks.length > 0 ? `
        <details style="margin-top: 24px;">
          <summary style="font-size: 13.5px; font-weight: 600; color: var(--text-tertiary); cursor: pointer; padding: 8px 0; outline: none;">
            Completed Tasks (${completedTasks.length})
          </summary>
          <div class="task-items-list" style="margin-top: 12px; opacity: 0.75;">
            ${completedTasks.map(t => renderTaskItem(t)).join('')}
          </div>
        </details>
      ` : ''}
    </div>
  `;

  // Bind Events
  container.querySelector('#btn-tasks-new-task').addEventListener('click', () => {
    window.aetherQuickAdd && window.aetherQuickAdd.open(activeCategoryFilter !== 'all' ? activeCategoryFilter : null);
  });

  const searchInp = container.querySelector('#tasks-search-input');
  searchInp.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTasksView(container, navigate);
  });

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

  // Task item interaction events
  container.querySelectorAll('.btn-check-task').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = btn.getAttribute('data-task-id');
      const updated = store.toggleTaskCompleted(taskId);
      if (updated && updated.completed) {
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
        const newTitle = prompt('Edit Task Title:', task.title);
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
    <div class="glass-card task-card ${task.completed ? 'completed' : ''}" data-task-id="${task.id}" style="flex-direction: column; align-items: stretch; gap: 8px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <button class="task-checkbox btn-check-task" data-task-id="${task.id}">
          ${task.completed ? '✓' : ''}
        </button>

        <div class="task-info-center">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="task-title">${task.title}</span>
            ${task.energyLevel === 'high' ? '<span title="High Energy Requirement" style="font-size: 13px;">⚡</span>' : ''}
          </div>
          <div class="task-meta-row">
            <span class="badge cat-badge">
              <span class="cat-dot" style="background: ${cat.color};"></span>
              ${cat.name}
            </span>
            <span>⏱ ${task.estimatedDuration}m</span>
            ${timeDisplay ? `<span>🕒 ${timeDisplay}</span>` : ''}
            ${task.priority !== 'none' ? `<span class="badge priority-${task.priority}">${task.priority}</span>` : ''}
            ${subtasks.length > 0 ? `
              <button class="btn btn-ghost btn-toggle-subtasks" data-task-id="${task.id}" style="padding: 2px 6px; font-size: 11px; border-radius: 4px;">
                ☑ ${completedSubtasks}/${subtasks.length} subtasks
              </button>
            ` : ''}
          </div>
        </div>

        <div class="task-actions-right">
          ${!task.completed ? `
            <button class="btn btn-primary btn-start-focus" data-task-id="${task.id}" style="padding: 6px 12px; font-size: 12px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Focus
            </button>
          ` : ''}
          <button class="btn btn-ghost btn-icon btn-edit-task" data-task-id="${task.id}" title="Rename Task" style="width: 28px; height: 28px; color: var(--text-muted); font-size: 14px;">
            ✎
          </button>
          <button class="btn btn-ghost btn-icon btn-delete-task" data-task-id="${task.id}" title="Delete Task" style="width: 28px; height: 28px; color: var(--text-muted);">
            ✕
          </button>
        </div>
      </div>

      <!-- Expandable Subtasks Checklist -->
      ${subtasks.length > 0 ? `
        <div id="subtasks-list-${task.id}" style="display: none; flex-direction: column; gap: 6px; padding-left: 36px; padding-top: 6px; border-top: 1px solid var(--border-subtle);">
          ${subtasks.map(s => `
            <label style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--text-secondary); cursor: pointer;">
              <input type="checkbox" class="subtask-check" data-task-id="${task.id}" data-subtask-id="${s.id}" ${s.completed ? 'checked' : ''}>
              <span style="${s.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${s.title}</span>
            </label>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}
