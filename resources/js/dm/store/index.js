import Vue from "vue";
import Vuex from "vuex";
import { httpCall } from "../../helpers/http-service";
import CustomersModule from "./customers-module";
import WorkplaceModule from "./workplace-module";
import PlannerModule from "./planner-module";
Vue.use(Vuex);

let user = document.getElementById("user");

if (user) {
  user = JSON.parse(user.value);
} else {
  user = null;
}

export default new Vuex.Store({
  modules: {
    CustomersModule,
    WorkplaceModule,
    PlannerModule
  },
  state: {
    reps: [],
    user
  },
  getters: {
    allReps: state => state.reps,
    user: state => state.user
  },
  actions: {
    getAllReps({ state }) {
      return httpCall
        .get("dm/v1/reps")
        .then(({ data }) => (state.reps = data.data));
    }
  }
});
