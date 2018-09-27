import Vue from 'vue'
//import App from './App.vue'
import Table1 from './Table1.vue'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue);

new Vue({
  el: '#app',
  render: h => h(Table1)
})
