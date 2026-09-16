/**
 * AETHER OS — TIME-BLOCKING VERTICAL CALENDAR
 * Vertical 24-hour timeline, category-tinted blocks, drag & click scheduling,
 * live current-time indicator line, and capacity overload meter.
 */

import { store } from '../store/db.js';
import { timerEngine } from '../engine/timer.js';

let selectedDate = new Date();

export function renderCalendarView(container, navigate) {
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const isToday = selectedDateStr === new Date().toISOString().split('T')[0];

  const tasks = store.getTasks();
  const dayTasks = tasks.filter(t => t.scheduledStart && t.scheduledStart.startsWith(selectedDateStr));

  // Compute total scheduled time in minutes
  const totalScheduledMinutes = dayTasks.reduce((acc, t) => acc + (t.estimatedDuration || 0), 0);
  const schedHours = Math.floor(totalScheduledMinutes / 60);
  const schedMins = totalScheduledMinutes % 60;
  const isOverloaded = totalScheduledMinutes > 8 * 60;

  // Timeline hours from 06:00 to 23:00 (18 hours)
  const startHour = 6;
  const endHour = 23;
  const totalHours = endHour - startHour + 1;
  const pixelsPerHour = 64;

  container.innerHTML = `
    <div class="animate-fade-in">
      <!-- Calendar Header -->
      <div class="calendar-view-header">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div>
            <h1 style="font-size: 26px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 2px;">Daily Time-Blocking</h1>
            <p style="font-size: 13.5px; color: var(--text-secondary);">Structure and protect deep work intervals throughout the day.</p>
          </div>
        </div>

        <!-- Date Switcher & Capacity -->
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <div class="calendar-capacity-meter">
            <span style="font-size: 14px;">⚡</span>
            <span>Capacity: <strong>${schedHours}h ${schedMins}m</strong> / 8h planned</span>
            ${isOverloaded ? `
              <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: var(--priority-critical);">
                Overloaded by ${Math.floor((totalScheduledMinutes - 480) / 60)}h ${(totalScheduledMinutes - 480) % 60}m
              </span>
            ` : `
              <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);">Balanced</span>
            `}
          </div>

          <div style="display: flex; align-items: center; gap: 6px; background: var(--bg-surface); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <button class="btn btn-ghost btn-icon" id="btn-cal-prev" style="width: 32px; height: 32px;">‹</button>
            <button class="btn btn-ghost" id="btn-cal-today" style="padding: 4px 12px; font-size: 12.5px; font-weight: 600; ${isToday ? 'background: var(--bg-surface-elevated); color: var(--accent-primary);' : ''}">
              Today
            </button>
            <button class="btn btn-ghost btn-icon" id="btn-cal-next" style="width: 32px; height: 32px;">›</button>
            <input type="date" id="cal-date-picker" class="glass-input" style="padding: 4px 8px; font-size: 12px; width: 130px; border: none; background: transparent;" value="${selectedDateStr}">
          </div>
        </div>
      </div>

      <!-- Vertical Timeline View -->
      <div class="calendar-timeline-container" id="calendar-timeline-scroll">
        <!-- Hour Labels Column -->
        <div class="calendar-hours-column">
          ${Array.from({ length: totalHours }, (_, i) => {
            const h = startHour + i;
            const label = `${h.toString().padStart(2, '0')}:00`;
            return `<div class="timeline-hour-label">${label}</div>`;
          }).join('')}
        </div>

        <!-- Slots & Blocks Column -->
        <div class="calendar-slots-column" id="calendar-slots-lane" style="height: ${totalHours * pixelsPerHour}px;">
          <!-- Empty Slots (Clickable to create task at that hour) -->
          ${Array.from({ length: totalHours }, (_, i) => {
            const h = startHour + i;
            return `<div class="timeline-hour-slot" data-hour="${h}" title="Click to schedule task at ${h}:00"></div>`;
          }).join('')}

          <!-- Current Time Line if viewing today -->
          ${isToday ? renderCurrentTimeLine(startHour, pixelsPerHour) : ''}

          <!-- Scheduled Task Blocks -->
          ${dayTasks.map(task => renderTaskBlock(task, startHour, pixelsPerHour)).join('')}
        </div>
      </div>
    </div>
  `;

  // Bind Events
  container.querySelector('#btn-cal-prev').addEventListener('click', () => {
    selectedDate.setDate(selectedDate.getDate() - 1);
    renderCalendarView(container, navigate);
  });

  container.querySelector('#btn-cal-next').addEventListener('click', () => {
    selectedDate.setDate(selectedDate.getDate() + 1);
    renderCalendarView(container, navigate);
  });

  container.querySelector('#btn-cal-today').addEventListener('click', () => {
    selectedDate = new Date();
    renderCalendarView(container, navigate);
  });

  const picker = container.querySelector('#cal-date-picker');
  picker.addEventListener('change', (e) => {
    if (e.target.value) {
      selectedDate = new Date(e.target.value + 'T00:00:00');
      renderCalendarView(container, navigate);
    }
  });

  // Click empty slot to schedule
  container.querySelectorAll('.timeline-hour-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      const h = parseInt(slot.getAttribute('data-hour'), 10);
      const pad = (n) => n.toString().padStart(2, '0');
      const timePreset = `${selectedDateStr}T${pad(h)}:00`;
      window.aetherQuickAdd && window.aetherQuickAdd.open(null, timePreset);
    });
  });

  // Click task block to start focus session
  container.querySelectorAll('.calendar-event-block').forEach(block => {
    block.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = block.getAttribute('data-task-id');
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

  // Auto-scroll timeline to 08:30 or current time
  const timelineScroll = container.querySelector('#calendar-timeline-scroll');
  if (timelineScroll) {
    const currentH = new Date().getHours();
    const scrollTarget = Math.max(0, (currentH - startHour - 1) * pixelsPerHour);
    timelineScroll.scrollTop = scrollTarget;
  }
}

function renderCurrentTimeLine(startHour, pixelsPerHour) {
  const now = new Date();
  const currentMinutesFromStart = (now.getHours() - startHour) * 60 + now.getMinutes();
  if (currentMinutesFromStart < 0) return '';
  const topPx = (currentMinutesFromStart / 60) * pixelsPerHour;

  return `<div class="current-time-line" style="top: ${topPx}px;" title="Current Time: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}"></div>`;
}

function renderTaskBlock(task, startHour, pixelsPerHour) {
  const cat = store.getCategoryById(task.categoryId);
  const startDate = new Date(task.scheduledStart);
  const startMinutesFromStart = (startDate.getHours() - startHour) * 60 + startDate.getMinutes();

  const topPx = (startMinutesFromStart / 60) * pixelsPerHour;
  const heightPx = Math.max(34, (task.estimatedDuration / 60) * pixelsPerHour - 4);

  const timeLabel = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${task.estimatedDuration}m`;

  return `
    <div class="calendar-event-block glass-card" data-task-id="${task.id}"
      style="top: ${topPx}px; height: ${heightPx}px; border-left-color: ${cat.color}; background: linear-gradient(90deg, ${cat.color}15 0%, var(--bg-surface-elevated) 100%);">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span class="calendar-event-title">${task.title}</span>
        <span class="badge cat-badge" style="font-size: 10px; padding: 2px 6px;">${cat.name}</span>
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span class="calendar-event-time">${timeLabel}</span>
        ${task.completed ? '<span style="color: var(--accent-emerald); font-size: 11px;">✓ Completed</span>' : '<span style="color: var(--accent-primary); font-size: 11px;">▶ Focus</span>'}
      </div>
    </div>
  `;
}
