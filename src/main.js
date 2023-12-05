import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import axios from 'axios';

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';
Vue.prototype.$http = axios;

new Vue({
  render: h => h(App),
}).$mount('#app')
