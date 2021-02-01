import Vue from 'vue'
import Vuex from 'vuex'
import UserModule from './user-module'
import ReportModule from './report-modules'
import PlannerModule from './planner-module';
import SettingModule from '../../shared/store/setting-module';
import AppModule from '../../shared/store/app-module'
import CustomerModule from './customers-module'

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
    ReportModule,
    PlannerModule,
    SettingModule,
    AppModule,
    CustomerModule
  }
});
