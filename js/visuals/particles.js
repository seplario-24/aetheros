/**
 * AETHER OS — ELEMENTAL PARTICLE "WOW" MOMENTS
 * Creates satisfying particle bursts on key interactions:
 * - Task completion → element-colored burst
 * - Habit completion → tile bloom
 * - Focus session start → swirl inward
 * - Day streak milestone → crystal shower
 */

export class ParticleSystem {
  /**
   * Emit a burst of particles from an element
   * @param {HTMLElement} originEl — the source element
   * @param {string} color — base color (hex or CSS var resolved)
   * @param {number} count — number of particles
   */
  static burst(originEl, color = '#8B5CF6', count = 16) {
    if (!originEl) return;

    const rect = originEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      left: 0; top: 0;
      width: 100vw; height: 100vh;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const distance = 40 + Math.random() * 80;
      const size = 3 + Math.random() * 5;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const duration = 0.5 + Math.random() * 0.3;
      const delay = Math.random() * 0.1;

      // Vary color slightly
      const alpha = 0.6 + Math.random() * 0.4;
      const particleColor = ParticleSystem._varyColor(color, alpha);

      particle.style.cssText = `
        position: absolute;
        left: ${cx}px;
        top: ${cy}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${particleColor};
        box-shadow: 0 0 ${size * 2}px ${particleColor};
        --dx: ${dx}px;
        --dy: ${dy}px;
        animation: burstFly ${duration}s ease-out ${delay}s forwards;
        opacity: 0;
      `;

      container.appendChild(particle);
    }

    // Cleanup after animation
    setTimeout(() => {
      if (container.parentNode) container.parentNode.removeChild(container);
    }, 900);
  }

  /**
   * Bloom effect for habit tile completion
   */
  static tileBloom(tileEl, color = '#10B981') {
    if (!tileEl) return;

    const bloom = document.createElement('div');
    const rect = tileEl.getBoundingClientRect();

    bloom.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      width: 0; height: 0;
      border-radius: 50%;
      background: ${color}40;
      box-shadow: 0 0 20px ${color}60;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9999;
      animation: tileBloomAnim 0.5s ease-out forwards;
    `;

    // Add bloom keyframe if not exists
    if (!document.getElementById('tile-bloom-style')) {
      const style = document.createElement('style');
      style.id = 'tile-bloom-style';
      style.textContent = `
        @keyframes tileBloomAnim {
          0%   { width: 0; height: 0; opacity: 0.9; }
          60%  { width: 60px; height: 60px; opacity: 0.5; }
          100% { width: 80px; height: 80px; opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(bloom);
    setTimeout(() => {
      if (bloom.parentNode) bloom.parentNode.removeChild(bloom);
    }, 600);

    // Also do a small burst
    ParticleSystem.burst(tileEl, color, 10);
  }

  /**
   * Focus session start — energy swirl toward center
   */
  static focusStart(color = '#8B5CF6', count = 24) {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed; inset: 0;
      pointer-events: none;
      z-index: 9998;
    `;
    document.body.appendChild(container);

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const startDist = 200 + Math.random() * 200;
      const startX = cx + Math.cos(angle) * startDist;
      const startY = cy + Math.sin(angle) * startDist;
      const size = 2 + Math.random() * 4;
      const duration = 0.8 + Math.random() * 0.4;
      const delay = Math.random() * 0.3;

      const p = document.createElement('div');
      const dx = -(startX - cx);
      const dy = -(startY - cy);

      p.style.cssText = `
        position: absolute;
        left: ${startX}px;
        top: ${startY}px;
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        background: ${color};
        box-shadow: 0 0 8px ${color}80;
        --dx: ${dx}px;
        --dy: ${dy}px;
        animation: burstFly ${duration}s ease-in ${delay}s forwards;
        opacity: 0;
      `;
      container.appendChild(p);
    }

    setTimeout(() => {
      if (container.parentNode) container.parentNode.removeChild(container);
    }, 1400);
  }

  /**
   * Task completion animation on the card
   */
  static taskComplete(taskCardEl) {
    if (!taskCardEl) return;
    const color = '#10B981';
    taskCardEl.classList.add('completed-anim');
    setTimeout(() => taskCardEl.classList.remove('completed-anim'), 500);
    ParticleSystem.burst(taskCardEl, color, 12);
  }

  // Internal helper to vary a hex color's opacity
  static _varyColor(color, alpha) {
    // If it's a CSS hex like #RRGGBB, convert to rgba
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  }
}

// Make globally available for view scripts
window.ParticleSystem = ParticleSystem;
