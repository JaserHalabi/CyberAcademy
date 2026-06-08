/**
 * CyberCompanion — Tutorial State Manager & Overlay Renderer
 * 
 * Manages the state of solved challenges, calculates XP and levels,
 * and renders the overlay UI (progress dashboard, toasts, hints).
 */

class TutorialStateManager {
  constructor() {
    this.challengesData = null; // From challenges.json
    this.solvedChallenges = new Map(); // key -> { solvedAt, xp }
    this.totalXP = 0;
    this.level = 1;
    this.activePageHint = null;

    this.LEVELS = [
      { max: 0, name: "Script Kiddie" },
      { max: 500, name: "Apprentice" },
      { max: 1200, name: "Hacker" },
      { max: 2500, name: "Pro Hacker" },
      { max: 5000, name: "Elite Hacker" },
      { max: 8000, name: "Legendary" }
    ];
  }

  async loadData() {
    try {
      const res = await fetch('challenges.json');
      this.challengesData = await res.json();
    } catch (e) {
      console.error('Failed to load challenges.json', e);
    }
  }

  restore() {
    const saved = localStorage.getItem('cybercompanion_progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.solved) {
          this.solvedChallenges = new Map(Object.entries(data.solved));
        }
        this.totalXP = data.totalXP || 0;
        this.recalculateLevel();
      } catch (e) {
        console.error('Failed to parse saved progress', e);
      }
    }
  }

  persist() {
    localStorage.setItem('cybercompanion_progress', JSON.stringify({
      solved: Object.fromEntries(this.solvedChallenges),
      totalXP: this.totalXP
    }));
  }

  recalculateLevel() {
    this.level = 1;
    for (let i = 1; i < this.LEVELS.length; i++) {
      if (this.totalXP >= this.LEVELS[i].max) {
        this.level = i + 1;
      } else {
        break;
      }
    }
  }

  getChallengeInfo(key) {
    if (!this.challengesData || !this.challengesData.mappings[key]) {
      return { xp: 100, module: null, celebrationText: "Challenge solved!" }; // Default
    }
    return this.challengesData.mappings[key];
  }

  handleChallengeSolved(payload) {
    if (!payload || !payload.key) return null;
    
    // Ignore if already solved in our state
    if (this.solvedChallenges.has(payload.key)) return null;

    const info = this.getChallengeInfo(payload.key);
    const xpGained = info.xp || 100;

    const oldLevel = this.level;

    this.solvedChallenges.set(payload.key, {
      name: payload.name || payload.key,
      solvedAt: Date.now(),
      xp: xpGained,
      module: info.module
    });

    this.totalXP += xpGained;
    this.recalculateLevel();
    this.persist();

    return {
      challenge: payload,
      info: info,
      xpGained: xpGained,
      leveledUp: this.level > oldLevel
    };
  }

  handleChallengesSync(data) {
    if (!data || !data.challenges) return false;
    
    let stateChanged = false;
    const oldLevel = this.level;

    data.challenges.forEach(ch => {
      if (ch.solved && !this.solvedChallenges.has(ch.key)) {
        const info = this.getChallengeInfo(ch.key);
        const xpGained = info.xp || 100;
        
        this.solvedChallenges.set(ch.key, {
          name: ch.name || ch.key,
          solvedAt: Date.now(),
          xp: xpGained,
          module: info.module
        });
        
        this.totalXP += xpGained;
        stateChanged = true;
      }
    });

    if (stateChanged) {
      this.recalculateLevel();
      this.persist();
    }

    return {
      stateChanged,
      leveledUp: this.level > oldLevel
    };
  }

  handlePageChange(data) {
    if (!this.challengesData || !this.challengesData.pageHints) return null;
    
    // Exact match or partial match on hash
    let hash = data.hash || '/';
    let hint = this.challengesData.pageHints[hash];
    
    if (!hint) {
      // Try partial matching
      for (const [key, val] of Object.entries(this.challengesData.pageHints)) {
        if (hash.startsWith(key)) {
          hint = val;
          break;
        }
      }
    }
    
    this.activePageHint = hint || null;
    return this.activePageHint;
  }

  getProgress() {
    let nextLevelXp = 8000;
    if (this.level < this.LEVELS.length) {
      nextLevelXp = this.LEVELS[this.level].max;
    }
    
    const levelName = this.LEVELS[Math.min(this.level - 1, this.LEVELS.length - 1)].name;

    // Calculate category progress (simulated for now, would be better with full category mapping)
    const solvedCount = this.solvedChallenges.size;
    
    // Sort recent challenges
    const recent = Array.from(this.solvedChallenges.entries())
      .map(([k, v]) => ({ key: k, ...v }))
      .sort((a, b) => b.solvedAt - a.solvedAt)
      .slice(0, 5);

    return {
      totalXP: this.totalXP,
      level: this.level,
      levelName: levelName,
      nextLevelXp: nextLevelXp,
      xpPercent: Math.min(100, Math.floor((this.totalXP / nextLevelXp) * 100)),
      solvedCount: solvedCount,
      recent: recent
    };
  }
}

class OverlayRenderer {
  constructor(stateManager) {
    this.state = stateManager;
    this.container = document.getElementById('overlayContent');
    this.toastsContainer = document.getElementById('achievementToasts');
    this.hintContainer = document.getElementById('contextHint');
  }

  renderDashboard() {
    if (!this.container) return;

    const progress = this.state.getProgress();

    this.container.innerHTML = `
      <div class="xp-section" id="xpSection">
        <div class="xp-header">
          <div class="level-badge">
            <span class="level-label">Level</span>
            <span class="level-value">${progress.level}</span>
            <span class="level-title">${progress.levelName}</span>
          </div>
          <div class="xp-stats">
            <div class="xp-current">${progress.totalXP} XP</div>
            <div class="xp-next">/ ${progress.nextLevelXp} XP</div>
          </div>
        </div>
        <div class="xp-bar-container">
          <div class="xp-bar-fill" id="xpBarFill" style="width: ${progress.xpPercent}%"></div>
        </div>
        <div class="level-up-glow" id="levelUpGlow"></div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <span class="stat-value">${progress.solvedCount}</span>
            <span class="stat-label">Solved</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <span class="stat-value">${progress.recent.length ? 'Active' : 'Idle'}</span>
            <span class="stat-label">Streak</span>
          </div>
        </div>
      </div>

      <div class="section-heading">Recent Achievements</div>
      <div class="recent-list">
        ${progress.recent.length === 0 ? '<div class="empty-state">No challenges solved yet. Boot the lab and start hacking!</div>' : ''}
        ${progress.recent.map(ch => `
          <div class="recent-item">
            <div class="recent-name">${this.escapeHtml(ch.name)}</div>
            <div class="recent-xp">+${ch.xp}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  updateXP(newXP, percent, leveledUp) {
    const xpSection = document.getElementById('xpSection');
    if (xpSection) {
      const fill = document.getElementById('xpBarFill');
      if (fill) fill.style.width = `${percent}%`;
      
      const current = xpSection.querySelector('.xp-current');
      if (current) current.textContent = `${newXP} XP`;
      
      if (leveledUp) {
        const glow = document.getElementById('levelUpGlow');
        if (glow) {
          glow.classList.remove('active');
          void glow.offsetWidth; // trigger reflow
          glow.classList.add('active');
        }
        // Re-render whole dashboard to update level numbers
        setTimeout(() => this.renderDashboard(), 1000);
      }
    } else {
      this.renderDashboard();
    }
  }

  showAchievementToast(result) {
    if (!this.toastsContainer) return;

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    
    // Add confetti
    const confetti = document.createElement('div');
    confetti.className = 'confetti-container';
    for (let i = 0; i < 20; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = `${Math.random() * 100}%`;
      c.style.animationDelay = `${Math.random() * 0.5}s`;
      c.style.backgroundColor = ['#00f0ff', '#8b5cf6', '#22c55e', '#f59e0b'][Math.floor(Math.random() * 4)];
      confetti.appendChild(c);
    }
    toast.appendChild(confetti);

    const moduleLink = result.info.module 
      ? `<div class="toast-link" onclick="window.__overlay.goToModule('${result.info.module}')">Review Module</div>`
      : '';

    toast.innerHTML += `
      <div class="toast-icon">🏆</div>
      <div class="toast-content">
        <div class="toast-title">Challenge Solved</div>
        <div class="toast-challenge">${this.escapeHtml(result.challenge.name)}</div>
        <div class="toast-xp">+${result.xpGained} XP</div>
        ${moduleLink}
      </div>
      <button class="toast-close" onclick="this.parentElement.classList.add('hiding'); setTimeout(() => this.parentElement.remove(), 400)">✕</button>
    `;

    this.toastsContainer.appendChild(toast);

    // Auto dismiss
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.classList.add('hiding');
        setTimeout(() => {
          if (document.body.contains(toast)) toast.remove();
        }, 400);
      }
    }, 6000);
  }

  showContextHint(hint) {
    if (!this.hintContainer) return;
    
    if (!hint) {
      this.hideContextHint();
      return;
    }

    const modulesHtml = (hint.relatedModules || []).map(m => 
      `<span class="hint-module-badge">${m}</span>`
    ).join('');

    this.hintContainer.innerHTML = `
      <div class="context-hint-icon">${hint.icon || '💡'}</div>
      <div class="context-hint-content">
        <div class="context-hint-title">${this.escapeHtml(hint.title)}</div>
        <div class="context-hint-body">${this.escapeHtml(hint.body)}</div>
        <div class="context-hint-modules">${modulesHtml}</div>
      </div>
      <button class="context-hint-close" onclick="window.__overlay.renderer.hideContextHint()">✕</button>
    `;
    
    this.hintContainer.style.display = 'flex';
    this.hintContainer.classList.remove('hiding');
  }

  hideContextHint() {
    if (!this.hintContainer || this.hintContainer.style.display === 'none') return;
    this.hintContainer.classList.add('hiding');
    setTimeout(() => {
      this.hintContainer.style.display = 'none';
      this.hintContainer.classList.remove('hiding');
    }, 300);
  }

  escapeHtml(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Initialization & Bridge
// ═══════════════════════════════════════════════════════════════════════════════

const stateManager = new TutorialStateManager();
const overlayRenderer = new OverlayRenderer(stateManager);

window.__overlay = {
  stateManager,
  renderer: overlayRenderer,
  
  async init(webviewEl) {
    await stateManager.loadData();
    stateManager.restore();
    overlayRenderer.renderDashboard();

    // Listen to IPC messages from the webview
    webviewEl.addEventListener('ipc-message', (event) => {
      if (event.channel === 'challenge:solved') {
        const result = stateManager.handleChallengeSolved(event.args[0]);
        if (result) {
          overlayRenderer.showAchievementToast(result);
          const prog = stateManager.getProgress();
          overlayRenderer.updateXP(prog.totalXP, prog.xpPercent, result.leveledUp);
          
          // Re-render dashboard after a slight delay to show it in the recent list
          setTimeout(() => overlayRenderer.renderDashboard(), 1000);
        }
      } 
      else if (event.channel === 'challenges:sync') {
        const result = stateManager.handleChallengesSync(event.args[0]);
        if (result && result.stateChanged) {
          overlayRenderer.renderDashboard();
        }
      }
      else if (event.channel === 'page:changed') {
        const hint = stateManager.handlePageChange(event.args[0]);
        if (hint) {
          overlayRenderer.showContextHint(hint);
        } else {
          overlayRenderer.hideContextHint();
        }
      }
      else if (event.channel === 'juiceshop:ready') {
        console.log('Juice Shop loaded inside Webview');
      }
    });

    // Also listen for main process backup API hits
    if (window.labAPI && window.labAPI.onJuiceshopApiHit) {
      window.labAPI.onJuiceshopApiHit((data) => {
        // We could trigger a manual webview refresh here if needed
      });
    }

    // Periodic bulk sync
    setInterval(() => {
      // We could use webviewEl.executeJavaScript to force a fetch if needed,
      // but the preload monkey-patching handles normal usage.
    }, 30000);
  },

  goToModule(moduleId) {
    // If the user clicks a module link in a toast, exit lab mode and go to module
    if (window.__app && window.__app.toggleLabMode) {
      window.__app.toggleLabMode(); // exit lab mode
    }
    
    // Find module index
    const items = document.querySelectorAll('.nav-item');
    for (let i = 0; i < items.length; i++) {
      // In renderer.js, modules are selected by index, we'd need to map id -> index
      // Hack for now: click the nav item containing the title
      // The DOM stores dataset.index
      if (MODULES && MODULES[i] && MODULES[i].id === moduleId) {
        items[i].click();
        break;
      }
    }
  }
};
