import Vue from 'vue';
import Vuex from 'vuex'
import SettingModule from '../../shared/store/setting-module'
import AppModule from '../../shared/store/app-module'
import UserModule from '../../shared/store/user-module'
import PharmacyModule from './pharmacy-module';
import ReportModule from './report-module';
import PlannerModule from './planner-module';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    AppModule,
    UserModule,
    SettingModule,
    PharmacyModule,
    ReportModule,
    PlannerModule
  }
});
