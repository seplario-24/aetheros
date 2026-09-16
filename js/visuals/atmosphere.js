/**
 * AETHER OS — ELEMENTAL ATMOSPHERE ENGINE
 * Multi-layer atmospheric system with time-of-day elemental character,
 * floating micro-particles, and smooth environment transitions.
 */

class AtmosphereEngine {
  constructor() {
    this.currentAtmos = null;
    this.particleCount = 20;
    this.particles = [];
    this.intervalId = null;
  }

  init() {
    this.updateAtmosphere();
    this.spawnAtmosphereParticles();

    // Update every 3 minutes
    this.intervalId = setInterval(() => this.updateAtmosphere(), 3 * 60 * 1000);
  }

  getAtmosClass() {
    const hour = new Date().getHours();
    if (hour >= 5  && hour < 12) return 'atmos-morning';
    if (hour >= 12 && hour < 18) return 'atmos-afternoon';
    if (hour >= 18 && hour < 22) return 'atmos-evening';
    return 'atmos-night';
  }

  updateAtmosphere() {
    const body = document.body;
    const newAtmos = this.getAtmosClass();

    if (this.currentAtmos === newAtmos) return;

    // Remove old atmos class
    if (this.currentAtmos) body.classList.remove(this.currentAtmos);
    body.classList.add(newAtmos);
    this.currentAtmos = newAtmos;

    // Also set on the atmosphere layer for CSS variable inheritance
    const layer = document.getElementById('atmosphere-layer');
    if (layer) {
      layer.className = '';
      layer.classList.add(newAtmos);
    }
  }

  spawnAtmosphereParticles() {
    const container = document.getElementById('atmos-particles');
    if (!container) return;

    container.innerHTML = '';
    this.particles = [];

    for (let i = 0; i < this.particleCount; i++) {
      const el = document.createElement('div');
      el.className = 'atmos-particle';

      const size = 2 + Math.random() * 4;
      const x = Math.random() * 100;
      const y = 20 + Math.random() * 70;
      const duration = 8 + Math.random() * 16;
      const delay = Math.random() * 12;
      const opacity = 0.2 + Math.random() * 0.4;

      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        opacity: ${opacity};
        --particle-duration: ${duration}s;
        --particle-delay: -${delay}s;
      `;

      container.appendChild(el);
      this.particles.push(el);
    }
  }

  destroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

export const atmosphereEngine = new AtmosphereEngine();
