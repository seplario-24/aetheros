/**
 * AETHER OS — COGNITIVE BREAK & BOREDOM GAMES
 * 6 minimalist, high-speed cognitive agility mini-games:
 * 1. Reaction Test (ms benchmark)
 * 2. Memory Grid (spatial recall)
 * 3. Number Memory (digit span sequence)
 * 4. Stroop Test (interference cognition)
 * 5. Quick Math (30-second arithmetic burst)
 * 6. Focus Dot (visual motion tracking)
 */

import { store } from '../store/db.js';

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
    <div class="animate-fade-in">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; flex-wrap: wrap; gap: 14px;">
        <div>
          <h1 style="font-size: 26px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 4px;">Cognitive Mind Breaks</h1>
          <p style="font-size: 13.5px; color: var(--text-secondary);">Intentional 1–3 minute mental resets. Sharpen reaction, working memory, and focus.</p>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-primary" id="btn-quick-bored-break">
            ⚡ Quick 2-Minute Reset
          </button>
        </div>
      </div>

      <!-- Games Grid -->
      <div class="games-grid">
        <!-- 1. Reaction Test -->
        <div class="glass-card game-card" data-launch-game="reaction">
          <div class="game-icon-orb" style="color: var(--accent-emerald);">⚡</div>
          <div>
            <div class="game-card-title">Reaction Time</div>
            <div class="game-card-desc">Click as soon as the screen flashes luminous emerald. Tests visual synaptic speed.</div>
          </div>
          <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>Personal Best</span>
            <strong style="color: var(--accent-emerald);">${getBestScore('Reaction Test')}</strong>
          </div>
        </div>

        <!-- 2. Memory Grid -->
        <div class="glass-card game-card" data-launch-game="memory-grid">
          <div class="game-icon-orb" style="color: var(--accent-primary);">⊞</div>
          <div>
            <div class="game-card-title">Memory Grid</div>
            <div class="game-card-desc">Memorize illuminated tiles in a 4x4 grid and reproduce the spatial pattern.</div>
          </div>
          <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>Best Level</span>
            <strong style="color: var(--accent-primary);">${getBestScore('Memory Grid')}</strong>
          </div>
        </div>

        <!-- 3. Number Memory -->
        <div class="glass-card game-card" data-launch-game="number-memory">
          <div class="game-icon-orb" style="color: var(--accent-cyan);">123</div>
          <div>
            <div class="game-card-title">Number Memory</div>
            <div class="game-card-desc">Remember a flashed sequence of digits that increases in length with each stage.</div>
          </div>
          <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>Longest Span</span>
            <strong style="color: var(--accent-cyan);">${getBestScore('Number Memory')} digits</strong>
          </div>
        </div>

        <!-- 4. Stroop Test -->
        <div class="glass-card game-card" data-launch-game="stroop">
          <div class="game-icon-orb" style="color: var(--accent-amber);">🎨</div>
          <div>
            <div class="game-card-title">Stroop Agility</div>
            <div class="game-card-desc">Choose the ink color of the word rather than reading the text. Overcomes cognitive bias.</div>
          </div>
          <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>Best Score</span>
            <strong style="color: var(--accent-amber);">${getBestScore('Stroop Test')}</strong>
          </div>
        </div>

        <!-- 5. Quick Math -->
        <div class="glass-card game-card" data-launch-game="quick-math">
          <div class="game-icon-orb" style="color: var(--cat-editing);">±</div>
          <div>
            <div class="game-card-title">Quick Math Burst</div>
            <div class="game-card-desc">Solve rapid arithmetic equations within 30 seconds to stimulate executive function.</div>
          </div>
          <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>Best Score</span>
            <strong style="color: var(--cat-editing);">${getBestScore('Quick Math')}</strong>
          </div>
        </div>

        <!-- 6. Focus Dot -->
        <div class="glass-card game-card" data-launch-game="focus-dot">
          <div class="game-icon-orb" style="color: var(--accent-rose);">●</div>
          <div>
            <div class="game-card-title">Focus Dot Pursuit</div>
            <div class="game-card-desc">Smooth pursuit tracking exercise. Click the shifting orbital dot to measure coordination.</div>
          </div>
          <div style="margin-top: auto; display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); border-top: 1px solid var(--border-subtle); padding-top: 10px;">
            <span>Best Score</span>
            <strong style="color: var(--accent-rose);">${getBestScore('Focus Dot')}</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Game Arena Overlay -->
    <div id="game-arena-modal" class="game-arena-overlay" style="display: none;">
      <div style="position: absolute; top: 24px; right: 28px; display: flex; gap: 12px;">
        <button class="btn btn-secondary" id="btn-arena-exit">Exit Game (Esc)</button>
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
  let state = 'waiting'; // 'waiting' | 'ready' | 'clicked'
  let timerId = null;
  let startTime = 0;

  const render = () => {
    if (state === 'waiting') {
      arena.innerHTML = `
        <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 12px;">Reaction Time Benchmark</h2>
        <div class="glass-card" id="reaction-box" style="width: 320px; height: 240px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px dashed var(--border-glass); border-radius: var(--radius-lg);">
          <div style="font-size: 16px; font-weight: 500; color: var(--text-secondary);">Click anywhere to start.<br>When it turns GREEN, click fast!</div>
        </div>
      `;
      arena.querySelector('#reaction-box').addEventListener('click', () => {
        state = 'primed';
        arena.querySelector('#reaction-box').style.background = 'rgba(239, 68, 68, 0.2)';
        arena.querySelector('#reaction-box').style.borderColor = 'var(--priority-critical)';
        arena.querySelector('#reaction-box').innerHTML = '<div style="font-size: 18px; font-weight: 600; color: var(--priority-critical);">Wait for green...</div>';

        const delay = 1500 + Math.random() * 3000;
        timerId = setTimeout(() => {
          state = 'ready';
          startTime = performance.now();
          arena.querySelector('#reaction-box').style.background = 'var(--accent-emerald)';
          arena.querySelector('#reaction-box').style.borderColor = 'var(--accent-emerald)';
          arena.querySelector('#reaction-box').innerHTML = '<div style="font-size: 28px; font-weight: 700; color: #fff;">CLICK NOW!</div>';
        }, delay);
      });
    } else if (state === 'primed') {
      // Clicked too early
      clearTimeout(timerId);
      arena.innerHTML = `
        <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 12px; color: var(--priority-critical);">Too Soon!</h2>
        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 20px;">You clicked before the green flash.</p>
        <button class="btn btn-primary" id="btn-react-retry">Try Again</button>
      `;
      arena.querySelector('#btn-react-retry').addEventListener('click', () => {
        state = 'waiting';
        render();
      });
    }
  };

  arena.addEventListener('click', (e) => {
    if (state === 'ready') {
      const elapsed = Math.round(performance.now() - startTime);
      store.recordGameScore('Reaction Test', elapsed, 5);
      arena.innerHTML = `
        <h2 style="font-size: 32px; font-weight: 700; margin-bottom: 8px; color: var(--accent-emerald);">${elapsed} ms</h2>
        <p style="font-size: 14.5px; color: var(--text-secondary); margin-bottom: 20px;">
          ${elapsed < 220 ? 'Lightning cognitive reflexes!' : elapsed < 280 ? 'Sharp reaction speed.' : 'Solid focus recovery.'}
        </p>
        <div style="display: flex; gap: 10px;">
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
  let level = 3; // number of tiles to memorize
  const gridSize = 4; // 4x4
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
      <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 6px;">Memory Grid — Level ${level - 2}</h2>
      <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 20px;">
        ${isDisplaying ? 'Memorize the illuminated positions...' : 'Recall and tap all highlighted tiles.'}
      </p>

      <div class="memory-grid-container" style="grid-template-columns: repeat(${gridSize}, 62px); justify-content: center; margin-bottom: 24px;">
        ${Array.from({ length: gridSize * gridSize }, (_, i) => {
          const isLit = isDisplaying && pattern.includes(i);
          const isSelected = userSelection.includes(i);
          const isCorrect = isSelected && pattern.includes(i);
          const isWrong = isSelected && !pattern.includes(i);

          let stateClass = '';
          if (isLit) stateClass = 'lit';
          else if (isCorrect) stateClass = 'correct';
          else if (isWrong) stateClass = 'wrong';

          return `
            <div class="grid-tile memory-3d-tile ${stateClass} ${isDisplaying ? 'locked' : ''}" data-idx="${i}" style="width: 62px; height: 62px;"></div>
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
              <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: var(--priority-critical);">Level Complete!</h2>
              <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 20px;">You reached Level ${level - 2} (${pattern.length} tiles spatial span).</p>
              <div style="display: flex; gap: 10px;">
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
      <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 6px;">Number Memory (${length} Digits)</h2>
      <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 24px;">Memorize the sequence before it vanishes...</p>
      <div style="font-family: var(--font-mono); font-size: 48px; font-weight: 700; letter-spacing: 4px; color: var(--accent-cyan); margin-bottom: 28px;">
        ${currentDigits}
      </div>
      <div style="width: 200px; height: 4px; background: var(--bg-surface); border-radius: var(--radius-full); overflow: hidden;">
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
      <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 6px;">Recall the Digits</h2>
      <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 20px;">What was the ${length}-digit number?</p>
      <input type="text" id="num-input" class="glass-input" style="font-family: var(--font-mono); font-size: 28px; letter-spacing: 4px; text-align: center; max-width: 280px; margin-bottom: 20px;" autofocus>
      <button class="btn btn-primary" id="btn-num-submit" style="padding: 10px 28px;">Submit</button>
    `;

    const inp = arena.querySelector('#num-input');
    inp.focus();

    const submit = () => {
      const val = inp.value.trim();
      if (val === currentDigits) {
        length++;
        nextStage();
      } else {
        store.recordGameScore('Number Memory', length, 45);
        arena.innerHTML = `
          <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: var(--priority-critical);">Incorrect Recall</h2>
          <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 6px;">The number was <strong>${currentDigits}</strong></p>
          <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 20px;">Your working memory span: <strong>${length - 1} digits</strong></p>
          <div style="display: flex; gap: 10px;">
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
      arena.innerHTML = `
        <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 8px; color: var(--accent-amber);">${score} / ${rounds} Points</h2>
        <p style="font-size: 14.5px; color: var(--text-secondary); margin-bottom: 20px;">Cognitive interference handled with high precision!</p>
        <div style="display: flex; gap: 10px;">
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
      <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 6px;">Stroop Agility (Round ${currentRound}/${rounds})</h2>
      <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 28px;">Select the <strong>INK COLOR</strong>, ignore the word itself.</p>

      <div style="font-size: 48px; font-weight: 800; color: ${colorItem.color}; margin-bottom: 36px; text-transform: uppercase; letter-spacing: 2px;">
        ${wordItem.name}
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 320px; width: 100%;">
        ${colors.map(c => `
          <button class="btn btn-secondary btn-stroop-option" data-color-name="${c.name}" style="padding: 14px; font-size: 15px; font-weight: 600;">
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
      <div style="display: flex; justify-content: space-between; width: 100%; max-width: 320px; font-size: 13.5px; color: var(--text-tertiary); margin-bottom: 16px;">
        <span>Score: <strong style="color: var(--text-primary);">${score}</strong></span>
        <span>Time Remaining: <strong style="color: var(--accent-rose); font-family: var(--font-mono);">${timeLeft}s</strong></span>
      </div>

      <div style="font-family: var(--font-mono); font-size: 42px; font-weight: 700; margin-bottom: 24px;">
        ${a} ${op} ${b} = ?
      </div>

      <input type="number" id="math-input" class="glass-input" style="font-family: var(--font-mono); font-size: 26px; text-align: center; max-width: 200px; margin-bottom: 20px;" autofocus>
      <button class="btn btn-primary" id="btn-math-submit" style="padding: 10px 24px;">Next</button>
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
      arena.innerHTML = `
        <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 8px; color: var(--accent-primary);">${score} Equations Solved!</h2>
        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 20px;">Sharp mental math calibration under 30 seconds.</p>
        <div style="display: flex; gap: 10px;">
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
      const tEl = arena.querySelector('strong[style*="accent-rose"]');
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
    <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">Focus Dot Tracking</h2>
    <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">Click the shifting orbital dot (${remainingHits} targets remaining)</p>
    <div id="dot-arena" class="glass-card" style="width: 360px; height: 280px; position: relative; overflow: hidden; cursor: crosshair;"></div>
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
    dot.style.boxShadow = '0 0 12px var(--accent-rose-glow)';
    dot.style.cursor = 'pointer';

    dot.addEventListener('click', () => {
      score++;
      remainingHits--;
      if (remainingHits <= 0) {
        store.recordGameScore('Focus Dot', score, 20);
        arena.innerHTML = `
          <h2 style="font-size: 26px; font-weight: 700; margin-bottom: 8px; color: var(--accent-rose);">Pursuit Complete!</h2>
          <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 20px;">100% Target accuracy achieved.</p>
          <div style="display: flex; gap: 10px;">
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
