import Vue from "vue"
import Vuex from "vuex";
import AppModule from './app-module';
import UsersModule from './users-module';
import SettingModule from "./setting-module";
import BroadcastModule from './broadcast-module';
import PlannerModule from './planner-module'

Vue.use(Vuex);


export default new Vuex.Store({
  modules: {
    AppModule,
    UsersModule,
    SettingModule,
    BroadcastModule,
    PlannerModule
  }
});
