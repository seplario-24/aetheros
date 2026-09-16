/**
 * AETHER OS — MAIN APPLICATION ORCHESTRATOR
 * Router, multi-user authentication lifecycle, reactive store sync,
 * 3D canvas lifecycle, and global shortcuts (Sections 133-169).
 */

import { auth } from './auth/auth.js?v=3.0';
import { store } from './store/db.js?v=3.0';
import { FocusOrb } from './visuals/orb.js?v=3.0';
import { atmosphereEngine } from './visuals/atmosphere.js?v=3.0';
import { ParticleSystem } from './visuals/particles.js?v=3.0';
import { CommandPalette } from './components/command-palette.js?v=3.0';
import { QuickAddModal } from './components/quick-add.js?v=3.0';
import { ProfileMenu } from './components/profile-menu.js?v=3.0';

import { renderLandingView } from './views/landing.js?v=3.0';
import { renderOnboardingView } from './views/onboarding.js?v=3.0';
import { renderHomeView } from './views/home.js?v=3.0';
import { renderTasksView } from './views/tasks.js?v=3.0';
import { renderCalendarView } from './views/calendar.js?v=3.0';
import { renderFocusView } from './views/focus.js?v=3.0';
import { renderDotCalendarView } from './views/dot-calendar.js?v=3.0';
import { renderAnalyticsView } from './views/analytics.js?v=3.0';
import { renderSleepView } from './views/sleep.js?v=3.0';
import { renderGamesView } from './views/games.js?v=3.0';
import { renderHabitsView } from './views/habits.js?v=3.0';
import { renderSettingsView } from './views/settings.js?v=3.0';

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
    // 1. Set Initial Theme from Preferences
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

    // 4. Initialize Global Overlays
    window.aetherCommandPalette = new CommandPalette((view) => this.navigate(view));
    window.aetherQuickAdd = new QuickAddModal();

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
    if (this.orb) this.orb.setIntensity(0.7);

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
    if (this.orb) this.orb.setIntensity(0.45);

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

// Bootstrap on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.aetherApp = new AetherApp();
  });
}
