import Vue from "vue"
import Vuex from "vuex";
import UsersModule from './users-module';
import SettingModule from "./setting-module";
import BroadcastModule from './broadcast-module';
Vue.use(Vuex);


export default new Vuex.Store({
  modules: {
    UsersModule,
    SettingModule,
    BroadcastModule
  }
});
