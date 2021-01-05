import { httpCall } from "../../helpers/http-service"

export default {
  state: {
    pm_reports: [],
    isReportsFetched: false
  },
  mutations: {
    setPmReports(state, payload) {
      state.pm_reports = payload
    }
  },
  getters: {
    allPmReports: state => state.pm_reports,
    isReportsFetched : state => state.isReportsFetched
  },
  actions: {
    getAllReports() {

    },
    getAllPmReports(module, payload) {
      module.state.pm_reports = [];
      module.state.isReportsFetched=false
      httpCall.get('rm/v1/reports/pm')
      .then(({data}) => {
      module.state.isReportsFetched=true
        module.commit('setPmReports', data.data)
      }).catch(err => console.log(err))
    },
    getAllAmReports() {

    },
    getAllPharmacyReport() {

    }
  }
}
