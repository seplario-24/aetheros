/**
 * AETHER OS — MAIN APPLICATION ORCHESTRATOR
 * Router, multi-user authentication lifecycle, reactive store sync,
 * 3D canvas lifecycle, and global shortcuts (Sections 133-169).
 */

import { auth } from './auth/auth.js';
import { store } from './store/db.js';
import { FocusOrb } from './visuals/orb.js';
import { atmosphereEngine } from './visuals/atmosphere.js';
import { ParticleSystem } from './visuals/particles.js';
import { CommandPalette } from './components/command-palette.js';
import { QuickAddModal } from './components/quick-add.js';
import { ProfileMenu } from './components/profile-menu.js';

import { renderLandingView } from './views/landing.js';
import { renderOnboardingView } from './views/onboarding.js';
import { renderHomeView } from './views/home.js';
import { renderTasksView } from './views/tasks.js';
import { renderCalendarView } from './views/calendar.js';
import { renderFocusView } from './views/focus.js';
import { renderDotCalendarView } from './views/dot-calendar.js';
import { renderAnalyticsView } from './views/analytics.js';
import { renderSleepView } from './views/sleep.js';
import { renderGamesView } from './views/games.js';
import { renderHabitsView } from './views/habits.js';
import { renderSettingsView } from './views/settings.js';

// 3D Intensity Mapping by Screen (Section 133)
export const SCREEN_3D_INTENSITY = {
  home: 0.65,       // Hero orb in full glory
  focus: 0.55,      // Floating glass clock + subtle orb aura
  games: 0.42,      // Tactile 3D tiles, ambient orb calm
  calendar: 0.30,   // Dimensional blocks, soft ambient
  habits: 0.24,     // Tactile matrix, clean background
  tasks: 0.20,      // Clean productivity focus, minimal background
  analytics: 0.10,  // Maximum clean reading clarity, minimal 3D
  settings: 0.20,
  sleep: 0.28,
  dots: 0.30
};

class AetherApp {
  constructor() {
    this.currentView = 'home';
    this.viewport = null;
    this.orb = null;
    this.profileMenu = null;

    this.init();
  }

  init() {
    this.viewport = document.getElementById('view-viewport');
    window.aetherApp = this;

    // 1. Set Initial Theme from Preferences
    try {
      const prefs = store.getPreferences();
      document.documentElement.setAttribute('data-theme', prefs.theme || 'dark');
    } catch (e) {
      console.warn('[AetherApp] Theme init fallback:', e);
    }

    // 2. Initialize Atmospheric Environmental Engine
    try {
      atmosphereEngine.init();
      window.atmosphereEngine = atmosphereEngine;
    } catch (e) {
      console.warn('[AetherApp] Atmosphere engine init warning:', e);
    }

    // 3. Initialize 3D Focus Orb Canvas
    try {
      const canvas = document.getElementById('focus-orb-canvas');
      if (canvas) {
        this.orb = new FocusOrb(canvas);
        window.aetherOrb = this.orb;
      }
    } catch (e) {
      console.warn('[AetherApp] Focus orb canvas init warning:', e);
    }

    // 4. Initialize Global Overlays
    try {
      window.aetherCommandPalette = new CommandPalette((view) => this.navigate(view));
      window.aetherQuickAdd = new QuickAddModal();
    } catch (e) {
      console.warn('[AetherApp] Overlays init warning:', e);
    }

    // 5. Bind Navigation & Shortcuts
    this.bindNavigation();
    this.bindKeyboardShortcuts();

    // 6. Reactive Store Sync
    store.subscribe((state, event) => {
      this.updateBadges();
      if (auth.isAuthenticated() && auth.getUser()?.onboardingCompleted) {
        this.renderCurrentView();
      }
    });

    // 7. Subscribe to Auth Lifecycle (Section 135)
    auth.subscribe((user) => {
      this.handleAuthChange(user);
    });

    // 8. Initial Authentication Check
    if (!auth.isAuthenticated()) {
      this.showLanding();
    } else {
      const user = auth.getUser();
      if (!user.onboardingCompleted) {
        this.showOnboarding();
      } else {
        this.showApp();
      }
    }
  }

  handleAuthChange(user) {
    if (!user) {
      this.showLanding();
    } else if (!user.onboardingCompleted) {
      this.showOnboarding();
    } else {
      this.showApp();
    }
  }

  showLanding() {
    document.body.classList.add('app-auth-mode');
    if (this.orb && typeof this.orb.setIntensity === 'function') {
      this.orb.setIntensity(0.7);
    }

    renderLandingView(this.viewport, (user, isNewUser) => {
      if (isNewUser) {
        this.showOnboarding();
      } else {
        this.showApp();
      }
    });
  }

  showOnboarding() {
    document.body.classList.add('app-auth-mode');
    if (this.orb && typeof this.orb.setIntensity === 'function') {
      this.orb.setIntensity(0.45);
    }

    renderOnboardingView(this.viewport, () => {
      this.showApp();
    });
  }

  showApp() {
    document.body.classList.remove('app-auth-mode');

    // Mount 3D Profile Menu in Sidebar Footer
    const footerContainer = document.querySelector('.sidebar-footer');
    if (footerContainer) {
      this.profileMenu = new ProfileMenu(footerContainer, (v) => this.navigate(v));
    }

    const prefs = store.getPreferences();
    document.documentElement.setAttribute('data-theme', prefs.theme || 'dark');

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
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Topbar Theme Toggle
    const themeBtn = document.getElementById('topbar-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        store.updatePreferences({ theme: newTheme });
      });
    }

    // Topbar Quick Add Button
    const quickAddBtn = document.getElementById('topbar-quick-add-btn');
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', () => {
        if (window.aetherQuickAdd) {
          window.aetherQuickAdd.open();
        }
      });
    }

    // Topbar Search Trigger
    const searchTrigger = document.getElementById('topbar-search-trigger');
    if (searchTrigger) {
      searchTrigger.addEventListener('click', () => {
        if (window.aetherCommandPalette) {
          window.aetherCommandPalette.open();
        }
      });
    }
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (document.body.classList.contains('app-auth-mode')) return;

      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select' || (document.activeElement && document.activeElement.isContentEditable);

      // Ctrl+K / Cmd+K -> Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (window.aetherCommandPalette) window.aetherCommandPalette.open();
        return;
      }

      if (!isInput) {
        // N -> Quick Add Task
        if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          if (window.aetherQuickAdd) window.aetherQuickAdd.open();
          return;
        }

        // Numbers 1-8 for Rapid Navigation
        const keyNum = parseInt(e.key, 10);
        if (keyNum >= 1 && keyNum <= 8) {
          const viewMap = ['home', 'tasks', 'calendar', 'focus', 'habits', 'dots', 'analytics', 'sleep'];
          const target = viewMap[keyNum - 1];
          if (target) {
            e.preventDefault();
            this.navigate(target);
          }
        }
      }
    });
  }

  navigate(viewName) {
    if (!auth.isAuthenticated()) {
      this.showLanding();
      return;
    }

    this.currentView = viewName;

    // Update active class on desktop sidebar
    document.querySelectorAll('.app-sidebar [data-nav]').forEach(el => {
      const target = el.getAttribute('data-nav');
      el.classList.toggle('active', target === viewName);
    });

    // Update active class on mobile bottom nav
    document.querySelectorAll('.mobile-bottom-nav [data-mobile-nav]').forEach(el => {
      const target = el.getAttribute('data-mobile-nav');
      const isActive = target === viewName;
      el.style.color = isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)';
    });

    // Update 3D intensity of focus orb canvas per screen
    if (this.orb) {
      const intensity = SCREEN_3D_INTENSITY[viewName] ?? 0.35;
      this.orb.setIntensity(intensity);
    }

    // Scroll viewport to top
    if (this.viewport) {
      this.viewport.scrollTop = 0;
    }

    // Render active view module
    this.renderCurrentView();
  }

  renderCurrentView() {
    if (!this.viewport) return;

    if (!auth.isAuthenticated()) {
      this.showLanding();
      return;
    }

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
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">Personal OS Workspace Ready</h3>
          <p style="font-size: 13px; color: #94A3B8; max-width: 420px; margin: 0 auto 20px auto;">
            Click below to refresh and load your personal command center.
          </p>
          <button class="btn btn-primary" onclick="location.reload()">Refresh Workspace</button>
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

    const habits = store.getHabits();
    const habitBadge = document.getElementById('badge-habits-count');
    if (habitBadge) {
      habitBadge.textContent = habits.length > 0 ? habits.length : '';
    }
  }
}

// Bootstrap on DOM ready with interactive readyState fallback
function bootApp() {
  if (!window.aetherApp) {
    try {
      window.aetherApp = new AetherApp();
    } catch (err) {
      console.error('[AetherApp] Boot fatal error:', err);
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
