/**
 * AETHER OS — MAIN APPLICATION ORCHESTRATOR
 * Router, reactive store sync, 3D canvas lifecycle, and global shortcuts.
 */

import { store } from './store/db.js?v=10.0';
import { FocusOrb } from './visuals/orb.js?v=10.0';
import { atmosphereEngine } from './visuals/atmosphere.js?v=10.0';
import { ParticleSystem } from './visuals/particles.js?v=10.0';
import { CommandPalette } from './components/command-palette.js?v=10.0';
import { QuickAddModal } from './components/quick-add.js?v=10.0';

import { renderHomeView } from './views/home.js?v=10.0';
import { renderTasksView } from './views/tasks.js?v=10.0';
import { renderCalendarView } from './views/calendar.js?v=10.0';
import { renderFocusView } from './views/focus.js?v=10.0';
import { renderDotCalendarView } from './views/dot-calendar.js?v=10.0';
import { renderAnalyticsView } from './views/analytics.js?v=10.0';
import { renderSleepView } from './views/sleep.js?v=10.0';
import { renderGamesView } from './views/games.js?v=10.0';
import { renderHabitsView } from './views/habits.js?v=10.0';
import { renderSettingsView } from './views/settings.js?v=10.0';

// 3D Intensity Mapping by Screen (User Directive Section 133)
export const SCREEN_3D_INTENSITY = {
  home: 0.65,       // ⭐⭐⭐⭐⭐ (Hero orb in full glory)
  focus: 0.55,      // ⭐⭐⭐⭐⭐ (Floating glass clock + subtle orb aura)
  games: 0.42,      // ⭐⭐⭐⭐ (Tactile 3D tiles, ambient orb calm)
  calendar: 0.30,   // ⭐⭐⭐ (Dimensional blocks, soft ambient)
  habits: 0.24,     // ⭐⭐ (Tactile matrix, clean background)
  tasks: 0.20,      // ⭐⭐ (Clean productivity focus, minimal background)
  analytics: 0.10,  // ⭐ (Maximum clean reading clarity, minimal 3D)
  settings: 0.20,
  sleep: 0.28,
  dots: 0.30
};

class AetherApp {
  constructor() {
    this.currentView = 'home';
    this.viewport = null;
    this.orb = null;

    this.init();
  }

  init() {
    // 1. Set Initial Theme
    const prefs = store.getPreferences();
    document.documentElement.setAttribute('data-theme', prefs.theme || 'dark');

    // 2. Initialize Atmospheric Environmental Engine
    atmosphereEngine.init();
    window.atmosphereEngine = atmosphereEngine;

    // 3. Initialize 3D Focus Orb Canvas
    const canvas = document.getElementById('focus-orb-canvas');
    if (canvas) {
      this.orb = new FocusOrb(canvas);
      window.aetherOrb = this.orb;
    }
    window.aetherApp = this;

    this.viewport = document.getElementById('view-viewport');

    // 3. Initialize Global Overlays
    window.aetherCommandPalette = new CommandPalette((view) => this.navigate(view));
    window.aetherQuickAdd = new QuickAddModal();

    // 4. Bind Navigation Elements
    this.bindNavigation();

    // 5. Global Keyboard Shortcuts
    this.bindKeyboardShortcuts();

    // 6. Reactive Store Sync
    store.subscribe((state, event) => {
      this.updateBadges();
      // Re-render active view
      this.renderCurrentView();
    });

    // 7. Initial View Render & Badges
    this.updateBadges();
    this.navigate('home');
  }

  bindNavigation() {
    // Desktop Nav Items
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = el.getAttribute('data-nav');
        this.navigate(targetView);

        // Close mobile drawer if open
        const sidebar = document.querySelector('.app-sidebar');
        if (sidebar) sidebar.classList.remove('mobile-open');
      });
    });

    // Mobile Bottom Nav Items
    document.querySelectorAll('[data-mobile-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = el.getAttribute('data-mobile-nav');
        this.navigate(targetView);
      });
    });

    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.app-sidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }

    // Mobile Menu Button
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Topbar Search Click
    const searchTrigger = document.getElementById('topbar-search-trigger');
    if (searchTrigger) {
      searchTrigger.addEventListener('click', () => {
        window.aetherCommandPalette.open();
      });
    }

    // Topbar Quick Add Button
    const quickAddBtn = document.getElementById('topbar-quick-add-btn');
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', () => {
        window.aetherQuickAdd.open();
      });
    }

    // Topbar Theme Toggle Button
    const themeBtn = document.getElementById('topbar-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const cur = store.getPreferences().theme;
        const next = cur === 'dark' ? 'light' : 'dark';
        store.updatePreferences({ theme: next });
        document.documentElement.setAttribute('data-theme', next);
      });
    }
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      const target = e.target;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isInput || e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case 'c':
          e.preventDefault();
          this.navigate('calendar');
          break;
        case 't':
        case 'f':
          e.preventDefault();
          this.navigate('focus');
          break;
        case 'a':
          e.preventDefault();
          this.navigate('analytics');
          break;
        case 'd':
          e.preventDefault();
          this.navigate('dots');
          break;
        case 'g':
          e.preventDefault();
          this.navigate('games');
          break;
        case 's':
          e.preventDefault();
          this.navigate('sleep');
          break;
        case 'h':
          e.preventDefault();
          this.navigate('habits');
          break;
        default:
          break;
      }
    });
  }

  navigate(viewName) {
    this.currentView = viewName;

    // Update active nav styling
    document.querySelectorAll('[data-nav]').forEach(el => {
      if (el.getAttribute('data-nav') === viewName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    document.querySelectorAll('[data-mobile-nav]').forEach(el => {
      if (el.getAttribute('data-mobile-nav') === viewName) {
        el.classList.add('active');
        el.style.color = 'var(--accent-primary)';
      } else {
        el.classList.remove('active');
        el.style.color = 'var(--text-tertiary)';
      }
    });

    // Adjust 3D Canvas Intensity by Screen
    const canvas = document.getElementById('focus-orb-canvas');
    if (canvas) {
      const prefs = store.getPreferences();
      const effects3D = prefs.effects3D || 'full';
      if (effects3D === 'off') {
        canvas.style.opacity = '0';
      } else {
        const targetOpacity = (SCREEN_3D_INTENSITY[viewName] !== undefined ? SCREEN_3D_INTENSITY[viewName] : 0.3) * (effects3D === 'reduced' ? 0.45 : 1);
        canvas.style.opacity = `${targetOpacity}`;
      }
    }

    this.renderCurrentView();
  }

  renderCurrentView() {
    if (!this.viewport) return;
    this.viewport.scrollTop = 0;

    try {
      switch (this.currentView) {
        case 'home':
          renderHomeView(this.viewport, (v) => this.navigate(v));
          break;
        case 'tasks':
          renderTasksView(this.viewport, (v) => this.navigate(v));
          break;
        case 'calendar':
          renderCalendarView(this.viewport, (v) => this.navigate(v));
          break;
        case 'focus':
          renderFocusView(this.viewport, (v) => this.navigate(v));
          break;
        case 'habits':
          renderHabitsView(this.viewport, (v) => this.navigate(v));
          break;
        case 'dots':
          renderDotCalendarView(this.viewport, (v) => this.navigate(v));
          break;
        case 'analytics':
          renderAnalyticsView(this.viewport, (v) => this.navigate(v));
          break;
        case 'sleep':
          renderSleepView(this.viewport, (v) => this.navigate(v));
          break;
        case 'games':
          renderGamesView(this.viewport, (v) => this.navigate(v));
          break;
        case 'settings':
          renderSettingsView(this.viewport, (v) => this.navigate(v));
          break;
        default:
          renderHomeView(this.viewport, (v) => this.navigate(v));
          break;
      }
    } catch (err) {
      console.error(`[AetherApp] Error rendering view ${this.currentView}:`, err);
      this.viewport.innerHTML = `
        <div style="padding: 40px; text-align: center; color: #E2E8F0;">
          <div style="font-size: 32px; margin-bottom: 12px;">✨</div>
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Workspace Ready</h3>
          <p style="font-size: 13px; color: #94A3B8; max-width: 420px; margin: 0 auto 20px auto;">
            Loading your personal productivity cockpit.
          </p>
          <button class="btn btn-primary" onclick="location.reload()">Reload View</button>
        </div>
      `;
    }
  }

  updateBadges() {
    const tasks = store.getTasks();
    const pendingCount = tasks.filter(t => !t.completed).length;

    const taskBadge = document.getElementById('badge-tasks-count');
    if (taskBadge) {
      taskBadge.textContent = pendingCount > 0 ? pendingCount : '';
    }

    const habitSummary = store.getTodayHabitSummary();
    const habitBadge = document.getElementById('badge-habits-count');
    if (habitBadge) {
      const remaining = habitSummary.unlogged;
      habitBadge.textContent = remaining > 0 ? remaining : (habitSummary.total > 0 ? '✓' : '');
      if (remaining === 0 && habitSummary.total > 0) {
        habitBadge.style.color = 'var(--accent-emerald)';
      } else {
        habitBadge.style.color = '';
      }
    }
  }
}

// Bootstrap on DOM ready with interactive readyState fallback
function bootApp() {
  if (!window.aetherApp) {
    try {
      window.aetherApp = new AetherApp();
    } catch (err) {
      console.error('[AetherApp] Boot error:', err);
    }
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
  } else {
    bootApp();
  }
}
