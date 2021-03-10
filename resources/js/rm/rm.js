import Vue from 'vue'
import App from './App.vue';
import router from './router'
import store from './store';
import {extend, localize, ValidationObserver, ValidationProvider} from "vee-validate"
import * as rules from "vee-validate/dist/rules"
import en from "vee-validate/dist/locale/en.json";
import Toasted from "vue-toasted";
import LoaderComponent from "../components/LoaderComponent";
import { ResponseHandler } from "../helpers/response-handler";
import VueSweetAlert2 from 'vue-sweetalert2';
import "sweetalert2/dist/sweetalert2.min.css";
import CoachReportModule from '../shared/modules/coach-report-module'
import CustomerRequestModule from "../shared/modules/request-module"
import SingleVisitModule from "../shared/modules/single-visit"




store.registerModule(CoachReportModule.MODULE_NAME,CoachReportModule.store);
router.addRoutes(CoachReportModule.router)
store.registerModule(CustomerRequestModule.MODULE_NAME, CustomerRequestModule.store)
router.addRoutes(CustomerRequestModule.router);
store.registerModule(SingleVisitModule.MODULE_NAME, SingleVisitModule.store)
router.addRoutes(SingleVisitModule.router)

Vue.use(VueSweetAlert2)

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


Vue.mixin(ResponseHandler)

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

localize(en);

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('LoaderComponent', LoaderComponent);

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

