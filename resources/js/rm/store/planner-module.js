import { httpCall } from "../../helpers/http-service";

export default {
  state: {
    plans: [],
    amPlans: [],
    pmPlans: [],
    coachPlans: [],
    isPmPlansFetched: false,
    isAmPlansFetched: false,
    isCoachPlansFetched: false,
  },
  getters: {
    allPlans: state => [...state.amPlans, ...state.pmPlans, ...state.coachPlans],
    amPlans: state => state.amPlans,
    pmPlans: state => state.pmPlans,
    isPmPlansFetched: state => state.isPmPlansFetched,
    isAmPlansFetched: state => state.isAmPlansFetched
  },
  mutations: {},
  actions: {
    fetchPlansCollection(module, payload) {
      module.dispatch("fetchPmPlans", payload);
      module.dispatch("fetchAmPlans", payload);
      module.dispatch("fetchCoachPlans", payload);

    },
    fetchPmPlans(module, payload) {
      if(!module.state.pmPlans.length || payload.force) {
        module.state.pmPlans = [];
        module.state.isPmPlansFetched = false;
        return httpCall
        .get("rm/v1/planner/pm")
        .then(({ data }) => {
          module.state.pmPlans = data.data;
          module.state.isPmPlansFetched = true;
        })
        .catch(err => console.log(err));
      }
    },
    fetchAmPlans(module, payload) {
      if(!module.state.amPlans.length || payload.force) {
        module.state.amPlans = [];
        module.state.isAmPlansFetched = false;

        return httpCall
          .get("rm/v1/planner/am")
          .then(({ data }) => {
            module.state.amPlans = data.data;
            module.state.isAmPlansFetched = true;
          })
          .catch(err => console.log(err));
      }
    },
    fetchCoachPlans(module, payload) {
      if(!module.state.coachPlans.length || payload.force) {
        module.state.coachPlans = [];
        module.state.isCoachPlansFetched = false;

        return httpCall
          .get("rm/v1/planner/coach")
          .then(({ data }) => {
            module.state.coachPlans = data.data;
            module.state.isCoachPlansFetched = true;
          })
          .catch(err => console.log(err));
      }
    }
  }
};
