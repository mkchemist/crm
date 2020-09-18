import { httpCall } from "../helpers/http-service"
import Vue from 'vue';
import { ResponseHandler } from "../helpers/response-handler";
export default {
  state: {
    plans: [],
    fetched: false
  },
  getters: {
    plans : state => {
      return state.plans
    },
    isPlansFetched: state => {
      return state.fetched;
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
    }
  }
}
