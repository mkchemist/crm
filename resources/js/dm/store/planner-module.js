import { httpCall } from "../../helpers/http-service"

export default {
  state: {
    allPlans: [],
    nonFieldActivityPlans:[],
    fetched: false,
    currentUserId: [],
    selectedUserPlans: [],
    repPlans: [],
    coachPlans: [],
    planValidationData: []
  },
  getters: {
    plans: state =>{
      let plans = [...state.nonFieldActivityPlans,...state.allPlans];
     return plans.filter(plan => plan.user_id === state.currentUserId)
    } ,
    isPlanFetched : state => state.fetched,
    currentUserId: state => state.currentUserId,
    repPlans: state => state.repPlans,
    planValidationData: state => state.planValidationData
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
        state.repPlans = [];
        state.coachPlans = [];
        state.allPlans = [];
        return httpCall.get('dm/v1/planner')
          .then(({data}) => {
            state.fetched = true;
            state.repPlans = data.data.rep;
            state.coachPlans = data.data.coach;
            state.allPlans = [...state.allPlans,...data.data.coach, ...data.data.rep]
            state.planValidationData = data.validation
          }).catch(err => console.log(err))
        ;
      }
    },
    getNonFieldActivityPlans({state} ,force){
      if(!state.nonFieldActivityPlans.length || force) {
        this.nonFieldActivityPlans = [];
        return httpCall.get('activity-planner')
          .then(({data}) => {
            state.nonFieldActivityPlans = data.data;
          }).catch(err => console.log(err))
      }
    }
  }
}
