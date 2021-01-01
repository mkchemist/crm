import { httpCall } from "../../helpers/http-service";

export default {
  state: {
    amPlans: [],
    pmPlans: [],
    activityPlans: [],
    isPlanFetched: false,
    planUser: null
  },
  getters: {
    allPlans: state => [
      ...state.activityPlans,
      ...state.amPlans,
      ...state.pmPlans
    ],
    pmPlans: state => state.pmPlans,
    amPlans: state => state.amPlans,
    activityPlans: state => state.activityPlans,
    isPlanFetched: state => state.isPlanFetched,
    planUser: state => state.planUser
  },
  mutations: {
    setPlanUser(state, payload) {
      state.setPlanUser = payload.user
    }
  },
  actions: {
    fetchAllPlans(module, payload) {
      let query = {};
      if (module.state.planUser) {
        query.user = module.state.planUser;
      }
      module.state.isPlanFetched = false;
      module.state.pmPlans = [];
      module.state.amPlans = [];
      httpCall
        .get("admin/v1/planner", query)
        .then(({ data }) => {
          module.state.amPlans = data.data.am;
          module.state.pmPlans = data.data.pm;
          module.state.isPlanFetched = true;
        })
        .catch(err => console.log(err));
    },
    getPmPlans(module, payload) {},
    getAmPlans(module, payload) {},
    getActivityPlans(module, payload) {}
  }
};
