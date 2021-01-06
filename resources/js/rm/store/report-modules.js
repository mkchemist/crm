import { httpCall } from "../../helpers/http-service";

export default {
  state: {
    pm_reports: [],
    isReportsFetched: false,
    am_reports: [],
    isAmReportsFetched: false,
    pharmacy_reports : [],
    isPharmacyReportsFetched: false,
  },
  mutations: {
    setPmReports(state, payload) {
      state.pm_reports = payload;
    },
    setAmReports(state, payload) {
      state.am_reports = payload;
    },
    setPharmacyReports(state, payload) {
      state.pharmacy_reports = payload
    }
  },
  getters: {
    allPmReports: state => state.pm_reports,
    isReportsFetched: state => state.isReportsFetched,
    allAmReports: state => state.am_reports,
    isAmReportsFetched: state => state.isAmReportsFetched,
    allPharmacyReports: state => state.pharmacy_reports,
    isPharmacyReportsFetched: state=> state.isPharmacyReportsFetched
  },
  actions: {
    getAllReports() {},
    getAllPmReports(module, payload) {
      module.state.pm_reports = [];
      module.state.isReportsFetched = false;
      httpCall
        .get("rm/v1/reports/pm")
        .then(({ data }) => {
          module.state.isReportsFetched = true;
          module.commit("setPmReports", data.data);
        })
        .catch(err => console.log(err));
    },
    getAllAmReports(module, payload) {
      module.state.am_reports = [];
      module.state.isAmReportsFetched = false;
      httpCall
        .get("rm/v1/reports/am")
        .then(({ data }) => {
          module.state.am_reports = data.data;
          module.state.isAmReportsFetched = true;
        })
        .catch(err => console.log(err));
    },
    getAllPharmacyReports(module, payload) {
      module.state.pharmacy_reports = [];
        module.state.isPharmacyReportsFetched = false;
      httpCall.get('rm/v1/reports/pharmacy')
      .then(({data}) => {
        module.commit('setPharmacyReports', data.data)
        module.state.isPharmacyReportsFetched = true;
      }).catch(err => console.log(err))
    }
  }
};
