import Vue from 'vue'

import App from './App'
import router from './router'
// 引用element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 日志
import './error'
import './icons'
import '@/styles/index.scss'
const Store = require('electron-store')
Vue.use(ElementUI)

if (!process.env.IS_WEB) {
  if (!require('../../config').IsUseSysTitle) {
    require('@/styles/custom-title.scss')
  }
  // 当处于electron状态下才引用db
  Vue.prototype.$store = new Store()
  Vue.prototype.$ipcApi = require('./utils/ipcRenderer').default
  const { ipcRenderer } = require('electron')
  const os = require('os')

  ipcRenderer.on('change-view', (event, data) => {
    console.log(data)
    if (data.route) {
      router.push(data.route)
    }
  })
  ipcRenderer.on('open-dialog', function(event, data) {
    Vue.prototype.$alert(
      `<ul>
    <li style="list-style:none"><span style="width:90px;padding-right:10px;display:inline-block;text-align:right">版本:</span><span>${
      data.version
    }</span></li>
    <li style="list-style:none"><span style="width:90px;padding-right:10px;display:inline-block;text-align:right">引擎版本:</span><span>${
      data.yin
    }</span></li>
    <li style="list-style:none"><span style="width:90px;padding-right:10px;display:inline-block;text-align:right">当前系统:</span><span>${os.type()} ${os.arch()} ${os.release()}</span></li>
    </ul>
    `,
      '关于 icb-helper',
      {
        dangerouslyUseHTMLString: true,
      }
    )
  })
}

Vue.config.productionTip = false
/* eslint-disable no-new */
const vue = new Vue({
  components: { App },
  router,
  template: '<App/>',
}).$mount('#app')

export default vue
