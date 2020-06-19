import antd, { message } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import axios from 'axios';
import Vue from 'vue';
import XbIcon from './components/icon/index';
import XbTable from './components/table/index';
import App from './demo/Demo.vue';
Vue.prototype.$axiosServices = axios;

Vue.config.productionTip = false;
message.config({
  top: `114px`,
  maxCount: 1,
});
Vue.use(antd);

Vue.component('XbTable', XbTable);
Vue.component('XbIcon', XbIcon);
new Vue({
  render: h => h(App),
}).$mount('#app');
