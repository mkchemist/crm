import Vue from "vue";
import Vuex from "vuex";
import CustomersModule from "./customers-module"

Vue.use(Vuex);


export default new Vuex.Store({
  modules: {
    CustomersModule
  }
});
