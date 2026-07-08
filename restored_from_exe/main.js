const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// ─── Container Configuration ───────────────────────────────────────────────────
const CONTAINERS = {
  juiceshop: {
    name: 'cyber-juiceshop',
    image: 'bkimminich/juice-shop',
    port: '3000:3000',
    label: 'Juice Shop'
  },
  dvwa: {
    name: 'cyber-dvwa',
    image: 'vulnerables/web-dvwa',
    port: '8080:80',
    label: 'DVWA'
  }
};

// ─── Docker Download URLs ───────────────────────────────────────────────────────
const DOCKER_URLS = {
  win32:  'https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe',
  darwin: 'https://desktop.docker.com/mac/main/amd64/Docker.dmg',
  linux:  'https://docs.docker.com/engine/install/'
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

function runCommand(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { timeout: 300000 }, (error, stdout, stderr) => {
      if (error) {
        const msg = (stderr || error.message || '').toLowerCase();

        if (msg.includes('permission denied') || msg.includes('got permission denied')) {
          resolve({
            ok: false,
            error: 'Permission denied. On Linux, add your user to the docker group:\nsudo usermod -aG docker $USER\nThen log out and back in.'
          });
        } else if (msg.includes('cannot connect') || msg.includes('is the docker daemon running')) {
          resolve({
            ok: false,
            error: 'Cannot connect to Docker. Please ensure the Docker daemon is running and your user has permissions.'
          });
        } else if (msg.includes('not found') || msg.includes('not recognized')) {
          resolve({ ok: false, error: 'DOCKER_NOT_FOUND' });
        } else {
          resolve({ ok: false, error: stderr || error.message });
        }
        return;
      }
      resolve({ ok: true, data: stdout.trim() });
    });
  });
}

// ─── IPC Handlers ───────────────────────────────────────────────────────────────

function registerIpcHandlers() {

  ipcMain.handle('lab:getTutorials', () => {
    try {
      return require('./tutorials.json');
    } catch (e) {
      console.error('Failed to read tutorials.json', e);
      return {};
    }
  });

  // ── Check Docker Installation ───────────────────────────────────────────────
  ipcMain.handle('lab:checkDocker', async () => {
    const result = await runCommand('docker --version');
    return {
      installed: result.ok,
      version: result.ok ? result.data : null,
      error: result.ok ? null : result.error,
      platform: process.platform
    };
  });

  // ── Open External URL (for Docker download and Lab opening) ────────────────
  ipcMain.handle('lab:openUrl', async (_event, url) => {
    if (typeof url === 'string' && (url.startsWith('https://') || url.startsWith('http://localhost:'))) {
      await shell.openExternal(url);
      return { ok: true };
    }
    return { ok: false, error: 'Invalid or insecure URL.' };
  });

  // ── Download Docker (opens installer download in browser) ──────────────────
  ipcMain.handle('lab:downloadDocker', async () => {
    const url = DOCKER_URLS[process.platform] || DOCKER_URLS.linux;
    await shell.openExternal(url);
    return { ok: true, url, platform: process.platform };
  });

  // ── Boot Lab ────────────────────────────────────────────────────────────────
  ipcMain.handle('lab:boot', async () => {
    const results = {};
    for (const [key, container] of Object.entries(CONTAINERS)) {
      await runCommand(`docker rm -f ${container.name}`);
      const cmd = `docker run -d --name ${container.name} -p ${container.port} ${container.image}`;
      const result = await runCommand(cmd);
      results[key] = { label: container.label, ...result };
    }
    return results;
  });

  // ── Stop Lab ────────────────────────────────────────────────────────────────
  ipcMain.handle('lab:stop', async () => {
    const results = {};
    for (const [key, container] of Object.entries(CONTAINERS)) {
      const stopResult = await runCommand(`docker stop ${container.name}`);
      const rmResult   = await runCommand(`docker rm ${container.name}`);
      results[key] = {
        label: container.label,
        ok: stopResult.ok && rmResult.ok,
        error: stopResult.error || rmResult.error || null
      };
    }
    return results;
  });

  // ── Status ──────────────────────────────────────────────────────────────────
  ipcMain.handle('lab:status', async () => {
    const results = {};
    for (const [key, container] of Object.entries(CONTAINERS)) {
      const result = await runCommand(
        `docker ps --filter "name=${container.name}" --format "{{.Status}}"`
      );
      if (!result.ok) {
        results[key] = { label: container.label, running: false, error: result.error };
      } else {
        const isRunning = result.data.length > 0 && result.data.toLowerCase().startsWith('up');
        results[key] = { label: container.label, running: isRunning, status: result.data || 'Not running' };
      }
    }
    return results;
  });
}

// ─── Mini Burp Proxy — Session-Level Interception ───────────────────────────────
let isProxyInterceptOn = true;
let proxyQueue = [];

function sendNextProxyRequest() {
  const mainWindow = BrowserWindow.getAllWindows()[0];
  if (mainWindow && proxyQueue.length > 0) {
    const nextReq = proxyQueue[0];
    mainWindow.webContents.send('proxy:intercepted', {
      method: nextReq.details.method,
      url: nextReq.details.url,
      body: nextReq.rawRequest
    });
  }
}

function setupProxyIpc() {
  ipcMain.on('proxy:forward', (_event, _modifiedRawRequest) => {
    if (proxyQueue.length > 0) {
      const req = proxyQueue.shift();
      req.callback({ cancel: false });
      sendNextProxyRequest();
    }
  });

  ipcMain.on('proxy:drop', (_event) => {
    if (proxyQueue.length > 0) {
      const req = proxyQueue.shift();
      req.callback({ cancel: true });
      sendNextProxyRequest();
    }
  });

  ipcMain.handle('proxy:toggle', (_event, isOn) => {
    isProxyInterceptOn = isOn;
    // If turning off intercept, release ALL pending requests
    if (!isOn) {
      while (proxyQueue.length > 0) {
        const req = proxyQueue.shift();
        req.callback({ cancel: false });
      }
    }
    return isProxyInterceptOn;
  });
}

// ─── Window Creation ────────────────────────────────────────────────────────────

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#0a0e17',
    title: 'CyberCompanion',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: true
    }
  });

  win.loadFile('index.html');

  // ── Intercept webview traffic using session.webRequest ────────────────────
  win.webContents.on('did-attach-webview', (_event, webContents) => {
    const session = webContents.session;

    // Use onBeforeRequest to intercept ALL requests from the webview
    session.webRequest.onBeforeRequest(
      { urls: ['http://localhost:3000/*', 'http://localhost:8080/*'] },
      (details, callback) => {
        // Only intercept when toggle is ON
        if (!isProxyInterceptOn) {
          callback({ cancel: false });
          return;
        }

        // Skip static assets — only intercept API/REST/login calls
        const url = details.url;
        const isApiCall = url.includes('/api/') || url.includes('/rest/') || url.includes('/login');

        if (!isApiCall) {
          callback({ cancel: false });
          return;
        }

        // Build a raw HTTP request string for display
        const parsedUrl = new URL(details.url);
        let rawRequest = `${details.method} ${parsedUrl.pathname}${parsedUrl.search} HTTP/1.1\r\n`;
        rawRequest += `Host: ${parsedUrl.host}\r\n`;

        // Add common headers
        if (details.referrer) {
          rawRequest += `Referer: ${details.referrer}\r\n`;
        }
        rawRequest += `Origin: ${parsedUrl.origin}\r\n`;

        // Add upload data if present
        let bodyStr = '';
        if (details.uploadData && details.uploadData.length > 0) {
          for (const chunk of details.uploadData) {
            if (chunk.bytes) {
              bodyStr += Buffer.from(chunk.bytes).toString('utf-8');
            }
          }
          rawRequest += `Content-Type: application/json\r\n`;
          rawRequest += `Content-Length: ${Buffer.byteLength(bodyStr)}\r\n`;
        }

        rawRequest += `\r\n${bodyStr}`;

        // Add to the queue
        const isQueueEmpty = proxyQueue.length === 0;
        proxyQueue.push({ details, callback, rawRequest });

        // If it was the first item in the queue, notify the UI immediately
        if (isQueueEmpty) {
          sendNextProxyRequest();
        }
      }
    );

    // Also monitor completed requests for the overlay system
    session.webRequest.onCompleted(
      { urls: ['http://localhost:3000/api/Challenges/*'] },
      (details) => {
        win.webContents.send('juiceshop:api-hit', {
          url: details.url,
          statusCode: details.statusCode
        });
      }
    );
  });
}

// ─── App Lifecycle ──────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  registerIpcHandlers();
  setupProxyIpc();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
