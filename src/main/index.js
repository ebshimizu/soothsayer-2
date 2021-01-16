'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import http from 'http'
import serveStatic from 'serve-static'
import path from 'path'
import fs from 'fs-extra'
import express from 'express'
import io from 'socket.io'
// import { autoUpdater } from 'electron-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// Core overlay folder location
const soothsayerWebRootServer = serveStatic(path.join(__static, 'srv'))

// this can actually change based on settings. I assume it will update itself on next request.
// init to app data
const localFiles = app.getPath('userData')

// ensure folder exists (it's the default location)
fs.ensureDirSync(path.join(localFiles, 'themes'))
const defaultThemeFolder = path.join(localFiles, 'themes')

console.log(`Serving from ${path.join(__static, 'srv')}`)
console.log(`Serving theme from ${defaultThemeFolder}`)

// todo: load saved theme folder location
let soothsayerThemeRootServer = serveStatic(defaultThemeFolder)

// socket stuff
// socket cache
const socketCache = {}

const expressApp = express()
expressApp.use(soothsayerWebRootServer)
expressApp.use(soothsayerThemeRootServer)

const socketServer = http.Server(expressApp)
const socketIo = io(socketServer)

socketIo.on('connection', (socket) => {
  // connection event handling
  console.log(`New connection from ${socket.id}. Requesting id.`)

  // add to cache
  socketCache[socket.id] = socket
  socket.emit('requestID')

  // overlayName is a string
  socket.on('reportID', (overlayName) => {
    // punt to front end to continue registration
    mainWindow.webContents.send('register-overlay', { id: socket.id, name: overlayName })
  })

  socket.on('disconnect', (reason) => {
    mainWindow.webContents.send('unregister-overlay', socket.id)
  })
})

// commands from front end
ipcMain.on('change-one-theme', (event, { id, theme }) => {
  console.log(`Updating theme for socket ${id}`)

  // check that socket exists
  if (id in socketCache) {
    socketCache[id].emit('changeTheme', theme)
  }
})

ipcMain.on('change-all-theme', (event, theme) => {
  console.log('Updating all themes')

  socketIo.emit('changeTheme', theme)
})

ipcMain.on('update-one-state', (event, { id, data }) => {
  console.log(`Updating state for ${id}`)

  if (id in socketCache) {
    socketCache[id].emit('update', data)
  }
})

ipcMain.on('update-all-state', (event, data) => {
  console.log('Broadcasting update')

  socketIo.emit('update', data)
})

ipcMain.on('get-version', () => {
  mainWindow.webContents.send('set-version', app.getVersion())
})

function initServer () {
  socketServer.listen(3005, () => {
    console.log('Socket server initialized on port 3005')
  })
}

function initApp () {
  initServer()
  createWindow()
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 720,
    useContentSize: true,
    width: 1080,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', initApp)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

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
