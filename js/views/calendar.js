/**
 * AETHER OS — 3D ELEMENTAL TIME-BLOCKING CALENDAR
 * Volumetric event slabs with category material extrusions,
 * luminous live current-time indicator line, capacity overload gauge,
 * and dimensional vertical timeline.
 */

import { store } from '../store/db.js';
import { timerEngine } from '../engine/timer.js';
import { ambientAudio } from '../audio/ambient.js';

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
  const pixelsPerHour = 68;

  container.innerHTML = `
    <div class="animate-fade-in" style="perspective: 1200px;">
      <!-- Calendar Header -->
      <div class="calendar-view-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--el-air);">Spatial Chronology</span>
          </div>
          <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 4px;">Daily Time-Blocking</h1>
          <p style="font-size: 13.5px; color: var(--text-secondary);">Structure volumetric deep work intervals. Protect intentional cognitive flow.</p>
        </div>

        <!-- Date Switcher & Capacity Gauge -->
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <!-- Capacity Gauge -->
          <div class="calendar-capacity-meter glass-card" style="padding: 6px 14px; display: flex; align-items: center; gap: 8px; border-radius: var(--radius-full); font-size: 13px; border: 1px solid ${isOverloaded ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.3)'}; box-shadow: ${isOverloaded ? '0 0 15px rgba(239, 68, 68, 0.2)' : '0 0 15px rgba(16, 185, 129, 0.1)'};">
            <span style="font-size: 14px;">${isOverloaded ? '🔥' : '⚡'}</span>
            <span>Capacity: <strong>${schedHours}h ${schedMins}m</strong> / 8h planned</span>
            ${isOverloaded ? `
              <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: var(--priority-critical); font-size: 11px; font-weight: 700; border-radius: 4px; padding: 2px 6px;">
                Overloaded
              </span>
            ` : `
              <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); font-size: 11px; font-weight: 700; border-radius: 4px; padding: 2px 6px;">Balanced</span>
            `}
          </div>

          <!-- Date Navigation Pill -->
          <div style="display: flex; align-items: center; gap: 6px; background: rgba(15, 23, 42, 0.4); padding: 4px 8px; border-radius: var(--radius-full); border: 1px solid var(--border-glass); backdrop-filter: blur(12px);">
            <button class="btn btn-ghost btn-icon" id="btn-cal-prev" style="width: 30px; height: 30px;">‹</button>
            <button class="btn btn-ghost" id="btn-cal-today" style="padding: 4px 14px; font-size: 12.5px; font-weight: 700; border-radius: var(--radius-full); ${isToday ? 'background: var(--accent-primary); color: #fff; box-shadow: 0 2px 10px var(--accent-primary-glow);' : ''}">
              Today
            </button>
            <button class="btn btn-ghost btn-icon" id="btn-cal-next" style="width: 30px; height: 30px;">›</button>
            <input type="date" id="cal-date-picker" class="glass-input" style="padding: 4px 8px; font-size: 12px; width: 130px; border: none; background: transparent; cursor: pointer; color: var(--text-primary);" value="${selectedDateStr}">
          </div>
        </div>
      </div>

      <!-- Vertical Timeline View with Spatial Perspective -->
      <div class="calendar-timeline-container glass-panel" id="calendar-timeline-scroll" style="position: relative; border-radius: var(--radius-lg); padding: 16px; overflow-y: auto; max-height: calc(100vh - 220px); box-shadow: var(--shadow-glass);">
        <!-- Hour Labels Column -->
        <div class="calendar-hours-column" style="width: 65px; flex-shrink: 0; border-right: 1px solid var(--border-glass);">
          ${Array.from({ length: totalHours }, (_, i) => {
            const h = startHour + i;
            const label = `${h.toString().padStart(2, '0')}:00`;
            return `<div class="timeline-hour-label" style="height: ${pixelsPerHour}px; font-family: var(--font-mono); font-size: 11.5px; color: var(--text-tertiary); display: flex; align-items: flex-start; padding-top: 4px;">${label}</div>`;
          }).join('')}
        </div>

        <!-- Slots & Volumetric Blocks Column -->
        <div class="calendar-slots-column" id="calendar-slots-lane" style="position: relative; flex: 1; height: ${totalHours * pixelsPerHour}px;">
          <!-- Empty Hour Grid Slots -->
          ${Array.from({ length: totalHours }, (_, i) => {
            const h = startHour + i;
            return `
              <div class="timeline-hour-slot" data-hour="${h}" title="Click to schedule interval at ${h}:00" 
                   style="height: ${pixelsPerHour}px; border-bottom: 1px dashed rgba(255, 255, 255, 0.06); cursor: pointer; transition: background var(--transition-fast);">
              </div>
            `;
          }).join('')}

          <!-- Live Current Time Indicator Line -->
          ${isToday ? renderCurrentTimeLine(startHour, pixelsPerHour) : ''}

          <!-- Scheduled Volumetric Task Blocks -->
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

  // Click task block to start focus session with chime
  container.querySelectorAll('.calendar-event-block').forEach(block => {
    block.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = block.getAttribute('data-task-id');
      const task = store.getTaskById(taskId);
      if (task) {
        ambientAudio.playChime();
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

  // Auto-scroll timeline to current time or 08:30
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

  return `
    <div class="current-time-line" style="position: absolute; top: ${topPx}px; left: 0; right: 0; height: 2px; background: var(--accent-cyan); box-shadow: 0 0 10px var(--accent-cyan-glow); z-index: 10; pointer-events: none;" title="Current Time: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}">
      <div style="position: absolute; left: -5px; top: -4px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan);"></div>
    </div>
  `;
}

function renderTaskBlock(task, startHour, pixelsPerHour) {
  const cat = store.getCategoryById(task.categoryId);
  const startDate = new Date(task.scheduledStart);
  const startMinutesFromStart = (startDate.getHours() - startHour) * 60 + startDate.getMinutes();

  const topPx = (startMinutesFromStart / 60) * pixelsPerHour;
  const heightPx = Math.max(38, (task.estimatedDuration / 60) * pixelsPerHour - 4);

  const timeLabel = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${task.estimatedDuration}m`;

  return `
    <div class="calendar-event-block glass-card" data-task-id="${task.id}"
         style="position: absolute; top: ${topPx}px; left: 10px; right: 10px; height: ${heightPx}px; border-left: 4px solid ${cat.color}; background: linear-gradient(135deg, ${cat.color}25 0%, rgba(15, 23, 42, 0.75) 100%); box-shadow: 0 4px 16px rgba(0,0,0,0.3); border-radius: var(--radius-md); padding: 8px 12px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all var(--transition-normal); z-index: 5;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
        <span class="calendar-event-title" style="font-size: 13.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff;">${task.title}</span>
        <span class="badge cat-badge" style="font-size: 10px; padding: 2px 8px; border-radius: var(--radius-full); background: rgba(255,255,255,0.08);">${cat.name}</span>
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; color: var(--text-secondary);">
        <span class="calendar-event-time">${timeLabel}</span>
        ${task.completed ? '<span style="color: var(--accent-emerald); font-weight: 700;">✓ Completed</span>' : '<span style="color: var(--accent-cyan); font-weight: 700;">▶ Launch Focus</span>'}
      </div>
    </div>
  `;
}
