import { httpCall } from "../../helpers/http-service"
import Vue from 'vue';
import { ResponseHandler } from "../../helpers/response-handler";
export default {
  state: {
    /**
     * pm plans container
     *
     */
    plans: [],
    /**
     * is plan fetched
     *
     */
    fetched: false,
    /**
     * am plans container
     *
     */
    workplacePlans: [],
    /**
     * is workplaces plans fetched
     *
     */
    isWorkplacePlansFetched: false
  },
  getters: {
    /**
     * pm plans
     *
     */
    plans : state => {
      return state.plans
    },
    /**
     * is plan is already fetched
     */
    isPlansFetched: state => {
      return state.fetched;
    },
    /**
     * am plan
     *
     */
    amPlans: state => {
      return state.workplacePlans;
    },
    allPlans: state => {
      return [...state.workplacePlans, ...state.plans];
    },
    isAmPlansFetched: state => state.isWorkplacePlansFetched
  },
  mutations: {

  },
  actions: {
    /**
     * get all plans from API
     *
     * @param {object} {state}
     * @param {bool} force
     */
    getPlanner({state}, force) {
      if(!state.plans.length || force) {
        httpCall.get('rep/v1/planner')
        .then(({data}) => {
          state.fetched = true;
          data.message = "Planner loaded";
          ResponseHandler.methods.handleResponse(data, (data) => {
            state.plans = data.data;
          });
        });
      }
    },
    /**
     * get workplace planner
     *
     * @param {object} {state}
     * @param {boolean} force
     */
    getWorkplacePlanner({state}, force) {
      if(!state.workplacePlans.length || force) {
        this.isWorkplacePlansFetched = false;
        httpCall.get('rep/v1/workplace-planner')
        .then(({data}) => {
          this.isWorkplacePlansFetched = true;
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
