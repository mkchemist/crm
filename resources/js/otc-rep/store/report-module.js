import { filterBy, filterData } from "../../helpers/helpers";
import { httpCall } from "../../helpers/http-service";

export default {
  state: {
    pharmacyReports: [],
    pharmacyReportsFetched: false,
  },
  getters: {
    pharmacyReports : state => state.pharmacyReports,
    pharmacyReportsFetched : state => state.pharmacyReportsFetched,
    pharmacyReportsDateView: state => {
      let reports = filterData(state.pharmacyReports, 'date');
      return reports;
    },
    pharmacyReportsPharmacyView: state => {
      let reports = filterData(state.pharmacyReports, 'pharmacy');
      return reports;
    },
    totalPharmacyReportsCount: state => state.pharmacyReports.length
  },
  mutations: {

  },
  actions: {
    fetchPharmacyReports(module, payload) {
      module.state.pharmacyReports = [];
      module.state.pharmacyReportsFetched = false;
      if(!module.state.pharmacyReports.length || payload.force) {
        return httpCall.get('otc-rep/v1/reports/pharmacy')
        .then(({data}) => {
          module.state.pharmacyReports = data.data;
          module.state.pharmacyReportsFetched = true;
        }).catch(err => console.log(err))
      }
    }
  }
}
