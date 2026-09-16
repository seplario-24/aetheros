/**
 * AETHER OS — GLOBAL COMMAND PALETTE (Ctrl/Cmd + K)
 * Omnibox search across tasks, categories, and fast system commands.
 */

import { store } from '../store/db.js';
import { timerEngine } from '../engine/timer.js';

export class CommandPalette {
  constructor(appNavigate) {
    this.navigate = appNavigate;
    this.isOpen = false;
    this.selectedIndex = 0;
    this.query = '';
    this.results = [];

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-backdrop';
    this.overlay.id = 'command-palette-backdrop';

    this.overlay.innerHTML = `
      <div class="modal-container" style="max-width: 600px;">
        <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-tertiary);">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="palette-search-input" class="glass-input" style="border: none; background: transparent; padding: 0; font-size: 16px;" placeholder="Search tasks or type a command... (Esc to exit)">
        </div>
        <div id="palette-results-list" style="max-height: 380px; overflow-y: auto; padding: 8px;"></div>
        <div style="padding: 10px 20px; border-top: 1px solid var(--border-subtle); font-size: 11.5px; color: var(--text-tertiary); display: flex; align-items: center; justify-content: space-between;">
          <span>Navigate with <span class="kbd-shortcut">↑</span> <span class="kbd-shortcut">↓</span>, select with <span class="kbd-shortcut">↵</span></span>
          <span><span class="kbd-shortcut">ESC</span> to close</span>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    this.input = this.overlay.querySelector('#palette-search-input');
    this.resultsList = this.overlay.querySelector('#palette-results-list');
  }

  bindEvents() {
    // Global shortcut Ctrl+K or Cmd+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.input.addEventListener('input', (e) => {
      this.query = e.target.value.trim().toLowerCase();
      this.selectedIndex = 0;
      this.updateResults();
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex + 1) % Math.max(1, this.results.length);
        this.renderResults();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex = (this.selectedIndex - 1 + this.results.length) % Math.max(1, this.results.length);
        this.renderResults();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.executeSelected();
      }
    });
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.isOpen = true;
    this.query = '';
    this.input.value = '';
    this.selectedIndex = 0;
    this.overlay.classList.add('open');
    this.updateResults();
    setTimeout(() => this.input.focus(), 50);
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('open');
  }

  getDefaultCommands() {
    return [
      {
        id: 'cmd-new-task',
        title: 'Create New Task',
        category: 'Action',
        shortcut: 'N',
        action: () => window.aetherQuickAdd && window.aetherQuickAdd.open()
      },
      {
        id: 'cmd-focus-pomodoro',
        title: 'Start Pomodoro (25m Focus)',
        category: 'Focus',
        shortcut: 'T',
        action: () => {
          timerEngine.configure({ mode: 'pomodoro', durationMinutes: 25 });
          timerEngine.start();
          this.navigate('focus');
        }
      },
      {
        id: 'cmd-focus-sprint',
        title: 'Start 45m Focus Sprint',
        category: 'Focus',
        shortcut: 'F',
        action: () => {
          timerEngine.configure({ mode: 'sprint', durationMinutes: 45 });
          timerEngine.start();
          this.navigate('focus');
        }
      },
      {
        id: 'cmd-nav-calendar',
        title: 'Open Time-Blocking Calendar',
        category: 'Navigation',
        shortcut: 'C',
        action: () => this.navigate('calendar')
      },
      {
        id: 'cmd-nav-dots',
        title: 'Open 365-Day Dot Calendar',
        category: 'Navigation',
        shortcut: 'D',
        action: () => this.navigate('dots')
      },
      {
        id: 'cmd-nav-analytics',
        title: 'Open Analytics & Category Intelligence',
        category: 'Navigation',
        shortcut: 'A',
        action: () => this.navigate('analytics')
      },
      {
        id: 'cmd-boredom-games',
        title: "I'm Bored — Play Cognitive Mind Games",
        category: 'Lifestyle',
        shortcut: 'G',
        action: () => this.navigate('games')
      },
      {
        id: 'cmd-nav-sleep',
        title: 'Open Sleep & Routine Tracker',
        category: 'Lifestyle',
        shortcut: 'S',
        action: () => this.navigate('sleep')
      },
      {
        id: 'cmd-nav-habits',
        title: 'Open Habit Tracker (Monthly Matrix)',
        category: 'Navigation',
        shortcut: 'H',
        action: () => this.navigate('habits')
      },
      {
        id: 'cmd-habit-add',
        title: 'Add New Daily Habit',
        category: 'Habits',
        shortcut: '',
        action: () => {
          this.navigate('habits');
          setTimeout(() => {
            const btn = document.getElementById('btn-add-habit');
            if (btn) btn.click();
          }, 150);
        }
      },
      {
        id: 'cmd-toggle-theme',
        title: 'Toggle Theme (Dark / Light)',
        category: 'Preferences',
        shortcut: '',
        action: () => {
          const current = store.getPreferences().theme;
          const next = current === 'dark' ? 'light' : 'dark';
          store.updatePreferences({ theme: next });
          document.documentElement.setAttribute('data-theme', next);
        }
      }
    ];
  }

  updateResults() {
    const commands = this.getDefaultCommands();
    const tasks = store.getTasks();

    let matched = [];

    if (!this.query) {
      matched = commands;
    } else {
      // Filter commands
      const cmdMatches = commands.filter(c =>
        c.title.toLowerCase().includes(this.query) ||
        c.category.toLowerCase().includes(this.query)
      );

      // Filter habits
      const habits = store.getHabits();
      const habitMatches = habits
        .filter(h => h.name.toLowerCase().includes(this.query) || (h.category && h.category.toLowerCase().includes(this.query)))
        .map(h => {
          const stats = store.getHabitStats(h.id);
          return {
            id: `habit-${h.id}`,
            title: `${h.icon || '🌱'} ${h.name}`,
            category: `Habit (${h.category || 'General'})`,
            shortcut: `🔥 ${stats.currentStreak}d`,
            action: () => {
              this.navigate('habits');
              setTimeout(() => {
                const row = document.querySelector(`.habit-name-cell[data-habit-id="${h.id}"]`);
                if (row) row.click();
              }, 150);
            }
          };
        });

      // Filter tasks
      const taskMatches = tasks
        .filter(t => t.title.toLowerCase().includes(this.query) || (t.tags && t.tags.some(tag => tag.toLowerCase().includes(this.query))))
        .map(t => ({
          id: `task-${t.id}`,
          title: t.title,
          category: `Task (${store.getCategoryById(t.categoryId).name})`,
          shortcut: t.completed ? 'Done' : `${t.estimatedDuration}m`,
          action: () => {
            timerEngine.configure({
              mode: 'task',
              durationMinutes: t.estimatedDuration,
              task: t
            });
            timerEngine.start();
            this.navigate('focus');
          }
        }));

      matched = [...cmdMatches, ...habitMatches, ...taskMatches];
    }

    this.results = matched;
    this.renderResults();
  }

  renderResults() {
    if (this.results.length === 0) {
      this.resultsList.innerHTML = `
        <div style="padding: 28px; text-align: center; color: var(--text-tertiary); font-size: 13.5px;">
          No matching commands or tasks found.
        </div>
      `;
      return;
    }

    this.resultsList.innerHTML = this.results.map((r, i) => `
      <div class="palette-item ${i === this.selectedIndex ? 'selected' : ''}" data-index="${i}"
        style="padding: 10px 14px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; cursor: pointer; background: ${i === this.selectedIndex ? 'var(--bg-surface-elevated)' : 'transparent'}; border: 1px solid ${i === this.selectedIndex ? 'var(--border-glass)' : 'transparent'}; transition: all var(--transition-fast);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="badge" style="font-size: 10px; background: var(--bg-surface); color: var(--text-tertiary);">${r.category}</span>
          <span style="font-size: 13.5px; font-weight: 500; color: ${i === this.selectedIndex ? 'var(--accent-primary)' : 'var(--text-primary)'};">${r.title}</span>
        </div>
        ${r.shortcut ? `<span class="kbd-shortcut">${r.shortcut}</span>` : ''}
      </div>
    `).join('');

    this.resultsList.querySelectorAll('.palette-item').forEach(el => {
      el.addEventListener('click', () => {
        this.selectedIndex = Number(el.getAttribute('data-index'));
        this.executeSelected();
      });
    });
  }

  executeSelected() {
    const item = this.results[this.selectedIndex];
    if (item && item.action) {
      this.close();
      item.action();
    }
  }
}
