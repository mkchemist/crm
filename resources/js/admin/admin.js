import Vue from 'vue';
import App from "./App.vue"
import router from "./router"

let app = new Vue({
  render : h=>h(App),
  router
}).$mount('#app');
