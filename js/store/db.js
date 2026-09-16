/**
 * AETHER OS — REACTIVE STORE & PERSISTENT DATABASE ENGINE
 * Robust local persistence, realistic 60-day historical data seeder,
 * CSV/JSON export & import capabilities.
 */

const STORAGE_KEY = 'AETHER_PRODUCTIVITY_OS_STORE_V1';

export const DEFAULT_CATEGORIES = [
  { id: 'cat-study', name: 'Study', color: '#6366F1', icon: 'book-open', isCustom: false },
  { id: 'cat-research', name: 'Research', color: '#06B6D4', icon: 'atom', isCustom: false },
  { id: 'cat-editing', name: 'Editing', color: '#8B5CF6', icon: 'video', isCustom: false },
  { id: 'cat-content', name: 'Content', color: '#EC4899', icon: 'pen-tool', isCustom: false },
  { id: 'cat-reading', name: 'Book Reading', color: '#3B82F6', icon: 'bookmark', isCustom: false },
  { id: 'cat-course', name: 'Course', color: '#10B981', icon: 'graduation-cap', isCustom: false },
  { id: 'cat-personal', name: 'Personal', color: '#14B8A6', icon: 'user', isCustom: false },
  { id: 'cat-exercise', name: 'Exercise', color: '#F97316', icon: 'activity', isCustom: false },
  { id: 'cat-admin', name: 'Admin', color: '#64748B', icon: 'check-square', isCustom: false },
  { id: 'cat-other', name: 'Other', color: '#EAB308', icon: 'box', isCustom: false }
];

export const DEFAULT_PREFERENCES = {
  theme: 'dark',
  soundEnabled: true,
  effects3D: 'full', // 'full' | 'reduced' | 'off'
  defaultFocusDuration: 25,
  defaultShortBreak: 5,
  defaultLongBreak: 20,
  defaultSprintDuration: 45,
  ultradianFocusDuration: 90,
  ultradianBreakDuration: 20,
  sleepTargetHours: 8,
  wakeTargetTime: '07:15',
  userName: 'Shlok',
  quoteIndex: 0
};

export const DEFAULT_HABITS = [
  {
    id: 'habit-exercise',
    name: 'Zone-2 Exercise & Lift',
    description: '45 minutes aerobic conditioning or strength training',
    icon: 'activity',
    category: 'Fitness',
    group: 'Health',
    target: 45,
    targetType: 'minutes',
    frequency: 'daily',
    color: '#F97316',
    streakPolicy: 'preserve_on_skip',
    reminderTime: '07:30',
    reminderEnabled: true,
    active: true,
    createdAt: '2026-07-01T00:00:00.000Z'
  },
  {
    id: 'habit-reading',
    name: 'Deep Book Reading',
    description: '30 minutes focused reading of non-fiction or literature',
    icon: 'book-open',
    category: 'Learning',
    group: 'Growth',
    target: 30,
    targetType: 'minutes',
    frequency: 'daily',
    color: '#3B82F6',
    streakPolicy: 'preserve_on_skip',
    reminderTime: '22:00',
    reminderEnabled: true,
    active: true,
    createdAt: '2026-07-01T00:00:00.000Z'
  },
  {
    id: 'habit-meditation',
    name: 'Mindfulness Meditation',
    description: '10 minutes breathwork or Vipassana meditation',
    icon: 'sun',
    category: 'Mental',
    group: 'Morning',
    target: 10,
    targetType: 'minutes',
    frequency: 'daily',
    color: '#10B981',
    streakPolicy: 'preserve_on_skip',
    reminderTime: '07:15',
    reminderEnabled: true,
    active: true,
    createdAt: '2026-07-01T00:00:00.000Z'
  },
  {
    id: 'habit-no-sugar',
    name: 'Zero Refined Sugar',
    description: 'No added sugar snacks, sodas, or processed confectionery',
    icon: 'slash',
    category: 'Nutrition',
    group: 'Health',
    target: 1,
    targetType: 'binary',
    frequency: 'daily',
    color: '#EC4899',
    streakPolicy: 'preserve_on_skip',
    reminderTime: '20:00',
    reminderEnabled: false,
    active: true,
    createdAt: '2026-07-01T00:00:00.000Z'
  },
  {
    id: 'habit-coding',
    name: 'Daily Coding Practice',
    description: '60 minutes building algorithms or creative code',
    icon: 'code',
    category: 'Engineering',
    group: 'Deep Work',
    target: 60,
    targetType: 'minutes',
    frequency: 'daily',
    color: '#6366F1',
    streakPolicy: 'preserve_on_skip',
    reminderTime: '10:00',
    reminderEnabled: true,
    active: true,
    createdAt: '2026-07-01T00:00:00.000Z'
  },
  {
    id: 'habit-hydration',
    name: 'Hydration 2.5 Liters',
    description: 'Drink mineralized water and electrolytes throughout the day',
    icon: 'droplet',
    category: 'Health',
    group: 'Morning',
    target: 2500,
    targetType: 'ml',
    frequency: 'daily',
    color: '#06B6D4',
    streakPolicy: 'preserve_on_skip',
    reminderTime: '08:00',
    reminderEnabled: false,
    active: true,
    createdAt: '2026-07-01T00:00:00.000Z'
  },
  {
    id: 'habit-sleep-off',
    name: 'Screens Off at 22:30',
    description: 'Wind down without blue light before bedtime',
    icon: 'moon',
    category: 'Recovery',
    group: 'Evening',
    target: 1,
    targetType: 'binary',
    frequency: 'daily',
    color: '#8B5CF6',
    streakPolicy: 'preserve_on_skip',
    reminderTime: '22:30',
    reminderEnabled: true,
    active: true,
    createdAt: '2026-07-01T00:00:00.000Z'
  }
];

export const MOTIVATIONAL_QUOTES = [
  { quote: "Focus on the work, not the clock.", author: "Productivity Principle" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Simplicity boils down to two steps: Identify the essential. Eliminate the rest.", author: "Leo Babauta" },
  { quote: "Deep work is the ability to focus without distraction on a cognitively demanding task.", author: "Cal Newport" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { quote: "Consistency is what transforms average into excellence.", author: "Anonymous" }
];

class AetherStore {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadState();
  }

  loadState() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.tasks && parsed.categories) {
            const currentYear = new Date().getFullYear();
            const hasEarlySessions = (parsed.focusSessions || []).some(s => s.startTime && s.startTime.startsWith(`${currentYear}-01-`));
            if (!parsed.habits || parsed.habits.length === 0 || !hasEarlySessions) {
              const seed = this.createSeedState();
              if (!parsed.habits || parsed.habits.length === 0) {
                parsed.habits = seed.habits;
                parsed.habitRecords = seed.habitRecords;
              }
              if (!hasEarlySessions) {
                const existingDates = new Set((parsed.focusSessions || []).map(s => s.startTime ? s.startTime.split('T')[0] : ''));
                const missingSessions = seed.focusSessions.filter(s => {
                  const dStr = s.startTime ? s.startTime.split('T')[0] : '';
                  return !existingDates.has(dStr);
                });
                parsed.focusSessions = [...(parsed.focusSessions || []), ...missingSessions];

                const existingTaskDates = new Set((parsed.tasks || []).filter(t => t.completed && t.completedAt).map(t => t.completedAt.split('T')[0]));
                const missingTasks = seed.tasks.filter(t => {
                  if (!t.completed || !t.completedAt) return false;
                  const dStr = t.completedAt.split('T')[0];
                  return !existingTaskDates.has(dStr);
                });
                parsed.tasks = [...(parsed.tasks || []), ...missingTasks];

                const existingHrKeys = new Set((parsed.habitRecords || []).map(r => `${r.habitId}_${r.date}`));
                const missingHrs = seed.habitRecords.filter(r => !existingHrKeys.has(`${r.habitId}_${r.date}`));
                parsed.habitRecords = [...(parsed.habitRecords || []), ...missingHrs];
              }
              this.state = parsed;
              this.saveState();
            }
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse existing state from localStorage:', e);
    }
    return this.createSeedState();
  }

  saveState() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
      this.notify();
    } catch (e) {
      console.error('Failed to persist state to localStorage:', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(eventData = { type: 'STATE_CHANGED' }) {
    for (const listener of this.listeners) {
      try {
        listener(this.state, eventData);
      } catch (err) {
        console.error('Error in store listener:', err);
      }
    }
  }

  getState() {
    return this.state;
  }

  // ------------------------------------------------------------------------
  // Preferences
  // ------------------------------------------------------------------------
  getPreferences() {
    return { ...DEFAULT_PREFERENCES, ...(this.state.preferences || {}) };
  }

  updatePreferences(patch) {
    this.state.preferences = { ...this.getPreferences(), ...patch };
    this.saveState();
  }

  // ------------------------------------------------------------------------
  // Categories
  // ------------------------------------------------------------------------
  getCategories() {
    return this.state.categories || DEFAULT_CATEGORIES;
  }

  getCategoryById(id) {
    return this.getCategories().find(c => c.id === id) || this.getCategories()[0];
  }

  addCategory(category) {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: category.name || 'New Category',
      color: category.color || '#6366F1',
      icon: category.icon || 'folder',
      isCustom: true
    };
    this.state.categories.push(newCat);
    this.saveState();
    return newCat;
  }

  // ------------------------------------------------------------------------
  // Tasks Management
  // ------------------------------------------------------------------------
  getTasks() {
    return this.state.tasks || [];
  }

  getTaskById(id) {
    return this.getTasks().find(t => t.id === id);
  }

  addTask(taskData) {
    const now = new Date().toISOString();
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: taskData.title.trim() || 'Untitled Task',
      description: taskData.description || '',
      categoryId: taskData.categoryId || 'cat-research',
      priority: taskData.priority || 'medium',
      estimatedDuration: Number(taskData.estimatedDuration) || 45,
      scheduledStart: taskData.scheduledStart || null,
      scheduledEnd: taskData.scheduledEnd || null,
      deadline: taskData.deadline || null,
      completed: false,
      completedAt: null,
      subtasks: taskData.subtasks || [],
      tags: taskData.tags || [],
      energyLevel: taskData.energyLevel || 'medium',
      repeatRule: taskData.repeatRule || 'none',
      createdAt: now,
      updatedAt: now
    };
    this.state.tasks.unshift(newTask);
    this.saveState();
    return newTask;
  }

  updateTask(id, patch) {
    const task = this.getTaskById(id);
    if (!task) return null;
    Object.assign(task, patch, { updatedAt: new Date().toISOString() });
    this.saveState();
    return task;
  }

  toggleTaskCompleted(id) {
    const task = this.getTaskById(id);
    if (!task) return null;
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;
    task.updatedAt = new Date().toISOString();

    // If completed, record an implicit focus session if none exists
    if (task.completed) {
      this.recordTaskSession(task.id, task.estimatedDuration, task.estimatedDuration, task.categoryId);
    }
    this.saveState();
    return task;
  }

  deleteTask(id) {
    this.state.tasks = this.state.tasks.filter(t => t.id !== id);
    this.saveState();
  }

  // ------------------------------------------------------------------------
  // Focus Sessions
  // ------------------------------------------------------------------------
  getFocusSessions() {
    return this.state.focusSessions || [];
  }

  recordTaskSession(taskId, plannedMinutes, actualMinutes, categoryId, notes = '') {
    const now = new Date();
    const start = new Date(now.getTime() - actualMinutes * 60000);
    const session = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      taskId: taskId || null,
      mode: 'task',
      plannedDuration: plannedMinutes || actualMinutes,
      actualDuration: actualMinutes,
      startTime: start.toISOString(),
      endTime: now.toISOString(),
      completed: true,
      categoryId: categoryId || 'cat-research',
      notes
    };
    this.state.focusSessions.unshift(session);
    this.saveState();
    return session;
  }

  // ------------------------------------------------------------------------
  // Sleep & Routine Tracking
  // ------------------------------------------------------------------------
  getSleepRecords() {
    return this.state.sleepRecords || [];
  }

  recordSleep(dateStr, sleepTime, wakeTime, quality = 4, notes = '') {
    // Calculate duration
    const [sH, sM] = sleepTime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);
    let diffMinutes = (wH * 60 + wM) - (sH * 60 + sM);
    if (diffMinutes <= 0) {
      diffMinutes += 24 * 60; // crossed midnight
    }

    const existingIndex = this.state.sleepRecords.findIndex(r => r.date === dateStr);
    const record = {
      id: `sleep-${Date.now()}`,
      date: dateStr,
      sleepTime,
      wakeTime,
      durationMinutes: diffMinutes,
      quality,
      notes
    };

    if (existingIndex >= 0) {
      this.state.sleepRecords[existingIndex] = record;
    } else {
      this.state.sleepRecords.unshift(record);
    }
    this.saveState();
    return record;
  }

  getRoutines() {
    return this.state.routines || [];
  }

  getRoutineById(id) {
    return (this.state.routines || []).find(r => r.id === id) || null;
  }

  updateRoutine(routineId, updates) {
    const routine = (this.state.routines || []).find(r => r.id === routineId);
    if (!routine) return null;
    if (updates.title !== undefined) routine.title = updates.title.trim();
    if (updates.scheduledTime !== undefined) routine.scheduledTime = updates.scheduledTime;
    if (Array.isArray(updates.steps)) routine.steps = updates.steps;
    this.saveState();
    return routine;
  }

  addRoutineStep(routineId, text) {
    const routine = (this.state.routines || []).find(r => r.id === routineId);
    if (!routine || !text || !text.trim()) return null;
    const newStep = {
      id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text: text.trim(),
      completed: false
    };
    routine.steps.push(newStep);
    this.saveState();
    return newStep;
  }

  updateRoutineStep(routineId, stepId, text) {
    const routine = (this.state.routines || []).find(r => r.id === routineId);
    if (!routine) return null;
    const step = routine.steps.find(s => s.id === stepId);
    if (!step) return null;
    step.text = text.trim();
    this.saveState();
    return step;
  }

  deleteRoutineStep(routineId, stepId) {
    const routine = (this.state.routines || []).find(r => r.id === routineId);
    if (!routine) return false;
    routine.steps = routine.steps.filter(s => s.id !== stepId);
    this.saveState();
    return true;
  }

  toggleRoutineStep(routineId, stepId, dateStr) {
    const routine = this.state.routines.find(r => r.id === routineId);
    if (!routine) return;
    const step = routine.steps.find(s => s.id === stepId);
    if (!step) return;
    step.completed = !step.completed;
    this.saveState();
  }

  // ------------------------------------------------------------------------
  // Mind Games Records
  // ------------------------------------------------------------------------
  getGameRecords() {
    return this.state.gameRecords || [];
  }

  recordGameScore(gameName, score, durationSeconds) {
    const record = {
      id: `game-${Date.now()}`,
      game: gameName,
      score,
      duration: durationSeconds,
      date: new Date().toISOString()
    };
    this.state.gameRecords.unshift(record);
    this.saveState();
    return record;
  }

  // ------------------------------------------------------------------------
  // Habits Engine & Records
  // ------------------------------------------------------------------------
  getHabits({ includeArchived = false } = {}) {
    const habits = this.state.habits || [];
    if (includeArchived) return habits;
    return habits.filter(h => h.active !== false);
  }

  getHabitById(id) {
    return (this.state.habits || []).find(h => h.id === id);
  }

  addHabit(data) {
    const now = new Date().toISOString();
    const newHabit = {
      id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: data.name ? data.name.trim() : 'New Habit',
      description: data.description || '',
      icon: data.icon || 'activity',
      category: data.category || 'General',
      group: data.group || 'Daily Focus',
      target: Number(data.target) || 1,
      targetType: data.targetType || 'binary',
      frequency: data.frequency || 'daily',
      color: data.color || '#6366F1',
      streakPolicy: data.streakPolicy || 'preserve_on_skip', // 'preserve_on_skip' | 'break_on_skip'
      reminderTime: data.reminderTime || '08:00',
      reminderEnabled: !!data.reminderEnabled,
      active: true,
      createdAt: now,
      updatedAt: now
    };
    this.state.habits.push(newHabit);
    this.saveState();
    return newHabit;
  }

  updateHabit(id, patch) {
    const habit = this.getHabitById(id);
    if (!habit) return null;
    Object.assign(habit, patch, { updatedAt: new Date().toISOString() });
    this.saveState();
    return habit;
  }

  archiveHabit(id) {
    return this.updateHabit(id, { active: false });
  }

  restoreHabit(id) {
    return this.updateHabit(id, { active: true });
  }

  deleteHabit(id) {
    this.state.habits = (this.state.habits || []).filter(h => h.id !== id);
    this.state.habitRecords = (this.state.habitRecords || []).filter(r => r.habitId !== id);
    this.saveState();
  }

  getHabitRecords() {
    return this.state.habitRecords || [];
  }

  getHabitRecord(habitId, dateStr) {
    return (this.state.habitRecords || []).find(r => r.habitId === habitId && r.date === dateStr) || null;
  }

  getHabitStatus(habitId, dateStr) {
    const rec = this.getHabitRecord(habitId, dateStr);
    return rec ? rec.status : 'unlogged';
  }

  setHabitStatus(habitId, dateStr, status, value = null, note = '') {
    this.state.habitRecords = this.state.habitRecords || [];
    const existingIndex = this.state.habitRecords.findIndex(r => r.habitId === habitId && r.date === dateStr);

    if (status === 'unlogged') {
      if (existingIndex >= 0) {
        this.state.habitRecords.splice(existingIndex, 1);
      }
      this.saveState();
      return null;
    }

    const now = new Date().toISOString();
    const record = {
      id: existingIndex >= 0 ? this.state.habitRecords[existingIndex].id : `hr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      habitId,
      date: dateStr,
      status, // 'completed' | 'failed' | 'skipped'
      value,
      note,
      updatedAt: now
    };

    if (existingIndex >= 0) {
      this.state.habitRecords[existingIndex] = record;
    } else {
      this.state.habitRecords.push(record);
    }

    this.saveState();
    return record;
  }

  cycleHabitStatus(habitId, dateStr) {
    const rec = this.getHabitRecord(habitId, dateStr);
    const cur = rec ? rec.status : 'unlogged';

    let next = 'completed';
    if (cur === 'unlogged') next = 'completed';
    else if (cur === 'completed') next = 'failed';
    else if (cur === 'failed') next = 'skipped';
    else if (cur === 'skipped') next = 'unlogged';

    this.setHabitStatus(habitId, dateStr, next);
    return next;
  }

  getHabitStats(habitId, monthStr) {
    const habit = this.getHabitById(habitId);
    const records = (this.state.habitRecords || []).filter(r => r.habitId === habitId);
    const recordMap = new Map(records.map(r => [r.date, r]));

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // 1. Current Streak & Best Streak Calculation
    let currentStreak = 0;
    let checkDate = new Date(today);

    // Check today first
    const todayRec = recordMap.get(todayStr);
    if (todayRec && todayRec.status === 'completed') {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (!todayRec || todayRec.status === 'unlogged') {
      // Pending today: start streak from yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (todayRec.status === 'skipped' && habit && habit.streakPolicy === 'preserve_on_skip') {
      // Preserves streak
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Step backwards day-by-day
    const maxLookback = 365;
    for (let i = 0; i < maxLookback; i++) {
      const dStr = checkDate.toISOString().split('T')[0];
      const rec = recordMap.get(dStr);

      if (rec && rec.status === 'completed') {
        currentStreak++;
      } else if (rec && rec.status === 'skipped' && habit && habit.streakPolicy === 'preserve_on_skip') {
        // Preserves streak without breaking
      } else {
        // Failed or unlogged in the past breaks current streak
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate Longest Streak in history
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedDates = Array.from(recordMap.keys()).sort();

    for (const dStr of sortedDates) {
      const rec = recordMap.get(dStr);
      if (rec.status === 'completed') {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else if (rec.status === 'skipped' && habit && habit.streakPolicy === 'preserve_on_skip') {
        // Preserve
      } else {
        tempStreak = 0;
      }
    }
    if (currentStreak > longestStreak) longestStreak = currentStreak;

    // 2. Monthly Stats for monthStr (e.g. '2026-09')
    const targetMonth = monthStr || todayStr.substring(0, 7);
    const [year, month] = targetMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    let completedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;
    let unloggedCount = 0;

    const dayOfWeekCounts = Array(7).fill(0);

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${targetMonth}-${String(day).padStart(2, '0')}`;
      const rec = recordMap.get(dayStr);
      const dayDate = new Date(`${dayStr}T00:00:00`);
      const dow = dayDate.getDay();

      if (!rec || rec.status === 'unlogged') {
        unloggedCount++;
      } else if (rec.status === 'completed') {
        completedCount++;
        dayOfWeekCounts[dow]++;
      } else if (rec.status === 'failed') {
        failedCount++;
      } else if (rec.status === 'skipped') {
        skippedCount++;
      }
    }

    const totalTracked = completedCount + failedCount;
    const loggedCompletionRate = totalTracked > 0 ? Math.round((completedCount / totalTracked) * 100) : 0;
    const monthlyConsistency = Math.round((completedCount / daysInMonth) * 100);

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      completedCount,
      totalCompleted: completedCount,
      failedCount,
      skippedCount,
      unloggedCount,
      daysInMonth,
      loggedCompletionRate,
      monthlyConsistency,
      dayOfWeekCounts
    };
  }

  getTodayHabitSummary() {
    const habits = this.getHabits();
    const todayStr = new Date().toISOString().split('T')[0];

    let completed = 0;
    let failed = 0;
    let skipped = 0;
    let unlogged = 0;

    for (const h of habits) {
      const rec = this.getHabitRecord(h.id, todayStr);
      if (!rec || rec.status === 'unlogged') unlogged++;
      else if (rec.status === 'completed') completed++;
      else if (rec.status === 'failed') failed++;
      else if (rec.status === 'skipped') skipped++;
    }

    const total = habits.length;
    const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      completed,
      failed,
      skipped,
      unlogged,
      total,
      completionPct,
      completionRate: completionPct
    };
  }

  getDailyHabitCompletionRate(dateStr) {
    const habits = this.getHabits();
    if (habits.length === 0) {
      return { completed: 0, total: 0, rate: 0, pct: 0 };
    }

    let completed = 0;
    for (const h of habits) {
      const rec = this.getHabitRecord(h.id, dateStr);
      if (rec && rec.status === 'completed') completed++;
    }
    const pct = Math.round((completed / habits.length) * 100);
    return {
      completed,
      total: habits.length,
      rate: habits.length > 0 ? (completed / habits.length) : 0,
      pct
    };
  }

  // ------------------------------------------------------------------------
  // Data Import / Export / Reset
  // ------------------------------------------------------------------------
  exportJSON() {
    return JSON.stringify(this.state, null, 2);
  }

  exportCSV() {
    const headers = ['Type', 'ID', 'Title_Or_Metric', 'Category', 'DurationMinutes', 'Date', 'Status'];
    const rows = [headers.join(',')];

    // Export Tasks
    for (const t of this.state.tasks) {
      const cat = this.getCategoryById(t.categoryId).name;
      const cleanTitle = `"${t.title.replace(/"/g, '""')}"`;
      rows.push(['Task', t.id, cleanTitle, cat, t.estimatedDuration, t.scheduledStart || t.createdAt, t.completed ? 'Completed' : 'Pending'].join(','));
    }

    // Export Sessions
    for (const s of this.state.focusSessions) {
      const cat = this.getCategoryById(s.categoryId).name;
      rows.push(['FocusSession', s.id, s.mode, cat, s.actualDuration, s.endTime, s.completed ? 'Completed' : 'Interrupted'].join(','));
    }

    // Export Habits
    for (const h of (this.state.habits || [])) {
      rows.push(['Habit', h.id, `"${h.name.replace(/"/g, '""')}"`, h.category, h.target, h.createdAt, h.active ? 'Active' : 'Archived'].join(','));
    }

    return rows.join('\n');
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.tasks) && Array.isArray(parsed.categories)) {
        this.state = parsed;
        this.saveState();
        return { success: true };
      }
      return { success: false, error: 'Invalid AETHER data format' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  clearAllData() {
    this.state = {
      preferences: { ...DEFAULT_PREFERENCES },
      categories: [...DEFAULT_CATEGORIES],
      tasks: [],
      focusSessions: [],
      sleepRecords: [],
      habits: [],
      habitRecords: [],
      routines: this.createDefaultRoutines(),
      gameRecords: []
    };
    this.saveState();
  }

  restoreDemoData() {
    this.state = this.createSeedState();
    this.saveState();
  }

  // ------------------------------------------------------------------------
  // Seed State Generator (Realistic 60+ Days History)
  // ------------------------------------------------------------------------
  createSeedState() {
    const today = new Date();
    const todayIso = today.toISOString().split('T')[0];

    const tasks = [
      {
        id: 'task-1',
        title: 'Quantum Physics — Linear Algebra Eigenvalues',
        description: 'Spectral decomposition and Dirac notation practice problems.',
        categoryId: 'cat-research',
        priority: 'critical',
        estimatedDuration: 90,
        scheduledStart: `${todayIso}T10:00`,
        scheduledEnd: `${todayIso}T11:30`,
        deadline: `${todayIso}T20:00`,
        completed: false,
        completedAt: null,
        subtasks: [
          { id: 'st-1', title: 'Review Hermitian matrices', completed: true },
          { id: 'st-2', title: 'Derive Pauli spin operators', completed: false },
          { id: 'st-3', title: 'Complete exercise set 4.2', completed: false }
        ],
        tags: ['Physics', 'Quantum', 'Math'],
        energyLevel: 'high',
        repeatRule: 'none',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      },
      {
        id: 'task-2',
        title: 'Edit Architectural Walkthrough Video',
        description: 'Cut pacing, color grade LUTs, and mix binaural audio master.',
        categoryId: 'cat-editing',
        priority: 'high',
        estimatedDuration: 60,
        scheduledStart: `${todayIso}T13:00`,
        scheduledEnd: `${todayIso}T14:00`,
        deadline: `${todayIso}T18:00`,
        completed: false,
        completedAt: null,
        subtasks: [
          { id: 'st-4', title: 'Rough cut assembly', completed: true },
          { id: 'st-5', title: 'Sound design passes', completed: false }
        ],
        tags: ['Video', 'YouTube', 'Design'],
        energyLevel: 'medium',
        repeatRule: 'none',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      },
      {
        id: 'task-3',
        title: 'Read "Structure and Interpretation of Computer Programs"',
        description: 'Chapter 3: Modularity, Objects, and State.',
        categoryId: 'cat-reading',
        priority: 'medium',
        estimatedDuration: 45,
        scheduledStart: `${todayIso}T16:00`,
        scheduledEnd: `${todayIso}T16:45`,
        deadline: null,
        completed: true,
        completedAt: new Date(today.getTime() - 2 * 3600000).toISOString(),
        subtasks: [],
        tags: ['SICP', 'CS', 'Books'],
        energyLevel: 'medium',
        repeatRule: 'daily',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      },
      {
        id: 'task-4',
        title: 'Complete Deep Learning Course Module 7',
        description: 'Transformers, self-attention mechanisms, and positional encoding.',
        categoryId: 'cat-course',
        priority: 'high',
        estimatedDuration: 75,
        scheduledStart: `${todayIso}T18:00`,
        scheduledEnd: `${todayIso}T19:15`,
        deadline: null,
        completed: false,
        completedAt: null,
        subtasks: [
          { id: 'st-6', title: 'Watch lecture 7.1 and 7.2', completed: false },
          { id: 'st-7', title: 'Code multi-head attention block', completed: false }
        ],
        tags: ['AI', 'PyTorch', 'Study'],
        energyLevel: 'high',
        repeatRule: 'none',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      },
      {
        id: 'task-5',
        title: 'Zone-2 Aerobic Run & Mobility Stretch',
        description: '45-minute steady heart-rate conditioning in the park.',
        categoryId: 'cat-exercise',
        priority: 'medium',
        estimatedDuration: 45,
        scheduledStart: `${todayIso}T07:30`,
        scheduledEnd: `${todayIso}T08:15`,
        deadline: null,
        completed: true,
        completedAt: new Date(today.getTime() - 16 * 3600000).toISOString(),
        subtasks: [],
        tags: ['Fitness', 'Cardio'],
        energyLevel: 'medium',
        repeatRule: 'daily',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      },
      {
        id: 'task-6',
        title: 'Inbox Zero & Project Triage',
        description: 'Review research collaborator emails and organize sprint backlog.',
        categoryId: 'cat-admin',
        priority: 'low',
        estimatedDuration: 30,
        scheduledStart: `${todayIso}T09:00`,
        scheduledEnd: `${todayIso}T09:30`,
        deadline: null,
        completed: true,
        completedAt: new Date(today.getTime() - 14 * 3600000).toISOString(),
        subtasks: [],
        tags: ['Admin', 'Email'],
        energyLevel: 'low',
        repeatRule: 'weekdays',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      }
    ];

    // Generate historical focus sessions, completed tasks, sleep records and habits from Jan 1 to today
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const daysSinceJan1 = Math.max(1, Math.floor((today - startOfYear) / 86400000) + 1);

    const focusSessions = [];
    const sleepRecords = [];
    const historicalTasks = [];
    const catPool = ['cat-research', 'cat-study', 'cat-editing', 'cat-reading', 'cat-course', 'cat-content'];
    const taskTitlesPool = [
      'Literature review on neural manifolds',
      'Optimize WebGL fragment shader',
      'Refactor state synchronization loop',
      'Draft publication abstract & figures',
      'Benchmark memory footprint under high concurrency',
      'Conduct user evaluation & protocol trial',
      'Implement audio spatial panning system',
      'Audit accessibility & contrast ratios',
      'Write technical documentation for core pipeline',
      'Sprint retrospective & backlog grooming',
      'Deep work on algorithmic complexity reduction',
      'Design token alignment and CSS variables audit',
      'Profile battery consumption on mobile webkit',
      'Assemble interactive data visualization canvas',
      'Unit testing edge cases in state machine'
    ];

    for (let i = 0; i < daysSinceJan1; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay(); // 0 is Sun, 6 is Sat

      // Sleep record (last 90 days)
      if (i < 90) {
        const bedH = (22 + (i % 3 === 0 ? 1 : 0)).toString().padStart(2, '0');
        const bedM = (30 + (i * 7) % 25).toString().padStart(2, '0');
        const wakeH = '07';
        const wakeM = (10 + (i * 11) % 20).toString().padStart(2, '0');
        const sMins = 7 * 60 + 20 + ((i * 17) % 50);
        sleepRecords.push({
          id: `sleep-seed-${i}`,
          date: dStr,
          sleepTime: `${bedH}:${bedM}`,
          wakeTime: `${wakeH}:${wakeM}`,
          durationMinutes: sMins,
          quality: 4 + (i % 2 === 0 ? 1 : 0),
          notes: i % 7 === 0 ? 'Woke up feeling deeply rested and alert.' : ''
        });
      }

      // Systematic realistic focus sessions
      // Occasional rest day on Sundays
      const isRestDay = dayOfWeek === 0 && (i % 3 === 0);
      const numSessions = isRestDay ? 0 : (dayOfWeek === 0 || dayOfWeek === 6 ? (1 + (i % 2)) : (2 + (i % 4)));

      for (let s = 0; s < numSessions; s++) {
        const catId = catPool[(i + s) % catPool.length];
        const dur = [25, 45, 60, 90][(i + s) % 4];
        const sessTime = new Date(d);
        sessTime.setHours(9 + s * 3, (s * 15) % 60, 0);

        focusSessions.push({
          id: `session-seed-${i}-${s}`,
          taskId: null,
          mode: dur === 25 ? 'pomodoro' : dur === 90 ? 'ultradian' : 'sprint',
          plannedDuration: dur,
          actualDuration: dur - ((i + s) % 5 === 0 ? 5 : 0),
          startTime: sessTime.toISOString(),
          endTime: new Date(sessTime.getTime() + dur * 60000).toISOString(),
          completed: true,
          categoryId: catId,
          notes: ''
        });
      }

      // Historical completed tasks (1-3 completed outcomes on active past days)
      if (i > 0 && !isRestDay) {
        const numTasks = 1 + (i % 4);
        for (let t = 0; t < numTasks; t++) {
          const tTitle = taskTitlesPool[(i * 3 + t) % taskTitlesPool.length];
          const tCat = catPool[(i + t) % catPool.length];
          const tTime = new Date(d);
          tTime.setHours(11 + t * 2, 30, 0);

          historicalTasks.push({
            id: `task-hist-${i}-${t}`,
            title: tTitle,
            description: 'Completed scheduled focus outcome.',
            categoryId: tCat,
            priority: t % 3 === 0 ? 'high' : 'medium',
            estimatedDuration: 45,
            scheduledStart: `${dStr}T10:00`,
            scheduledEnd: `${dStr}T11:00`,
            deadline: null,
            completed: true,
            completedAt: tTime.toISOString(),
            subtasks: [],
            tags: ['DeepWork', 'Milestone'],
            energyLevel: 'high',
            repeatRule: 'none',
            createdAt: d.toISOString(),
            updatedAt: tTime.toISOString()
          });
        }
      }
    }

    // Combine current active tasks with historical completed tasks
    tasks.push(...historicalTasks);

    const routines = this.createDefaultRoutines();

    const gameRecords = [
      { id: 'g-1', game: 'Reaction Test', score: 218, duration: 30, date: todayIso },
      { id: 'g-2', game: 'Memory Grid', score: 8, duration: 65, date: todayIso },
      { id: 'g-3', game: 'Stroop Test', score: 24, duration: 45, date: todayIso }
    ];

    // Generate historical habit records for all days of the year up to today
    const habits = JSON.parse(JSON.stringify(DEFAULT_HABITS));
    const habitRecords = [];

    for (let i = 0; i < daysSinceJan1; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];

      for (let hIdx = 0; hIdx < habits.length; hIdx++) {
        const h = habits[hIdx];
        let status = 'completed';

        if (i === 0) {
          // Today: 4 completed, 2 unlogged, 1 skipped
          if (hIdx === 0 || hIdx === 1 || hIdx === 2 || hIdx === 4) status = 'completed';
          else if (hIdx === 3) status = 'skipped';
          else status = 'unlogged';
        } else {
          // Deterministic realistic pattern
          const seedVal = (i * 17 + hIdx * 23) % 100;
          if (seedVal < 74) status = 'completed';
          else if (seedVal < 86) status = 'skipped';
          else if (seedVal < 95) status = 'failed';
          else status = 'unlogged';
        }

        if (status !== 'unlogged') {
          habitRecords.push({
            id: `hr-seed-${h.id}-${i}`,
            habitId: h.id,
            date: dStr,
            status,
            value: h.target,
            note: '',
            updatedAt: d.toISOString()
          });
        }
      }
    }

    return {
      preferences: { ...DEFAULT_PREFERENCES },
      categories: [...DEFAULT_CATEGORIES],
      tasks,
      focusSessions,
      sleepRecords,
      habits,
      habitRecords,
      routines,
      gameRecords
    };
  }

  createDefaultRoutines() {
    return [
      {
        id: 'rt-morning',
        title: 'Morning Momentum Routine',
        timeOfDay: 'morning',
        scheduledTime: '07:15',
        steps: [
          { id: 'm-1', text: 'Drink 500ml water + electrolytes', completed: true },
          { id: 'm-2', text: '10 minutes mindful breathing or daylight exposure', completed: true },
          { id: 'm-3', text: 'Review top 3 essential outcomes for today', completed: true },
          { id: 'm-4', text: '30-45 minutes movement or conditioning', completed: true }
        ]
      },
      {
        id: 'rt-night',
        title: 'Evening Decompression Protocol',
        timeOfDay: 'night',
        scheduledTime: '22:30',
        steps: [
          { id: 'n-1', text: 'Zero blue light screens 45 min before sleep', completed: false },
          { id: 'n-2', text: 'Brief reflection: What went exceptionally well?', completed: false },
          { id: 'n-3', text: 'Review tomorrow\'s calendar timeline', completed: false },
          { id: 'n-4', text: '20 minutes book reading in bed', completed: false }
        ]
      }
    ];
  }
}

export const store = new AetherStore();
