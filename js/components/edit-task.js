/**
 * AETHER OS — COMPREHENSIVE TASK EDIT MODAL WINDOW
 * Full granular editing: Title, notes/description, category, priority,
 * energy level, duration presets & custom timesetter, scheduling, subtasks, tags.
 */

import { store } from '../store/db.js?v=11.0';
import { ambientAudio } from '../audio/ambient.js';
import { timerEngine } from '../engine/timer.js';

export class EditTaskModal {
  constructor() {
    this.isOpen = false;
    this.currentTask = null;
    this.editedSubtasks = [];
    this.editedTags = [];

    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-backdrop';
    this.overlay.id = 'edit-task-backdrop';

    const categories = store.getCategories();

    this.overlay.innerHTML = `
      <div class="modal-container" style="max-width: 640px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;">
        <!-- Modal Header -->
        <div class="modal-header" style="padding: 16px 22px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div id="edit-task-cat-bead" style="width: 10px; height: 10px; border-radius: 50%; background: var(--accent-primary); box-shadow: 0 0 8px currentColor;"></div>
            <div>
              <h3 style="font-size: 16px; font-weight: 700; color: #FFFFFF; display: flex; align-items: center; gap: 8px;">
                Edit Outcome
                <span id="edit-task-id-badge" style="font-size: 11px; font-family: var(--font-mono); color: var(--text-tertiary); font-weight: normal;"></span>
              </h3>
            </div>
          </div>
          <button class="btn btn-ghost btn-icon" id="edit-task-close" title="Close (Esc)" style="width: 30px; height: 30px; border-radius: var(--radius-full);">✕</button>
        </div>

        <!-- Modal Scrollable Content -->
        <div class="modal-body" style="padding: 20px 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 18px;">
          
          <!-- Title Input -->
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;">
              Outcome Title *
            </label>
            <input type="text" id="edit-task-title" class="glass-input" placeholder="What is the concrete outcome?" style="font-size: 15px; font-weight: 600; width: 100%;">
          </div>

          <!-- Description & Notes -->
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;">
              Description & Context Notes
            </label>
            <textarea id="edit-task-desc" class="glass-input" rows="3" placeholder="Context, reference links, formulas, or execution notes..." style="width: 100%; resize: vertical; line-height: 1.5; font-size: 13px;"></textarea>
          </div>

          <!-- Classification Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <!-- Category -->
            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;">
                Category
              </label>
              <select id="edit-task-category" class="glass-input" style="cursor: pointer; width: 100%;">
                ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>

            <!-- Priority -->
            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;">
                Priority
              </label>
              <select id="edit-task-priority" class="glass-input" style="cursor: pointer; width: 100%;">
                <option value="none">None</option>
                <option value="low">🌱 Low</option>
                <option value="medium">💧 Medium</option>
                <option value="high">⚡ High</option>
                <option value="critical">🔥 Critical</option>
              </select>
            </div>

            <!-- Energy Requirement -->
            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;">
                Energy Intensity
              </label>
              <select id="edit-task-energy" class="glass-input" style="cursor: pointer; width: 100%;">
                <option value="high">⚡ High Focus (Cognitive Peak)</option>
                <option value="medium">⚖️ Medium Focus (Balanced Flow)</option>
                <option value="low">🌱 Low Energy (Routine / Admin)</option>
              </select>
            </div>

            <!-- Repeat Rule -->
            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;">
                Recurrence Cadence
              </label>
              <select id="edit-task-repeat" class="glass-input" style="cursor: pointer; width: 100%;">
                <option value="none">Does Not Repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <!-- Duration & Interactive Timesetter -->
          <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0;">
                Estimated Focus Duration
              </label>
              <button type="button" id="edit-task-toggle-timesetter" style="background: none; border: none; color: var(--accent-cyan); font-size: 11px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;" title="Toggle Custom Timesetter">
                <span>⚙ Custom Time Setter</span>
              </button>
            </div>

            <select id="edit-task-duration" class="glass-input" style="cursor: pointer; width: 100%;">
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">1 hour (60 min)</option>
              <option value="90">90 min</option>
              <option value="120">2 hours (120 min)</option>
              <option value="150">2.5 hours (150 min)</option>
              <option value="180">3 hours (180 min)</option>
              <option value="240">4 hours (240 min)</option>
              <option value="300">5 hours (300 min)</option>
              <option value="360">6 hours (360 min)</option>
              <option value="480">8 hours (480 min)</option>
              <option value="600">10 hours (600 min)</option>
              <option value="720">12 hours (720 min)</option>
              <option value="custom">⚙ Custom Duration (Set Hours & Mins)...</option>
            </select>

            <!-- Custom Interactive Timesetter -->
            <div id="edit-task-custom-timesetter-box" class="custom-timesetter-box" style="display: none; margin-top: 10px; background: rgba(15, 23, 42, 0.75); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 12px; backdrop-filter: blur(16px);">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px;">
                <!-- Hours Stepper -->
                <div style="flex: 1;">
                  <span style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); display: block; margin-bottom: 4px;">Hours</span>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <button type="button" class="btn btn-ghost btn-sm timesetter-stepper-btn" id="edit-btn-hours-minus" style="width: 28px; height: 28px; padding: 0; font-weight: bold; border: 1px solid var(--border-subtle); border-radius: 4px;">-</button>
                    <input type="number" id="edit-task-custom-hours" min="0" max="99" value="0" style="width: 48px; text-align: center; padding: 4px 2px; font-weight: 700; font-family: var(--font-mono); background: rgba(0,0,0,0.35); border: 1px solid var(--border-subtle); border-radius: 4px; color: #fff; font-size: 13px;">
                    <button type="button" class="btn btn-ghost btn-sm timesetter-stepper-btn" id="edit-btn-hours-plus" style="width: 28px; height: 28px; padding: 0; font-weight: bold; border: 1px solid var(--border-subtle); border-radius: 4px;">+</button>
                  </div>
                </div>

                <!-- Minutes Stepper -->
                <div style="flex: 1;">
                  <span style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); display: block; margin-bottom: 4px;">Minutes</span>
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <button type="button" class="btn btn-ghost btn-sm timesetter-stepper-btn" id="edit-btn-mins-minus" style="width: 28px; height: 28px; padding: 0; font-weight: bold; border: 1px solid var(--border-subtle); border-radius: 4px;">-</button>
                    <input type="number" id="edit-task-custom-mins" min="0" max="59" step="5" value="45" style="width: 48px; text-align: center; padding: 4px 2px; font-weight: 700; font-family: var(--font-mono); background: rgba(0,0,0,0.35); border: 1px solid var(--border-subtle); border-radius: 4px; color: #fff; font-size: 13px;">
                    <button type="button" class="btn btn-ghost btn-sm timesetter-stepper-btn" id="edit-btn-mins-plus" style="width: 28px; height: 28px; padding: 0; font-weight: bold; border: 1px solid var(--border-subtle); border-radius: 4px;">+</button>
                  </div>
                </div>
              </div>

              <!-- Quick Hour Chips -->
              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
                <button type="button" class="edit-timesetter-chip" data-hours="1" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">1h</button>
                <button type="button" class="edit-timesetter-chip" data-hours="2" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">2h</button>
                <button type="button" class="edit-timesetter-chip" data-hours="3" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">3h</button>
                <button type="button" class="edit-timesetter-chip" data-hours="4" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">4h</button>
                <button type="button" class="edit-timesetter-chip" data-hours="6" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">6h</button>
                <button type="button" class="edit-timesetter-chip" data-hours="8" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">8h</button>
                <button type="button" class="edit-timesetter-chip" data-hours="12" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">12h</button>
              </div>

              <!-- Live Summary -->
              <div id="edit-timesetter-summary" style="font-size: 11.5px; font-family: var(--font-mono); color: var(--accent-cyan); font-weight: 600; text-align: center; background: rgba(6, 182, 212, 0.1); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(6, 182, 212, 0.25);">
                ⏱ Effective Duration: 45 min
              </div>
            </div>
          </div>

          <!-- Scheduling Grid (Start, End, Deadline) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;">
                Scheduled Start
              </label>
              <input type="datetime-local" id="edit-task-start" class="glass-input" style="width: 100%; font-size: 12.5px;">
            </div>

            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;">
                Scheduled End
              </label>
              <input type="datetime-local" id="edit-task-end" class="glass-input" style="width: 100%; font-size: 12.5px;">
            </div>

            <div style="grid-column: span 2;">
              <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;">
                Hard Deadline / Due Time
              </label>
              <input type="datetime-local" id="edit-task-deadline" class="glass-input" style="width: 100%; font-size: 12.5px;">
            </div>
          </div>

          <!-- Subtasks / Action Steps Manager -->
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0;">
                Subtasks / Action Checklist (<span id="edit-subtasks-count">0</span>)
              </label>
            </div>

            <div id="edit-subtasks-list" style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px;"></div>

            <!-- Add Subtask Row -->
            <div style="display: flex; gap: 8px;">
              <input type="text" id="edit-new-subtask-input" class="glass-input" placeholder="Add an actionable subtask step..." style="flex: 1; font-size: 13px;">
              <button type="button" class="btn btn-secondary" id="edit-add-subtask-btn" style="padding: 6px 14px; font-size: 12px; font-weight: 600; white-space: nowrap;">
                + Add Step
              </button>
            </div>
          </div>

          <!-- Tags Manager -->
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;">
              Tags & Labels
            </label>
            <div id="edit-tags-container" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;"></div>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="edit-new-tag-input" class="glass-input" placeholder="Add a tag (press Enter)..." style="flex: 1; font-size: 13px;">
              <button type="button" class="btn btn-ghost" id="edit-add-tag-btn" style="padding: 6px 12px; font-size: 12px; border: 1px solid var(--border-subtle);">
                + Tag
              </button>
            </div>
          </div>

          <!-- Completion Status Toggle -->
          <div style="padding: 12px 14px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-glass); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span style="font-size: 13.5px; font-weight: 600; color: #FFFFFF; display: block;">Completion Status</span>
              <span id="edit-task-status-desc" style="font-size: 11.5px; color: var(--text-tertiary);">Active outcome in progress</span>
            </div>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="edit-task-completed-check" style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent-emerald);">
              <span style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">Mark Done</span>
            </label>
          </div>

        </div>

        <!-- Modal Footer Actions -->
        <div class="modal-footer" style="padding: 14px 22px; border-top: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; background: rgba(10, 15, 30, 0.6);">
          <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" class="btn btn-ghost" id="edit-task-delete-btn" style="color: var(--accent-rose); font-size: 12px; padding: 7px 12px;" title="Permanently Delete Outcome">
              🗑 Delete
            </button>
            <button type="button" class="btn btn-secondary" id="edit-task-focus-btn" style="font-size: 12px; padding: 7px 14px; display: flex; align-items: center; gap: 6px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Start Focus
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <button type="button" class="btn btn-ghost" id="edit-task-cancel-btn" style="padding: 7px 16px;">Cancel</button>
            <button type="button" class="btn btn-primary" id="edit-task-save-btn" style="padding: 7px 22px; font-weight: 700; box-shadow: 0 2px 12px var(--accent-primary-glow);">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    // Grab elements
    this.closeBtn = this.overlay.querySelector('#edit-task-close');
    this.cancelBtn = this.overlay.querySelector('#edit-task-cancel-btn');
    this.saveBtn = this.overlay.querySelector('#edit-task-save-btn');
    this.deleteBtn = this.overlay.querySelector('#edit-task-delete-btn');
    this.focusBtn = this.overlay.querySelector('#edit-task-focus-btn');

    this.catBead = this.overlay.querySelector('#edit-task-cat-bead');
    this.idBadge = this.overlay.querySelector('#edit-task-id-badge');
    this.titleInput = this.overlay.querySelector('#edit-task-title');
    this.descInput = this.overlay.querySelector('#edit-task-desc');
    this.categorySelect = this.overlay.querySelector('#edit-task-category');
    this.prioritySelect = this.overlay.querySelector('#edit-task-priority');
    this.energySelect = this.overlay.querySelector('#edit-task-energy');
    this.repeatSelect = this.overlay.querySelector('#edit-task-repeat');

    this.durationSelect = this.overlay.querySelector('#edit-task-duration');
    this.toggleTimesetterBtn = this.overlay.querySelector('#edit-task-toggle-timesetter');
    this.customTimesetterBox = this.overlay.querySelector('#edit-task-custom-timesetter-box');
    this.customHoursInput = this.overlay.querySelector('#edit-task-custom-hours');
    this.customMinsInput = this.overlay.querySelector('#edit-task-custom-mins');
    this.btnHoursMinus = this.overlay.querySelector('#edit-btn-hours-minus');
    this.btnHoursPlus = this.overlay.querySelector('#edit-btn-hours-plus');
    this.btnMinsMinus = this.overlay.querySelector('#edit-btn-mins-minus');
    this.btnMinsPlus = this.overlay.querySelector('#edit-btn-mins-plus');
    this.timesetterSummary = this.overlay.querySelector('#edit-timesetter-summary');
    this.timesetterChips = this.overlay.querySelectorAll('.edit-timesetter-chip');

    this.startInput = this.overlay.querySelector('#edit-task-start');
    this.endInput = this.overlay.querySelector('#edit-task-end');
    this.deadlineInput = this.overlay.querySelector('#edit-task-deadline');

    this.subtasksList = this.overlay.querySelector('#edit-subtasks-list');
    this.subtasksCount = this.overlay.querySelector('#edit-subtasks-count');
    this.newSubtaskInput = this.overlay.querySelector('#edit-new-subtask-input');
    this.addSubtaskBtn = this.overlay.querySelector('#edit-add-subtask-btn');

    this.tagsContainer = this.overlay.querySelector('#edit-tags-container');
    this.newTagInput = this.overlay.querySelector('#edit-new-tag-input');
    this.addTagBtn = this.overlay.querySelector('#edit-add-tag-btn');

    this.completedCheck = this.overlay.querySelector('#edit-task-completed-check');
    this.statusDesc = this.overlay.querySelector('#edit-task-status-desc');
  }

  updateTimesetterSummary() {
    const h = parseInt(this.customHoursInput.value, 10) || 0;
    const m = parseInt(this.customMinsInput.value, 10) || 0;
    const totalMins = h * 60 + m;

    let label = '';
    if (h > 0 && m > 0) label = `${h} hr${h > 1 ? 's' : ''} ${m} min`;
    else if (h > 0) label = `${h} hr${h > 1 ? 's' : ''}`;
    else label = `${m} min`;

    if (this.timesetterSummary) {
      this.timesetterSummary.textContent = `⏱ Effective Duration: ${label} (${totalMins} min total)`;
    }
  }

  syncTimesetterFromMinutes(totalMinutes) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (this.customHoursInput) this.customHoursInput.value = String(h);
    if (this.customMinsInput) this.customMinsInput.value = String(m);
    this.updateTimesetterSummary();
  }

  bindEvents() {
    // Backdrop click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Close / Cancel
    this.closeBtn.addEventListener('click', () => this.close());
    this.cancelBtn.addEventListener('click', () => this.close());

    // Save
    this.saveBtn.addEventListener('click', () => this.save());

    // Delete
    this.deleteBtn.addEventListener('click', () => {
      if (!this.currentTask) return;
      if (confirm(`Are you sure you want to permanently delete "${this.currentTask.title}"?`)) {
        store.deleteTask(this.currentTask.id);
        ambientAudio.playChime();
        this.close();
        if (window.aetherApp) window.aetherApp.renderCurrentView();
      }
    });

    // Start Focus directly
    this.focusBtn.addEventListener('click', () => {
      if (!this.currentTask) return;
      this.save(false); // Save changes first without re-opening
      const updated = store.getTaskById(this.currentTask.id);
      if (updated) {
        timerEngine.configure({
          mode: 'task',
          durationMinutes: updated.estimatedDuration,
          task: updated
        });
        timerEngine.start();
        this.close();
        if (window.aetherApp) window.aetherApp.navigate('focus');
      }
    });

    // Category Change Color Indicator
    this.categorySelect.addEventListener('change', () => {
      const cat = store.getCategoryById(this.categorySelect.value);
      if (cat && this.catBead) {
        this.catBead.style.background = cat.color;
        this.catBead.style.boxShadow = `0 0 8px ${cat.color}`;
      }
    });

    // Duration Select
    this.durationSelect.addEventListener('change', () => {
      if (this.durationSelect.value === 'custom') {
        this.customTimesetterBox.style.display = 'block';
      } else {
        const val = Number(this.durationSelect.value);
        if (!isNaN(val)) this.syncTimesetterFromMinutes(val);
      }
    });

    // Custom timesetter toggle
    this.toggleTimesetterBtn.addEventListener('click', () => {
      const isHidden = this.customTimesetterBox.style.display === 'none' || !this.customTimesetterBox.style.display;
      this.customTimesetterBox.style.display = isHidden ? 'block' : 'none';
      if (isHidden && this.durationSelect.value !== 'custom') {
        const val = Number(this.durationSelect.value);
        if (!isNaN(val)) this.syncTimesetterFromMinutes(val);
      }
    });

    // Steppers
    this.btnHoursPlus.addEventListener('click', () => {
      let val = parseInt(this.customHoursInput.value, 10) || 0;
      this.customHoursInput.value = String(Math.min(99, val + 1));
      this.durationSelect.value = 'custom';
      this.updateTimesetterSummary();
    });
    this.btnHoursMinus.addEventListener('click', () => {
      let val = parseInt(this.customHoursInput.value, 10) || 0;
      this.customHoursInput.value = String(Math.max(0, val - 1));
      this.durationSelect.value = 'custom';
      this.updateTimesetterSummary();
    });
    this.btnMinsPlus.addEventListener('click', () => {
      let val = parseInt(this.customMinsInput.value, 10) || 0;
      this.customMinsInput.value = String(Math.min(55, val + 5));
      this.durationSelect.value = 'custom';
      this.updateTimesetterSummary();
    });
    this.btnMinsMinus.addEventListener('click', () => {
      let val = parseInt(this.customMinsInput.value, 10) || 0;
      this.customMinsInput.value = String(Math.max(0, val - 5));
      this.durationSelect.value = 'custom';
      this.updateTimesetterSummary();
    });

    this.customHoursInput.addEventListener('input', () => {
      this.durationSelect.value = 'custom';
      this.updateTimesetterSummary();
    });
    this.customMinsInput.addEventListener('input', () => {
      this.durationSelect.value = 'custom';
      this.updateTimesetterSummary();
    });

    // Quick chips
    this.timesetterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const h = parseInt(chip.getAttribute('data-hours'), 10) || 0;
        const m = parseInt(chip.getAttribute('data-mins'), 10) || 0;
        this.customHoursInput.value = String(h);
        this.customMinsInput.value = String(m);
        const total = h * 60 + m;
        const opt = this.durationSelect.querySelector(`option[value="${total}"]`);
        if (opt) {
          this.durationSelect.value = String(total);
        } else {
          this.durationSelect.value = 'custom';
        }
        this.updateTimesetterSummary();
      });
    });

    // Add Subtask
    const addSubtask = () => {
      const text = this.newSubtaskInput.value.trim();
      if (!text) return;
      this.editedSubtasks.push({
        id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: text,
        completed: false
      });
      this.newSubtaskInput.value = '';
      this.renderSubtasks();
    };
    this.addSubtaskBtn.addEventListener('click', addSubtask);
    this.newSubtaskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSubtask();
      }
    });

    // Add Tag
    const addTag = () => {
      const val = this.newTagInput.value.trim().replace(/^#/, '');
      if (!val) return;
      if (!this.editedTags.includes(val)) {
        this.editedTags.push(val);
        this.renderTags();
      }
      this.newTagInput.value = '';
    };
    this.addTagBtn.addEventListener('click', addTag);
    this.newTagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag();
      }
    });

    // Completed Checkbox
    this.completedCheck.addEventListener('change', () => {
      if (this.completedCheck.checked) {
        this.statusDesc.textContent = 'Outcome marked completed';
        this.statusDesc.style.color = 'var(--accent-emerald)';
      } else {
        this.statusDesc.textContent = 'Active outcome in progress';
        this.statusDesc.style.color = 'var(--text-tertiary)';
      }
    });

    // Global keydown (Escape)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  renderSubtasks() {
    this.subtasksCount.textContent = String(this.editedSubtasks.length);
    if (this.editedSubtasks.length === 0) {
      this.subtasksList.innerHTML = `
        <div style="font-size: 12px; color: var(--text-tertiary); padding: 6px 0;">No subtasks defined. Add granular steps below.</div>
      `;
      return;
    }

    this.subtasksList.innerHTML = this.editedSubtasks.map((st, i) => `
      <div class="glass-card" style="padding: 6px 10px; display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px;">
        <input type="checkbox" class="subtask-edit-check" data-index="${i}" ${st.completed ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px; accent-color: var(--accent-emerald);">
        <input type="text" class="subtask-edit-title glass-input" data-index="${i}" value="${st.title.replace(/"/g, '&quot;')}" style="flex: 1; padding: 3px 6px; font-size: 12.5px; border: none; background: transparent; ${st.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
        <button type="button" class="btn btn-ghost subtask-delete-btn" data-index="${i}" style="width: 24px; height: 24px; padding: 0; color: var(--text-tertiary); font-size: 12px;" title="Remove step">✕</button>
      </div>
    `).join('');

    // Bind subtask checkboxes
    this.subtasksList.querySelectorAll('.subtask-edit-check').forEach(cb => {
      cb.addEventListener('change', () => {
        const idx = Number(cb.getAttribute('data-index'));
        if (this.editedSubtasks[idx]) {
          this.editedSubtasks[idx].completed = cb.checked;
          this.renderSubtasks();
        }
      });
    });

    // Bind subtask titles
    this.subtasksList.querySelectorAll('.subtask-edit-title').forEach(inp => {
      inp.addEventListener('input', () => {
        const idx = Number(inp.getAttribute('data-index'));
        if (this.editedSubtasks[idx]) {
          this.editedSubtasks[idx].title = inp.value;
        }
      });
    });

    // Bind subtask deletes
    this.subtasksList.querySelectorAll('.subtask-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-index'));
        this.editedSubtasks.splice(idx, 1);
        this.renderSubtasks();
      });
    });
  }

  renderTags() {
    if (this.editedTags.length === 0) {
      this.tagsContainer.innerHTML = '<span style="font-size: 12px; color: var(--text-tertiary);">No tags assigned.</span>';
      return;
    }

    this.tagsContainer.innerHTML = this.editedTags.map((tag, i) => `
      <span class="badge" style="background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.12); color: #fff; font-size: 11px; padding: 3px 8px; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 6px;">
        #${tag}
        <button type="button" class="tag-remove-btn" data-index="${i}" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer; font-size: 11px; padding: 0; line-height: 1;">✕</button>
      </span>
    `).join('');

    this.tagsContainer.querySelectorAll('.tag-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-index'));
        this.editedTags.splice(idx, 1);
        this.renderTags();
      });
    });
  }

  open(task) {
    if (!task) return;
    this.isOpen = true;
    this.currentTask = task;
    this.editedSubtasks = Array.isArray(task.subtasks) ? JSON.parse(JSON.stringify(task.subtasks)) : [];
    this.editedTags = Array.isArray(task.tags) ? [...task.tags] : [];

    // Populate header
    this.idBadge.textContent = task.id;
    const cat = store.getCategoryById(task.categoryId);
    if (cat && this.catBead) {
      this.catBead.style.background = cat.color;
      this.catBead.style.boxShadow = `0 0 8px ${cat.color}`;
    }

    // Populate inputs
    this.titleInput.value = task.title || '';
    this.descInput.value = task.description || '';
    this.categorySelect.value = task.categoryId || 'cat-research';
    this.prioritySelect.value = task.priority || 'medium';
    this.energySelect.value = task.energyLevel || 'medium';
    this.repeatSelect.value = task.repeatRule || 'none';

    // Duration setup
    const duration = Number(task.estimatedDuration) || 45;
    const opt = this.durationSelect.querySelector(`option[value="${duration}"]`);
    if (opt) {
      this.durationSelect.value = String(duration);
      this.customTimesetterBox.style.display = 'none';
    } else {
      this.durationSelect.value = 'custom';
      this.customTimesetterBox.style.display = 'block';
    }
    this.syncTimesetterFromMinutes(duration);

    // Timing inputs
    this.startInput.value = task.scheduledStart || '';
    this.endInput.value = task.scheduledEnd || '';
    this.deadlineInput.value = task.deadline || '';

    // Subtasks & tags
    this.renderSubtasks();
    this.renderTags();

    // Completion
    this.completedCheck.checked = Boolean(task.completed);
    if (task.completed) {
      this.statusDesc.textContent = `Completed on ${task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'earlier'}`;
      this.statusDesc.style.color = 'var(--accent-emerald)';
    } else {
      this.statusDesc.textContent = 'Active outcome in progress';
      this.statusDesc.style.color = 'var(--text-tertiary)';
    }

    this.overlay.classList.add('open');

    // Register with App Back Navigation Manager
    if (window.aetherApp && typeof window.aetherApp.pushModal === 'function') {
      window.aetherApp.pushModal('edit-task', () => this.close(false));
    }

    setTimeout(() => this.titleInput.focus(), 50);
  }

  close(shouldPopHistory = true) {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.overlay.classList.remove('open');

    if (shouldPopHistory && window.aetherApp && typeof window.aetherApp.popModal === 'function') {
      window.aetherApp.popModal('edit-task');
    }

    this.currentTask = null;
  }

  save(shouldClose = true) {
    if (!this.currentTask) return;

    const rawTitle = this.titleInput.value.trim();
    if (!rawTitle) {
      this.titleInput.focus();
      return;
    }

    let duration = 45;
    if (this.durationSelect.value === 'custom') {
      const h = parseInt(this.customHoursInput.value, 10) || 0;
      const m = parseInt(this.customMinsInput.value, 10) || 0;
      duration = Math.max(5, h * 60 + m);
    } else {
      duration = Number(this.durationSelect.value) || 45;
    }

    const updates = {
      title: rawTitle,
      description: this.descInput.value.trim(),
      categoryId: this.categorySelect.value,
      priority: this.prioritySelect.value,
      energyLevel: this.energySelect.value,
      repeatRule: this.repeatSelect.value,
      estimatedDuration: duration,
      scheduledStart: this.startInput.value || null,
      scheduledEnd: this.endInput.value || null,
      deadline: this.deadlineInput.value || null,
      subtasks: this.editedSubtasks,
      tags: this.editedTags,
      completed: this.completedCheck.checked,
      completedAt: this.completedCheck.checked ? (this.currentTask.completedAt || new Date().toISOString()) : null
    };

    store.updateTask(this.currentTask.id, updates);
    ambientAudio.playChime();

    if (shouldClose) {
      this.close();
      if (window.aetherApp) {
        window.aetherApp.renderCurrentView();
      }
    }
  }
}
