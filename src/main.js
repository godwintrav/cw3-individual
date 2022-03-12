import Vue from 'vue'
import App from './App.vue'
import VueSweetalert2 from 'vue-sweetalert2';

Vue.config.productionTip = false

Vue.use(VueSweetalert2);


new Vue({
  render: h => h(App),
}).$mount('#app')
