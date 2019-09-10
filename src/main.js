import Vue from 'vue'
import store from './store'
import App from './App'

Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'

wx.cloud.init({
  env: 'music163-4rnnj',
  traceUser: true
})

const app = new Vue(App)
app.$mount()
