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

  // ── Proxy Simulator ──────────────────────────────────────────────────────────
  ipcMain.on('proxy:forward', (event, modifiedRawRequest) => {
    if (pendingProxyContext) {
      const { res } = pendingProxyContext;
      
      const parts = (modifiedRawRequest || '').split('\r\n\r\n');
      const headerSection = parts[0] || '';
      const finalBody = parts.slice(1).join('\r\n\r\n') || '';

      const headerLines = headerSection.split('\r\n');
      const requestLine = (headerLines.shift() || '').split(' ');
      const method = requestLine[0] || 'GET';
      const path = requestLine[1] || '/';

      const headers = {};
      headerLines.forEach(line => {
        const idx = line.indexOf(':');
        if (idx > 0) {
          const key = line.substring(0, idx).trim().toLowerCase();
          const val = line.substring(idx + 1).trim();
          headers[key] = val;
        }
      });
      
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: method,
        headers: headers
      };
      
      options.headers['content-length'] = Buffer.byteLength(finalBody);
      
      const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      });
      
      proxyReq.on('error', (e) => {
        if (!res.headersSent) {
          res.writeHead(500);
          res.end('Proxy Error');
        }
      });
      
      proxyReq.write(finalBody);
      proxyReq.end();
      
      pendingProxyContext = null;
    }
  });
  
  ipcMain.on('proxy:drop', (event) => {
    if (pendingProxyContext) {
      pendingProxyContext.res.destroy();
      pendingProxyContext = null;
    }
  });

  ipcMain.handle('proxy:toggle', (event, isOn) => {
    isProxyInterceptOn = isOn;
    return isProxyInterceptOn;
  });
}

// ─── Mini Burp Proxy Server ─────────────────────────────────────────────────────
const http = require('http');
let isProxyInterceptOn = true;
let pendingProxyContext = null;

const proxyServer = http.createServer((req, res) => {
  // We only intercept POST/PUT requests to the API for the simulation
  if (isProxyInterceptOn && ['POST', 'PUT'].includes(req.method) && req.url.includes('/api/')) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      // Pause the request, send payload to UI
      pendingProxyContext = { req, res, body };
      
      // Build raw HTTP request string
      let rawRequest = `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`;
      for (let i = 0; i < req.rawHeaders.length; i += 2) {
        rawRequest += `${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}\r\n`;
      }
      rawRequest += `\r\n${body}`;
      
      const mainWindow = BrowserWindow.getAllWindows()[0];
      if (mainWindow) {
        mainWindow.webContents.send('proxy:intercepted', {
          method: req.method,
          url: req.url,
          body: rawRequest
        });
      }
    });
  } else {
    // Pass through
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: req.url,
      method: req.method,
      headers: req.headers
    };
    
    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    
    req.pipe(proxyReq);
    proxyReq.on('error', (e) => {
      res.writeHead(500);
      res.end('Proxy Error');
    });
  }
});

proxyServer.listen(8081, '127.0.0.1', () => {
  console.log('Mini Burp proxy running on 127.0.0.1:8081');
});

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

  // ── Monitor Juice Shop webview network at the session level (backup) ────
  win.webContents.on('did-attach-webview', (_event, webContents) => {
    // Route all traffic through our Mini Burp local proxy server
    webContents.session.setProxy({ proxyRules: 'http://127.0.0.1:8081' });

    webContents.session.webRequest.onCompleted(
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
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
