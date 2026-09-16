/**
 * AETHER OS — 3D ELEMENTAL COGNITIVE MIND BREAKS
 * 6 high-agility mental resets in miniature 3D environments:
 * 1. Reaction Test (visual synaptic reflex)
 * 2. Memory Grid (spatial 3D tile recall)
 * 3. Number Memory (digit span endurance)
 * 4. Stroop Test (interference cognition)
 * 5. Quick Math (rapid arithmetic burst)
 * 6. Focus Dot (smooth visual pursuit tracking)
 */

import { store } from '../store/db.js';
import { ambientAudio } from '../audio/ambient.js';

export function renderGamesView(container, navigate) {
  const gameRecords = store.getGameRecords();

  const getBestScore = (gameName) => {
    const recs = gameRecords.filter(r => r.game === gameName);
    if (recs.length === 0) return '—';
    if (gameName === 'Reaction Test') {
      const best = Math.min(...recs.map(r => r.score));
      return `${best} ms`;
    }
    const best = Math.max(...recs.map(r => r.score));
    return best;
  };

  container.innerHTML = `
    <div class="animate-fade-in" style="perspective: 1200px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--el-fire);">Cognitive Recalibration</span>
          </div>
          <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 4px;">Cognitive Mind Breaks</h1>
          <p style="font-size: 13.5px; color: var(--text-secondary);">Intentional 1–3 minute mental resets. Sharpen reaction speed, working memory, and focus.</p>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-primary" id="btn-quick-bored-break" style="box-shadow: 0 4px 16px var(--accent-primary-glow); display: flex; align-items: center; gap: 8px;">
            ⚡ Quick 2-Minute Reset
          </button>
        </div>
      </div>

      <!-- 6 Dimensional 3D Game Cards -->
      <div class="games-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 18px;">
        <!-- 1. Reaction Test -->
        <div class="glass-card game-card spatial-floating-card animate-float" data-launch-game="reaction" style="--stat-element-glow: var(--accent-emerald-glow); animation-delay: 0s; padding: 22px; display: flex; flex-direction: column; gap: 14px; cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div class="game-icon-orb" style="width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%); box-shadow: 0 0 14px var(--accent-emerald-glow); color: var(--accent-emerald); font-size: 20px; display: flex; align-items: center; justify-content: center;">⚡</div>
            <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.3); font-size: 11px;">Speed</span>
          </div>
          <div>
            <div class="game-card-title" style="font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 4px;">Reaction Time Benchmark</div>
            <div class="game-card-desc" style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4;">Click immediately when emerald flash triggers. Tests visual synaptic speed.</div>
          </div>
          <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>Personal Best</span>
            <strong style="color: var(--accent-emerald); font-family: var(--font-mono);">${getBestScore('Reaction Test')}</strong>
          </div>
        </div>

        <!-- 2. Memory Grid -->
        <div class="glass-card game-card spatial-floating-card animate-float" data-launch-game="memory-grid" style="--stat-element-glow: var(--accent-primary-glow); animation-delay: 0.15s; padding: 22px; display: flex; flex-direction: column; gap: 14px; cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div class="game-icon-orb" style="width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%); box-shadow: 0 0 14px var(--accent-primary-glow); color: var(--accent-primary); font-size: 20px; display: flex; align-items: center; justify-content: center;">⊞</div>
            <span class="badge" style="background: rgba(99, 102, 241, 0.15); color: var(--accent-primary); border: 1px solid rgba(99, 102, 241, 0.3); font-size: 11px;">Spatial</span>
          </div>
          <div>
            <div class="game-card-title" style="font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 4px;">Memory Grid Recall</div>
            <div class="game-card-desc" style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4;">Memorize illuminated 3D tiles in a 4x4 matrix and reproduce the spatial coordinates.</div>
          </div>
          <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>Best Level</span>
            <strong style="color: var(--accent-primary); font-family: var(--font-mono);">${getBestScore('Memory Grid')}</strong>
          </div>
        </div>

        <!-- 3. Number Memory -->
        <div class="glass-card game-card spatial-floating-card animate-float" data-launch-game="number-memory" style="--stat-element-glow: var(--el-water-glow); animation-delay: 0.3s; padding: 22px; display: flex; flex-direction: column; gap: 14px; cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div class="game-icon-orb" style="width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%); box-shadow: 0 0 14px var(--accent-cyan-glow); color: var(--accent-cyan); font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center;">123</div>
            <span class="badge" style="background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan); border: 1px solid rgba(6, 182, 212, 0.3); font-size: 11px;">Span</span>
          </div>
          <div>
            <div class="game-card-title" style="font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 4px;">Number Sequence Span</div>
            <div class="game-card-desc" style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4;">Remember a flashed stream of digits that escalates in span length with each round.</div>
          </div>
          <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>Longest Span</span>
            <strong style="color: var(--accent-cyan); font-family: var(--font-mono);">${getBestScore('Number Memory')} digits</strong>
          </div>
        </div>

        <!-- 4. Stroop Test -->
        <div class="glass-card game-card spatial-floating-card animate-float" data-launch-game="stroop" style="--stat-element-glow: var(--el-light-glow); animation-delay: 0.45s; padding: 22px; display: flex; flex-direction: column; gap: 14px; cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div class="game-icon-orb" style="width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%); box-shadow: 0 0 14px var(--accent-amber-glow); color: var(--accent-amber); font-size: 20px; display: flex; align-items: center; justify-content: center;">🎨</div>
            <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-amber); border: 1px solid rgba(245, 158, 11, 0.3); font-size: 11px;">Agility</span>
          </div>
          <div>
            <div class="game-card-title" style="font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 4px;">Stroop Color Agility</div>
            <div class="game-card-desc" style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4;">Select the actual ink color of the word rather than reading the word text.</div>
          </div>
          <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>Best Score</span>
            <strong style="color: var(--accent-amber); font-family: var(--font-mono);">${getBestScore('Stroop Test')}</strong>
          </div>
        </div>

        <!-- 5. Quick Math -->
        <div class="glass-card game-card spatial-floating-card animate-float" data-launch-game="quick-math" style="--stat-element-glow: var(--el-fire-glow); animation-delay: 0.6s; padding: 22px; display: flex; flex-direction: column; gap: 14px; cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div class="game-icon-orb" style="width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(circle, rgba(244, 63, 94, 0.25) 0%, transparent 70%); box-shadow: 0 0 14px var(--el-fire-glow); color: var(--el-fire); font-size: 20px; font-weight: 800; display: flex; align-items: center; justify-content: center;">±</div>
            <span class="badge" style="background: rgba(244, 63, 94, 0.15); color: var(--el-fire); border: 1px solid rgba(244, 63, 94, 0.3); font-size: 11px;">Burst</span>
          </div>
          <div>
            <div class="game-card-title" style="font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 4px;">Quick Math Burst</div>
            <div class="game-card-desc" style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4;">Solve rapid mental equations in a 30-second burst to stimulate executive cognition.</div>
          </div>
          <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>Best Score</span>
            <strong style="color: var(--el-fire); font-family: var(--font-mono);">${getBestScore('Quick Math')}</strong>
          </div>
        </div>

        <!-- 6. Focus Dot -->
        <div class="glass-card game-card spatial-floating-card animate-float" data-launch-game="focus-dot" style="--stat-element-glow: var(--accent-rose-glow); animation-delay: 0.75s; padding: 22px; display: flex; flex-direction: column; gap: 14px; cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div class="game-icon-orb" style="width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(circle, rgba(244, 63, 94, 0.25) 0%, transparent 70%); box-shadow: 0 0 14px var(--accent-rose-glow); color: var(--accent-rose); font-size: 20px; display: flex; align-items: center; justify-content: center;">●</div>
            <span class="badge" style="background: rgba(244, 63, 94, 0.15); color: var(--accent-rose); border: 1px solid rgba(244, 63, 94, 0.3); font-size: 11px;">Pursuit</span>
          </div>
          <div>
            <div class="game-card-title" style="font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 4px;">Focus Dot Tracking</div>
            <div class="game-card-desc" style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.4;">Smooth pursuit visual tracking. Tap shifting orbital targets to calibrate coordination.</div>
          </div>
          <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>Best Score</span>
            <strong style="color: var(--accent-rose); font-family: var(--font-mono);">${getBestScore('Focus Dot')}</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Game Arena Overlay -->
    <div id="game-arena-modal" class="game-arena-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(5, 10, 20, 0.88); backdrop-filter: blur(28px); z-index: 1000; align-items: center; justify-content: center; padding: 20px;">
      <div style="position: absolute; top: 24px; right: 28px; display: flex; gap: 12px;">
        <button class="btn btn-secondary" id="btn-arena-exit" style="border-radius: var(--radius-full); padding: 8px 18px; font-size: 13px;">Exit Arena (Esc)</button>
      </div>
      <div id="game-arena-content" style="width: 100%; max-width: 540px; display: flex; flex-direction: column; align-items: center; text-align: center;"></div>
    </div>
  `;

  // Arena DOM
  const arenaModal = container.querySelector('#game-arena-modal');
  const arenaContent = container.querySelector('#game-arena-content');
  const arenaExit = container.querySelector('#btn-arena-exit');

  const closeArena = () => {
    arenaModal.style.display = 'none';
    arenaContent.innerHTML = '';
    renderGamesView(container, navigate);
  };

  arenaExit.addEventListener('click', closeArena);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && arenaModal.style.display === 'flex') {
      closeArena();
    }
  });

  // Launch Game Handler
  container.querySelectorAll('[data-launch-game]').forEach(card => {
    card.addEventListener('click', () => {
      const gameType = card.getAttribute('data-launch-game');
      arenaModal.style.display = 'flex';
      launchGame(gameType, arenaContent, closeArena);
    });
  });

  container.querySelector('#btn-quick-bored-break').addEventListener('click', () => {
    arenaModal.style.display = 'flex';
    launchGame('reaction', arenaContent, closeArena);
  });
}

function launchGame(gameType, content, onExit) {
  switch (gameType) {
    case 'reaction':
      runReactionTest(content, onExit);
      break;
    case 'memory-grid':
      runMemoryGrid(content, onExit);
      break;
    case 'number-memory':
      runNumberMemory(content, onExit);
      break;
    case 'stroop':
      runStroopTest(content, onExit);
      break;
    case 'quick-math':
      runQuickMath(content, onExit);
      break;
    case 'focus-dot':
      runFocusDot(content, onExit);
      break;
    default:
      break;
  }
}

// ----------------------------------------------------------------------------
// 1. Reaction Test
// ----------------------------------------------------------------------------
function runReactionTest(arena, onExit) {
  let state = 'waiting'; // 'waiting' | 'primed' | 'ready'
  let timerId = null;
  let startTime = 0;

  const render = () => {
    if (state === 'waiting') {
      arena.innerHTML = `
        <h2 style="font-size: 26px; font-weight: 800; margin-bottom: 8px;">Reaction Time Benchmark</h2>
        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 24px;">Tap anywhere to prime the pulse. Click fast when it flashes green!</p>
        <div class="glass-card" id="reaction-box" style="width: 340px; height: 260px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px dashed rgba(255, 255, 255, 0.2); border-radius: var(--radius-lg); box-shadow: var(--shadow-glass); transition: all 0.2s ease;">
          <div style="font-size: 15px; font-weight: 600; color: var(--text-secondary); line-height: 1.5;">Click anywhere to start.<br><span style="color: var(--accent-emerald);">When green appears, click!</span></div>
        </div>
      `;
      arena.querySelector('#reaction-box').addEventListener('click', () => {
        state = 'primed';
        const box = arena.querySelector('#reaction-box');
        box.style.background = 'rgba(239, 68, 68, 0.25)';
        box.style.borderColor = 'var(--priority-critical)';
        box.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.3)';
        box.innerHTML = '<div style="font-size: 20px; font-weight: 700; color: var(--priority-critical);">Wait for green...</div>';

        const delay = 1500 + Math.random() * 3000;
        timerId = setTimeout(() => {
          state = 'ready';
          startTime = performance.now();
          box.style.background = 'var(--accent-emerald)';
          box.style.borderColor = 'var(--accent-emerald)';
          box.style.boxShadow = '0 0 50px var(--accent-emerald-glow)';
          box.innerHTML = '<div style="font-size: 32px; font-weight: 800; color: #fff;">CLICK NOW!</div>';
        }, delay);
      });
    } else if (state === 'primed') {
      clearTimeout(timerId);
      arena.innerHTML = `
        <h2 style="font-size: 26px; font-weight: 800; margin-bottom: 8px; color: var(--priority-critical);">Too Soon!</h2>
        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 24px;">You clicked before the green pulse ignited.</p>
        <button class="btn btn-primary" id="btn-react-retry" style="padding: 10px 28px;">Try Again</button>
      `;
      arena.querySelector('#btn-react-retry').addEventListener('click', () => {
        state = 'waiting';
        render();
      });
    }
  };

  arena.addEventListener('click', () => {
    if (state === 'ready') {
      const elapsed = Math.round(performance.now() - startTime);
      store.recordGameScore('Reaction Test', elapsed, 5);
      ambientAudio.playChime();
      arena.innerHTML = `
        <h2 style="font-size: 42px; font-weight: 800; margin-bottom: 8px; color: var(--accent-emerald); font-family: var(--font-mono);">${elapsed} ms</h2>
        <p style="font-size: 15px; color: var(--text-secondary); margin-bottom: 24px;">
          ${elapsed < 220 ? '⚡ Lightning synaptic reflexes!' : elapsed < 280 ? '🎯 Sharp cognitive reaction speed.' : 'Solid focus calibration.'}
        </p>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-secondary" id="btn-react-again">Play Again</button>
          <button class="btn btn-primary" id="btn-react-done">Return to Workspace</button>
        </div>
      `;
      arena.querySelector('#btn-react-again').addEventListener('click', () => {
        state = 'waiting';
        render();
      });
      arena.querySelector('#btn-react-done').addEventListener('click', onExit);
    } else if (state === 'primed') {
      state = 'primed';
      render();
    }
  });

  render();
}

// ----------------------------------------------------------------------------
// 2. Memory Grid
// ----------------------------------------------------------------------------
function runMemoryGrid(arena, onExit) {
  let level = 3;
  const gridSize = 4;
  let pattern = [];
  let userSelection = [];
  let isDisplaying = true;

  const startLevel = () => {
    pattern = [];
    userSelection = [];
    isDisplaying = true;

    while (pattern.length < level) {
      const idx = Math.floor(Math.random() * (gridSize * gridSize));
      if (!pattern.includes(idx)) pattern.push(idx);
    }

    render();

    setTimeout(() => {
      isDisplaying = false;
      render();
    }, 1200 + level * 200);
  };

  const render = () => {
    arena.innerHTML = `
      <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 6px;">Memory Grid — Level ${level - 2}</h2>
      <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 22px;">
        ${isDisplaying ? 'Memorize the illuminated spatial coordinates...' : 'Recall and tap all highlighted tiles.'}
      </p>

      <div class="memory-grid-container" style="display: grid; grid-template-columns: repeat(${gridSize}, 66px); gap: 10px; justify-content: center; margin-bottom: 26px; perspective: 800px;">
        ${Array.from({ length: gridSize * gridSize }, (_, i) => {
          const isLit = isDisplaying && pattern.includes(i);
          const isSelected = userSelection.includes(i);
          const isCorrect = isSelected && pattern.includes(i);
          const isWrong = isSelected && !pattern.includes(i);

          let bg = 'rgba(255, 255, 255, 0.05)';
          let border = '1px solid rgba(255, 255, 255, 0.12)';
          let shadow = 'inset 0 1px 2px rgba(0,0,0,0.4)';

          if (isLit) {
            bg = 'var(--accent-primary)';
            border = '1px solid var(--accent-primary)';
            shadow = '0 0 20px var(--accent-primary-glow)';
          } else if (isCorrect) {
            bg = 'var(--accent-emerald)';
            border = '1px solid var(--accent-emerald)';
            shadow = '0 0 20px var(--accent-emerald-glow)';
          } else if (isWrong) {
            bg = 'var(--priority-critical)';
            border = '1px solid var(--priority-critical)';
            shadow = '0 0 20px rgba(239, 68, 68, 0.6)';
          }

          return `
            <div class="grid-tile memory-3d-tile" data-idx="${i}" 
                 style="width: 66px; height: 66px; border-radius: 10px; background: ${bg}; border: ${border}; box-shadow: ${shadow}; cursor: ${isDisplaying ? 'default' : 'pointer'}; transition: all var(--transition-fast);">
            </div>
          `;
        }).join('')}
      </div>
    `;

    if (!isDisplaying) {
      arena.querySelectorAll('.grid-tile').forEach(tile => {
        tile.addEventListener('click', () => {
          const idx = parseInt(tile.getAttribute('data-idx'), 10);
          if (userSelection.includes(idx)) return;
          userSelection.push(idx);

          if (!pattern.includes(idx)) {
            // Failure
            store.recordGameScore('Memory Grid', level - 2, 30);
            arena.innerHTML = `
              <h2 style="font-size: 26px; font-weight: 800; margin-bottom: 8px; color: var(--priority-critical);">Recall Complete!</h2>
              <p style="font-size: 14.5px; color: var(--text-secondary); margin-bottom: 24px;">You achieved Level ${level - 2} (${pattern.length} tiles spatial span).</p>
              <div style="display: flex; gap: 12px;">
                <button class="btn btn-secondary" id="btn-grid-retry">Play Again</button>
                <button class="btn btn-primary" id="btn-grid-done">Return to Workspace</button>
              </div>
            `;
            arena.querySelector('#btn-grid-retry').addEventListener('click', () => {
              level = 3;
              startLevel();
            });
            arena.querySelector('#btn-grid-done').addEventListener('click', onExit);
            return;
          }

          // Check if all found
          if (userSelection.length === pattern.length) {
            ambientAudio.playChime();
            level++;
            startLevel();
          } else {
            render();
          }
        });
      });
    }
  };

  startLevel();
}

// ----------------------------------------------------------------------------
// 3. Number Memory
// ----------------------------------------------------------------------------
function runNumberMemory(arena, onExit) {
  let length = 4;
  let currentDigits = '';

  const nextStage = () => {
    currentDigits = '';
    for (let i = 0; i < length; i++) {
      currentDigits += Math.floor(Math.random() * 10).toString();
    }

    arena.innerHTML = `
      <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 6px;">Number Memory (${length} Digits)</h2>
      <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 26px;">Memorize the digit sequence before it vanishes...</p>
      <div style="font-family: var(--font-mono); font-size: 52px; font-weight: 800; letter-spacing: 6px; color: var(--accent-cyan); text-shadow: 0 0 25px var(--accent-cyan-glow); margin-bottom: 28px;">
        ${currentDigits}
      </div>
      <div style="width: 220px; height: 5px; background: rgba(255, 255, 255, 0.08); border-radius: var(--radius-full); overflow: hidden;">
        <div id="num-progress" style="width: 100%; height: 100%; background: var(--accent-cyan); transition: width ${1500 + length * 350}ms linear;"></div>
      </div>
    `;

    setTimeout(() => {
      const p = arena.querySelector('#num-progress');
      if (p) p.style.width = '0%';
    }, 50);

    setTimeout(() => {
      promptUser();
    }, 1500 + length * 350);
  };

  const promptUser = () => {
    arena.innerHTML = `
      <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 6px;">Recall the Digits</h2>
      <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 22px;">What was the ${length}-digit sequence?</p>
      <input type="text" id="num-input" class="glass-input" style="font-family: var(--font-mono); font-size: 32px; letter-spacing: 6px; text-align: center; max-width: 280px; margin-bottom: 22px; padding: 10px;" autofocus>
      <button class="btn btn-primary" id="btn-num-submit" style="padding: 10px 32px; font-weight: 700;">Submit</button>
    `;

    const inp = arena.querySelector('#num-input');
    inp.focus();

    const submit = () => {
      const val = inp.value.trim();
      if (val === currentDigits) {
        ambientAudio.playChime();
        length++;
        nextStage();
      } else {
        store.recordGameScore('Number Memory', length - 1, 45);
        arena.innerHTML = `
          <h2 style="font-size: 26px; font-weight: 800; margin-bottom: 8px; color: var(--priority-critical);">Sequence Broke</h2>
          <p style="font-size: 14.5px; color: var(--text-secondary); margin-bottom: 6px;">The number was <strong style="color: #fff; font-family: var(--font-mono); font-size: 18px;">${currentDigits}</strong></p>
          <p style="font-size: 14.5px; color: var(--text-secondary); margin-bottom: 24px;">Working memory span: <strong style="color: var(--accent-cyan);">${length - 1} digits</strong></p>
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-secondary" id="btn-num-retry">Play Again</button>
            <button class="btn btn-primary" id="btn-num-done">Return to Workspace</button>
          </div>
        `;
        arena.querySelector('#btn-num-retry').addEventListener('click', () => {
          length = 4;
          nextStage();
        });
        arena.querySelector('#btn-num-done').addEventListener('click', onExit);
      }
    };

    arena.querySelector('#btn-num-submit').addEventListener('click', submit);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  };

  nextStage();
}

// ----------------------------------------------------------------------------
// 4. Stroop Test
// ----------------------------------------------------------------------------
function runStroopTest(arena, onExit) {
  const colors = [
    { name: 'Red', color: '#EF4444' },
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Green', color: '#10B981' },
    { name: 'Yellow', color: '#F59E0B' }
  ];

  let score = 0;
  let rounds = 12;
  let currentRound = 0;

  const nextQuestion = () => {
    currentRound++;
    if (currentRound > rounds) {
      store.recordGameScore('Stroop Test', score, 30);
      ambientAudio.playChime();
      arena.innerHTML = `
        <h2 style="font-size: 32px; font-weight: 800; margin-bottom: 8px; color: var(--accent-amber); font-family: var(--font-mono);">${score} / ${rounds} Points</h2>
        <p style="font-size: 14.5px; color: var(--text-secondary); margin-bottom: 24px;">Cognitive interference handled with high precision!</p>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-secondary" id="btn-stroop-retry">Play Again</button>
          <button class="btn btn-primary" id="btn-stroop-done">Return to Workspace</button>
        </div>
      `;
      arena.querySelector('#btn-stroop-retry').addEventListener('click', () => {
        score = 0;
        currentRound = 0;
        nextQuestion();
      });
      arena.querySelector('#btn-stroop-done').addEventListener('click', onExit);
      return;
    }

    const wordItem = colors[Math.floor(Math.random() * colors.length)];
    const colorItem = colors[Math.floor(Math.random() * colors.length)];

    arena.innerHTML = `
      <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 6px;">Stroop Agility (Round ${currentRound}/${rounds})</h2>
      <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 30px;">Select the <strong>INK COLOR</strong>, ignore the word itself.</p>

      <div style="font-size: 52px; font-weight: 800; color: ${colorItem.color}; margin-bottom: 36px; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 20px ${colorItem.color}50;">
        ${wordItem.name}
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; max-width: 320px; width: 100%;">
        ${colors.map(c => `
          <button class="btn btn-secondary btn-stroop-option" data-color-name="${c.name}" style="padding: 14px; font-size: 15px; font-weight: 700; border-radius: var(--radius-md);">
            ${c.name}
          </button>
        `).join('')}
      </div>
    `;

    arena.querySelectorAll('.btn-stroop-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const picked = btn.getAttribute('data-color-name');
        if (picked === colorItem.name) {
          score++;
        }
        nextQuestion();
      });
    });
  };

  nextQuestion();
}

// ----------------------------------------------------------------------------
// 5. Quick Math
// ----------------------------------------------------------------------------
function runQuickMath(arena, onExit) {
  let score = 0;
  let timeLeft = 30;
  let timerId = null;

  const nextProblem = () => {
    const a = Math.floor(Math.random() * 20) + 2;
    const b = Math.floor(Math.random() * 20) + 2;
    const isMult = Math.random() > 0.6;
    const ans = isMult ? a * b : a + b;
    const op = isMult ? '×' : '+';

    arena.innerHTML = `
      <div style="display: flex; justify-content: space-between; width: 100%; max-width: 320px; font-size: 14px; color: var(--text-tertiary); margin-bottom: 18px;">
        <span>Score: <strong style="color: #fff; font-family: var(--font-mono);">${score}</strong></span>
        <span>Time: <strong style="color: var(--el-fire); font-family: var(--font-mono);">${timeLeft}s</strong></span>
      </div>

      <div style="font-family: var(--font-mono); font-size: 46px; font-weight: 800; margin-bottom: 26px; color: #fff;">
        ${a} ${op} ${b} = ?
      </div>

      <input type="number" id="math-input" class="glass-input" style="font-family: var(--font-mono); font-size: 28px; text-align: center; max-width: 220px; margin-bottom: 22px;" autofocus>
      <button class="btn btn-primary" id="btn-math-submit" style="padding: 10px 28px; font-weight: 700;">Submit</button>
    `;

    const inp = arena.querySelector('#math-input');
    inp.focus();

    const submit = () => {
      if (parseInt(inp.value, 10) === ans) {
        score++;
      }
      nextProblem();
    };

    arena.querySelector('#btn-math-submit').addEventListener('click', submit);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  };

  timerId = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      store.recordGameScore('Quick Math', score, 30);
      ambientAudio.playChime();
      arena.innerHTML = `
        <h2 style="font-size: 32px; font-weight: 800; margin-bottom: 8px; color: var(--accent-primary); font-family: var(--font-mono);">${score} Equations Solved!</h2>
        <p style="font-size: 14.5px; color: var(--text-secondary); margin-bottom: 24px;">Sharp mental arithmetic calibration under 30 seconds.</p>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-secondary" id="btn-math-retry">Play Again</button>
          <button class="btn btn-primary" id="btn-math-done">Return to Workspace</button>
        </div>
      `;
      arena.querySelector('#btn-math-retry').addEventListener('click', () => {
        score = 0;
        timeLeft = 30;
        nextProblem();
      });
      arena.querySelector('#btn-math-done').addEventListener('click', onExit);
    } else {
      const tEl = arena.querySelector('strong[style*="el-fire"]');
      if (tEl) tEl.textContent = `${timeLeft}s`;
    }
  }, 1000);

  nextProblem();
}

// ----------------------------------------------------------------------------
// 6. Focus Dot
// ----------------------------------------------------------------------------
function runFocusDot(arena, onExit) {
  let score = 0;
  let remainingHits = 15;

  arena.innerHTML = `
    <h2 style="font-size: 22px; font-weight: 800; margin-bottom: 6px;">Focus Dot Tracking</h2>
    <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 18px;">Click the shifting orbital dot (${remainingHits} targets remaining)</p>
    <div id="dot-arena" class="glass-card" style="width: 360px; height: 280px; position: relative; overflow: hidden; cursor: crosshair; box-shadow: var(--shadow-glass); border-radius: var(--radius-lg);"></div>
  `;

  const box = arena.querySelector('#dot-arena');

  const spawnDot = () => {
    box.innerHTML = '';
    const x = 30 + Math.random() * (360 - 70);
    const y = 30 + Math.random() * (280 - 70);

    const dot = document.createElement('div');
    dot.style.position = 'absolute';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.width = '24px';
    dot.style.height = '24px';
    dot.style.borderRadius = '50%';
    dot.style.background = 'var(--accent-rose)';
    dot.style.boxShadow = '0 0 16px var(--accent-rose-glow)';
    dot.style.cursor = 'pointer';
    dot.style.transition = 'transform 0.1s ease';

    dot.addEventListener('click', () => {
      score++;
      remainingHits--;
      if (remainingHits <= 0) {
        store.recordGameScore('Focus Dot', score, 20);
        ambientAudio.playChime();
        arena.innerHTML = `
          <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 8px; color: var(--accent-rose);">Pursuit Calibration Complete!</h2>
          <p style="font-size: 14.5px; color: var(--text-secondary); margin-bottom: 24px;">100% Target accuracy achieved in continuous pursuit.</p>
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-secondary" id="btn-dot-retry">Play Again</button>
            <button class="btn btn-primary" id="btn-dot-done">Return to Workspace</button>
          </div>
        `;
        arena.querySelector('#btn-dot-retry').addEventListener('click', () => runFocusDot(arena, onExit));
        arena.querySelector('#btn-dot-done').addEventListener('click', onExit);
      } else {
        spawnDot();
      }
    });

    box.appendChild(dot);
  };

  spawnDot();
}
