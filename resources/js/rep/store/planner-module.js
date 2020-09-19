import { httpCall } from "../helpers/http-service"
import Vue from 'vue';
import { ResponseHandler } from "../helpers/response-handler";
export default {
  state: {
    plans: [],
    fetched: false,
    workplacePlans: []
  },
  getters: {
    plans : state => {
      return state.plans
    },
    isPlansFetched: state => {
      return state.fetched;
    },
    amPlans: state => {
      return state.workplacePlans;
    }
  },
  mutations: {

  },
  actions: {
    getPlanner({state}, force) {
      if(!state.plans.length || force) {
        httpCall.get('rep/v1/planner')
        .then(({data}) => {
          state.fetched = true;
          if(data.code === 400 || data.code === 203) {
            Vue.toasted.show('No Plans found', {
              type: 'info',
              icon: 'exclamation-triangle'
            })
            ResponseHandler.methods.handleResponseError(data);
            state.fetched = true;
          } else {
            Vue.toasted.show('Planner loaded', {
              type: 'info',
              icon: 'check'
            });
            state.plans = data.data;
          }
        });
      }
    },
    getWorkplacePlanner({state}, force) {
      if(!state.workplacePlans.length || force) {
        httpCall.get('rep/v1/workplace-planner')
        .then(({data}) => {
          if(data.code === 201) {
            Vue.toasted.show('Workplace planner loaded successfully', {
              type: 'success',
              icon: 'check'
            });
            state.workplacePlans = data.data;
          }
        })
      }
    }
  }
}
