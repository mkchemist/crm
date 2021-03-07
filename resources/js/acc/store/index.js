import Vue from "vue"
import Vuex from "vuex"
import UserModule from "../../shared/store/user-module";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    UserModule
  }
});
