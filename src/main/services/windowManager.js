import { app, BrowserWindow, Menu, dialog } from 'electron'
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
var loadWindow = null
var mainWindow = null
const menu = [
  {
    label: '工具',
    submenu: [
      {
        label: '配置',
        role: 'setting',
        click: function() {
          mainWindow.loadURL(winURL + '#/')
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
          mainWindow.loadURL(winURL + '#/mainPage')
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
        role: 'about',
        click: function() {
          dialog.showMessageBox({
            title: '关于',
            type: 'info',
            message: 'icb-helper',
            detail: `版本信息：1.0.0\n引擎版本：${process.versions.v8}\n当前系统：${os.type()} ${os.arch()} ${os.release()}`,
            noLink: true,
            buttons: ['确定'],
          })
        },
      },
    ],
  },
]

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
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  setTrays(mainWindow)
}

function loadindWindow() {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    backgroundColor: '#222',
    transparent: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: { experimentalFeatures: true },
  })

  loadWindow.loadURL(loadingURL)

  loadWindow.show()

  setTimeout(() => {
    createMainWindow()
  }, 2000)

  loadWindow.on('closed', () => {
    loadWindow = null
  })
}

function initWindow() {
  if (config.UseStartupChart) {
    return loadindWindow()
  } else {
    return createMainWindow()
  }
}
export default initWindow
