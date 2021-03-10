import { httpCall } from "../../helpers/http-service";

export default {
  state: {
    plans: [],
    fetched: false,
    lock : []
  },
  getters: {
    allPlans: state => state.plans,
    isPlansFetched : state => state.fetched,
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
        let start = payload.start || null;
        let end = payload.end || null;
        return httpCall.get('otc-manager/v1/planner', {start, end})
        .then(({data}) => {
          module.commit('loadPlans', {data: data.data, lock:data.submitted})
        }).catch(err => console.log(err))
      }
    }
  }
}
