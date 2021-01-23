import Vue from 'vue'
import LoaderComponent from '../components/LoaderComponent.vue'
import TableComponent from '../components/TableComponent.vue'
import NoDataToShow from '../components/NoDataToShow.vue'
import router from './router/index'
import store from './store/index'
import App from './App.vue'
import {extend, localize, ValidationObserver, ValidationProvider} from "vee-validate"
import * as rules from "vee-validate/dist/rules"
import en from "vee-validate/dist/locale/en.json";
import { ResponseHandler } from "../helpers/response-handler";
import Toasted from "vue-toasted";

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
Vue.mixin(ResponseHandler)
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('loader-component', LoaderComponent)
Vue.component('table-component', TableComponent)
Vue.component('no-data-to-show', NoDataToShow)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
