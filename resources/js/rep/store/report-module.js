import { httpCall } from "../helpers/http-service";
export default {
  state: {
    pm_visits: [],
    am_visits: [],
  },
  getters: {
    pmVisits: state => {
      return state.pm_visits;
    },
    amVisits: state => {
      return state.am_visits;
    }
  },
  mutations: {

  },
  actions: {
    /**
     * get all pm visits
     * @param {object} {state}
     * @param {boolean} force
     */
    reportGetAll({state}, force) {
      if(!state.pm_visits.length || force) {
        httpCall.get('rep/v1/reports/pm')
        .then(({data}) => {
          state.pm_visits = data.data;
        })
      }
    },
    /**
     * get all am visits
     *
     * @param {object} {state}
     * @param {boolean} force
     */
    amGetAll({state}, force) {
      if(!state.pm_visits.length || force ) {
        httpCall.get('rep/v1/reports/am')
        .then(({data}) => {
          if(data.code === 201) {
            state.am_visits = data.data
          }
        });
      }
    }
  }
}
