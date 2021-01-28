import { httpCall } from "../../helpers/http-service";

export default {
  state: {
    plans: [],
    fetch: false,
    lock : []
  },
  getters: {
    allPlans: state => state.plans,
    isPlansFetched : state => state.fetch,
    lockedPlans: state => state.lock
  },
  mutations: {
    resetPlans(state) {
      state.plans = [];
      state.fetched = false;
    },
    loadPlans(state, payload) {
      state.plans = payload.data;
      state.fetched =true;
      state.lock = payload.lock
    }
  },
  actions: {
    fetchPlans(module, payload = {}) {
      if(!module.state.plans.length || payload.force) {
        module.commit('resetPlans')
        return httpCall.get('otc-manager/v1/planner')
        .then(({data}) => {
          module.commit('loadPlans', {data: data.data, lock:data.submitted})
        }).catch(err => console.log(err))
      }
    }
  }
}
