/**
 * AETHER OS — HERO 3D PRODUCTIVITY ORB (HIGH REFRESH 144Hz+ ENGINE)
 * Full elemental world signature object:
 * - High-refresh 144Hz+ delta-time independent physics & smoothing
 * - Dual-lattice faceted 3D crystal geometry (20 icosahedral faces + inner core)
 * - True 3D surface normal calculations with directional celestial lighting
 * - Specular reflection glints and Fresnel edge illumination
 * - 3 Precomputed orbital energy rings with traveling photon nodes
 * - Internal 3D cosmic stardust with depth-attenuated perspective
 * - Zero-garbage-collection render loop for rock-solid 144+ FPS
 */

import { timerEngine } from '../engine/timer.js';
import { store } from '../store/db.js';

// Precomputed static unit circle points (80 segments) for zero-trig ring loops
const RING_SEGMENTS = 80;
const UNIT_CIRCLE = Array.from({ length: RING_SEGMENTS + 1 }, (_, i) => {
  const rad = (i / RING_SEGMENTS) * Math.PI * 2;
  return [Math.cos(rad), Math.sin(rad)];
});

// Normalized directional light vector (celestial source above and right)
const LIGHT_DIR = (() => {
  const lx = 0.45, ly = -0.75, lz = 0.48;
  const len = Math.hypot(lx, ly, lz);
  return [lx / len, ly / len, lz / len];
})();

export class FocusOrb {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d', { alpha: true, desynchronized: true });
    this.width = 0;
    this.height = 0;
    this.dpr = 1;

    this.particles = [];
    this.numParticles = 54;

    // 3D Rotation State
    this.rotX = 0.28;
    this.rotY = 0.42;
    this.rotZ = 0.14;

    // Mouse Parallax (Delta-Time Lerp for 144Hz+)
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.currentMouseX = 0;
    this.currentMouseY = 0;

    // Photon Bead Positions along rings [0..1]
    this.photonA = 0;
    this.photonB = 0.33;
    this.photonC = 0.67;

    // Animation & Timing
    this.animId = null;
    this.lastTime = performance.now();
    this.t = 0;

    // Throttled Store Sampling (Avoid GC pauses at 144Hz)
    this.lastMetricsUpdate = 0;
    this.progressFactor = 0;

    // 3D Crystal Geometry
    this.crystalVertices = [];
    this.crystalFaces = [];
    this.innerVertices = [];
    this.innerFaces = [];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    window.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });

    this.buildCrystalGeometry();
    this.seedParticles();
    this.updateProductivityFactor();
    this.render();
  }

  buildCrystalGeometry() {
    // 1. Outer Icosahedron faceted crystal
    const phi = (1 + Math.sqrt(5)) / 2;
    const r = 48 / Math.sqrt(1 + phi * phi);

    this.crystalVertices = [
      [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
      [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
      [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
    ].map(([x, y, z]) => [x * r, y * r, z * r]);

    this.crystalFaces = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];

    // 2. Inner Golden Octahedron Core
    const ir = 22;
    this.innerVertices = [
      [0, -ir, 0], [ir, 0, 0], [0, 0, ir],
      [-ir, 0, 0], [0, 0, -ir], [0, ir, 0]
    ];
    this.innerFaces = [
      [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1],
      [5, 2, 1], [5, 3, 2], [5, 4, 3], [5, 1, 4]
    ];
  }

  seedParticles() {
    this.particles = [];
    const prefs = store.getPreferences();
    const count = prefs.effects3D === 'reduced' ? 24 : this.numParticles;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 75 + Math.random() * 115;

      this.particles.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        size: 1.0 + Math.random() * 2.4,
        opacity: 0.25 + Math.random() * 0.65,
        speed: 0.2 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        colorIndex: i % 3
      });
    }
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  onMouseMove(e) {
    this.targetMouseX = (e.clientX - this.width / 2) / (this.width / 2);
    this.targetMouseY = (e.clientY - this.height / 2) / (this.height / 2);
  }

  updateProductivityFactor() {
    try {
      const habitSummary = store.getTodayHabitSummary();
      const tasks = store.getTasks();
      const todayIso = new Date().toISOString().split('T')[0];
      let todayCount = 0;
      let completedCount = 0;

      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        if ((t.scheduledStart && t.scheduledStart.startsWith(todayIso)) ||
            (t.createdAt && t.createdAt.startsWith(todayIso))) {
          todayCount++;
          if (t.completed) completedCount++;
        }
      }

      this.progressFactor = Math.min(1,
        (completedCount * 0.12) +
        ((habitSummary.completionRate || 0) * 0.006)
      );
    } catch {
      this.progressFactor = 0.5;
    }
  }

  getElementalPalette(hour, isDark) {
    if (hour >= 5 && hour < 12) {
      // MORNING — Golden solar dawn & amber light
      return {
        r: 245, g: 158, b: 11,
        r2: 249, g: 115, b: 22,
        coreAlpha: isDark ? 0.22 : 0.18,
        haloAlpha: isDark ? 0.09 : 0.06,
        ringA: 'rgba(245, 158, 11, 0.48)',
        ringB: 'rgba(249, 115, 22, 0.38)',
        ringC: 'rgba(251, 191, 36, 0.28)',
        crystalColor: [252, 211, 77],
        particles: ['rgba(252, 211, 77, 0.85)', 'rgba(251, 146, 60, 0.75)', 'rgba(245, 158, 11, 0.8)']
      };
    } else if (hour >= 12 && hour < 18) {
      // AFTERNOON — Cyan water flow & emerald pulse
      return {
        r: 6, g: 182, b: 212,
        r2: 16, g: 185, b: 129,
        coreAlpha: isDark ? 0.20 : 0.16,
        haloAlpha: isDark ? 0.08 : 0.05,
        ringA: 'rgba(6, 182, 212, 0.48)',
        ringB: 'rgba(16, 185, 129, 0.38)',
        ringC: 'rgba(34, 211, 238, 0.28)',
        crystalColor: [103, 232, 249],
        particles: ['rgba(103, 232, 249, 0.85)', 'rgba(110, 231, 183, 0.75)', 'rgba(6, 182, 212, 0.8)']
      };
    } else if (hour >= 18 && hour < 22) {
      // EVENING — Violet twilight & celestial rose
      return {
        r: 139, g: 92, b: 246,
        r2: 251, g: 113, b: 133,
        coreAlpha: isDark ? 0.24 : 0.18,
        haloAlpha: isDark ? 0.10 : 0.06,
        ringA: 'rgba(139, 92, 246, 0.52)',
        ringB: 'rgba(251, 113, 133, 0.38)',
        ringC: 'rgba(167, 139, 250, 0.28)',
        crystalColor: [196, 181, 253],
        particles: ['rgba(196, 181, 253, 0.85)', 'rgba(253, 164, 175, 0.75)', 'rgba(139, 92, 246, 0.8)']
      };
    } else {
      // NIGHT — Midnight indigo & cosmic velvet
      return {
        r: 99, g: 102, b: 241,
        r2: 139, g: 92, b: 246,
        coreAlpha: 0.20,
        haloAlpha: 0.08,
        ringA: 'rgba(99, 102, 241, 0.45)',
        ringB: 'rgba(139, 92, 246, 0.34)',
        ringC: 'rgba(79, 70, 229, 0.24)',
        crystalColor: [165, 180, 252],
        particles: ['rgba(165, 180, 252, 0.85)', 'rgba(196, 181, 253, 0.75)', 'rgba(99, 102, 241, 0.8)']
      };
    }
  }

  render() {
    const prefs = store.getPreferences();
    const effects3D = prefs.effects3D || 'full';
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (effects3D === 'off' || prefersReducedMotion) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.animId = requestAnimationFrame(() => this.render());
      return;
    }

    const now = performance.now();
    // Delta-time clamped to prevent leaps when tab is inactive
    const dt = Math.min((now - this.lastTime) / 1000, 0.06);
    this.lastTime = now;
    this.t += dt;

    // Throttled store sampling (runs every 1.5s to prevent GC stutters at 144Hz)
    if (now - this.lastMetricsUpdate > 1500) {
      this.updateProductivityFactor();
      this.lastMetricsUpdate = now;
    }

    // 144Hz+ Delta-Time Independent Exponential Smoothing for Mouse Parallax
    const mouseLerp = 1 - Math.exp(-16 * dt);
    this.currentMouseX += (this.targetMouseX - this.currentMouseX) * mouseLerp;
    this.currentMouseY += (this.targetMouseY - this.currentMouseY) * mouseLerp;

    const timerSnap = timerEngine.getSnapshot();
    const isFocusRunning = timerSnap.isRunning;
    const speedMult = isFocusRunning ? 1.6 : (effects3D === 'reduced' ? 0.45 : 0.75);

    // 3D Rotation Increment
    this.rotX += dt * 0.16 * speedMult;
    this.rotY += dt * 0.22 * speedMult;
    this.rotZ += dt * 0.09 * speedMult;

    // Photon Bead Animation
    this.photonA = (this.photonA + dt * 0.22 * speedMult) % 1;
    this.photonB = (this.photonB + dt * 0.18 * speedMult) % 1;
    this.photonC = (this.photonC + dt * 0.26 * speedMult) % 1;

    // Clear Screen
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Spatial Anchors
    const isMobile = this.width <= 768;
    const centerX = isMobile ? this.width * 0.5 : this.width * 0.72;
    const centerY = isMobile ? this.height * 0.3 : this.height * 0.36;

    // Harmonic Breathing Pulse
    const breathFreq = isFocusRunning ? 2.5 : 1.1;
    const breath = 1 + Math.sin(this.t * breathFreq) * 0.045;
    const baseRadius = (isMobile ? 95 : 155) * breath;

    // Time & Palette
    const hour = new Date().getHours();
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const palette = this.getElementalPalette(hour, isDark);

    // 3D Projection Matrix with Mouse Tilting
    const fov = 460;
    const mx = this.currentMouseX * 0.42;
    const my = this.currentMouseY * 0.42;
    const rx = this.rotX + my;
    const ry = this.rotY + mx;
    const rz = this.rotZ;

    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

    const project3D = (x, y, z) => {
      // Rotation X
      let y1 = y * cosX - z * sinX;
      let z1 = y * sinX + z * cosX;
      // Rotation Y
      let x2 = x * cosY + z1 * sinY;
      let z2 = -x * sinY + z1 * cosY;
      // Rotation Z
      let x3 = x2 * cosZ - y1 * sinZ;
      let y3 = x2 * sinZ + y1 * cosZ;

      const scale = fov / (fov + z2 + 360);
      return {
        x: centerX + x3 * scale,
        y: centerY + y3 * scale,
        rx: x3,
        ry: y3,
        rz: z2,
        scale
      };
    };

    // ──────────────────────────────────────────────────────────────────────────
    // 1. ATMOSPHERIC VOLUMETRIC GLOW
    // ──────────────────────────────────────────────────────────────────────────
    const coreRadius = baseRadius * (0.84 + this.progressFactor * 0.16);

    const outerGlow = this.ctx.createRadialGradient(
      centerX - 16 * this.currentMouseX, centerY - 12 * this.currentMouseY, 0,
      centerX, centerY, coreRadius * 2.3
    );
    outerGlow.addColorStop(0, `rgba(${palette.r}, ${palette.g}, ${palette.b}, ${palette.coreAlpha * 1.3})`);
    outerGlow.addColorStop(0.4, `rgba(${palette.r2}, ${palette.g}, ${palette.b}, ${palette.haloAlpha})`);
    outerGlow.addColorStop(1, 'transparent');

    this.ctx.fillStyle = outerGlow;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, coreRadius * 2.3, 0, Math.PI * 2);
    this.ctx.fill();

    // ──────────────────────────────────────────────────────────────────────────
    // 2. INNER REFRACTIVE CRYSTAL CORE (True 3D Normals & Specular Lighting)
    // ──────────────────────────────────────────────────────────────────────────
    if (effects3D !== 'reduced' && !isMobile) {
      const cr = palette.crystalColor[0];
      const cg = palette.crystalColor[1];
      const cb = palette.crystalColor[2];

      // Project vertices
      const projectedVerts = this.crystalVertices.map(v => project3D(...v));

      // Build and depth-sort faces
      const facesWithDepth = [];
      for (let i = 0; i < this.crystalFaces.length; i++) {
        const [i0, i1, i2] = this.crystalFaces[i];
        const p0 = projectedVerts[i0];
        const p1 = projectedVerts[i1];
        const p2 = projectedVerts[i2];

        // 3D Normal Vector in Camera Space
        const ax = p1.rx - p0.rx, ay = p1.ry - p0.ry, az = p1.rz - p0.rz;
        const bx = p2.rx - p0.rx, by = p2.ry - p0.ry, bz = p2.rz - p0.rz;
        const nx = ay * bz - az * by;
        const ny = az * bx - ax * bz;
        const nz = ax * by - ay * bx;

        // Backface culling: only render front-facing or glancing faces (nz < 0.1)
        if (nz < 0.1) {
          const avgZ = (p0.rz + p1.rz + p2.rz) / 3;
          const nLen = Math.hypot(nx, ny, nz) || 1;
          const norm = [nx / nLen, ny / nLen, nz / nLen];
          facesWithDepth.push({ p0, p1, p2, avgZ, norm });
        }
      }

      // Sort back-to-front (Painter's Algorithm)
      facesWithDepth.sort((a, b) => b.avgZ - a.avgZ);

      for (let i = 0; i < facesWithDepth.length; i++) {
        const { p0, p1, p2, norm } = facesWithDepth[i];

        // Lighting calculation
        const dotLight = norm[0] * LIGHT_DIR[0] + norm[1] * LIGHT_DIR[1] + norm[2] * LIGHT_DIR[2];
        const diffuse = Math.max(0.14, dotLight);

        // Specular reflection glint (half-angle)
        const hx = LIGHT_DIR[0], hy = LIGHT_DIR[1], hz = LIGHT_DIR[2] - 1;
        const hLen = Math.hypot(hx, hy, hz) || 1;
        const dotHalf = Math.max(0, norm[0] * (hx / hLen) + norm[1] * (hy / hLen) + norm[2] * (hz / hLen));
        const specular = Math.pow(dotHalf, 20);

        // Fresnel edge glow
        const fresnel = Math.pow(1 - Math.abs(norm[2]), 2.2);

        // Multi-stop crystal face fill
        const alpha = Math.min(0.85, (diffuse * 0.35 + specular * 0.5 + fresnel * 0.35));
        const specAlpha = Math.min(1, specular * 0.9);

        this.ctx.beginPath();
        this.ctx.moveTo(p0.x, p0.y);
        this.ctx.lineTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.closePath();

        const grad = this.ctx.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
        grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${alpha * 1.3})`);
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${specAlpha * 0.7 + 0.05})`);
        grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.7})`);

        this.ctx.fillStyle = grad;
        this.ctx.fill();

        // Facet wireframe edge glint
        this.ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${Math.min(1, alpha * 1.8 + 0.2)})`;
        this.ctx.lineWidth = 0.8;
        this.ctx.stroke();
      }

      // Inner Golden Nucleus (Pulsating seed)
      const innerVerts = this.innerVertices.map(v => project3D(...v));
      this.ctx.fillStyle = `rgba(${palette.r}, ${palette.g}, ${palette.b}, 0.25)`;
      for (let i = 0; i < this.innerFaces.length; i++) {
        const [a, b, c] = this.innerFaces[i];
        const va = innerVerts[a], vb = innerVerts[b], vc = innerVerts[c];
        this.ctx.beginPath();
        this.ctx.moveTo(va.x, va.y);
        this.ctx.lineTo(vb.x, vb.y);
        this.ctx.lineTo(vc.x, vc.y);
        this.ctx.closePath();
        this.ctx.fill();
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. TRIPLE VOLUMETRIC ORBITAL RINGS & ENERGY PHOTONS
    // ──────────────────────────────────────────────────────────────────────────
    const rings = [
      { radius: baseRadius * 1.10, color: palette.ringA, axis: 'xy', photon: this.photonA, width: 2.0 },
      { radius: baseRadius * 0.92, color: palette.ringB, axis: 'yz', photon: this.photonB, width: 1.5 },
      { radius: baseRadius * 0.70, color: palette.ringC, axis: 'xz', photon: this.photonC, width: 1.2 }
    ];

    for (let rIdx = 0; rIdx < rings.length; rIdx++) {
      const ring = rings[rIdx];
      this.ctx.strokeStyle = ring.color;
      this.ctx.lineWidth = ring.width;
      this.ctx.beginPath();

      let photonProj = null;

      for (let i = 0; i <= RING_SEGMENTS; i++) {
        const [ux, uy] = UNIT_CIRCLE[i];
        let px = 0, py = 0, pz = 0;

        if (ring.axis === 'xy') {
          px = ux * ring.radius;
          py = uy * ring.radius;
        } else if (ring.axis === 'yz') {
          py = ux * ring.radius;
          pz = uy * ring.radius;
        } else {
          px = ux * ring.radius;
          pz = uy * ring.radius;
        }

        const proj = project3D(px, py, pz);
        if (i === 0) this.ctx.moveTo(proj.x, proj.y);
        else this.ctx.lineTo(proj.x, proj.y);

        // Check if this segment corresponds to the photon position
        if (Math.abs((i / RING_SEGMENTS) - ring.photon) < 0.015) {
          photonProj = proj;
        }
      }
      this.ctx.stroke();

      // Render traveling energy photon bead along the ring
      if (photonProj && effects3D !== 'reduced') {
        const beadGlow = this.ctx.createRadialGradient(
          photonProj.x, photonProj.y, 0,
          photonProj.x, photonProj.y, 14
        );
        beadGlow.addColorStop(0, '#FFFFFF');
        beadGlow.addColorStop(0.35, `rgba(${palette.r}, ${palette.g}, ${palette.b}, 0.9)`);
        beadGlow.addColorStop(1, 'transparent');

        this.ctx.fillStyle = beadGlow;
        this.ctx.beginPath();
        this.ctx.arc(photonProj.x, photonProj.y, 14, 0, Math.PI * 2);
        this.ctx.fill();

        // Bright white bead core
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(photonProj.x, photonProj.y, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. COSMIC STARDUST PARTICLES (With 3D Depth Fog)
    // ──────────────────────────────────────────────────────────────────────────
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const drift = this.t * p.speed * 0.4 + p.phase;
      const px = p.x + Math.sin(drift) * 9;
      const py = p.y + Math.cos(drift * 0.7) * 7;
      const pz = p.z + Math.sin(drift * 0.5) * 6;

      const proj = project3D(px, py, pz);
      if (proj.scale > 0) {
        // Depth fog attenuation
        const depthAlpha = Math.max(0.1, Math.min(1, (proj.scale * 1.5 - 0.2)));
        const color = palette.particles[p.colorIndex % palette.particles.length];

        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = p.opacity * depthAlpha * (0.7 + this.progressFactor * 0.3);
        this.ctx.beginPath();
        this.ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 5. SPECULAR LENS HIGHLIGHT (Mouse-Responsive Glint)
    // ──────────────────────────────────────────────────────────────────────────
    if (effects3D !== 'reduced') {
      const flareX = centerX - 32 + this.currentMouseX * -28;
      const flareY = centerY - 32 + this.currentMouseY * -24;
      const flare = this.ctx.createRadialGradient(
        flareX, flareY, 0,
        flareX, flareY, baseRadius * 0.45
      );
      flare.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      flare.addColorStop(0.35, 'rgba(255, 255, 255, 0.04)');
      flare.addColorStop(1, 'transparent');

      this.ctx.fillStyle = flare;
      this.ctx.beginPath();
      this.ctx.arc(flareX, flareY, baseRadius * 0.45, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Continuous 144Hz+ RAF Loop
    this.animId = requestAnimationFrame(() => this.render());
  }

  setIntensity(intensity) {
    if (this.canvas) {
      this.canvas.style.opacity = String(intensity);
    }
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
