/**
 * AETHER OS — UNIVERSAL QUICK ADD (N)
 * Natural language task parsing + structured attributes editor
 */

import { store } from '../store/db.js';

export class QuickAddModal {
  constructor() {
    this.isOpen = false;
    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-backdrop';
    this.overlay.id = 'quick-add-backdrop';

    const categories = store.getCategories();

    this.overlay.innerHTML = `
      <div class="modal-container" style="max-width: 580px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-primary);"></div>
            <h3 style="font-size: 16px; font-weight: 600;">Create New Task</h3>
          </div>
          <button class="btn btn-ghost btn-icon" id="quick-add-close" style="width: 28px; height: 28px;">✕</button>
        </div>

        <div class="modal-body">
          <!-- Natural Language Input -->
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">
              Task & Natural Schedule (e.g. "Linear algebra study tomorrow 10am 90m")
            </label>
            <input type="text" id="quick-add-title" class="glass-input" placeholder="What needs your focused attention?" autofocus>
          </div>

          <!-- Parsed Chips Preview -->
          <div id="quick-add-parsed-preview" style="display: flex; gap: 8px; flex-wrap: wrap; min-height: 24px;"></div>

          <!-- Structured Form Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Category</label>
              <select id="quick-add-category" class="glass-input" style="cursor: pointer;">
                ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>

            <div>
              <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Priority</label>
              <select id="quick-add-priority" class="glass-input" style="cursor: pointer;">
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 0;">Estimated Duration</label>
                <button type="button" id="quick-add-toggle-custom-time" style="background: none; border: none; color: var(--accent-cyan); font-size: 11px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0;" title="Toggle Custom Hours/Mins Setter">
                  <span>⚙ Custom Time Setter</span>
                </button>
              </div>

              <select id="quick-add-duration" class="glass-input" style="cursor: pointer; width: 100%;">
                <!-- Original Presets (Preserved) -->
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45" selected>45 min</option>
                <option value="60">1 hour (60 min)</option>
                <option value="90">90 min</option>
                <option value="120">2 hours (120 min)</option>
                <!-- Extended Multi-Hour Presets -->
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

              <!-- Interactive Custom Timesetter Container -->
              <div id="quick-add-custom-timesetter" class="custom-timesetter-box" style="display: none; margin-top: 8px; background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 12px; backdrop-filter: blur(16px);">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px;">
                  <!-- Hours Stepper -->
                  <div style="flex: 1;">
                    <span style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); display: block; margin-bottom: 4px;">Hours</span>
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <button type="button" class="btn btn-ghost btn-sm timesetter-stepper-btn" id="btn-hours-minus" style="width: 26px; height: 26px; padding: 0; font-weight: bold; border: 1px solid var(--border-subtle); border-radius: 4px;">-</button>
                      <input type="number" id="quick-add-custom-hours" min="0" max="99" value="0" style="width: 46px; text-align: center; padding: 4px 2px; font-weight: 700; font-family: var(--font-mono); background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: 4px; color: #fff; font-size: 13px;">
                      <button type="button" class="btn btn-ghost btn-sm timesetter-stepper-btn" id="btn-hours-plus" style="width: 26px; height: 26px; padding: 0; font-weight: bold; border: 1px solid var(--border-subtle); border-radius: 4px;">+</button>
                    </div>
                  </div>

                  <!-- Minutes Stepper -->
                  <div style="flex: 1;">
                    <span style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: var(--text-tertiary); display: block; margin-bottom: 4px;">Minutes</span>
                    <div style="display: flex; align-items: center; gap: 4px;">
                      <button type="button" class="btn btn-ghost btn-sm timesetter-stepper-btn" id="btn-mins-minus" style="width: 26px; height: 26px; padding: 0; font-weight: bold; border: 1px solid var(--border-subtle); border-radius: 4px;">-</button>
                      <input type="number" id="quick-add-custom-mins" min="0" max="59" step="5" value="45" style="width: 46px; text-align: center; padding: 4px 2px; font-weight: 700; font-family: var(--font-mono); background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: 4px; color: #fff; font-size: 13px;">
                      <button type="button" class="btn btn-ghost btn-sm timesetter-stepper-btn" id="btn-mins-plus" style="width: 26px; height: 26px; padding: 0; font-weight: bold; border: 1px solid var(--border-subtle); border-radius: 4px;">+</button>
                    </div>
                  </div>
                </div>

                <!-- Quick Hours Shortcut Chips -->
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
                  <button type="button" class="timesetter-chip" data-hours="1" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">1h</button>
                  <button type="button" class="timesetter-chip" data-hours="2" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">2h</button>
                  <button type="button" class="timesetter-chip" data-hours="3" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">3h</button>
                  <button type="button" class="timesetter-chip" data-hours="4" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">4h</button>
                  <button type="button" class="timesetter-chip" data-hours="5" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">5h</button>
                  <button type="button" class="timesetter-chip" data-hours="6" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">6h</button>
                  <button type="button" class="timesetter-chip" data-hours="8" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">8h</button>
                  <button type="button" class="timesetter-chip" data-hours="10" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">10h</button>
                  <button type="button" class="timesetter-chip" data-hours="12" data-mins="0" style="padding: 2px 8px; font-size: 11px; border-radius: var(--radius-full); background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer;">12h</button>
                </div>

                <!-- Live Total Duration Summary -->
                <div id="timesetter-summary" style="font-size: 11.5px; font-family: var(--font-mono); color: var(--accent-cyan); font-weight: 600; text-align: center; background: rgba(6, 182, 212, 0.1); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(6, 182, 212, 0.25);">
                  ⏱ Effective Duration: 45 min
                </div>
              </div>
            </div>

            <div>
              <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Energy Requirement</label>
              <select id="quick-add-energy" class="glass-input" style="cursor: pointer;">
                <option value="low">Low Energy</option>
                <option value="medium" selected>Medium Energy</option>
                <option value="high">High Energy (Deep Work)</option>
              </select>
            </div>

            <div>
              <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Scheduled Start Time</label>
              <input type="datetime-local" id="quick-add-start" class="glass-input">
            </div>

            <div>
              <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Deadline (Optional)</label>
              <input type="datetime-local" id="quick-add-deadline" class="glass-input">
            </div>
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Notes & Context</label>
            <textarea id="quick-add-notes" class="glass-input" rows="2" placeholder="Key outcomes, references, or sub-goals..."></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-ghost" id="quick-add-cancel">Cancel</button>
          <button class="btn btn-primary" id="quick-add-submit">Create Task</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    this.titleInput = this.overlay.querySelector('#quick-add-title');
    this.previewBox = this.overlay.querySelector('#quick-add-parsed-preview');
    this.categorySelect = this.overlay.querySelector('#quick-add-category');
    this.prioritySelect = this.overlay.querySelector('#quick-add-priority');
    this.durationSelect = this.overlay.querySelector('#quick-add-duration');
    this.energySelect = this.overlay.querySelector('#quick-add-energy');
    this.startInput = this.overlay.querySelector('#quick-add-start');
    this.deadlineInput = this.overlay.querySelector('#quick-add-deadline');
    this.notesInput = this.overlay.querySelector('#quick-add-notes');

    // Timesetter elements
    this.toggleCustomBtn = this.overlay.querySelector('#quick-add-toggle-custom-time');
    this.customTimesetterBox = this.overlay.querySelector('#quick-add-custom-timesetter');
    this.customHoursInput = this.overlay.querySelector('#quick-add-custom-hours');
    this.customMinsInput = this.overlay.querySelector('#quick-add-custom-mins');
    this.timesetterSummary = this.overlay.querySelector('#timesetter-summary');
    this.btnHoursMinus = this.overlay.querySelector('#btn-hours-minus');
    this.btnHoursPlus = this.overlay.querySelector('#btn-hours-plus');
    this.btnMinsMinus = this.overlay.querySelector('#btn-mins-minus');
    this.btnMinsPlus = this.overlay.querySelector('#btn-mins-plus');
    this.timesetterChips = this.overlay.querySelectorAll('.timesetter-chip');

    this.closeBtn = this.overlay.querySelector('#quick-add-close');
    this.cancelBtn = this.overlay.querySelector('#quick-add-cancel');
    this.submitBtn = this.overlay.querySelector('#quick-add-submit');
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
    window.addEventListener('keydown', (e) => {
      // Shortcut N (when not in an active input/textarea)
      const target = e.target;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key.toLowerCase() === 'n' && !isInput && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        this.open();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.closeBtn.addEventListener('click', () => this.close());
    this.cancelBtn.addEventListener('click', () => this.close());
    this.submitBtn.addEventListener('click', () => this.submit());

    // Duration dropdown change listener
    this.durationSelect.addEventListener('change', () => {
      if (this.durationSelect.value === 'custom') {
        this.customTimesetterBox.style.display = 'block';
      } else {
        const val = Number(this.durationSelect.value);
        if (!isNaN(val)) {
          this.syncTimesetterFromMinutes(val);
        }
      }
    });

    // Custom time toggle button
    if (this.toggleCustomBtn) {
      this.toggleCustomBtn.addEventListener('click', () => {
        const isHidden = this.customTimesetterBox.style.display === 'none' || !this.customTimesetterBox.style.display;
        this.customTimesetterBox.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
          if (this.durationSelect.value !== 'custom') {
            const val = Number(this.durationSelect.value);
            if (!isNaN(val)) this.syncTimesetterFromMinutes(val);
          }
        }
      });
    }

    // Stepper buttons
    if (this.btnHoursPlus) {
      this.btnHoursPlus.addEventListener('click', () => {
        let val = parseInt(this.customHoursInput.value, 10) || 0;
        this.customHoursInput.value = String(Math.min(99, val + 1));
        this.durationSelect.value = 'custom';
        this.updateTimesetterSummary();
      });
    }
    if (this.btnHoursMinus) {
      this.btnHoursMinus.addEventListener('click', () => {
        let val = parseInt(this.customHoursInput.value, 10) || 0;
        this.customHoursInput.value = String(Math.max(0, val - 1));
        this.durationSelect.value = 'custom';
        this.updateTimesetterSummary();
      });
    }
    if (this.btnMinsPlus) {
      this.btnMinsPlus.addEventListener('click', () => {
        let val = parseInt(this.customMinsInput.value, 10) || 0;
        this.customMinsInput.value = String(Math.min(55, val + 5));
        this.durationSelect.value = 'custom';
        this.updateTimesetterSummary();
      });
    }
    if (this.btnMinsMinus) {
      this.btnMinsMinus.addEventListener('click', () => {
        let val = parseInt(this.customMinsInput.value, 10) || 0;
        this.customMinsInput.value = String(Math.max(0, val - 5));
        this.durationSelect.value = 'custom';
        this.updateTimesetterSummary();
      });
    }

    if (this.customHoursInput) {
      this.customHoursInput.addEventListener('input', () => {
        this.durationSelect.value = 'custom';
        this.updateTimesetterSummary();
      });
    }
    if (this.customMinsInput) {
      this.customMinsInput.addEventListener('input', () => {
        this.durationSelect.value = 'custom';
        this.updateTimesetterSummary();
      });
    }

    // Quick chips
    this.timesetterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const h = parseInt(chip.getAttribute('data-hours'), 10) || 0;
        const m = parseInt(chip.getAttribute('data-mins'), 10) || 0;
        this.customHoursInput.value = String(h);
        this.customMinsInput.value = String(m);
        const total = h * 60 + m;
        // Check if exists in dropdown
        const opt = this.durationSelect.querySelector(`option[value="${total}"]`);
        if (opt) {
          this.durationSelect.value = String(total);
        } else {
          this.durationSelect.value = 'custom';
        }
        this.updateTimesetterSummary();
      });
    });

    this.titleInput.addEventListener('input', () => this.parseNaturalInput());
    this.titleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.submit();
      }
    });
  }

  parseNaturalInput() {
    const raw = this.titleInput.value;
    const parsed = this.interpretText(raw);

    const chips = [];
    if (parsed.duration) chips.push(`<span class="badge" style="background: rgba(99, 102, 241, 0.15); color: var(--accent-primary);">⏱ ${parsed.duration} min</span>`);
    if (parsed.dateStr) chips.push(`<span class="badge" style="background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan);">📅 ${parsed.dateStr}</span>`);
    if (parsed.timeStr) chips.push(`<span class="badge" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);">🕒 ${parsed.timeStr}</span>`);
    if (parsed.matchedCategory) chips.push(`<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-amber);">🏷 ${parsed.matchedCategory.name}</span>`);

    this.previewBox.innerHTML = chips.join('');

    // Pre-fill form selectors if matched
    if (parsed.duration) {
      this.durationSelect.value = String(parsed.duration);
    }
    if (parsed.matchedCategory) {
      this.categorySelect.value = parsed.matchedCategory.id;
    }
  }

  interpretText(text) {
    let clean = text;
    let duration = null;
    let dateStr = null;
    let timeStr = null;
    let matchedCategory = null;

    // Detect duration: "90m", "90 min", "1h", "2 hours", "45m"
    const durMatch = text.match(/\b(\d+)\s*(m|min|mins|minutes|h|hr|hours)\b/i);
    if (durMatch) {
      const val = parseInt(durMatch[1], 10);
      const unit = durMatch[2].toLowerCase();
      duration = unit.startsWith('h') ? val * 60 : val;
    }

    // Detect today / tomorrow
    const today = new Date();
    if (/\btomorrow\b/i.test(text)) {
      const tmrw = new Date(today);
      tmrw.setDate(tmrw.getDate() + 1);
      dateStr = tmrw.toISOString().split('T')[0];
    } else if (/\btoday\b/i.test(text)) {
      dateStr = today.toISOString().split('T')[0];
    }

    // Detect time: "10am", "2:30pm", "14:00"
    const timeMatch = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
    if (timeMatch && (timeMatch[3] || timeMatch[2])) {
      let h = parseInt(timeMatch[1], 10);
      const m = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
      const meridiem = timeMatch[3] ? timeMatch[3].toLowerCase() : null;

      if (meridiem === 'pm' && h < 12) h += 12;
      if (meridiem === 'am' && h === 12) h = 0;

      timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    // Category detection by keyword
    const categories = store.getCategories();
    for (const c of categories) {
      if (new RegExp(`\\b${c.name}\\b`, 'i').test(text)) {
        matchedCategory = c;
        break;
      }
    }

    return { clean, duration, dateStr, timeStr, matchedCategory };
  }

  open(presetCategory = null, presetStartTime = null) {
    this.isOpen = true;
    this.titleInput.value = '';
    this.previewBox.innerHTML = '';
    this.notesInput.value = '';

    if (presetCategory) {
      this.categorySelect.value = presetCategory;
    }

    if (presetStartTime) {
      this.startInput.value = presetStartTime;
    } else {
      const now = new Date();
      now.setMinutes(0, 0, 0);
      now.setHours(now.getHours() + 1);
      const pad = (n) => n.toString().padStart(2, '0');
      this.startInput.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    }

    this.overlay.classList.add('open');
    if (window.aetherApp && typeof window.aetherApp.pushModal === 'function') {
      window.aetherApp.pushModal('quick-add', () => this.close(false));
    }
    setTimeout(() => this.titleInput.focus(), 50);
  }

  close(shouldPop = true) {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.overlay.classList.remove('open');
    if (shouldPop && window.aetherApp && typeof window.aetherApp.popModal === 'function') {
      window.aetherApp.popModal('quick-add');
    }
  }

  submit() {
    const rawTitle = this.titleInput.value.trim();
    if (!rawTitle) {
      this.titleInput.focus();
      return;
    }

    const parsed = this.interpretText(rawTitle);

    // Clean title from duration & temporal tags for aesthetic clarity
    let cleanTitle = rawTitle
      .replace(/\b(\d+)\s*(m|min|mins|minutes|h|hr|hours)\b/gi, '')
      .replace(/\b(tomorrow|today)\b/gi, '')
      .replace(/\b\d{1,2}(?::\d{2})?\s*(am|pm)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    let duration = 45;
    if (this.durationSelect.value === 'custom') {
      const h = parseInt(this.customHoursInput.value, 10) || 0;
      const m = parseInt(this.customMinsInput.value, 10) || 0;
      duration = Math.max(5, h * 60 + m);
    } else {
      duration = parsed.duration || Number(this.durationSelect.value) || 45;
    }
    const categoryId = this.categorySelect.value || (parsed.matchedCategory ? parsed.matchedCategory.id : 'cat-research');
    const priority = this.prioritySelect.value || 'medium';
    const energyLevel = this.energySelect.value || 'medium';
    const scheduledStart = this.startInput.value || null;
    const deadline = this.deadlineInput.value || null;
    const description = this.notesInput.value.trim();

    let scheduledEnd = null;
    if (scheduledStart) {
      const startD = new Date(scheduledStart);
      const endD = new Date(startD.getTime() + duration * 60000);
      scheduledEnd = endD.toISOString();
    }

    store.addTask({
      title: cleanTitle,
      description,
      categoryId,
      priority,
      estimatedDuration: duration,
      scheduledStart,
      scheduledEnd,
      deadline,
      energyLevel,
      subtasks: []
    });

    this.close();
  }
}
