import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store";
import {extend, localize, ValidationObserver, ValidationProvider} from "vee-validate"
import * as rules from "vee-validate/dist/rules"
import en from "vee-validate/dist/locale/en.json";
import Toasted from "vue-toasted";
import LoaderComponent from "../components/LoaderComponent.vue";

Vue.use(Toasted, {
  duration: 4000,
  iconPack: 'fontawesome',
  action:{
    onClick: (e, toastObject) => {
      toastObject.goAway(0);
    },
    class: 'small text-light',
    icon: 'times'
  },
  position: 'top-left'
});



Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

localize(en);

Vue.component('loader-component', LoaderComponent);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

let app = new Vue({
  render : h => h(App),
  router,
  store
}).$mount('#app');
