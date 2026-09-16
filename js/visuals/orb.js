/**
 * AETHER OS — HERO 3D PRODUCTIVITY ORB
 * Full elemental world signature object:
 * - Crystal inner geometry with faceted structure
 * - Fluid orbital rings with elemental color states
 * - Internal particle system reactive to productivity
 * - Time-of-day elemental atmosphere
 * - Focus mode deep-work state activation
 * - Mouse parallax with 3D depth response
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
    this.numParticles = 56;

    this.rotX = 0.3;
    this.rotY = 0.4;
    this.rotZ = 0.12;

    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.currentMouseX = 0;
    this.currentMouseY = 0;

    this.animId = null;
    this.lastTime = performance.now();
    this.t = 0; // global time accumulator

    // Crystal geometry
    this.crystalFaces = [];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.seedParticles();
    this.buildCrystalGeometry();
    this.render();
  }

  buildCrystalGeometry() {
    // Inner crystal — icosahedron-like structure with 8 faces
    const r = 60;
    this.crystalFaces = [
      // Upper cap
      [[0, -r, 0], [r * 0.7, -r * 0.3, r * 0.4], [-r * 0.7, -r * 0.3, r * 0.4]],
      [[0, -r, 0], [r * 0.7, -r * 0.3, -r * 0.4], [r * 0.7, -r * 0.3, r * 0.4]],
      [[0, -r, 0], [-r * 0.7, -r * 0.3, -r * 0.4], [r * 0.7, -r * 0.3, -r * 0.4]],
      [[0, -r, 0], [-r * 0.7, -r * 0.3, r * 0.4], [-r * 0.7, -r * 0.3, -r * 0.4]],
      // Lower cap
      [[0, r, 0], [r * 0.7, r * 0.3, r * 0.4], [-r * 0.7, r * 0.3, r * 0.4]],
      [[0, r, 0], [r * 0.7, r * 0.3, -r * 0.4], [r * 0.7, r * 0.3, r * 0.4]],
      [[0, r, 0], [-r * 0.7, r * 0.3, -r * 0.4], [r * 0.7, r * 0.3, -r * 0.4]],
      [[0, r, 0], [-r * 0.7, r * 0.3, r * 0.4], [-r * 0.7, r * 0.3, -r * 0.4]],
    ];
  }

  seedParticles() {
    this.particles = [];
    const prefs = store.getPreferences();
    const count = prefs.effects3D === 'reduced' ? 22 : this.numParticles;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 90 + Math.random() * 110;

      this.particles.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        size: 1.0 + Math.random() * 2.5,
        opacity: 0.2 + Math.random() * 0.6,
        speed: 0.15 + Math.random() * 0.45,
        phaseOffset: Math.random() * Math.PI * 2,
        colorIndex: Math.floor(Math.random() * 3) // picks one of 3 element colors
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

  getElementalPalette(hour, isDark, progressFactor, isFocusRunning) {
    // Base elemental atmosphere by time of day
    let base;
    if (hour >= 5 && hour < 12) {
      // MORNING — Light/Fire: gold, peach, warm amber
      base = {
        coreGlow:  isDark ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.18)',
        haloOuter: isDark ? 'rgba(249, 115, 22, 0.1)'  : 'rgba(249, 115, 22, 0.07)',
        ringA:     isDark ? 'rgba(245, 158, 11, 0.42)' : 'rgba(245, 158, 11, 0.5)',
        ringB:     isDark ? 'rgba(249, 115, 22, 0.32)' : 'rgba(249, 115, 22, 0.42)',
        ringC:     isDark ? 'rgba(251, 191, 36, 0.22)' : 'rgba(251, 191, 36, 0.3)',
        crystal:   isDark ? 'rgba(252, 211, 77, 0.6)'  : 'rgba(217, 119, 6, 0.55)',
        particle:  ['rgba(252,211,77,0.8)', 'rgba(251,146,60,0.7)', 'rgba(245,158,11,0.75)'],
        coreFill:  isDark ? 'rgba(245,158,11,0.08)'    : 'rgba(245,158,11,0.05)'
      };
    } else if (hour >= 12 && hour < 18) {
      // AFTERNOON — Water/Earth: cyan, turquoise, mint
      base = {
        coreGlow:  isDark ? 'rgba(6, 182, 212, 0.2)'   : 'rgba(6, 182, 212, 0.16)',
        haloOuter: isDark ? 'rgba(16, 185, 129, 0.09)' : 'rgba(16, 185, 129, 0.06)',
        ringA:     isDark ? 'rgba(6, 182, 212, 0.42)'  : 'rgba(6, 182, 212, 0.5)',
        ringB:     isDark ? 'rgba(16, 185, 129, 0.32)' : 'rgba(16, 185, 129, 0.42)',
        ringC:     isDark ? 'rgba(34, 211, 238, 0.22)' : 'rgba(34, 211, 238, 0.3)',
        crystal:   isDark ? 'rgba(103,232,249,0.65)'   : 'rgba(14, 165, 233, 0.6)',
        particle:  ['rgba(103,232,249,0.8)', 'rgba(110,231,183,0.7)', 'rgba(6,182,212,0.75)'],
        coreFill:  isDark ? 'rgba(6,182,212,0.07)'     : 'rgba(6,182,212,0.04)'
      };
    } else if (hour >= 18 && hour < 22) {
      // EVENING — Crystal/Coral: violet, lavender, rose
      base = {
        coreGlow:  isDark ? 'rgba(139, 92, 246, 0.24)' : 'rgba(139, 92, 246, 0.18)',
        haloOuter: isDark ? 'rgba(251, 113, 133, 0.1)' : 'rgba(251, 113, 133, 0.07)',
        ringA:     isDark ? 'rgba(139, 92, 246, 0.44)' : 'rgba(139, 92, 246, 0.52)',
        ringB:     isDark ? 'rgba(251, 113, 133, 0.32)'  : 'rgba(251, 113, 133, 0.42)',
        ringC:     isDark ? 'rgba(167,139,250,0.22)'   : 'rgba(167, 139, 250, 0.3)',
        crystal:   isDark ? 'rgba(196,181,253,0.7)'    : 'rgba(124, 58, 237, 0.6)',
        particle:  ['rgba(196,181,253,0.8)', 'rgba(253,164,175,0.7)', 'rgba(139,92,246,0.75)'],
        coreFill:  isDark ? 'rgba(139,92,246,0.08)'    : 'rgba(139,92,246,0.05)'
      };
    } else {
      // NIGHT — Air/Crystal: deep indigo, midnight blue, velvet violet
      base = {
        coreGlow:  'rgba(99, 102, 241, 0.18)',
        haloOuter: 'rgba(67, 56, 202, 0.08)',
        ringA:     'rgba(99, 102, 241, 0.38)',
        ringB:     'rgba(139, 92, 246, 0.28)',
        ringC:     'rgba(79, 70, 229, 0.18)',
        crystal:   'rgba(165, 180, 252, 0.65)',
        particle:  ['rgba(165,180,252,0.75)', 'rgba(196,181,253,0.65)', 'rgba(99,102,241,0.7)'],
        coreFill:  'rgba(67,56,202,0.06)'
      };
    }

    // Focus mode overrides ring intensity
    if (isFocusRunning) {
      // Boost all ring opacities
      const boost = (c) => c.replace(/[\d.]+\)$/, (m) => Math.min(1, parseFloat(m) * 1.7) + ')');
      base.ringA = boost(base.ringA);
      base.ringB = boost(base.ringB);
    }

    return base;
  }

  render() {
    const prefs = store.getPreferences();
    const effects3D = prefs.effects3D || 'full';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (effects3D === 'off' || prefersReducedMotion) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.animId = requestAnimationFrame(() => this.render());
      return;
    }

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.t += dt;

    // Smooth mouse parallax
    this.currentMouseX += (this.targetMouseX - this.currentMouseX) * 0.035;
    this.currentMouseY += (this.targetMouseY - this.currentMouseY) * 0.035;

    const timerSnap = timerEngine.getSnapshot();
    const isFocusRunning = timerSnap.isRunning;
    const speedMult = isFocusRunning ? 1.5 : (effects3D === 'reduced' ? 0.45 : 0.7);

    this.rotX += dt * 0.12 * speedMult;
    this.rotY += dt * 0.17 * speedMult;
    this.rotZ += dt * 0.07 * speedMult;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Responsive spatial anchor — orb position
    const isMobile = this.width <= 768;
    const centerX = isMobile ? this.width * 0.5  : this.width * 0.72;
    const centerY = isMobile ? this.height * 0.3 : this.height * 0.36;

    // Breathing pulse
    const breathPeriod = isFocusRunning ? 0.003 : 0.0012;
    const breath = 1 + Math.sin(this.t * breathPeriod * 1000) * 0.04;
    const baseRadius = (isMobile ? 90 : 150) * breath;

    // Time and productivity context
    const hour = new Date().getHours();
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    // Productivity factor from completed tasks + habit rate
    const habitSummary = store.getTodayHabitSummary();
    const tasks = store.getTasks();
    const now2 = new Date();
    const todayIso = now2.toISOString().split('T')[0];
    const todayTasks = tasks.filter(t =>
      (t.scheduledStart && t.scheduledStart.startsWith(todayIso)) ||
      (t.createdAt && t.createdAt.startsWith(todayIso))
    );
    const completedTasks = todayTasks.filter(t => t.completed).length;
    const progressFactor = Math.min(1,
      (completedTasks * 0.12) +
      ((habitSummary.completionRate || 0) * 0.006)
    );

    const palette = this.getElementalPalette(hour, isDark, progressFactor, isFocusRunning);

    // 3D projection function with mouse-responsive rotation
    const fov = 440;
    const project = (x, y, z) => {
      const mx = this.currentMouseX * 0.4;
      const my = this.currentMouseY * 0.4;

      let y1 = y * Math.cos(this.rotX + my) - z * Math.sin(this.rotX + my);
      let z1 = y * Math.sin(this.rotX + my) + z * Math.cos(this.rotX + my);
      let x2 = x * Math.cos(this.rotY + mx) + z1 * Math.sin(this.rotY + mx);
      let z2 = -x * Math.sin(this.rotY + mx) + z1 * Math.cos(this.rotY + mx);

      const scale = fov / (fov + z2 + 350);
      return {
        x: centerX + x2 * scale,
        y: centerY + y1 * scale,
        scale,
        z: z2
      };
    };

    // ── 1. ATMOSPHERIC HALO (outermost glow) ──
    const coreRadius = baseRadius * (0.82 + progressFactor * 0.18);

    const outerHalo = this.ctx.createRadialGradient(
      centerX - 18 * this.currentMouseX, centerY - 14 * this.currentMouseY, 0,
      centerX, centerY, coreRadius * 2.2
    );
    outerHalo.addColorStop(0, palette.coreGlow);
    outerHalo.addColorStop(0.45, palette.haloOuter);
    outerHalo.addColorStop(1, 'transparent');

    this.ctx.fillStyle = outerHalo;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, coreRadius * 2.2, 0, Math.PI * 2);
    this.ctx.fill();

    // ── 2. INNER CRYSTAL CORE GLOW ──
    const innerGrad = this.ctx.createRadialGradient(
      centerX - 10 * this.currentMouseX, centerY - 8 * this.currentMouseY, 0,
      centerX, centerY, coreRadius * 0.85
    );
    innerGrad.addColorStop(0, palette.coreFill);
    innerGrad.addColorStop(0.6, palette.coreGlow.replace(/[\d.]+\)$/, '0.05)'));
    innerGrad.addColorStop(1, 'transparent');

    this.ctx.fillStyle = innerGrad;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, coreRadius * 0.85, 0, Math.PI * 2);
    this.ctx.fill();

    // ── 3. CRYSTAL GEOMETRY FACES (inner structure) ──
    if (effects3D !== 'reduced' && !isMobile) {
      const faces = this.crystalFaces;
      // Sort by depth (painter's algorithm)
      const sortedFaces = faces.map(face => {
        const projected = face.map(v => project(...v));
        const avgZ = projected.reduce((s, p) => s + p.z, 0) / 3;
        return { projected, avgZ, face };
      }).sort((a, b) => b.avgZ - a.avgZ);

      for (const { projected, avgZ } of sortedFaces) {
        // Only render faces somewhat facing us
        if (avgZ > -50) {
          const [p0, p1, p2] = projected;

          // Crystal face with refractive coloring
          const depthFactor = Math.max(0, Math.min(1, 1 - (avgZ + 100) / 200));
          const baseColor = palette.crystal;
          const alphaMatch = baseColor.match(/[\d.]+(?=\))/);
          const baseAlpha = alphaMatch ? parseFloat(alphaMatch[0]) : 0.4;
          const faceAlpha = baseAlpha * depthFactor * 0.7;

          this.ctx.beginPath();
          this.ctx.moveTo(p0.x, p0.y);
          this.ctx.lineTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.closePath();

          // Glass-like fill
          const faceGrad = this.ctx.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
          faceGrad.addColorStop(0, baseColor.replace(/[\d.]+\)$/, `${faceAlpha * 1.4})`));
          faceGrad.addColorStop(0.5, baseColor.replace(/[\d.]+\)$/, `${faceAlpha * 0.6})`));
          faceGrad.addColorStop(1, baseColor.replace(/[\d.]+\)$/, `${faceAlpha * 1.1})`));

          this.ctx.fillStyle = faceGrad;
          this.ctx.fill();

          // Edge highlight
          this.ctx.strokeStyle = baseColor.replace(/[\d.]+\)$/, `${faceAlpha * 2.5})`);
          this.ctx.lineWidth = 0.6;
          this.ctx.stroke();
        }
      }
    }

    // ── 4. ORBITAL RINGS (3 elemental rings) ──
    const ringDefs = [
      { radius: baseRadius * 1.08, color: palette.ringA, axis: 'xy', width: 1.8 },
      { radius: baseRadius * 0.9,  color: palette.ringB, axis: 'yz', width: 1.4 },
      { radius: baseRadius * 0.68, color: palette.ringC, axis: 'xz', width: 1.0 }
    ];

    for (const ring of ringDefs) {
      this.ctx.strokeStyle = ring.color;
      this.ctx.lineWidth = ring.width;
      this.ctx.beginPath();

      const segments = 80;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
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

    // ── 5. INTERNAL PARTICLES (stardust) ──
    for (const p of this.particles) {
      // Slow drift
      const driftAngle = this.t * p.speed * 0.3 + p.phaseOffset;
      const px = p.x + Math.sin(driftAngle) * 8;
      const py = p.y + Math.cos(driftAngle * 0.7) * 6;
      const pz = p.z + Math.sin(driftAngle * 0.5) * 5;

      const proj = project(px, py, pz);
      if (proj.scale > 0) {
        const color = palette.particle[p.colorIndex % palette.particle.length];
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = p.opacity * proj.scale * (0.7 + progressFactor * 0.3);
        this.ctx.beginPath();
        this.ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
      }
    }

    // ── 6. SPECULAR LENS FLARE (subtle mouse-reactive highlight) ──
    if (effects3D !== 'reduced') {
      const flareX = centerX - 30 + this.currentMouseX * -25;
      const flareY = centerY - 30 + this.currentMouseY * -20;
      const flareGrad = this.ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, baseRadius * 0.4);
      flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
      flareGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.03)');
      flareGrad.addColorStop(1, 'transparent');
      this.ctx.fillStyle = flareGrad;
      this.ctx.beginPath();
      this.ctx.arc(flareX, flareY, baseRadius * 0.4, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.animId = requestAnimationFrame(() => this.render());
  }

  setIntensity(intensity) {
    if (this.canvas) {
      this.canvas.style.opacity = String(intensity);
    }
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
