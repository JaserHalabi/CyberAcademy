/**
 * CyberCompanion — Webview Preload (Tracking Engine)
 *
 * Injected into the Juice Shop <webview> guest page.
 * Intercepts socket.io events and fetch responses, forwarding
 * challenge-related data to the host renderer via IPC.
 *
 * Channels sent to host:
 *   'challenge:solved'  — real-time, from socket.io "challenge solved" event
 *   'challenges:sync'   — bulk, from GET /api/Challenges response
 *   'page:changed'      — navigation, from URL/hash changes
 *   'juiceshop:ready'   — fired once when the page finishes initial load
 */

const { ipcRenderer } = require('electron');

// ═══════════════════════════════════════════════════════════════════════════════
// 1. WebSocket Interception — socket.io "challenge solved" events
// ═══════════════════════════════════════════════════════════════════════════════

const OriginalWebSocket = window.WebSocket;

window.WebSocket = function (...args) {
  const ws = new OriginalWebSocket(...args);

  ws.addEventListener('message', (event) => {
    try {
      const raw = event.data;
      if (typeof raw !== 'string') return;

      // socket.io v4 wire format:
      //   Optional length prefix: "215:"
      //   Message type: "42" = EVENT
      //   Payload: ["event name", {data}]
      //
      // Example: 215:42["challenge solved",{"key":"scoreBoardChallenge","name":"Score Board",...}]

      // Strip optional length prefix (e.g., "215:")
      const stripped = raw.replace(/^\d+:/, '');

      // Only interested in socket.io EVENT messages (type "42")
      if (!stripped.startsWith('42')) return;

      const jsonPart = stripped.substring(2);
      const parsed = JSON.parse(jsonPart);

      if (!Array.isArray(parsed) || parsed.length < 2) return;

      const [eventName, payload] = parsed;

      // Juice Shop emits "challenge solved" (with space)
      if (eventName === 'challenge solved' && payload) {
        ipcRenderer.sendToHost('challenge:solved', {
          key: payload.key || null,
          name: payload.name || null,
          challenge: payload.challenge || null,
          flag: payload.flag || null,
          hidden: payload.hidden || false
        });
      }
    } catch (e) {
      // Silently ignore non-JSON or malformed frames
    }
  });

  return ws;
};

// Preserve prototype chain so instanceof checks still work
window.WebSocket.prototype = OriginalWebSocket.prototype;
window.WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
window.WebSocket.OPEN = OriginalWebSocket.OPEN;
window.WebSocket.CLOSING = OriginalWebSocket.CLOSING;
window.WebSocket.CLOSED = OriginalWebSocket.CLOSED;


// ═══════════════════════════════════════════════════════════════════════════════
// 2. Fetch Interception — /api/Challenges bulk sync
// ═══════════════════════════════════════════════════════════════════════════════

const originalFetch = window.fetch;

window.fetch = async function (...args) {
  const response = await originalFetch.apply(this, args);

  try {
    // Determine the request URL
    const url = typeof args[0] === 'string'
      ? args[0]
      : (args[0] && args[0].url) || '';

    // Intercept /api/Challenges responses to bulk-sync solved state
    if (url.includes('/api/Challenges')) {
      const clone = response.clone();
      clone.json().then((data) => {
        if (data && data.data && Array.isArray(data.data)) {
          ipcRenderer.sendToHost('challenges:sync', {
            challenges: data.data.map((ch) => ({
              id: ch.id,
              key: ch.key,
              name: ch.name,
              category: ch.category,
              difficulty: ch.difficulty,
              description: ch.description,
              solved: ch.solved,
              hint: ch.hint,
              hintUrl: ch.hintUrl
            }))
          });
        }
      }).catch(() => {});
    }
  } catch (e) {
    // Never break the original fetch flow
  }

  return response;
};


// ═══════════════════════════════════════════════════════════════════════════════
// 3. XMLHttpRequest Interception — fallback for older Juice Shop versions
// ═══════════════════════════════════════════════════════════════════════════════

const OriginalXHR = window.XMLHttpRequest;
const origOpen = OriginalXHR.prototype.open;
const origSend = OriginalXHR.prototype.send;

OriginalXHR.prototype.open = function (method, url, ...rest) {
  this._cyberURL = url;
  return origOpen.call(this, method, url, ...rest);
};

OriginalXHR.prototype.send = function (...args) {
  this.addEventListener('load', function () {
    try {
      if (this._cyberURL && this._cyberURL.includes('/api/Challenges')) {
        const data = JSON.parse(this.responseText);
        if (data && data.data && Array.isArray(data.data)) {
          ipcRenderer.sendToHost('challenges:sync', {
            challenges: data.data.map((ch) => ({
              id: ch.id,
              key: ch.key,
              name: ch.name,
              category: ch.category,
              difficulty: ch.difficulty,
              description: ch.description,
              solved: ch.solved,
              hint: ch.hint,
              hintUrl: ch.hintUrl
            }))
          });
        }
      }
    } catch (e) {}
  });
  return origSend.apply(this, args);
};


// ═══════════════════════════════════════════════════════════════════════════════
// 4. Page Navigation Detection
// ═══════════════════════════════════════════════════════════════════════════════

let lastHash = '';

function checkNavigation() {
  const currentHash = window.location.hash;
  if (currentHash !== lastHash) {
    lastHash = currentHash;
    ipcRenderer.sendToHost('page:changed', {
      url: window.location.href,
      hash: currentHash
    });
  }
}

// Poll for hash changes (Angular apps use hash routing)
setInterval(checkNavigation, 500);

// Also listen for popstate
window.addEventListener('popstate', checkNavigation);
window.addEventListener('hashchange', checkNavigation);


// ═══════════════════════════════════════════════════════════════════════════════
// 5. Ready Signal
// ═══════════════════════════════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.sendToHost('juiceshop:ready', {
    url: window.location.href,
    title: document.title
  });
});

// Backup: if DOMContentLoaded already fired
if (document.readyState !== 'loading') {
  setTimeout(() => {
    ipcRenderer.sendToHost('juiceshop:ready', {
      url: window.location.href,
      title: document.title
    });
  }, 100);
}


// ═══════════════════════════════════════════════════════════════════════════════
// 6. Interactive Tutorial Engine
// ═══════════════════════════════════════════════════════════════════════════════

class TutorialEngine {
  constructor() {
    this.steps = [];
    this.currentStep = 0;
    this.active = false;
    
    this.backdrop = document.createElement('div');
    this.backdrop.id = 'cyber-tutorial-backdrop';
    
    this.bubble = document.createElement('div');
    this.bubble.id = 'cyber-tutorial-bubble';
    
    this.injectStyles();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #cyber-tutorial-backdrop {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.7); z-index: 999998;
        pointer-events: none; /* Let clicks pass through to target */
        display: none; transition: all 0.3s ease;
      }
      #cyber-tutorial-bubble {
        position: fixed; z-index: 999999;
        background: rgba(10, 14, 23, 0.95);
        border: 1px solid rgba(0, 240, 255, 0.4);
        border-radius: 8px; padding: 16px 20px;
        color: #e2e8f0; font-family: 'Inter', sans-serif;
        font-size: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(0,240,255,0.2);
        max-width: 300px; display: none; opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      .cyber-tut-header { font-weight: 700; color: #00f0ff; margin-bottom: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;}
      .cyber-tut-text { line-height: 1.5; }
      .cyber-tut-btn { 
        margin-top: 12px; background: rgba(0,240,255,0.15); border: 1px solid #00f0ff; 
        color: #00f0ff; padding: 6px 12px; border-radius: 4px; cursor: pointer;
        font-size: 12px; font-weight: 600; width: 100%; text-align: center;
      }
      .cyber-tut-btn:hover { background: rgba(0,240,255,0.25); }
      .cyber-highlighted { position: relative; z-index: 999999 !important; }
    `;
    document.head.appendChild(style);
    
    // Wait for body to be ready
    const tryInject = () => {
      if (document.body) {
        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.bubble);
      } else {
        setTimeout(tryInject, 100);
      }
    };
    tryInject();
  }

  play(steps) {
    this.steps = steps;
    this.currentStep = 0;
    this.active = true;
    this.backdrop.style.display = 'block';
    this.renderStep();
  }

  stop() {
    this.active = false;
    this.backdrop.style.display = 'none';
    this.bubble.style.display = 'none';
    this.bubble.style.opacity = '0';
    this.clearHighlight();
  }

  clearHighlight() {
    document.querySelectorAll('.cyber-highlighted').forEach(el => {
      el.classList.remove('cyber-highlighted');
    });
    this.backdrop.style.clipPath = 'none';
  }

  renderStep() {
    if (this.currentStep >= this.steps.length) {
      this.stop();
      return;
    }

    const step = this.steps[this.currentStep];
    this.clearHighlight();

    // Find target
    const target = step.selector === 'body' ? document.body : document.querySelector(step.selector);
    
    if (!target) {
      // Element not found, wait and retry
      setTimeout(() => this.renderStep(), 500);
      return;
    }

    // Highlight target
    if (target !== document.body) {
      target.classList.add('cyber-highlighted');
      
      // Cut a hole in the backdrop using clip-path
      const rect = target.getBoundingClientRect();
      const pad = 4;
      this.backdrop.style.clipPath = \`polygon(
        0% 0%, 0% 100%, 
        \${rect.left - pad}px 100%, 
        \${rect.left - pad}px \${rect.top - pad}px, 
        \${rect.right + pad}px \${rect.top - pad}px, 
        \${rect.right + pad}px \${rect.bottom + pad}px, 
        \${rect.left - pad}px \${rect.bottom + pad}px, 
        \${rect.left - pad}px 100%, 
        100% 100%, 100% 0%
      )\`;
    } else {
      this.backdrop.style.clipPath = 'none';
    }

    // Position bubble
    this.bubble.style.display = 'block';
    this.bubble.innerHTML = \`
      <div class="cyber-tut-header">Step \${this.currentStep + 1} of \${this.steps.length}</div>
      <div class="cyber-tut-text">\${step.text}</div>
    \`;

    // Add explicit continue button if action is just 'click' on body or wait
    if (step.selector === 'body' || !step.action) {
      const btn = document.createElement('button');
      btn.className = 'cyber-tut-btn';
      btn.textContent = 'Continue';
      btn.onclick = () => this.nextStep();
      this.bubble.appendChild(btn);
    }

    setTimeout(() => {
      this.bubble.style.opacity = '1';
      this.bubble.style.transform = 'translateY(0)';
      
      const targetRect = target.getBoundingClientRect();
      const bubbleRect = this.bubble.getBoundingClientRect();
      
      let top = targetRect.bottom + 10;
      let left = targetRect.left;
      
      if (step.position === 'right') {
        top = targetRect.top;
        left = targetRect.right + 10;
      } else if (step.position === 'center') {
        top = window.innerHeight / 2 - bubbleRect.height / 2;
        left = window.innerWidth / 2 - bubbleRect.width / 2;
      }
      
      // Keep in viewport
      if (left + bubbleRect.width > window.innerWidth) left = window.innerWidth - bubbleRect.width - 10;
      if (top + bubbleRect.height > window.innerHeight) top = targetRect.top - bubbleRect.height - 10;
      if (left < 0) left = 10;
      if (top < 0) top = 10;

      this.bubble.style.top = \`\${top}px\`;
      this.bubble.style.left = \`\${left}px\`;
    }, 50);

    // Setup advancement trigger
    this.setupTrigger(target, step);
  }

  setupTrigger(target, step) {
    const handler = (e) => {
      if (step.action === 'input' && e.type === 'input') {
        if (step.waitForValue && target.value !== step.waitForValue) return;
      }
      if (step.action === 'enter' && e.type === 'keyup' && e.key !== 'Enter') return;
      
      // Cleanup listener
      target.removeEventListener('click', handler);
      target.removeEventListener('input', handler);
      target.removeEventListener('focus', handler);
      target.removeEventListener('keyup', handler);
      
      this.nextStep();
    };

    if (step.action === 'click') {
      target.addEventListener('click', handler);
    } else if (step.action === 'input') {
      target.addEventListener('input', handler);
    } else if (step.action === 'focus') {
      target.addEventListener('focus', handler);
    } else if (step.action === 'enter') {
      target.addEventListener('keyup', handler);
    }
  }

  nextStep() {
    this.bubble.style.opacity = '0';
    this.bubble.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      this.currentStep++;
      this.renderStep();
    }, 300);
  }
}

const tutorialEngine = new TutorialEngine();

ipcRenderer.on('play-tutorial', (event, steps) => {
  tutorialEngine.play(steps);
});
