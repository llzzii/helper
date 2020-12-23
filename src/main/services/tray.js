import { app, ipcMain, Tray, Menu } from 'electron'
import path from 'path'

let mainWindow = null
let appTray = null // 托盘实例

// 隐藏主窗口，并创建托盘
function setTray() {
  // 当托盘最小化时，右击有一个菜单显示，这里进设置一个退出的菜单
  let trayMenuTemplate = [
    {
      // 系统托盘图标目录
      label: '打开',
      click: function() {
        mainWindow.show()
      },
    },
    {
      // 系统托盘图标目录
      label: '退出',
      click: function() {
        app.quit() // 点击之后退出应用
      },
    },
  ]
  // 创建托盘实例
  const iconPath =
    process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '../../../static/icon.ico')
      : path.join(__dirname, '/static/icon.ico').replace(/\\/g, '\\\\')
  console.log(iconPath)
  appTray = new Tray(iconPath)
  // 图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)

  // 隐藏主窗口
  mainWindow.hide()
  // 设置托盘悬浮提示
  appTray.setToolTip('icb-helper')
  // 设置托盘菜单
  appTray.setContextMenu(contextMenu)
  // 单机托盘小图标显示应用
  appTray.on('click', function() {
    // 显示主程序
    mainWindow.show()
    // 关闭托盘显示
    // appTray.destroy()
  })
}

// 主进程监听打开托盘事件
ipcMain.on('open-tray', () => {
  setTray()
})

function setTrays(main) {
  mainWindow = main
  setTray()
}
export default setTrays
