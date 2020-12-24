import { httpCall } from "../../helpers/http-service"

export default {
  state: {
    allPlans: [],
    fetched: false,
    currentUserId: [],
    selectedUserPlans: [],
    repPlans: [],
    coachPlans: [],
  },
  getters: {
    plans: state => state.allPlans.filter(plan => plan.user_id === state.currentUserId),
    isPlanFetched : state => state.fetched,
    currentUserId: state => state.currentUserId,
    repPlans: state => state.repPlans
  },
  mutations: {
    setCurrentUserId(state, id) {
      state.currentUserId = id;
    }
  },
  actions: {
    getPlans: ({state}, force) => {
      if(!state.allPlans.length || force) {
        state.fetched = false;
        return httpCall.get('non-field-activity-planner')
        .then(({data}) => {
          state.allPlans = data.data;
          return httpCall.get('dm/v1/planner')
          .then(({data}) => {
            state.fetched = true;
            state.repPlans = data.data.rep;
            state.coachPlans = data.data.coach;
            state.allPlans = [...state.allPlans,...data.data.coach, ...data.data.rep]
          })
        }).catch(err => console.log(err));
      }
    }
  }
}
