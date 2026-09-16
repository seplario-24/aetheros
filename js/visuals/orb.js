/**
 * AETHER OS — HERO 3D PRODUCTIVITY ORB
 * Signature organic translucent 3D celestial sphere with soft internal illumination,
 * fluid orbital rings, subtle stardust particles, and time/productivity responsiveness.
 *
 * Adheres to the Refreshing, Calm, Premium, Human Visual Direction (Section 105).
 */

import { timerEngine } from '../engine/timer.js';
import { store } from '../store/db.js';

export class FocusOrb {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;

    this.particles = [];
    this.numParticles = 48;

    this.rotX = 0.3;
    this.rotY = 0.4;
    this.rotZ = 0.15;

    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.currentMouseX = 0;
    this.currentMouseY = 0;

    this.animId = null;
    this.lastTime = performance.now();

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.seedParticles();
    this.render();
  }

  seedParticles() {
    this.particles = [];
    const prefs = store.getPreferences();
    const count = prefs.effects3D === 'reduced' ? 18 : this.numParticles;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 100 + Math.random() * 90;

      this.particles.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        size: 1.2 + Math.random() * 2.2,
        opacity: 0.25 + Math.random() * 0.55,
        speed: 0.2 + Math.random() * 0.4
      });
    }
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  onMouseMove(e) {
    this.targetMouseX = (e.clientX - this.width / 2) / (this.width / 2);
    this.targetMouseY = (e.clientY - this.height / 2) / (this.height / 2);
  }

  render() {
    const prefs = store.getPreferences();
    const effects3D = prefs.effects3D || 'full';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // If 3D is disabled, clear canvas and stop rendering loop
    if (effects3D === 'off' || prefersReducedMotion) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.animId = requestAnimationFrame(() => this.render());
      return;
    }

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    // Smooth mouse parallax
    this.currentMouseX += (this.targetMouseX - this.currentMouseX) * 0.04;
    this.currentMouseY += (this.targetMouseY - this.currentMouseY) * 0.04;

    // Rotation tempo based on focus state
    const timerSnap = timerEngine.getSnapshot();
    const isFocusRunning = timerSnap.isRunning;
    const speedMult = isFocusRunning ? 1.3 : (effects3D === 'reduced' ? 0.5 : 0.75);

    this.rotX += dt * 0.14 * speedMult;
    this.rotY += dt * 0.18 * speedMult;
    this.rotZ += dt * 0.08 * speedMult;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Responsive spatial anchor
    const centerX = this.width > 900 ? this.width * 0.72 : this.width * 0.5;
    const centerY = this.width > 900 ? this.height * 0.38 : this.height * 0.32;

    // Breathing pulse
    const breathPeriod = isFocusRunning ? 0.0025 : 0.0012;
    const breath = 1 + Math.sin(now * breathPeriod) * 0.04;
    const baseRadius = (this.width > 900 ? 150 : 100) * breath;

    // Time-of-day chromatic mood
    const hour = new Date().getHours();
    let themeColors;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    if (hour >= 5 && hour < 12) {
      // Morning: warm sunlit cream, honey, and pale peach
      themeColors = {
        coreGlow: isDark ? 'rgba(251, 191, 36, 0.18)' : 'rgba(251, 191, 36, 0.15)',
        haloOuter: isDark ? 'rgba(251, 146, 60, 0.08)' : 'rgba(251, 146, 60, 0.06)',
        ringA: isDark ? 'rgba(251, 191, 36, 0.38)' : 'rgba(251, 191, 36, 0.45)',
        ringB: isDark ? 'rgba(251, 146, 60, 0.32)' : 'rgba(251, 146, 60, 0.4)',
        stardust: isDark ? 'rgba(253, 230, 138, 0.7)' : 'rgba(217, 119, 6, 0.6)'
      };
    } else if (hour >= 12 && hour < 18) {
      // Afternoon: crisp pale sky, soft azure, and fresh mint
      themeColors = {
        coreGlow: isDark ? 'rgba(56, 189, 248, 0.18)' : 'rgba(56, 189, 248, 0.15)',
        haloOuter: isDark ? 'rgba(52, 211, 153, 0.08)' : 'rgba(52, 211, 153, 0.06)',
        ringA: isDark ? 'rgba(56, 189, 248, 0.38)' : 'rgba(56, 189, 248, 0.45)',
        ringB: isDark ? 'rgba(52, 211, 153, 0.32)' : 'rgba(52, 211, 153, 0.4)',
        stardust: isDark ? 'rgba(186, 230, 253, 0.7)' : 'rgba(14, 165, 233, 0.6)'
      };
    } else if (hour >= 18 && hour < 22) {
      // Evening: soothing twilight lavender and soft coral rose
      themeColors = {
        coreGlow: isDark ? 'rgba(167, 139, 250, 0.2)' : 'rgba(167, 139, 250, 0.16)',
        haloOuter: isDark ? 'rgba(251, 113, 133, 0.08)' : 'rgba(251, 113, 133, 0.06)',
        ringA: isDark ? 'rgba(167, 139, 250, 0.4)' : 'rgba(139, 92, 246, 0.45)',
        ringB: isDark ? 'rgba(251, 113, 133, 0.32)' : 'rgba(251, 113, 133, 0.4)',
        stardust: isDark ? 'rgba(233, 213, 255, 0.7)' : 'rgba(147, 51, 234, 0.6)'
      };
    } else {
      // Night: quiet deep graphite & starlit velvet violet
      themeColors = {
        coreGlow: 'rgba(139, 92, 246, 0.14)',
        haloOuter: 'rgba(56, 189, 248, 0.05)',
        ringA: 'rgba(139, 92, 246, 0.3)',
        ringB: 'rgba(96, 165, 250, 0.25)',
        stardust: 'rgba(224, 231, 255, 0.6)'
      };
    }

    // Productivity Bloom Effect: calculate completion rate today
    const habitSummary = store.getTodayHabitSummary();
    const tasks = store.getTasks();
    const completedTasks = tasks.filter(t => t.completed).length;
    const progressFactor = Math.min(1, (completedTasks * 0.1) + ((habitSummary.completionRate || 0) * 0.005));

    // Projection constants
    const fov = 420;
    const project = (x, y, z) => {
      let y1 = y * Math.cos(this.rotX + this.currentMouseY * 0.35) - z * Math.sin(this.rotX + this.currentMouseY * 0.35);
      let z1 = y * Math.sin(this.rotX + this.currentMouseY * 0.35) + z * Math.cos(this.rotX + this.currentMouseY * 0.35);

      let x2 = x * Math.cos(this.rotY + this.currentMouseX * 0.35) + z1 * Math.sin(this.rotY + this.currentMouseX * 0.35);
      let z2 = -x * Math.sin(this.rotY + this.currentMouseX * 0.35) + z1 * Math.cos(this.rotY + this.currentMouseX * 0.35);

      const scale = fov / (fov + z2 + 320);
      return {
        x: centerX + x2 * scale,
        y: centerY + y1 * scale,
        scale,
        z: z2
      };
    };

    // 1. Soft Translucent Inner Core (Atmospheric sphere)
    const coreRadius = baseRadius * (0.8 + progressFactor * 0.15);
    const auraGrad = this.ctx.createRadialGradient(
      centerX - 15 * this.currentMouseX,
      centerY - 15 * this.currentMouseY,
      0,
      centerX,
      centerY,
      coreRadius * 1.6
    );
    auraGrad.addColorStop(0, themeColors.coreGlow);
    auraGrad.addColorStop(0.5, themeColors.haloOuter);
    auraGrad.addColorStop(1, 'transparent');

    this.ctx.fillStyle = auraGrad;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, coreRadius * 1.6, 0, Math.PI * 2);
    this.ctx.fill();

    // 2. Smooth Floating Refraction Rings (Smooth circular orbits)
    const rings = [
      { radius: baseRadius * 1.05, segments: 64, color: themeColors.ringA, axis: 'xy', width: 1.5 },
      { radius: baseRadius * 0.88, segments: 64, color: themeColors.ringB, axis: 'yz', width: 1.2 },
      { radius: baseRadius * 0.65, segments: 64, color: themeColors.coreGlow, axis: 'xz', width: 1.0 }
    ];

    for (const ring of rings) {
      this.ctx.strokeStyle = ring.color;
      this.ctx.lineWidth = ring.width;
      this.ctx.beginPath();

      for (let i = 0; i <= ring.segments; i++) {
        const theta = (i / ring.segments) * Math.PI * 2;
        let px = 0, py = 0, pz = 0;

        if (ring.axis === 'xy') {
          px = Math.cos(theta) * ring.radius;
          py = Math.sin(theta) * ring.radius;
        } else if (ring.axis === 'yz') {
          py = Math.cos(theta) * ring.radius;
          pz = Math.sin(theta) * ring.radius;
        } else {
          px = Math.cos(theta) * ring.radius;
          pz = Math.sin(theta) * ring.radius;
        }

        const proj = project(px, py, pz);
        if (i === 0) this.ctx.moveTo(proj.x, proj.y);
        else this.ctx.lineTo(proj.x, proj.y);
      }
      this.ctx.stroke();
    }

    // 3. Fluid Stardust Particles (Slowly drifting points of light)
    for (const p of this.particles) {
      const proj = project(p.x, p.y, p.z);
      if (proj.scale > 0) {
        this.ctx.fillStyle = themeColors.stardust;
        this.ctx.globalAlpha = p.opacity * proj.scale;
        this.ctx.beginPath();
        this.ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
      }
    }

    this.animId = requestAnimationFrame(() => this.render());
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
  }
}
