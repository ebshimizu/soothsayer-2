'use strict'

import { app, BrowserWindow, dialog, globalShortcut, ipcMain } from 'electron'
import http from 'http'
import serveStatic from 'serve-static'
import path from 'path'
import fs from 'fs-extra'
import express from 'express'
import io from 'socket.io'
import settings from 'electron-settings'
import { scanForThemes } from './themes'
import { DEFAULT_SHORTCUTS } from './defaultKeyboardShortcuts'
import _ from 'lodash'
// import { autoUpdater } from 'electron-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const previewWindows = {}

const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

// automatic dev library switching for overlays
if (process.env.NODE_ENV === 'development') {
  fs.copyFile(
    path.join(__static, 'srv', 'js', 'vue@2.dev.js'),
    path.join(__static, 'srv', 'js', 'vue@2.js'),
  )
} else {
  fs.copyFile(
    path.join(__static, 'srv', 'js', 'vue@2.prod.js'),
    path.join(__static, 'srv', 'js', 'vue@2.js'),
  )
}

// Core overlay folder location
const webRoot = path.join(__static, 'srv')
const soothsayerWebRootServer = serveStatic(webRoot)

// check what's in there
let availableOverlays = []
try {
  availableOverlays = fs.readdirSync(webRoot).filter((f) => {
    return f.endsWith('.html')
  })
} catch (e) {
  console.log('Failed to fetch available overlays.')
  console.log(e)
}

console.log(availableOverlays)

// init to app data
const localFiles = app.getPath('userData')

// ensure folder exists (it's the default location)
fs.ensureDirSync(path.join(localFiles, 'themes'))
const defaultThemeFolder = path.join(localFiles, 'themes')

// temp image file folder
const imgFolder = path.join(localFiles, 'img')
fs.ensureDirSync(imgFolder)

// ok i want to grab the whiteboard image real quick because it doesn't render until mount
if (fs.existsSync(path.join(imgFolder, 'whiteboard.png'))) {
  fs.copyFileSync(
    path.join(imgFolder, 'whiteboard.png'),
    path.join(localFiles, 'whiteboard.png'),
  )
}

fs.emptyDirSync(imgFolder)

// and now put it back
if (fs.existsSync(path.join(localFiles, 'whiteboard.png'))) {
  fs.copyFileSync(
    path.join(localFiles, 'whiteboard.png'),
    path.join(imgFolder, 'whiteboard.png'),
  )
}

const soothsayerLocalImageServer = serveStatic(imgFolder)

console.log(`Serving from ${path.join(__static, 'srv')}`)
console.log(`Serving local images from ${imgFolder}`)
console.log(`Serving theme from ${defaultThemeFolder}`)

// todo: load saved theme folder location
const storedThemeFolder = settings.getSync('state.app.themeFolder')
let soothsayerThemeRootServer = storedThemeFolder
  ? serveStatic(storedThemeFolder)
  : serveStatic(defaultThemeFolder)

// socket variables
let socketCache = {}

// for when the UI reconnects (if that happens in prod)
let socketStateCache = {}

let socketIo, socketServer

// commands from front end
ipcMain.on('change-one-theme', (event, { id, theme }) => {
  console.log(`Updating theme for socket ${id}`)

  // check that socket exists
  if (id in socketCache) {
    socketCache[id].emit('changeTheme', theme)
  }
})

// change the theme for all overlays
ipcMain.on('change-all-theme', (event, theme) => {
  console.log('Updating all themes')

  socketIo.emit('changeTheme', theme)
})

// update one overlay (usually used on overlay connection)
ipcMain.on('update-one-state', (event, { id, data }) => {
  console.log(`Updating state for ${id}`)

  if (id in socketCache) {
    socketCache[id].emit('update', data)
  }
})

// update all the overlays
ipcMain.on('update-all-state', (event, data) => {
  console.log('Broadcasting update')

  socketIo.emit('update', data)
})

ipcMain.on('update-one-graphics', (event, { id, data }) => {
  console.log(`Updating graphics for ${id}`)
  if (id in socketCache) {
    socketCache[id].emit('update-graphics', data)
  }
})

ipcMain.on('update-all-graphics', (event, data) => {
  console.log('Updating all Graphics')

  socketIo.emit('update-graphics', data)
})

ipcMain.on('identify', (event, id) => {
  if (id in socketCache) {
    socketCache[id].emit('identify')
  }
})

// snapshot the entire application store for loading later
// happens on update or on specific actions/mutations
ipcMain.on('snapshot', (event, data) => {
  // console.log('Snapshotting state')
  settings.set('state', data)
})

// open a file for the renderer
ipcMain.handle('open-file', async () => {
  try {
    console.log('opening file...')
    const file = await dialog.showOpenDialog({
      title: 'Select Local File',
      properties: ['openFile'],
    })
    return file
  } catch (e) {
    return undefined
  }
})

ipcMain.handle('set-theme-folder', async (event, reset = false) => {
  try {
    console.log('Beginning theme folder selection')

    // match sig for open dialog
    let file = { filePaths: [defaultThemeFolder] }

    // if we're not resetting, then pop up the dialog
    if (!reset) {
      file = await dialog.showOpenDialog({
        title: 'Select Theme Folder',
        properties: ['openDirectory'],
      })
    }

    // ok if we have a file path
    if (file) {
      const newFolderLocation = file.filePaths[0]

      // scan the folder
      const availableThemes = scanForThemes(newFolderLocation)

      // ok re-serve
      soothsayerThemeRootServer = serveStatic(newFolderLocation)
      bootServer()

      return { availableThemes, folder: newFolderLocation }
    }
  } catch (e) {
    return undefined
  }
})

ipcMain.handle('rebind', (event, keybinds) => {
  return bindShortcuts(keybinds)
})

function bindShortcuts(keybinds) {
  // keybind object consists of key id and the shortcut.
  // clean
  globalShortcut.unregisterAll()

  // track which things got registered successfully
  const result = {}

  // keybinds will always send a 'keyboard' event to the renderer with the payload being the key id
  for (const id in keybinds) {
    try {
      result[id] = globalShortcut.register(keybinds[id], () => {
        mainWindow.webContents.send('keyboard', { key: id })
      })
    } catch (e) {
      // failed to bind
      result[id] = false
    }
  }

  return result
}

// this happens when the front end signals that it's up and running.
ipcMain.handle('load-state', async () => {
  try {
    let data = await settings.get('state')

    if (!data) {
      data = {}
      data.app = {}
    }

    // update main process fields
    data.version = app.getVersion()
    data.localFiles = localFiles
    data.overlays = socketStateCache
    data.availableOverlays = availableOverlays

    // load keybinds, merge into default in case new ones have been added
    data.keybinds = _.merge(DEFAULT_SHORTCUTS, data.keybinds)

    // bind
    bindShortcuts(data.keybinds)

    delete data.log

    // theme scan (does not affect active theme)
    if (!('themeFolder' in data.app) || data.app.themeFolder === '') {
      // set default
      data.app.themeFolder = defaultThemeFolder
    }

    data.app.availableThemes = scanForThemes(data.app.themeFolder)

    // check for image cache here.
    // load everything in the image cache
    for (const key in data.imageCache) {
      fs.copyFile(data.imageCache[key].src, data.imageCache[key].dest)
        .then(() => {
          console.log(
            `Loaded image for key ${key} from ${data.imageCache[key].src}.`,
          )
        })
        .catch((e) => {
          console.log(
            `Failed to load image for key ${key} from ${data.imageCache[key].src}`,
          )
          console.log(e)
        })
    }

    // console.log(data)

    return data
  } catch (e) {
    console.log(e)
    return {}
  }
})

ipcMain.handle('preview', (event, { page, width, height }) => {
  if (page in previewWindows) {
    // already open
    return
  }

  previewWindows[page] = new BrowserWindow({
    width,
    height,
    useContentSize: true,
    resizable: false,
    parent: mainWindow,
  })

  previewWindows[page].setMenuBarVisibility(false)
  previewWindows[page].loadURL(`http://localhost:3005/${page}`)

  previewWindows[page].on('closed', () => {
    if (page in previewWindows) {
      delete previewWindows[page]
    }
  })
})

function bootServer() {
  if (socketServer) {
    console.log('Shutting down server for reboot.')
    socketIo.close()
    socketServer.close()
  }

  console.log('Booting server.')

  const expressApp = express()
  expressApp.use(soothsayerWebRootServer)
  expressApp.use(soothsayerThemeRootServer)
  expressApp.use(soothsayerLocalImageServer)

  socketServer = http.Server(expressApp)
  socketIo = io(socketServer)

  socketIo.on('connection', (socket) => {
    // connection event handling
    console.log(`New connection from ${socket.id}. Requesting id.`)

    // add to cache
    socketCache[socket.id] = socket
    socket.emit('requestID')

    // overlayName is a string
    socket.on('reportID', ({ id, page }) => {
      // punt to front end to continue registration
      socketStateCache[socket.id] = {
        id: socket.id,
        name: id,
        page,
      }

      if (mainWindow) {
        mainWindow.webContents.send(
          'register-overlay',
          socketStateCache[socket.id],
        )
      }
    })

    socket.on('disconnect', (reason) => {
      delete socketCache[socket.id]
      delete socketStateCache[socket.id]

      if (mainWindow) {
        mainWindow.webContents.send('unregister-overlay', socket.id)
      }
    })
  })

  socketServer.listen(3005, () => {
    console.log('Socket server initialized on port 3005')
  })
}

function initApp() {
  bootServer()
  createWindow()
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 1080,
    useContentSize: true,
    width: 1920,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    for (const window in previewWindows) {
      if (previewWindows[window]) {
        previewWindows.close()
      }
    }

    mainWindow = null
  })
}

app.on('ready', initApp)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    socketServer.close()
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
