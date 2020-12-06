import {httpCall} from "../../helpers/http-service";
import {ResponseHandler} from "../../helpers/response-handler";

export default {
  state: {
    reports: [],
    fetched: false,
    filteredReports: []
  },
  getters: {
    repCoachReports: state => state.filteredReports,
    isCoachReportsFetched: state => state.fetched,
    allCoachReports: state => state.reports
  },
  mutations: {
    setCoachReports(state, data) {
      state.filteredReports = data;
    },
    resetCoachReports(state) {
      let asyncReset = () => {
        return new Promise((resolve, err) => {
          resolve(state.reports);
        })
      }
      state.filteredReports = [];
      asyncReset().then(data => state.filteredReports = data);
    }
  },
  actions: {
    getAllCoachReports({state}, force = false) {
      if(!state.reports.length || force) {
        state.reports = [];
        state.filteredReports = [];
        state.fetched = false;
        httpCall.get('dm/v1/reports/coach')
        .then(({data}) => {
          ResponseHandler.methods.handleResponse(data, data => {
           state.reports = data.data;
           state.filteredReports = data.data;
           state.fetched = true;
          })
        });
      }
    }
  }
}
