import Vue from "vue"
import Vuex from "vuex";
import UsersModule from './users-module';
Vue.use(Vuex);


export default new Vuex.Store({
  modules: {
    UsersModule
  }
});
