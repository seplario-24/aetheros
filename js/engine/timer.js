/**
 * AETHER OS — ROCK-SOLID TIMESTAMP TIMER ENGINE
 * Drift-free, background-tab resilient, timestamp-based countdown
 * Supports Task Timers, Pomodoro cycles, Focus Sprints, and Ultradian Rhythms (90/20).
 */

import { store } from '../store/db.js';
import { ambientAudio } from '../audio/ambient.js';

export class TimerEngine {
  constructor() {
    this.mode = 'task'; // 'task' | 'pomodoro' | 'sprint' | 'ultradian'
    this.phase = 'focus'; // 'focus' | 'short-break' | 'long-break' | 'recovery'
    this.isRunning = false;
    this.activeTask = null;

    this.totalDurationSeconds = 25 * 60;
    this.remainingSeconds = 25 * 60;
    this.targetEndTime = null;
    this.pausedRemaining = null;
    this.sessionStartTime = null;

    // Pomodoro cycle counter
    this.pomodoroCycle = 1;
    this.pomodorosUntilLongBreak = 4;

    // Laps & Interval Milestone tracking
    this.laps = [];

    this.timerInterval = null;
    this.listeners = new Set();

    // Re-sync immediately when returning from background tab
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.isRunning) {
          this.recalculate();
          this.emitTick();
        }
      });
    }
  }

  configure({ mode = 'task', durationMinutes = 25, task = null, phase = 'focus' }) {
    this.mode = mode;
    this.phase = phase;
    this.activeTask = task;
    this.totalDurationSeconds = Math.max(1, Math.round(durationMinutes * 60));
    this.remainingSeconds = this.totalDurationSeconds;
    this.pausedRemaining = null;
    this.targetEndTime = null;
    this.isRunning = false;
    this.laps = [];
    this.clearLoop();
    this.emitTick();
  }

  start() {
    if (this.isRunning) return;

    const now = Date.now();
    this.sessionStartTime = this.sessionStartTime || new Date().toISOString();

    const secondsToCount = this.pausedRemaining !== null ? this.pausedRemaining : this.remainingSeconds;
    this.targetEndTime = now + secondsToCount * 1000;
    this.pausedRemaining = null;
    this.isRunning = true;

    this.clearLoop();
    this.timerInterval = setInterval(() => {
      this.recalculate();
      this.emitTick();
    }, 250);

    this.emitTick();
  }

  pause() {
    if (!this.isRunning) return;
    this.recalculate();
    this.pausedRemaining = this.remainingSeconds;
    this.isRunning = false;
    this.clearLoop();
    this.emitTick();
  }

  resume() {
    if (this.isRunning) return;
    this.start();
  }

  stop() {
    this.clearLoop();
    this.isRunning = false;
    this.remainingSeconds = this.totalDurationSeconds;
    this.pausedRemaining = null;
    this.targetEndTime = null;
    this.sessionStartTime = null;
    this.clearLaps();
    this.emitTick();
  }

  markLap(note = '') {
    const totalElapsedSeconds = Math.max(0, this.totalDurationSeconds - this.remainingSeconds);
    // Find the total elapsed seconds at the previous lap
    const lastLapElapsed = this.laps.length > 0 ? this.laps[0].totalElapsedSeconds : 0;
    const splitSeconds = Math.max(0, totalElapsedSeconds - lastLapElapsed);

    const lapNumber = this.laps.length + 1;
    const lap = {
      id: `lap-${Date.now()}-${lapNumber}`,
      lapNumber,
      splitSeconds,
      formattedSplit: this.formatTime(splitSeconds),
      totalElapsedSeconds,
      formattedTotal: this.formatTime(totalElapsedSeconds),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      note: (note || '').trim()
    };

    this.laps.unshift(lap); // Most recent lap at index 0
    this.notify('LAP_MARKED', { lap, laps: [...this.laps] });
    this.emitTick();
    return lap;
  }

  clearLaps() {
    this.laps = [];
    this.notify('LAPS_CLEARED', { laps: [] });
  }

  getLaps() {
    return [...this.laps];
  }

  extend(minutes = 5) {
    const additionalSecs = minutes * 60;
    this.totalDurationSeconds += additionalSecs;
    if (this.isRunning && this.targetEndTime) {
      this.targetEndTime += additionalSecs * 1000;
    } else {
      this.remainingSeconds += additionalSecs;
      if (this.pausedRemaining !== null) {
        this.pausedRemaining += additionalSecs;
      }
    }
    this.emitTick();
  }

  finishEarly() {
    const actualSpentSeconds = this.totalDurationSeconds - this.remainingSeconds;
    this.completeSession(Math.max(1, Math.round(actualSpentSeconds / 60)));
  }

  recalculate() {
    if (!this.isRunning || !this.targetEndTime) return;

    const diff = this.targetEndTime - Date.now();
    if (diff <= 0) {
      this.remainingSeconds = 0;
      this.handleCountdownFinished();
    } else {
      this.remainingSeconds = Math.ceil(diff / 1000);
    }
  }

  handleCountdownFinished() {
    this.clearLoop();
    this.isRunning = false;

    // Play pleasant completion chime
    ambientAudio.playChime();

    const plannedMinutes = Math.round(this.totalDurationSeconds / 60);

    if (this.phase === 'focus') {
      this.recordCompletedSession(plannedMinutes, plannedMinutes);

      // Handle Pomodoro cycle transition
      if (this.mode === 'pomodoro') {
        if (this.pomodoroCycle >= this.pomodorosUntilLongBreak) {
          this.pomodoroCycle = 1;
          this.configure({
            mode: 'pomodoro',
            durationMinutes: store.getPreferences().defaultLongBreak || 20,
            phase: 'long-break',
            task: this.activeTask
          });
        } else {
          this.pomodoroCycle += 1;
          this.configure({
            mode: 'pomodoro',
            durationMinutes: store.getPreferences().defaultShortBreak || 5,
            phase: 'short-break',
            task: this.activeTask
          });
        }
      } else if (this.mode === 'ultradian') {
        // Switch to 20-minute recovery
        this.configure({
          mode: 'ultradian',
          durationMinutes: store.getPreferences().ultradianBreakDuration || 20,
          phase: 'recovery',
          task: this.activeTask
        });
      }
    } else {
      // Break or Recovery finished, switch back to focus
      const prefs = store.getPreferences();
      const nextDuration = this.mode === 'ultradian'
        ? (prefs.ultradianFocusDuration || 90)
        : (prefs.defaultFocusDuration || 25);

      this.configure({
        mode: this.mode,
        durationMinutes: nextDuration,
        phase: 'focus',
        task: this.activeTask
      });
    }

    this.notify('SESSION_COMPLETED', {
      mode: this.mode,
      phase: this.phase,
      task: this.activeTask
    });
  }

  completeSession(actualMinutes) {
    this.clearLoop();
    this.isRunning = false;

    ambientAudio.playChime();
    const plannedMinutes = Math.round(this.totalDurationSeconds / 60);
    this.recordCompletedSession(plannedMinutes, actualMinutes);
    this.stop();
  }

  recordCompletedSession(plannedMinutes, actualMinutes) {
    const categoryId = this.activeTask
      ? this.activeTask.categoryId
      : 'cat-research';

    store.recordTaskSession(
      this.activeTask ? this.activeTask.id : null,
      plannedMinutes,
      actualMinutes,
      categoryId,
      this.activeTask ? `Worked on ${this.activeTask.title}` : 'Deep Focus Session'
    );
  }

  clearLoop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(totalSecs) {
    const s = Math.max(0, Math.floor(totalSecs));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getSnapshot() {
    const progress = this.totalDurationSeconds > 0
      ? (this.totalDurationSeconds - this.remainingSeconds) / this.totalDurationSeconds
      : 0;

    return {
      mode: this.mode,
      phase: this.phase,
      isRunning: this.isRunning,
      activeTask: this.activeTask,
      totalSeconds: this.totalDurationSeconds,
      remainingSeconds: this.remainingSeconds,
      formattedTime: this.formatTime(this.remainingSeconds),
      progressRatio: Math.min(1, Math.max(0, progress)),
      pomodoroCycle: this.pomodoroCycle,
      laps: [...this.laps]
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emitTick() {
    this.notify('TICK', this.getSnapshot());
  }

  notify(eventType, data) {
    for (const l of this.listeners) {
      try {
        l(eventType, data);
      } catch (e) {
        console.error('Timer listener error:', e);
      }
    }
  }
}

export const timerEngine = new TimerEngine();
