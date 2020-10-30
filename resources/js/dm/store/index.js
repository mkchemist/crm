import Vue from "vue";
import Vuex from "vuex";
import CustomersModule from "./customers-module"
import WorkplaceModule from "./workplace-module"
Vue.use(Vuex);


export default new Vuex.Store({
  modules: {
    CustomersModule,
    WorkplaceModule
  }
});
