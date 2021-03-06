import { httpCall } from "../../helpers/http-service"

export default {
  state: {
    plans: [],
    fetched: false,
    locked: false,
    approvalLock: false
  },
  getters: {
    allPlans: state => state.plans,
    isPlannerFetched: state => state.fetched,
    regularPlans: state => state.plans.filter(plan => plan.type === "regular"),
    healthDayPlans: state => state.plans.filter(plan => plan.type !== "regular"),
    isPlannerLocked: state => state.locked,
    isPlannerApproved: state => state.approvalLock
  },
  mutations: {
    /**
     * load plans to store
     *
     * @param {Object} state
     * @param {Array} payload
     */
    loadPlanner(state, payload = []) {
      state.plans = payload;
    },
    /**
     * change planner fetching status
     *
     * @param {Object} state
     * @param {boolean} payload
     */
    changePlannerFetchedState(state, payload = false) {
      state.fetched = payload
    },
    /**
     * change planner lock
     *
     * @param {Object} state
     * @param {boolean} payload
     */
    changePlannerLockState(state, payload = false) {
      state.locked = payload
    },
    /**
     * change approval state
     *
     * @param {Object} state
     * @param {boolean} payload
     */
    changePlannerApprovalLockState(state, payload = false)
    {
      state.approvalLock = payload
    }

  },
  actions: {
    /**
     * fetching plans
     *
     * @param {Object} module
     * @param {Object} payload
     */
    fetchPlans(module, payload = {}) {
      if(!module.state.plans.length || payload.force) {
        let start = payload.start ||  null;
        let end = payload.end || null;

        module.commit('loadPlanner');
        module.commit('changePlannerFetchedState');
        module.commit('changePlannerLockState');
        module.commit("changePlannerApprovalLockState");

        return httpCall.get('otc-rep/v1/planner', {start, end})
        .then(({data}) => {
          module.commit('changePlannerFetchedState', true);
          module.commit('loadPlanner', data.data);
          module.commit('changePlannerLockState', data.isSubmitted);
          module.commit("changePlannerApprovalLockState", data.isApproved);
        }).catch(err => console.log(err));
      }
    }
  }
}
