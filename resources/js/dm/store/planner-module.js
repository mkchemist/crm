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
      module.dispatch("getPlans", payload).then(() => {
        module.dispatch("getWorkplacePlans", payload).then(() => {
          module.dispatch("getNonFieldActivityPlans", payload);
        });
      });

    },
    getPlans: ({ state }, payload) => {
      if (!state.allPlans.length || payload) {
        state.fetched = false;
        state.repPlans = [];
        state.coachPlans = [];
        state.allPlans = [];
        let start = null,end = null;
        if(payload && typeof payload === "object" && payload.cycle) {
          start = payload.cycle.start || null;
          end = payload.cycle.end || null;
        }
        return httpCall
          .get("dm/v1/planner",{start, end})
          .then(({ data }) => {
            state.fetched = true;
            state.repPlans = data.data.rep;
            state.coachPlans = data.data.coach;
            state.planValidationData = data.validation;
          })
          .catch(err => console.log(err));
      }
    },
    getNonFieldActivityPlans({ state }, payload) {
      if (!state.nonFieldActivityPlans.length || payload) {
        this.nonFieldActivityPlans = [];
        let start = null,end = null;
        if(payload && typeof payload === "object" &&payload.cycle) {
          start = payload.cycle.start || null;
          end = payload.cycle.end || null;
        }
        return httpCall
          .get("activity-planner", {start, end})
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
        let start = null,end = null;
        if(payload && typeof payload === "object" && payload.cycle) {
          start = payload.cycle.start || null;
          end = payload.cycle.end || null;
        }
        return httpCall
          .get("dm/v1/workplace-planner", {start, end})
          .then(({ data }) => {
            state.workplacePlans = data.data;
            state.isWorkplacePlansFetched = true;
          })
          .catch(err => console.log(err));
      }
    }
  }
};
