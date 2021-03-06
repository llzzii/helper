import { app, BrowserWindow, nativeImage, globalShortcut, Menu, dialog } from 'electron'
// import menuconfig from '../config/menu'
import config from '@config'
import setIpc from './ipcMain'
// import upload from './checkupdate'
import DownloadUpdate from './downloadFile'
import path from 'path'
import Server from '../server/index'
import setTrays from './tray'
const os = require('os')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
// 这个瓜皮全局变量只能在单个js中生效，而并不是整个主进程中
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}
// 将文件地址挪到这里
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT}` : `file://${__dirname}/index.html`
const loadingURL =
  process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT}/static/loader.html` : `file://${__static}/loader.html`
const iconPath =
  process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../../../build/icons/256x256.png')
    : path.join(__dirname, '/build/icons/256x256.png').replace(/\\/g, '\\\\')
var loadWindow = null
var mainWindow = null
let canQuit = false
const menu = [
  {
    label: '工具',
    submenu: [
      {
        label: '配置',
        role: 'setting',
        click: function() {
          //   mainWindow.loadURL(winURL + '#/')
          sendMenuEvent({ route: '/' })
        },
      },
    ],
  },
  {
    label: '播放',
    submenu: [
      {
        label: '离线播放',
        role: 'player',
        click: function() {
          //   mainWindow.loadURL(winURL + '#/mainPage')
          sendMenuEvent({ route: '/mainPage' })
        },
      },
    ],
  },
  {
    label: '设置',
    submenu: [
      {
        label: '快速重启',
        accelerator: 'F5',
        role: 'reload',
      },
      {
        label: '退出',
        accelerator: 'CmdOrCtrl+F4',
        role: 'close',
      },
    ],
  },
  {
    label: '帮助',
    submenu: [
      {
        label: '关于',
        click: function() {
          sendOpenDialog({
            version: '1.0.0',
            // type: 'info',
            yin: process.versions.v8,
            os: os,
          })
        },
      },
    ],
  },
]
const sendMenuEvent = async (data) => {
  mainWindow.webContents.send('change-view', data)
}
const sendOpenDialog = async (data) => {
  mainWindow.webContents.send('open-dialog', data)
}

function createMainWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1000,
    minWidth: 500,
    show: false,
    frame: config.IsUseSysTitle,
    // skipTaskbar: true,
    titleBarStyle: 'hidden',
    icon: global.__static + '/icon.ico',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      // 如果是开发模式可以使用devTools
      devTools: process.env.NODE_ENV === 'development',
      // 在macos中启用橡皮动画
      scrollBounce: process.platform === 'darwin',
    },
  })
  // 这里设置只有开发环境才注入显示开发者模式
  if (process.env.NODE_ENV === 'development') {
    menu.push({
      label: '开发者设置',
      submenu: [
        {
          label: '切换到开发者模式',
          accelerator: 'CmdOrCtrl+I',
          role: 'toggledevtools',
        },
      ],
    })
  }
  // 载入菜单
  const menuconfig = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(menuconfig)
  mainWindow.loadURL(winURL)

  setIpc.Mainfunc(mainWindow, config.IsUseSysTitle)
  //   upload.Update(mainWindow)
  DownloadUpdate.download(mainWindow)

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.show()
  })
  if (config.UseStartupChart) loadWindow.destroy()

  if (process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools(true)
  Server.StatrServer()
    .then((res) => {
      //   event.reply('confirm-start', res)
      console.log('启动', res)
    })
    .catch((err) => {
      console.log('错误', err)
    })
  const gotTheLock = app.requestSingleInstanceLock()

  mainWindow.on('close', (e) => {
    //回收BrowserWindow对象
    if (mainWindow.isMinimized() || !gotTheLock) {
      mainWindow = null
    } else {
      e.preventDefault()
      mainWindow.minimize()
    }
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  setTrays(mainWindow)
  //   限制只能开启一个应用(4.0以上版本)

  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
        mainWindow.show()
      }
    })
  }
}

function loadindWindow() {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    backgroundColor: '#222',
    transparent: true,
    // skipTaskbar: true,
    resizable: false,
    webPreferences: { experimentalFeatures: true },
  })

  loadWindow.loadURL(loadingURL)

  loadWindow.show()

  setTimeout(() => {
    createMainWindow()
  }, 2000)
  loadWindow.on('close', (e) => {
    //回收BrowserWindow对象
    if (mainWindow.isMinimized()) {
      mainWindow = null
    } else {
      e.preventDefault()
      mainWindow.minimize()
    }
  })
  loadWindow.on('closed', () => {
    loadWindow = null
  })
}

export function initWindow() {
  if (config.UseStartupChart) {
    return loadindWindow()
  } else {
    return createMainWindow()
  }
}

export default initWindow
