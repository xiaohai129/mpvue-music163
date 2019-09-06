import Vue from 'vue'
import store from './store'
import App from './App'
import '../static/iconfont/font_1039190_88v6babdonw.css'

Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'

wx.cloud.init({
  env: 'music163-4rnnj',
  traceUser: true
})

const app = new Vue(App)
app.$mount()
