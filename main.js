const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const remoteMain = require('@electron/remote/main');

remoteMain.initialize();

const defaultConfigPath = path.join(__dirname, 'config', 'config.json');
const userConfigPath = path.join(app.getPath('userData'), 'config.json');

function ensureUserConfig() {
  if (!fs.existsSync(userConfigPath)) {
    fs.copyFileSync(defaultConfigPath, userConfigPath);
  }
}

function loadUserConfig() {
  ensureUserConfig();
  return JSON.parse(fs.readFileSync(userConfigPath, 'utf-8'));
}

let win; // Declare globally so we can access it in IPC

function createWindow() {
  const config = loadUserConfig();

  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  remoteMain.enable(win.webContents);

  win.loadFile(path.join(__dirname, 'html', 'startup.html'));

  setTimeout(() => {
    if (win.webContents.getURL() === 'about:blank') {
      console.warn("Page still blank after timeout, loading fallback.");
      win.loadFile('fallback.html');
    }
  }, 10000); // 10 seconds
}

app.whenReady().then(createWindow);

// ✅ IPC listener for store URL
ipcMain.on('set-store-url', (event, url) => {
  console.log('Received store URL:', url);

  try {
    const config = loadUserConfig();
    config.url = url;
    fs.writeFileSync(userConfigPath, JSON.stringify(config, null, 2));
    console.log('Updated config.json with new store URL.');

    // Optional: reload the window with the new URL
    if (win && win.webContents) {
      win.loadURL(url);
    }
  } catch (err) {
    console.error('Failed to update store URL:', err);
  }
});