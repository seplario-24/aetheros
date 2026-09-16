/**
 * AETHER OS — ATMOSPHERIC ENVIRONMENTAL ENGINE
 * Subtle day/night ambient light fields, slow organic floating color blobs,
 * time-of-day awareness, and smooth atmospheric transitions.
 */

import { store } from '../store/db.js';

export class AtmosphereEngine {
  constructor() {
    this.container = null;
    this.currentPhase = '';
    this.timer = null;
  }

  init() {
    this.container = document.getElementById('atmosphere-layer');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'atmosphere-layer';
      this.container.innerHTML = `
        <div class="atmosphere-blob blob-primary"></div>
        <div class="atmosphere-blob blob-secondary"></div>
        <div class="atmosphere-blob blob-warm"></div>
      `;
      document.body.insertBefore(this.container, document.body.firstChild);
    }

    this.update();
    // Check every minute for subtle atmospheric transitions
    this.timer = setInterval(() => this.update(), 60000);
  }

  update() {
    const now = new Date();
    const hour = now.getHours();

    let phase = 'afternoon';
    if (hour >= 5 && hour < 12) phase = 'morning';
    else if (hour >= 12 && hour < 18) phase = 'afternoon';
    else if (hour >= 18 && hour < 22) phase = 'evening';
    else phase = 'night';

    if (this.currentPhase !== phase) {
      document.body.classList.remove('atmos-morning', 'atmos-afternoon', 'atmos-evening', 'atmos-night');
      document.body.classList.add(`atmos-${phase}`);
      this.currentPhase = phase;
    }

    // Check 3D Effects / Performance preference
    const prefs = store.getPreferences();
    const effects3D = prefs.effects3D || 'full';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.container) {
      if (effects3D === 'off' || prefersReducedMotion) {
        this.container.style.opacity = '0';
      } else if (effects3D === 'reduced') {
        this.container.style.opacity = '0.2';
      } else {
        this.container.style.opacity = '1';
      }
    }
  }

  destroy() {
    if (this.timer) clearInterval(this.timer);
  }
}

export const atmosphereEngine = new AtmosphereEngine();
