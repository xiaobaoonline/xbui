// require styles

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style/index.less'

Vue.config.productionTip = false
Vue.use(Antd)

new Vue({
  store,
  router,
  render: (h: any) => h(App),
}).$mount('#app')
