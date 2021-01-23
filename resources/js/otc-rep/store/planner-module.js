import { httpCall } from "../../helpers/http-service"

export default {
  state: {
    plans: [],
    fetched: false
  },
  getters: {
    allPlans: state => state.plans,
    isPlannerFetched: state => state.fetched,
    regularPlans: state => state.plans.filter(plan => plan.type === "regular"),
    healthDayPlans: state => state.plans.filter(plan => plan.type !== "regular")
  },
  mutations: {

  },
  actions: {
    fetchPlans(module, payload) {
      if(!module.state.plans.length || payload.force) {
        module.state.fetched = false;
        module.state.plans = [];
        return httpCall.get('otc-rep/v1/planner')
        .then(({data}) => {
          module.state.fetched = true;
          module.state.plans = data.data;
        }).catch(err => console.log(err));
      }
    }
  }
}
