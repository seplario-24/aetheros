<!-- This file stores the specs, requirements, and the ultimate goal of the project. This is the single source of truth for what is being built and why. Update this file in place when requirements change — keep it current, not a log. -->

# Project Requirements & Specifications: AETHER OS

> **Notice:** This file stores the specs, requirements, and the ultimate goal of the project. This is the single source of truth for what is being built and why. Update this file in place when requirements change — keep it current, not a log.

---

## 1. Executive Summary & Ultimate Goal
**AETHER OS** is a next-generation personal productivity operating system and deep-work command center. 
The ultimate goal is to move far beyond a conventional, flat productivity app with superficial 3D widgets. The entire product is designed as an **immersive 3D Elemental Productivity World** where every card, chart, calendar, habit matrix, timer, and console has physical depth, volumetric lighting, natural materials, and interactive energy.

---

## 2. Core Visual Language: 3D Elemental Design System
The visual language is grounded in **natural elements, physical materials, directional light, and reactive energy**:
- **Materials**: Frosted glass (`backdrop-filter: blur(24px)`), crystalline quartz, dark obsidian/slate, water caustics, polished metal rims, and luminous fire/coral glows.
- **Dimensionality**: Multi-tiered elevation (`z-depth`), inner bevel highlights (`inset 0 1px 1px rgba(255,255,255,...)`), deep atmospheric drop shadows, and 3D gyro perspective tilting on user cursor movement.
- **Lighting & Ambiance**: Volumetric atmospheric radial blobs (`#atmosphere-layer`), hero interactive 3D canvas orb (`#focus-orb-canvas`), and particle bursts on user interactions.
- **Micro-Animations**: Real-time particle blooms on habit check-ins, focus ignition particle bursts, and animated audio equalizer wavebars.
- **High-Contrast Dark Theme**: Deep midnight backgrounds (`#08090D`, `#0B0F19`) paired with crisp high-contrast typography (`#FFFFFF`, `#E2E8F0`, `#94A3B8`) to ensure zero wash-out and perfect legibility across all screens.

---

## 3. Technology Stack & Architectural Principles
1. **Core Logic**: Vanilla JavaScript (ES Modules). Zero heavy frontend frameworks (React/Vue/Angular) to guarantee instantaneous load times and zero dependency bloat.
2. **Styling**: Vanilla CSS divided into modular layers:
   - `css/theme.css`: Core design tokens, dark/light palette, typography (Inter, JetBrains Mono, Plus Jakarta Sans), and fundamental layout.
   - `css/elemental.css`: 3D materials, physical glass layers, lighting, atmospheric blobs, particle styling, and custom 3D consoles.
   - `css/components.css`: Component-level cards, navigation docks, timers, badges, and grids.
3. **Data Storage & State**:
   - `js/store/db.js`: Reactive in-memory state engine backed by browser `LocalStorage`.
   - Full persistence for tasks, categories, focus sessions, sleep logs, habit records, routines, mind game scores, and user preferences.
   - Pre-seeded with 60 days of realistic sample history for immediate visual richness.
4. **Procedural Sound Synthesizer**:
   - `js/audio/ambient.js`: 100% offline procedural Web Audio API audio synthesis. Generates rain/thunder pink noise, 10Hz binaural alpha brainwaves, 55Hz sub-bass cosmic drone, and forest canopy wind with zero external audio assets required.
5. **Curated Music Portal**:
   - `js/audio/music.js`: YouTube Music focus station controller (Lofi Girl, Synthwave, Cosmic Space Ambient, Neo-Classical Piano).
6. **Deployment & Hosting**:
   - Hosted on Vercel (`https://aetheros-nine.vercel.app/`).
   - Repository: `seplario-24/aetheros` on GitHub (`main` branch).
   - `vercel.json` configured as a static site without immutable caching to allow instant deployment updates.

---

## 4. Specification of the 10 Core Views

### 4.1 Command Center (`js/views/home.js`)
- **Spatial Greeting**: Contextual dynamic time-of-day greeting (Morning, Afternoon, Evening, Late Night) with user name (`Shlok`), date, remaining task count, and motivational quote with robust fallback protection.
- **Hero 3D Focus Orb**: Interactive canvas object reacting to productivity intensity and mouse parallax.
- **Volumetric Stat Cards**: Frosted glass metrics for Daily Progress (Crystal), Focus Time (Water), Sleep Duration (Air), and Day Streak (Fire).
- **Target Priority Task**: Physical glass preview of the top urgent outcome with quick start trigger.
- **Quick Action Bar**: Launch Focus, Log Sleep, or Log Habit with a single click.

### 4.2 Tasks & Outcomes (`js/views/tasks.js`)
- **Tactile Task Cards**: Physical depth, status pills, category indicator tags, estimated duration badges.
- **Organized Filtering**: All, Active, Completed, Priority (Critical, High, Medium, Low), Category tabs.
- **Interactive Completion**: Completing a task triggers tactile audio chime and radial particle explosion (`ParticleSystem.taskComplete()`).
- **Modal Add/Edit**: Modal overlay with keyboard shortcuts (`N` for quick add, `Ctrl+K` for search).

### 4.3 Time Calendar (`js/views/calendar.js`)
- **3D Dimensional Timeline**: Elevated day and week timeline grids.
- **Time Cursor**: Glowing real-time current time indicator line spanning across the schedule.
- **Event Blocks**: Glassmorphic scheduled task blocks with color-coded category lighting.

### 4.4 Focus Cockpit (`js/views/focus.js`)
- **Glass Sphere Timer Stage**: Central 330px spherical countdown cockpit with specular lens glints, 64px bold glowing countdown, and dynamic 3D mouse parallax tilt.
- **Orbital Pomodoro Crystals**: 4 tactile beads displaying cycle status (completed emerald glow, active coral fire pulse, pending smoked crystal).
- **Elemental Deep Work Modes**:
  - 💧 Task Flow (Water)
  - 🔥 Pomodoro 25/5 (Fire)
  - ⚡ Sprint 45m (Light)
  - 💎 Ultradian 90m (Crystal)
- **3D Holographic Sound Console**:
  - 5 Tactile Sound Cards: 🔇 Silent Void, 🌧️ Rain & Thunder, 🧠 10Hz Binaural Alpha Waves, 🌌 Cosmic Drone, 🌲 Forest Canopy.
  - Live 4-bar Equalizer Audio Visualizer.
  - 3D Volume Slider (`0%`–`100%`) with quick-mute toggle.
- **3D Target Task Drawer**: Interactive glass drawer for selecting active focus task.
- **Music Station Console**: Quick YouTube Music launcher for curated focus radio.
- **Distraction-Free Zen View**: Fullscreen immersion mode hiding sidebars and headers.

### 4.5 Habit Matrix (`js/views/habits.js`)
- **Crystal Habit Tiles**: Tactile 3D gem cards with category badges and streak counters.
- **7-Day Grid & Weekly Progress**: Interactive daily check-off circles that bloom with particle bursts upon logging.
- **Streak Protection & Analytics**: Visual indicators for completed, skipped, and pending habits.

### 4.6 Year Dot Matrix (`js/views/dot-calendar.js`)
- **365-Day Life Grid**: Full year-in-pixels matrix showing annual progress, productivity intensity, and active days.
- **Tooltips & Hover Elevation**: Interactive day inspection showing focus minutes and completed tasks.

### 4.7 Intelligence & Analytics (`js/views/analytics.js`)
- **Volumetric Metric Displays**: Total focus hours, task completion velocity, streak health, sleep-focus correlation.
- **SVG Trend Visualizations**: Clean 3D bar and line charts comparing planned vs. actual deep work.

### 4.8 Sleep & Protocol (`js/views/sleep.js`)
- **Lunar Air Theme**: Moon phase indicators, floating 3D moon orb with celestial lighting, bedtime vs. wake-up time calculation, 7-day volumetric duration chart vs. target.
- **Morning Momentum & Evening Decompression Protocols**: Fully interactive, customizable protocols:
  - Editable protocol title (e.g. Morning Momentum Protocol, Evening Decompression / Compression Protocol) and scheduled window.
  - Dynamic action steps (add new steps, edit step text in place, delete steps with tactile controls).
  - Step completion checkboxes with audio feedback and persistent state storage in `AetherStore`.
  - 3D Elemental Glassmorphic Protocol Editor modal (`#routine-editor-modal`) with smooth entry/exit animations.

### 4.9 Mind Games (`js/views/games.js`)
- **Cognitive Reset Suite**: 3 tactile cognitive micro-games:
  - Reaction Test: Millisecond visual reflex measurement.
  - Memory Grid: Spatial recall pattern matrix.
  - Stroop Effect: Cognitive flexibility and response inhibition test.
- **Score Persistence**: Best score and recent attempt logging.

### 4.10 Settings (`js/views/settings.js`)
- **3D Environment Controls**: Toggle 3D effects intensity (Full 3D World, Reduced Motion, Minimal).
- **Appearance & Presets**: Dark / Light theme toggle, custom timer duration overrides, audio volume defaults.

---

## 5. Non-Negotiable Quality Standards
1. **Never Revert to Flat UI**: All components must retain depth, specular reflections, and physical materials.
2. **Universal High Contrast**: All text must be clearly legible against dark backgrounds. Never use unstyled native select or input elements that can render light text on light backgrounds.
3. **Robust Error Boundaries**: Views must be wrapped in error boundaries so that unexpected data errors never create a blank screen.
4. **Resilient Bootstrap**: Module bootstrapping must account for fast-loading DOM states (`document.readyState !== 'loading'`).
5. **High Refresh Rate & High FPS (144Hz+)**:
   - Canvas animation loops must use delta-time based exponential smoothing (`1 - Math.exp(-k * dt)`) rather than frame-locked multipliers, ensuring silky-smooth responsiveness on 144Hz, 165Hz, and 240Hz ProMotion displays.
   - Zero per-frame allocations or regex operations inside `requestAnimationFrame` loops to prevent garbage collection frame drops.
   - Hardware compositor layer promotion (`will-change: transform`, `transform: translate3d(...)`) across all animated cards, blobs, particles, and floating objects.
   - Genuine 3D spatial fidelity: true surface normals, backface culling, specular highlights, and directional lighting on 3D geometric entities.
