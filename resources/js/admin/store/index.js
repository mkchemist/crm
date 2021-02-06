import Vue from "vue"
import Vuex from "vuex";
import AppModule from './app-module';
import UsersModule from './users-module';
import AdminSettingModule from "./setting-module";
import BroadcastModule from './broadcast-module';
import PlannerModule from './planner-module'
import CustomerModule from './customer-module'
import SettingModule from "../../shared/store/setting-module";
Vue.use(Vuex);


export default new Vuex.Store({
  modules: {
    AppModule,
    UsersModule,
    AdminSettingModule,
    BroadcastModule,
    PlannerModule,
    CustomerModule,
    SettingModule
  }
});
