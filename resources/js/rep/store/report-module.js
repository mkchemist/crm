import { httpCall } from "../helpers/http-service";
import Vue from "vue";
export default {
  state: {
    pm_visits: [],
    am_visits: [],
    pharmacy_visits: []
  },
  getters: {
    pmVisits: state => {
      return state.pm_visits;
    },
    amVisits: state => {
      return state.am_visits;
    },
    pharmacyVisits: state => {
      return state.pharmacy_visits;
    },
    allVisits: state => {
      return [...state.pm_visits, ...state.am_visits];
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
          Vue.toasted.show('PM reports loaded', {
            type: 'success',
            icon: 'check'
          })
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
      if(!state.am_visits.length || force ) {
        httpCall.get('rep/v1/reports/am')
        .then(({data}) => {
          if(data.code === 201) {
            state.am_visits = data.data
            Vue.toasted.show('AM reports loaded', {
              type: 'success',
              icon: 'check'
            })
          }

        });
      }
    },
    /**
     * get all pharmacy reports
     *
     * @param {object} {state}
     * @param {boolean} force
     */
    pharmacyReportGetAll({state}, force) {
      if(!state.pharmacy_visits.length || force) {
        httpCall.get('rep/v1/reports/pharmacy')
        .then(({data}) => {
          if(data.code === 201) {
            state.pharmacy_visits = data.data;
            Vue.toasted.show('Pharmacy reports loaded', {
              type: 'success',
              icon: 'check'
            })
          }
        })
      }
    }
  }
}
