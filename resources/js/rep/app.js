import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./routes";
import {extend, localize, ValidationObserver, ValidationProvider} from "vee-validate"
import * as rules from "vee-validate/dist/rules"
import en from "vee-validate/dist/locale/en.json";
import "vue-loaders/dist/vue-loaders.css";
import VueLoaders from "vue-loaders";
import Toasted from "vue-toasted";
import LoaderComponent from "./components/LoaderComponent";
import { ResponseHandler } from "./helpers/response-handler";

Vue.use(Toasted, {
  duration: 4000,
  iconPack: 'fontawesome',
  action:{
    onClick: (e, toastObject) => {
      toastObject.goAway(0);
    },
    class: 'small text-light',
    icon: 'times'
  }
});


Vue.mixin(ResponseHandler)

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

localize(en);


Vue.component('vue-loaders',VueLoaders.component);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('LoaderComponent', LoaderComponent);

var app = new Vue({
  render: h => h(App),
  store,
  router
}).$mount("#app");
