import Vue from 'vue'
import Vuex from 'vuex'
import SettingModule from '../../shared/store/setting-module';
import AppModule from '../../shared/store/app-module';
import UserModule from '../../shared/store/user-module';
import PharmacyModule from './PharmacyModule';
import PlannerModule from './PlannerModule';
import ReportModule from './ReportModule';
import { httpCall } from '../../helpers/http-service';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    SettingModule,
    AppModule,
    UserModule,
    PharmacyModule,
    PlannerModule,
    ReportModule
  },
  state: {
    managerReps: []
  },
  getters: {
    managerReps: state => state.managerReps
  },
  actions: {
    getManagerReps(module) {
      if(!module.state.managerReps.length) {
        return httpCall.get('otc-manager/v1/reps')
        .then(({data}) => {
          module.state.managerReps = data.data;
        }).catch(err => console.log(err))
      }
    }
  }
})
