import Vue from 'vue'
import Vuex from 'vuex'
import UserModule from './user-module'
import ReportModule from './report-modules'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  getters: {

  },
  actions: {

  },
  modules: {
    UserModule,
    ReportModule
  }
});
