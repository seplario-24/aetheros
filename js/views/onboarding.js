/**
 * AETHER OS — 5-STEP INTERACTIVE 3D ONBOARDING WIZARD
 * Guides first-time Google users through building their own
 * personalized productivity workspace (Sections 140-145 & 162).
 */

import { auth } from '../auth/auth.js';
import { store, TEMPLATE_CATEGORIES } from '../store/db.js';

export function renderOnboardingView(container, onComplete) {
  const user = auth.getUser() || { displayName: 'Pilot', email: 'user@aetheros.world' };

  let currentStep = 1;
  const totalSteps = 5;

  // Onboarding State
  const wizardData = {
    displayName: user.displayName || 'Pilot',
    categories: [
      { id: 'cat-deepwork', name: 'Deep Work', color: '#6366F1', icon: 'zap' },
      { id: 'cat-research', name: 'Research', color: '#06B6D4', icon: 'atom' },
      { id: 'cat-learning', name: 'Learning', color: '#10B981', icon: 'book-open' },
      { id: 'cat-personal', name: 'Personal', color: '#F97316', icon: 'user' }
    ],
    habits: [
      { id: 'h-1', name: 'Morning Movement & Stretch', target: 20, targetType: 'minutes', frequency: 'daily', color: '#F97316', category: 'Health' },
      { id: 'h-2', name: 'Focused Reading', target: 25, targetType: 'minutes', frequency: 'daily', color: '#3B82F6', category: 'Learning' }
    ],
    routineSteps: [
      { id: 's-1', time: '07:00', text: 'Wake up & Sunlight exposure' },
      { id: 's-2', time: '07:15', text: 'Hydration: 500ml water' },
      { id: 's-3', time: '07:30', text: 'Movement or aerobic conditioning' },
      { id: 's-4', time: '08:30', text: 'Review top daily focus outcomes' }
    ],
    firstTask: {
      title: 'Complete initial deep work milestone',
      estimatedDuration: 45,
      priority: 'high'
    }
  };

  function render() {
    container.innerHTML = `
      <div class="onboarding-wizard-wrap animate-fade-in" style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; padding: 24px 16px; perspective: 1200px; z-index: 10;">
        
        <!-- Atmospheric Glow -->
        <div style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); width: 520px; height: 520px; border-radius: 50%; background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.12) 50%, transparent 70%); filter: blur(90px); pointer-events: none; z-index: 0;"></div>

        <!-- Wizard Pedestal Card -->
        <div class="onboarding-card" style="width: 100%; max-width: 540px; background: rgba(11, 15, 25, 0.88); backdrop-filter: blur(36px) saturate(2); -webkit-backdrop-filter: blur(36px) saturate(2); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 28px; padding: 38px 32px; box-shadow: 0 32px 80px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(99, 102, 241, 0.18), inset 0 1px 2px rgba(255, 255, 255, 0.3); position: relative; z-index: 2;">
          
          <!-- Step Progress Indicator -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 26px;">
            <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--el-crystal);">
              Step ${currentStep} of ${totalSteps}
            </span>
            <div style="display: flex; gap: 6px;">
              ${[1, 2, 3, 4, 5].map(stepNum => `
                <div style="width: ${stepNum === currentStep ? '24px' : '8px'}; height: 6px; border-radius: 3px; background: ${stepNum <= currentStep ? 'var(--accent-primary)' : 'rgba(255,255,255,0.15)'}; transition: all 0.3s ease; box-shadow: ${stepNum === currentStep ? '0 0 10px var(--accent-primary-glow)' : 'none'};"></div>
              `).join('')}
            </div>
          </div>

          <!-- Step Content Switcher -->
          <div id="wizard-step-content">
            ${getStepHtml(currentStep)}
          </div>

          <!-- Footer Actions -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            ${currentStep > 1 ? `
              <button id="btn-wizard-prev" class="btn btn-ghost" style="padding: 10px 18px; font-size: 13px; font-weight: 600; border-radius: 12px; color: #94A3B8;">
                ← Back
              </button>
            ` : `<div></div>`}

            <button id="btn-wizard-next" class="btn btn-primary" style="padding: 11px 28px; font-size: 14px; font-weight: 700; border-radius: 14px; box-shadow: 0 8px 24px var(--accent-primary-glow); margin-left: auto;">
              ${currentStep === totalSteps ? 'Ignite My Personal OS ✨' : 'Continue →'}
            </button>
          </div>

        </div>
      </div>
    `;

    bindEvents();
  }

  function getStepHtml(step) {
    switch (step) {
      // ----------------------------------------------------------------------
      // STEP 1: IDENTITY (Section 141)
      // ----------------------------------------------------------------------
      case 1:
        return `
          <div class="animate-fade-in" style="text-align: center;">
            <div style="width: 76px; height: 76px; border-radius: 50%; margin: 0 auto 18px auto; overflow: hidden; border: 2px solid rgba(255, 255, 255, 0.3); box-shadow: 0 0 24px var(--accent-primary-glow); background: var(--bg-surface-elevated); display: flex; align-items: center; justify-content: center;">
              <img src="${user.profilePhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email || 'Pilot')}`}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            
            <h2 style="font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin: 0 0 8px 0;">
              Hi, ${wizardData.displayName}! 👋
            </h2>
            <p style="font-size: 13.5px; color: #94A3B8; margin: 0 0 24px 0; line-height: 1.5;">
              Welcome to your private productivity world. Let's configure your personal command center.
            </p>

            <div style="text-align: left; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 16px; padding: 18px;">
              <label style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #CBD5E1; display: block; margin-bottom: 8px;">
                Display Name in Cockpit
              </label>
              <input type="text" id="wizard-name-input" class="glass-input" value="${wizardData.displayName}" style="font-size: 14px; padding: 10px 14px; font-weight: 600;">
              
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 14px; font-size: 12px; color: #94A3B8;">
                <span>🌐</span>
                <span>Timezone: <strong>${user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}</strong></span>
              </div>
            </div>
          </div>
        `;

      // ----------------------------------------------------------------------
      // STEP 2: CATEGORIES (Section 141-142 & 162)
      // ----------------------------------------------------------------------
      case 2:
        return `
          <div class="animate-fade-in">
            <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--el-water); display: block; margin-bottom: 6px;">Workspace Architecture</span>
            <h2 style="font-size: 23px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin: 0 0 8px 0;">
              What kind of work do you do?
            </h2>
            <p style="font-size: 13px; color: #94A3B8; margin: 0 0 20px 0;">
              Select a template to kickstart your categories, or customize them below:
            </p>

            <!-- Template Quick Pickers (Section 162) -->
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px;">
              <button class="btn btn-ghost btn-template-pick" data-template="student" style="font-size: 12px; padding: 6px 14px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06);">
                🎓 Student
              </button>
              <button class="btn btn-ghost btn-template-pick" data-template="creator" style="font-size: 12px; padding: 6px 14px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06);">
                🎨 Creator
              </button>
              <button class="btn btn-ghost btn-template-pick" data-template="developer" style="font-size: 12px; padding: 6px 14px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06);">
                💻 Developer
              </button>
            </div>

            <!-- Active Categories Chips -->
            <div id="wizard-categories-list" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
              ${wizardData.categories.map((c, idx) => `
                <div class="wizard-cat-chip" style="display: flex; align-items: center; gap: 8px; padding: 7px 14px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); color: #FFFFFF; font-size: 12.5px; font-weight: 600;">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: ${c.color}; box-shadow: 0 0 8px ${c.color};"></span>
                  <span>${c.name}</span>
                  <button class="btn-remove-cat" data-idx="${idx}" style="background: none; border: none; color: #94A3B8; cursor: pointer; padding: 0 2px; font-size: 14px;">×</button>
                </div>
              `).join('')}
            </div>

            <!-- Add Category Inline -->
            <div style="display: flex; gap: 8px;">
              <input type="text" id="wizard-add-cat-input" class="glass-input" placeholder="Add custom category (e.g. Design, Gym, Thesis)..." style="font-size: 13px; padding: 8px 12px; flex: 1;">
              <button id="btn-add-cat" class="btn btn-secondary" style="padding: 8px 16px; font-size: 13px; font-weight: 600; white-space: nowrap;">
                + Add
              </button>
            </div>
          </div>
        `;

      // ----------------------------------------------------------------------
      // STEP 3: HABITS SETUP (Section 143)
      // ----------------------------------------------------------------------
      case 3:
        return `
          <div class="animate-fade-in">
            <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--el-coral); display: block; margin-bottom: 6px;">Daily Disciplines</span>
            <h2 style="font-size: 23px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin: 0 0 8px 0;">
              What habits would you like to build?
            </h2>
            <p style="font-size: 13px; color: #94A3B8; margin: 0 0 18px 0;">
              Select daily practices to track in your 3D Habit Matrix:
            </p>

            <!-- Habit Quick Suggestion Chips -->
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px;">
              ${['Exercise (30m)', 'Deep Reading', 'Meditation', 'Hydration', 'Coding Practice', 'No Sugar', '8h Sleep'].map(hName => `
                <button class="btn btn-ghost btn-habit-suggest" data-name="${hName}" style="font-size: 11.5px; padding: 5px 12px; border-radius: var(--radius-full); background: rgba(255,255,255,0.05); color: #CBD5E1;">
                  + ${hName}
                </button>
              `).join('')}
            </div>

            <!-- Active Habits List -->
            <div id="wizard-habits-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow-y: auto; margin-bottom: 16px;">
              ${wizardData.habits.map((h, idx) => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 12px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="width: 8px; height: 8px; border-radius: 50%; background: ${h.color}; box-shadow: 0 0 8px ${h.color};"></span>
                    <span style="font-size: 13px; font-weight: 600; color: #FFFFFF;">${h.name}</span>
                  </div>
                  <button class="btn-remove-habit" data-idx="${idx}" style="background: none; border: none; color: #94A3B8; cursor: pointer; font-size: 16px;">×</button>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; gap: 8px;">
              <input type="text" id="wizard-add-habit-input" class="glass-input" placeholder="Add custom habit..." style="font-size: 13px; padding: 8px 12px; flex: 1;">
              <button id="btn-add-habit" class="btn btn-secondary" style="padding: 8px 16px; font-size: 13px; font-weight: 600; white-space: nowrap;">
                + Add
              </button>
            </div>
          </div>
        `;

      // ----------------------------------------------------------------------
      // STEP 4: MORNING ROUTINE (Section 144)
      // ----------------------------------------------------------------------
      case 4:
        return `
          <div class="animate-fade-in">
            <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-amber); display: block; margin-bottom: 6px;">Circadian Momentum</span>
            <h2 style="font-size: 23px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin: 0 0 8px 0;">
              Build your morning routine
            </h2>
            <p style="font-size: 13px; color: #94A3B8; margin: 0 0 18px 0;">
              Design your morning flow steps. You can adjust these anytime:
            </p>

            <div id="wizard-routine-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 200px; overflow-y: auto; margin-bottom: 16px;">
              ${wizardData.routineSteps.map((s, idx) => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 11.5px; font-family: var(--font-mono); font-weight: 700; color: var(--accent-amber); background: rgba(245,158,11,0.15); padding: 3px 8px; border-radius: 6px;">${s.time}</span>
                    <span style="font-size: 13px; font-weight: 600; color: #FFFFFF;">${s.text}</span>
                  </div>
                  <button class="btn-remove-step" data-idx="${idx}" style="background: none; border: none; color: #94A3B8; cursor: pointer; font-size: 16px;">×</button>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; gap: 8px;">
              <input type="time" id="wizard-step-time-input" class="glass-input" value="08:00" style="width: 100px; font-size: 13px; padding: 8px 10px;">
              <input type="text" id="wizard-step-text-input" class="glass-input" placeholder="Routine step name..." style="font-size: 13px; padding: 8px 12px; flex: 1;">
              <button id="btn-add-step" class="btn btn-secondary" style="padding: 8px 16px; font-size: 13px; font-weight: 600; white-space: nowrap;">
                + Add
              </button>
            </div>
          </div>
        `;

      // ----------------------------------------------------------------------
      // STEP 5: FIRST OUTCOME (Section 145-146)
      // ----------------------------------------------------------------------
      case 5:
        return `
          <div class="animate-fade-in">
            <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--accent-primary); display: block; margin-bottom: 6px;">Launch Anchor</span>
            <h2 style="font-size: 23px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin: 0 0 8px 0;">
              What is your primary goal for today?
            </h2>
            <p style="font-size: 13px; color: #94A3B8; margin: 0 0 20px 0;">
              Anchor your brand-new OS with your very first focus outcome:
            </p>

            <div style="display: flex; flex-direction: column; gap: 14px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 18px; padding: 20px;">
              <div>
                <label style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #CBD5E1; display: block; margin-bottom: 6px;">
                  Task Objective
                </label>
                <input type="text" id="wizard-task-title" class="glass-input" value="${wizardData.firstTask.title}" placeholder="e.g. Finish research outline..." style="font-size: 14px; padding: 10px 14px; font-weight: 600;">
              </div>

              <div style="display: flex; gap: 14px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 140px;">
                  <label style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #CBD5E1; display: block; margin-bottom: 6px;">
                    Focus Duration
                  </label>
                  <select id="wizard-task-duration" class="glass-input" style="padding: 10px 14px; font-size: 13px; cursor: pointer;">
                    <option value="25">25 Minutes (Pomodoro)</option>
                    <option value="45" selected>45 Minutes (Sprint)</option>
                    <option value="60">60 Minutes (Hour Block)</option>
                    <option value="90">90 Minutes (Ultradian Cycle)</option>
                  </select>
                </div>

                <div style="flex: 1; min-width: 140px;">
                  <label style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #CBD5E1; display: block; margin-bottom: 6px;">
                    Priority
                  </label>
                  <select id="wizard-task-priority" class="glass-input" style="padding: 10px 14px; font-size: 13px; cursor: pointer;">
                    <option value="high" selected>🔥 High Priority</option>
                    <option value="medium">⚡ Medium Priority</option>
                    <option value="low">🌱 Low Priority</option>
                  </select>
                </div>
              </div>
            </div>

            <div style="margin-top: 18px; padding: 12px; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 12px; display: flex; align-items: center; gap: 10px; font-size: 12px; color: #E2E8F0;">
              <span>✨</span>
              <span>Your personal OS will generate clean analytics and zero fake history.</span>
            </div>
          </div>
        `;
    }
  }

  function bindEvents() {
    const btnNext = container.querySelector('#btn-wizard-next');
    const btnPrev = container.querySelector('#btn-wizard-prev');

    // Save inputs for step 1
    const nameInput = container.querySelector('#wizard-name-input');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        wizardData.displayName = e.target.value.trim() || user.displayName;
      });
    }

    // Step 2 Template Pickers
    container.querySelectorAll('.btn-template-pick').forEach(btn => {
      btn.addEventListener('click', () => {
        const tmpl = btn.getAttribute('data-template');
        if (TEMPLATE_CATEGORIES[tmpl]) {
          wizardData.categories = [...TEMPLATE_CATEGORIES[tmpl]];
          render();
        }
      });
    });

    // Step 2 Add/Remove Categories
    const btnAddCat = container.querySelector('#btn-add-cat');
    const catInput = container.querySelector('#wizard-add-cat-input');
    if (btnAddCat && catInput) {
      btnAddCat.addEventListener('click', () => {
        const val = catInput.value.trim();
        if (val) {
          wizardData.categories.push({
            id: `cat-${Date.now()}`,
            name: val,
            color: ['#6366F1', '#06B6D4', '#EC4899', '#10B981', '#F97316'][wizardData.categories.length % 5],
            icon: 'zap'
          });
          render();
        }
      });
    }

    container.querySelectorAll('.btn-remove-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        wizardData.categories.splice(idx, 1);
        render();
      });
    });

    // Step 3 Add Habit Suggestions
    container.querySelectorAll('.btn-habit-suggest').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        if (!wizardData.habits.some(h => h.name === name)) {
          wizardData.habits.push({
            id: `h-${Date.now()}`,
            name,
            target: 30,
            targetType: 'minutes',
            frequency: 'daily',
            color: ['#10B981', '#F97316', '#3B82F6', '#EC4899'][wizardData.habits.length % 4],
            category: 'Personal'
          });
          render();
        }
      });
    });

    // Step 3 Add Custom Habit
    const btnAddHabit = container.querySelector('#btn-add-habit');
    const habitInput = container.querySelector('#wizard-add-habit-input');
    if (btnAddHabit && habitInput) {
      btnAddHabit.addEventListener('click', () => {
        const val = habitInput.value.trim();
        if (val) {
          wizardData.habits.push({
            id: `h-${Date.now()}`,
            name: val,
            target: 1,
            targetType: 'binary',
            frequency: 'daily',
            color: '#6366F1',
            category: 'Personal'
          });
          render();
        }
      });
    }

    container.querySelectorAll('.btn-remove-habit').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        wizardData.habits.splice(idx, 1);
        render();
      });
    });

    // Step 4 Add Routine Step
    const btnAddStep = container.querySelector('#btn-add-step');
    const stepTime = container.querySelector('#wizard-step-time-input');
    const stepText = container.querySelector('#wizard-step-text-input');
    if (btnAddStep && stepTime && stepText) {
      btnAddStep.addEventListener('click', () => {
        const text = stepText.value.trim();
        if (text) {
          wizardData.routineSteps.push({
            id: `s-${Date.now()}`,
            time: stepTime.value,
            text
          });
          render();
        }
      });
    }

    container.querySelectorAll('.btn-remove-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        wizardData.routineSteps.splice(idx, 1);
        render();
      });
    });

    // Navigation Buttons
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          render();
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (currentStep === 5) {
          // Finalize onboarding
          const taskTitle = container.querySelector('#wizard-task-title')?.value.trim() || 'My first focus task';
          const taskDur = parseInt(container.querySelector('#wizard-task-duration')?.value || '45', 10);
          const taskPrio = container.querySelector('#wizard-task-priority')?.value || 'high';

          const morningRoutine = {
            id: 'rt-morning-user',
            title: 'Morning Flow Protocol',
            timeOfDay: 'morning',
            scheduledTime: wizardData.routineSteps[0]?.time || '07:00',
            steps: wizardData.routineSteps.map(s => ({
              id: s.id,
              text: `${s.time} — ${s.text}`,
              completed: false
            }))
          };

          // Save into user's isolated workspace
          store.initOnboardingWorkspace({
            categories: wizardData.categories,
            habits: wizardData.habits,
            routines: [morningRoutine],
            firstTask: {
              title: taskTitle,
              estimatedDuration: taskDur,
              priority: taskPrio,
              categoryId: wizardData.categories[0]?.id
            }
          });

          // Mark user onboarding complete
          auth.completeOnboarding({ displayName: wizardData.displayName });

          if (window.ParticleSystem && window.ParticleSystem.focusStart) {
            window.ParticleSystem.focusStart(window.innerWidth / 2, window.innerHeight / 2);
          }

          if (onComplete) onComplete();
        } else {
          currentStep++;
          render();
        }
      });
    }
  }

  render();
}
