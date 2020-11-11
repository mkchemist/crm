import { httpCall } from "../../helpers/http-service";
import { ResponseHandler } from "../../helpers/response-handler";

export default {
  state: {
    reports: [],
    fetched: false,
    repReports: []
  },
  getters: {
    repPmReports: state => state.repReports,
    isRepPmReportsFetched: state => state.fetched,
    allRepPmReports : state => state.reports
  },
  mutations: {
    setRepPmReports(state, data) {
      state.repReports = data;
    },
    resetRepPmReports(state) {
      let asyncReset = () => {
        return new Promise((resolve, error) => {
          resolve(state.reports);
        })
      }
      state.repReports = [];
      asyncReset().then(data => state.repReports = data);
    }
  },
  actions: {
    getAllRepPmReports({ state }, force) {
      if (!state.reports.length || force) {
        state.fetched = false;
        httpCall.get("dm/v1/reports/pm").then(({ data }) => {
          ResponseHandler.methods.handleResponse(data, data => {
            state.repReports = data.data;
            state.reports = data.data;
            state.fetched = true;
          });
        });
      }
    }
  }
};
