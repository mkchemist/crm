import { httpCall } from "../../helpers/http-service";
import Vue from "vue";
import { ResponseHandler } from "../../helpers/response-handler";

export default {
  state: {
    pm_visits: [],
    am_visits: [],
    pharmacy_visits: [],
    fetched: false
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
    },
    fetchedReports: state => {
      return state.fetched;
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
        state.fetched = false;
        httpCall.get('rep/v1/reports/pm')
        .then(({data}) => {
          data.message = "PM reports loaded";
          ResponseHandler.methods.handleResponse(data, (data) => {
            state.pm_visits = data.data;
            state.fetched = true;
          });
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
        state.fetched = false;
        httpCall.get('rep/v1/reports/am')
        .then(({data}) => {
          data.message = "AM reports loaded";
          ResponseHandler.methods.handleResponse(data, data => {
            state.am_visits = data.data;
            state.fetched = true;
          });
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
        state.fetched = false;
        httpCall.get('rep/v1/reports/pharmacy')
        .then(({data}) => {

          data.message = "Pharmacy reports loaded";
          ResponseHandler.methods.handleResponse(data, data => {
            state.pharmacy_visits = data.data;
            state.fetched = true;
          });
        })
      }
    }
  }
}
