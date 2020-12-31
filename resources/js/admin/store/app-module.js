export default {
  state: {
    planUser: null,
  },
  getters: {
    currentPlanUser: state => state.currentPlanUser
  },
  mutations: {
    setPlanUser(state, payload) {
      state.currentPlanUser = payload.user;
    }
  },
  actions: {

  }
}
