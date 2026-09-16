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
              <label style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">Estimated Duration</label>
              <select id="quick-add-duration" class="glass-input" style="cursor: pointer;">
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45" selected>45 min</option>
                <option value="60">1 hour (60 min)</option>
                <option value="90">90 min</option>
                <option value="120">2 hours (120 min)</option>
              </select>
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

    this.closeBtn = this.overlay.querySelector('#quick-add-close');
    this.cancelBtn = this.overlay.querySelector('#quick-add-cancel');
    this.submitBtn = this.overlay.querySelector('#quick-add-submit');
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
    setTimeout(() => this.titleInput.focus(), 50);
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('open');
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

    if (!cleanTitle) cleanTitle = rawTitle;

    const duration = parsed.duration || Number(this.durationSelect.value) || 45;
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
