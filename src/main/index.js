'use strict';

import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import http from 'http';
import serveStatic from 'serve-static';
import path from 'path';
import fs from 'fs-extra';
import express from 'express';
import io from 'socket.io';
import settings from 'electron-settings';
// import { autoUpdater } from 'electron-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

// Core overlay folder location
const soothsayerWebRootServer = serveStatic(path.join(__static, 'srv'));

// this can actually change based on settings. I assume it will update itself on next request.
// init to app data
const localFiles = app.getPath('userData');

// ensure folder exists (it's the default location)
fs.ensureDirSync(path.join(localFiles, 'themes'));
const defaultThemeFolder = path.join(localFiles, 'themes');

// temp image file folder
const imgFolder = path.join(localFiles, 'img');
fs.ensureDirSync(imgFolder);
fs.emptyDirSync(imgFolder);
const soothsayerLocalImageServer = serveStatic(imgFolder);

console.log(`Serving from ${path.join(__static, 'srv')}`);
console.log(`Serving local images from ${imgFolder}`);
console.log(`Serving theme from ${defaultThemeFolder}`);

// todo: load saved theme folder location
let soothsayerThemeRootServer = serveStatic(defaultThemeFolder);

// socket stuff
// socket cache
const socketCache = {};

const expressApp = express();
expressApp.use(soothsayerWebRootServer);
expressApp.use(soothsayerThemeRootServer);
expressApp.use(soothsayerLocalImageServer);

const socketServer = http.Server(expressApp);
const socketIo = io(socketServer);

socketIo.on('connection', (socket) => {
  // connection event handling
  console.log(`New connection from ${socket.id}. Requesting id.`);

  // add to cache
  socketCache[socket.id] = socket;
  socket.emit('requestID');

  // overlayName is a string
  socket.on('reportID', (overlayName) => {
    // punt to front end to continue registration
    mainWindow.webContents.send('register-overlay', {
      id: socket.id,
      name: overlayName,
    });
  });

  socket.on('disconnect', (reason) => {
    mainWindow.webContents.send('unregister-overlay', socket.id);
  });
});

// commands from front end
ipcMain.on('change-one-theme', (event, { id, theme }) => {
  console.log(`Updating theme for socket ${id}`);

  // check that socket exists
  if (id in socketCache) {
    socketCache[id].emit('changeTheme', theme);
  }
});

// change the theme for all overlays
ipcMain.on('change-all-theme', (event, theme) => {
  console.log('Updating all themes');

  socketIo.emit('changeTheme', theme);
});

// update one overlay (usually used on overlay connection)
ipcMain.on('update-one-state', (event, { id, data }) => {
  console.log(`Updating state for ${id}`);

  if (id in socketCache) {
    socketCache[id].emit('update', data);
  }
});

// update all the overlays
ipcMain.on('update-all-state', (event, data) => {
  console.log('Broadcasting update');

  socketIo.emit('update', data);
});

// snapshot the entire application store for loading later
// happens on update or on specific actions/mutations
ipcMain.on('snapshot', (event, data) => {
  console.log('Snapshotting state');
  settings.set('state', data);
});

// open a file for the renderer
ipcMain.handle('open-file', async () => {
  try {
    console.log('opening file...');
    const file = await dialog.showOpenDialog({
      title: 'Select Local File',
      properties: ['openFile'],
    });
    return file;
  } catch (e) {
    return undefined;
  }
});

ipcMain.handle('load-state', async () => {
  try {
    const data = await settings.get('state');

    // update main process fields
    data.version = app.getVersion();
    data.localFiles = localFiles;
    delete data.log;

    // check for image cache here.

    console.log(data);

    return data;
  } catch (e) {
    console.log(e);
    return {};
  }
});

function initServer() {
  socketServer.listen(3005, () => {
    console.log('Socket server initialized on port 3005');
  });
}

function initApp() {
  initServer();
  createWindow();
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 720,
    useContentSize: true,
    width: 1080,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', initApp);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/**
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
*/
