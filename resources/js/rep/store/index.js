import Vue from "vue";
import Vuex from "vuex";
import AppModule from "../../shared/store/app-module";
import Customer from "./customer-module";
import Workplace from "./workplace-module";
import Planner from './planner-module';
import Report from "./report-module";
import UserModule from '../../shared/store/user-module';
import SettingModule from "../../shared/store/setting-module"
import { httpCall } from "../../helpers/http-service";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    coaches: []
  },
  mutations: {},
  getters: {
    coaches: state => state.coaches
  },
  actions: {
    getCoaches({state}) {
      httpCall.get('rep/v1/coach')
      .then(({data}) => {
        state.coaches = data.data;
      })
    }
  },
  modules: {
    AppModule,
    Customer,
    Workplace,
    Planner,
    Report,
    SettingModule,
    UserModule
  }
});
