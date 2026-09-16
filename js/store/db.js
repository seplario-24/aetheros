/**
 * AETHER OS — MULTI-USER ISOLATED REACTIVE STORE & DATABASE ENGINE
 * Strict tenant isolation per authenticated user ID (Section 133-138).
 * Clean state initialization for newly registered users (Section 139).
 * Isolated demo workspace for testing without data pollution (Section 161).
 */

import { auth } from '../auth/auth.js';

export const TEMPLATE_CATEGORIES = {
  student: [
    { id: 'cat-study', name: 'Study & Coursework', color: '#6366F1', icon: 'book-open', isCustom: false },
    { id: 'cat-research', name: 'Research & Papers', color: '#06B6D4', icon: 'atom', isCustom: false },
    { id: 'cat-reading', name: 'Academic Reading', color: '#3B82F6', icon: 'bookmark', isCustom: false },
    { id: 'cat-course', name: 'Online Courses', color: '#10B981', icon: 'graduation-cap', isCustom: false }
  ],
  creator: [
    { id: 'cat-content', name: 'Content Production', color: '#EC4899', icon: 'pen-tool', isCustom: false },
    { id: 'cat-editing', name: 'Audio/Video Editing', color: '#8B5CF6', icon: 'video', isCustom: false },
    { id: 'cat-research', name: 'Idea Research', color: '#06B6D4', icon: 'atom', isCustom: false },
    { id: 'cat-design', name: 'Visual Design', color: '#F97316', icon: 'layers', isCustom: false }
  ],
  developer: [
    { id: 'cat-coding', name: 'Software Engineering', color: '#6366F1', icon: 'code', isCustom: false },
    { id: 'cat-architecture', name: 'System Architecture', color: '#06B6D4', icon: 'cpu', isCustom: false },
    { id: 'cat-debugging', name: 'Code Review & QA', color: '#EF4444', icon: 'check-square', isCustom: false },
    { id: 'cat-learning', name: 'Tech Upskilling', color: '#10B981', icon: 'terminal', isCustom: false }
  ]
};

export const DEFAULT_CATEGORIES = [
  { id: 'cat-deepwork', name: 'Deep Work', color: '#6366F1', icon: 'zap', isCustom: false },
  { id: 'cat-research', name: 'Research', color: '#06B6D4', icon: 'atom', isCustom: false },
  { id: 'cat-personal', name: 'Personal', color: '#10B981', icon: 'user', isCustom: false },
  { id: 'cat-admin', name: 'Admin', color: '#64748B', icon: 'check-square', isCustom: false }
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
  userName: 'Pilot',
  quoteIndex: 0
};

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
    this.currentUserId = null;
    this.state = null;

    // Connect to authentication lifecycle
    const user = auth.getUser();
    this.handleUserChange(user);

    auth.subscribe((newUser) => {
      this.handleUserChange(newUser);
    });
  }

  handleUserChange(user) {
    if (user && user.id) {
      this.currentUserId = user.id;
      this.state = this.loadUserState(user);
    } else {
      this.currentUserId = null;
      this.state = this.createEmptyCleanState('anonymous');
    }
    this.notify({ type: 'USER_CHANGED', userId: this.currentUserId });
  }

  getUserStorageKey(uid) {
    return `AETHER_USER_${uid}_STORE_V2`;
  }

  loadUserState(user) {
    const isDemo = user.email === 'demo@aetheros.world' || user.googleProviderId === 'demo_guest_user_99999';
    const storageKey = this.getUserStorageKey(user.id);

    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.tasks)) {
            // Ensure userId on all loaded arrays
            parsed.userId = user.id;
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('[AetherStore] Failed to parse existing user state:', e);
    }

    // If demo user and empty, seed demo data
    if (isDemo) {
      const demoState = this.createDemoSeedState(user.id);
      this.saveStateDirect(storageKey, demoState);
      return demoState;
    }

    // REAL USERS START WITH 100% CLEAN PERSONAL WORKSPACE (Section 139)
    const cleanState = this.createEmptyCleanState(user.id, user.displayName);
    this.saveStateDirect(storageKey, cleanState);
    return cleanState;
  }

  saveState() {
    if (!this.currentUserId) return;
    const storageKey = this.getUserStorageKey(this.currentUserId);
    this.saveStateDirect(storageKey, this.state);
    this.notify({ type: 'STATE_CHANGED', userId: this.currentUserId });
  }

  saveStateDirect(key, stateObj) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(stateObj));
      }
    } catch (e) {
      console.error('[AetherStore] Failed to persist state:', e);
    }
  }

  createEmptyCleanState(userId, userName = 'Pilot') {
    return {
      userId,
      preferences: {
        ...DEFAULT_PREFERENCES,
        userName
      },
      categories: [],
      tasks: [],
      focusSessions: [],
      sleepRecords: [],
      habits: [],
      habitRecords: [],
      routines: [],
      gameRecords: []
    };
  }

  /**
   * Initialize a newly onboarded user's personal environment (Section 141-145)
   */
  initOnboardingWorkspace({ categories = [], habits = [], routines = [], firstTask = null }) {
    if (!this.state) return;

    this.state.categories = categories.map(c => ({
      ...c,
      userId: this.currentUserId
    }));

    this.state.habits = habits.map(h => ({
      ...h,
      userId: this.currentUserId,
      createdAt: new Date().toISOString()
    }));

    this.state.routines = routines.map(r => ({
      ...r,
      userId: this.currentUserId
    }));

    if (firstTask && firstTask.title) {
      this.addTask(firstTask);
    }

    this.saveState();
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
    return { ...DEFAULT_PREFERENCES, ...(this.state?.preferences || {}) };
  }

  updatePreferences(patch) {
    if (!this.state) return;
    this.state.preferences = { ...this.getPreferences(), ...patch };
    this.saveState();
  }

  // ------------------------------------------------------------------------
  // Categories (User Owned, Section 142)
  // ------------------------------------------------------------------------
  getCategories() {
    return this.state?.categories || [];
  }

  getCategoryById(id) {
    return this.getCategories().find(c => c.id === id) || this.getCategories()[0] || {
      id: 'cat-default',
      name: 'General',
      color: '#6366F1',
      icon: 'zap'
    };
  }

  addCategory(category) {
    if (!this.state) return null;
    const newCat = {
      id: `cat-${Date.now()}`,
      userId: this.currentUserId,
      name: category.name || 'New Category',
      color: category.color || '#6366F1',
      icon: category.icon || 'folder',
      isCustom: true
    };
    this.state.categories.push(newCat);
    this.saveState();
    return newCat;
  }

  deleteCategory(id) {
    if (!this.state) return;
    this.state.categories = (this.state.categories || []).filter(c => c.id !== id);
    this.saveState();
  }

  // ------------------------------------------------------------------------
  // Tasks Management (Strictly Isolated by userId, Section 137)
  // ------------------------------------------------------------------------
  getTasks() {
    return this.state?.tasks || [];
  }

  getTaskById(id) {
    return this.getTasks().find(t => t.id === id);
  }

  addTask(taskData) {
    if (!this.state) return null;
    const now = new Date().toISOString();
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: this.currentUserId,
      title: (taskData.title || '').trim() || 'Untitled Task',
      description: taskData.description || '',
      categoryId: taskData.categoryId || (this.getCategories()[0]?.id || 'cat-deepwork'),
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

    if (task.completed) {
      this.recordTaskSession(task.id, task.estimatedDuration, task.estimatedDuration, task.categoryId);
    }
    this.saveState();
    return task;
  }

  deleteTask(id) {
    if (!this.state) return;
    this.state.tasks = (this.state.tasks || []).filter(t => t.id !== id);
    this.saveState();
  }

  // ------------------------------------------------------------------------
  // Focus Sessions
  // ------------------------------------------------------------------------
  getFocusSessions() {
    return this.state?.focusSessions || [];
  }

  recordTaskSession(taskId, plannedMinutes, actualMinutes, categoryId, notes = '') {
    if (!this.state) return null;
    const now = new Date();
    const start = new Date(now.getTime() - actualMinutes * 60000);
    const session = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: this.currentUserId,
      taskId: taskId || null,
      mode: 'task',
      plannedDuration: plannedMinutes || actualMinutes,
      actualDuration: actualMinutes,
      startTime: start.toISOString(),
      endTime: now.toISOString(),
      completed: true,
      categoryId: categoryId || (this.getCategories()[0]?.id || 'cat-deepwork'),
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
    return this.state?.sleepRecords || [];
  }

  recordSleep(dateStr, sleepTime, wakeTime, quality = 4, notes = '') {
    if (!this.state) return null;
    const [sH, sM] = sleepTime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);
    let diffMinutes = (wH * 60 + wM) - (sH * 60 + sM);
    if (diffMinutes <= 0) {
      diffMinutes += 24 * 60;
    }

    const existingIndex = this.state.sleepRecords.findIndex(r => r.date === dateStr);
    const record = {
      id: `sleep-${Date.now()}`,
      userId: this.currentUserId,
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
    return this.state?.routines || [];
  }

  addRoutine(routine) {
    if (!this.state) return null;
    const newRoutine = {
      id: `rt-${Date.now()}`,
      userId: this.currentUserId,
      title: routine.title || 'My Routine',
      timeOfDay: routine.timeOfDay || 'morning',
      scheduledTime: routine.scheduledTime || '07:00',
      steps: routine.steps || []
    };
    this.state.routines.push(newRoutine);
    this.saveState();
    return newRoutine;
  }

  toggleRoutineStep(routineId, stepId, dateStr) {
    const routine = (this.state?.routines || []).find(r => r.id === routineId);
    if (!routine || !routine.steps) return;
    const step = routine.steps.find(s => s.id === stepId);
    if (!step) return;
    step.completed = !step.completed;
    this.saveState();
  }

  // ------------------------------------------------------------------------
  // Mind Games Records
  // ------------------------------------------------------------------------
  getGameRecords() {
    return this.state?.gameRecords || [];
  }

  recordGameScore(gameName, score, durationSeconds) {
    if (!this.state) return null;
    const record = {
      id: `game-${Date.now()}`,
      userId: this.currentUserId,
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
    const habits = this.state?.habits || [];
    if (includeArchived) return habits;
    return habits.filter(h => h.active !== false);
  }

  getHabitById(id) {
    return (this.state?.habits || []).find(h => h.id === id);
  }

  addHabit(data) {
    if (!this.state) return null;
    const now = new Date().toISOString();
    const newHabit = {
      id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: this.currentUserId,
      name: data.name ? data.name.trim() : 'New Habit',
      description: data.description || '',
      icon: data.icon || 'activity',
      category: data.category || 'General',
      group: data.group || 'Daily Focus',
      target: Number(data.target) || 1,
      targetType: data.targetType || 'binary',
      frequency: data.frequency || 'daily',
      color: data.color || '#6366F1',
      streakPolicy: data.streakPolicy || 'preserve_on_skip',
      reminderTime: data.reminderTime || '08:00',
      reminderEnabled: Boolean(data.reminderEnabled),
      active: true,
      createdAt: now
    };
    this.state.habits.push(newHabit);
    this.saveState();
    return newHabit;
  }

  updateHabit(id, patch) {
    const habit = this.getHabitById(id);
    if (!habit) return null;
    Object.assign(habit, patch);
    this.saveState();
    return habit;
  }

  deleteHabit(id) {
    if (!this.state) return;
    this.state.habits = (this.state.habits || []).filter(h => h.id !== id);
    this.state.habitRecords = (this.state.habitRecords || []).filter(r => r.habitId !== id);
    this.saveState();
  }

  getHabitRecord(habitId, dateStr) {
    return (this.state?.habitRecords || []).find(
      r => r.habitId === habitId && r.date === dateStr
    );
  }

  logHabitRecord(habitId, dateStr, status, value = null, note = '') {
    if (!this.state) return null;
    const existingIndex = (this.state.habitRecords || []).findIndex(
      r => r.habitId === habitId && r.date === dateStr
    );

    const record = {
      id: existingIndex >= 0 ? this.state.habitRecords[existingIndex].id : `hr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: this.currentUserId,
      habitId,
      date: dateStr,
      status, // 'completed' | 'skipped' | 'failed' | 'unlogged'
      value: value !== null ? Number(value) : null,
      note,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      this.state.habitRecords[existingIndex] = record;
    } else {
      this.state.habitRecords.push(record);
    }

    this.saveState();
    return record;
  }

  getHabitStreak(habitId) {
    const records = (this.state?.habitRecords || []).filter(r => r.habitId === habitId);
    if (records.length === 0) return { currentStreak: 0, bestStreak: 0, totalCompletions: 0 };

    let totalCompletions = 0;
    records.forEach(r => {
      if (r.status === 'completed') totalCompletions++;
    });

    // Check consecutive days starting today
    const now = new Date();
    let currentStreak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const rec = records.find(r => r.date === dStr);
      if (rec && rec.status === 'completed') {
        currentStreak++;
      } else if (i === 0 && (!rec || rec.status === 'unlogged')) {
        // Today unlogged yet, check yesterday
        continue;
      } else if (rec && rec.status === 'skipped') {
        // Skip preserves streak
        continue;
      } else {
        break;
      }
    }

    return {
      currentStreak,
      bestStreak: Math.max(currentStreak, Math.min(totalCompletions, 14)),
      totalCompletions
    };
  }

  // ------------------------------------------------------------------------
  // Data Export & Deletion (Section 159 & 160)
  // ------------------------------------------------------------------------
  exportUserData() {
    if (!this.state) return;
    const dataStr = JSON.stringify(this.state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aether-os-data-${this.currentUserId}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  deleteUserData() {
    if (!this.currentUserId) return;
    const key = this.getUserStorageKey(this.currentUserId);
    try {
      localStorage.removeItem(key);
    } catch (e) {}
    this.state = this.createEmptyCleanState(this.currentUserId);
    this.notify();
  }

  // ------------------------------------------------------------------------
  // Demo Workspace Seeder (Section 161 - Strictly for Demo Mode)
  // ------------------------------------------------------------------------
  createDemoSeedState(userId) {
    const today = new Date();
    const categories = [
      { id: 'cat-study', name: 'Study & Research', color: '#6366F1', icon: 'book-open', isCustom: false },
      { id: 'cat-coding', name: 'Software Development', color: '#06B6D4', icon: 'code', isCustom: false },
      { id: 'cat-content', name: 'Creative Writing', color: '#EC4899', icon: 'pen-tool', isCustom: false }
    ];

    const tasks = [
      {
        id: 'demo-task-1',
        userId,
        title: 'Review Machine Learning Paper Notes',
        description: 'Deep dive into transformer architecture fundamentals',
        categoryId: 'cat-study',
        priority: 'high',
        estimatedDuration: 45,
        completed: false,
        completedAt: null,
        createdAt: today.toISOString()
      },
      {
        id: 'demo-task-2',
        userId,
        title: 'Implement WebGPU Shader Pipeline',
        description: 'Optimize real-time atmospheric particle simulation',
        categoryId: 'cat-coding',
        priority: 'medium',
        estimatedDuration: 60,
        completed: false,
        completedAt: null,
        createdAt: today.toISOString()
      }
    ];

    const habits = [
      {
        id: 'demo-habit-1',
        userId,
        name: 'Deep Reading',
        description: '30 minutes literature or science reading',
        category: 'Learning',
        target: 30,
        targetType: 'minutes',
        frequency: 'daily',
        color: '#3B82F6',
        active: true,
        createdAt: today.toISOString()
      },
      {
        id: 'demo-habit-2',
        userId,
        name: 'Aerobic Exercise',
        description: '30 minutes high intensity workout',
        category: 'Health',
        target: 30,
        targetType: 'minutes',
        frequency: 'daily',
        color: '#F97316',
        active: true,
        createdAt: today.toISOString()
      }
    ];

    const habitRecords = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      habitRecords.push({
        id: `demo-hr-${i}`,
        userId,
        habitId: 'demo-habit-1',
        date: dStr,
        status: i % 4 === 0 ? 'skipped' : 'completed',
        value: 30
      });
    }

    const routines = [
      {
        id: 'rt-demo-morning',
        userId,
        title: 'Morning Flow Protocol',
        timeOfDay: 'morning',
        scheduledTime: '07:30',
        steps: [
          { id: 's-1', text: 'Hydration: 500ml water', completed: true },
          { id: 's-2', text: 'Daylight exposure & breathwork', completed: true },
          { id: 's-3', text: 'Review top daily outcomes', completed: false }
        ]
      }
    ];

    return {
      userId,
      preferences: {
        ...DEFAULT_PREFERENCES,
        userName: 'Demo Guest'
      },
      categories,
      tasks,
      focusSessions: [],
      sleepRecords: [],
      habits,
      habitRecords,
      routines,
      gameRecords: []
    };
  }
}

export const store = new AetherStore();
