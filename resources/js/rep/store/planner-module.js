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
    isWorkplacePlansFetched: false,

    /**
     * non field activity plans
     */
    nonFieldActivityPlans: [],
    /** is plan submitted */
    isSubmitted: false,
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
      return [...state.nonFieldActivityPlans,...state.workplacePlans, ...state.plans];
    },
    isAmPlansFetched: state => state.isWorkplacePlansFetched,
    nonFieldActivityPlans: state => state.nonFieldActivityPlans,
    isSubmittedPlans : state => state.isSubmitted
  },
  mutations: {
    collectPlansStatus(state, payload) {
      let {status} = payload;
      if(state.isSubmitted !== true) {
        state.isSubmitted = status;
      }
    }
  },
  actions: {
    /* collect all plans */
    collectPlans(Module, payload) {
      let start = payload.start || null;
      let end = payload.end || null

      if(payload.force) {
        Module.dispatch('getPlanner', {force: true ,start, end})
        .then(() => {
          Module.dispatch('getWorkplacePlanner', {force: true ,start, end})
          .then(() => {
            Module.dispatch('getNonFieldActivityPlans', {force: true ,start, end})
          })
        })
      }
    },
    /**
     * get all plans from API
     *
     * @param {object} {state}
     * @param {bool} force
     */
    getPlanner({state, commit}, payload = {}) {
      if(!state.plans.length || payload) {
        let query = {
          start: payload.start ,
          end :payload.end
        }

        return httpCall.get('rep/v1/planner', query)
        .then(({data}) => {
          state.fetched = true;
          data.message = "Planner loaded";
          ResponseHandler.methods.handleResponse(data, (data) => {
            state.plans = data.data;
            commit('collectPlansStatus',{status: data.submitted})
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
    getWorkplacePlanner({state, commit}, payload = {}) {
      if(!state.workplacePlans.length || payload) {
        this.isWorkplacePlansFetched = false;

        let query = {
          start: payload.start ,
          end :payload.end
        }
       return httpCall.get('rep/v1/workplace-planner',query)
        .then(({data}) => {
          this.isWorkplacePlansFetched = true;
          if(data.code === 201) {
            Vue.toasted.show('Workplace planner loaded successfully', {
              type: 'success',
              icon: 'check'
            });
            state.workplacePlans = data.data;
            commit('collectPlansStatus',{status: data.submitted})
          }
        })
      }
    },
    /**
     * get non field activity plans
     *
     */
    getNonFieldActivityPlans({state}, payload = {}) {
      if(!state.nonFieldActivityPlans.length || payload) {
        let query = {
          start: payload.start ,
          end :payload.end
        }
        state.nonFieldActivityPlans = [];
        return httpCall.get('activity-planner', query)
        .then(({data}) => {
          state.nonFieldActivityPlans = data.data;
        }).catch(err => console.log(err))
      }
    }
  }
}
