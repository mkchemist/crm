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
     * submitted days
     */
    submittedDays: [],
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
    submittedDays : state =>  {
      let days = [];
      try {
        state.submittedDays.map(day => {
          if(!days.includes(day.plan_date)) {
            days.push(day.plan_date);
          }
        })
      }catch(e) {
        console.warn(e)
      }
      return days
    },
    nonFieldActivityPlans: state => state.nonFieldActivityPlans,
    isSubmittedPlans : state => state.isSubmitted
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
        let queryString = {};
        let activeCycle = this.state.AppModule.activeCycle;
        if(activeCycle) {
          queryString = activeCycle
        }

        return httpCall.get('rep/v1/planner', queryString)
        .then(({data}) => {
          state.fetched = true;
          data.message = "Planner loaded";
          ResponseHandler.methods.handleResponse(data, (data) => {
            state.plans = data.data;
            state.submittedDays = [...state.submittedDays,...data.submitted]
            state.isSubmitted = data.isSubmitted;
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
        let queryString = {};
        let activeCycle = this.state.AppModule.activeCycle;
        if(activeCycle) {
          queryString = activeCycle
        }
       return httpCall.get('rep/v1/workplace-planner',queryString)
        .then(({data}) => {
          this.isWorkplacePlansFetched = true;
          if(data.code === 201) {
            Vue.toasted.show('Workplace planner loaded successfully', {
              type: 'success',
              icon: 'check'
            });
            state.workplacePlans = data.data;
            state.submittedDays = [...state.submittedDays,...data.submitted]
          }
        })
      }
    },
    /**
     * get non field activity plans
     *
     */
    getNonFieldActivityPlans({state}, payload) {
      if(!state.nonFieldActivityPlans.length || payload) {
        let query = {};
        let activeCycle = this.state.AppModule.activeCycle;
        if(activeCycle) {
          query = activeCycle
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
