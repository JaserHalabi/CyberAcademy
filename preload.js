const { contextBridge, ipcRenderer } = require('electron');

/**
 * CyberCompanion — Secure Preload Bridge
 *
 * Exposes a minimal, typed API to the renderer process.
 * No raw Node.js modules (fs, child_process, etc.) are leaked.
 */
contextBridge.exposeInMainWorld('labAPI', {
  /** Boot Juice Shop + DVWA containers. */
  bootLab:       () => ipcRenderer.invoke('lab:boot'),

  /** Stop and remove all lab containers. */
  stopLab:       () => ipcRenderer.invoke('lab:stop'),

  /** Query running status of each container. */
  getStatus:     () => ipcRenderer.invoke('lab:status'),

  /** Check if Docker is installed. Returns { installed, version, platform, error }. */
  checkDocker:   () => ipcRenderer.invoke('lab:checkDocker'),

  /** Open a URL in the system default browser (validated to https only). */
  openUrl:       (url) => ipcRenderer.invoke('lab:openUrl', url),

  /** Open the Docker Desktop download page for the current platform. */
  downloadDocker:() => ipcRenderer.invoke('lab:downloadDocker'),

  // ── Overlay System ──────────────────────────────────────────────────────────
  /** Listen for Juice Shop API hits detected at the network level (main process). */
  onJuiceshopApiHit: (callback) => {
    ipcRenderer.on('juiceshop:api-hit', (_event, data) => callback(data));
  }
});
