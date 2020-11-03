import { httpCall } from "../../helpers/http-service"

export default {
  state: {
    allPlans: [],
    fetched: false,
    currentUserId: [],
    selectedUserPlans: [],
  },
  getters: {
    plans: state => state.allPlans.filter(plan => plan.user_id === state.currentUserId),
    isPlanFetched : state => state.fetched,
    currentUserId: state => state.currentUserId
  },
  mutations: {
    setCurrentUserId(state, id) {
      state.currentUserId = id;
    }
  },
  actions: {
    getPlans: ({state}, force) => {
      if(!state.allPlans.length || force) {
        httpCall.get('dm/v1/planner')
        .then(({data}) => {
          state.allPlans = [...data.data.coach, ...data.data.rep]
        })
      }
    }
  }
}
