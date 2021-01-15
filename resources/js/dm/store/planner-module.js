import { httpCall } from "../../helpers/http-service";

export default {
  state: {
    allPlans: [],
    nonFieldActivityPlans: [],
    fetched: false,
    currentUserId: [],
    selectedUserPlans: [],
    repPlans: [],
    coachPlans: [],
    planValidationData: [],
    workplacePlans: [],
    isWorkplacePlansFetched: false
  },
  getters: {
    plans: state => {
      let plans = [...state.nonFieldActivityPlans,...state.workplacePlans,...state.repPlans, ...state.coachPlans];
      //return plans
      return plans.filter(plan => plan.user_id === state.currentUserId);
    },
    isPlanFetched: state => state.fetched,
    currentUserId: state => state.currentUserId,
    repPlans: state => state.repPlans,
    coachPlans: state => state.coachPlans,
    planValidationData: state => state.planValidationData,
  },
  mutations: {
    setCurrentUserId(state, id) {
      state.currentUserId = id;
    }
  },
  actions: {
    fetchAllPlans(module, payload) {
      if (payload.force) {
        module.dispatch("getPlans", payload.force).then(() => {
          module.dispatch("getWorkplacePlans", payload.force).then(() => {
            module.dispatch("getNonFieldActivityPlans", payload.force);
          });
        });
      }
    },
    getPlans: ({ state }, force) => {
      if (!state.allPlans.length || force) {
        state.fetched = false;
        state.repPlans = [];
        state.coachPlans = [];
        state.allPlans = [];
        return httpCall
          .get("dm/v1/planner")
          .then(({ data }) => {
            state.fetched = true;
            state.repPlans = data.data.rep;
            state.coachPlans = data.data.coach;
            state.planValidationData = data.validation;
          })
          .catch(err => console.log(err));
      }
    },
    getNonFieldActivityPlans({ state }, force) {
      if (!state.nonFieldActivityPlans.length || force) {
        this.nonFieldActivityPlans = [];
        return httpCall
          .get("activity-planner")
          .then(({ data }) => {
            state.nonFieldActivityPlans = data.data;
          })
          .catch(err => console.log(err));
      }
    },
    getWorkplacePlans({ state }, payload) {
      if (!state.workplacePlans.length || payload.force) {
        state.workplacePlans = [];
        state.isWorkplacePlansFetched = false;
        return httpCall
          .get("dm/v1/workplace-planner")
          .then(({ data }) => {
            state.workplacePlans = data.data;
            state.isWorkplacePlansFetched = true;
          })
          .catch(err => console.log(err));
      }
    }
  }
};
