import Vue from "vue";
import Vuex from "vuex";
import AppModule from "./app-module";
import Customer from "./customer-module";
import Workplace from "./workplace-module";
import Planner from './planner-module';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  getters: {},
  actions: {},
  modules: {
    AppModule,
    Customer,
    Workplace,
    Planner
  }
});
