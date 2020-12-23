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
if (!process.env.IS_WEB) {
  if (!require('../../config').IsUseSysTitle) {
    require('@/styles/custom-title.scss')
  }
  // 当处于electron状态下才引用db
  Vue.prototype.$store = new Store()
  Vue.prototype.$ipcApi = require('./utils/ipcRenderer').default
}

Vue.use(ElementUI)

Vue.config.productionTip = false
/* eslint-disable no-new */
const vue = new Vue({
  components: { App },
  router,
  template: '<App/>',
}).$mount('#app')

export default vue
