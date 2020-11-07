import Vue from "vue";
import Vuex from "vuex";
import { httpCall } from "../../helpers/http-service";
import CustomersModule from "./customers-module";
import WorkplaceModule from "./workplace-module";
import PlannerModule from "./planner-module";
import ReportModule from './reports-module'
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
    PlannerModule,
    ReportModule
  },
  state: {
    reps: [],
    user,
    isRepsFetched: false
  },
  getters: {
    allReps: state => state.reps,
    dmReps: state => state.reps.filter(rep => rep.id !== state.user.id),
    user: state => state.user,
    isRepsFetched: state => state.isRepsFetched
  },
  actions: {
    getAllReps({ state }) {
      this.isRepsFetched = false;
      return httpCall
        .get("dm/v1/reps")
        .then(({ data }) => {
          this.isRepsFetched = true;
          state.reps = data.data
        });
    }
  }
});
