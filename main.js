const { app, BrowserWindow, ipcMain, shell } = require('electron');
const { exec } = require('child_process');
const path = require('path');

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
      sandbox: false
    }
  });

  win.loadFile('index.html');
}

// ─── App Lifecycle ──────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
