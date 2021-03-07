import { filterData } from "../../helpers/helpers";
import { httpCall } from "../../helpers/http-service";

export default {
  state: {
    pharmacyReports: [],
    pharmacyReportsFetched: false
  },
  getters: {
    pharmacyReports: state =>
      state.pharmacyReports.filter(item => item.report_type === "regular"),
    healthDayReports: state =>
      state.pharmacyReports.filter(item => item.report_type === "health-day"),
    pharmacyReportsFetched: state => state.pharmacyReportsFetched,
    pharmacyReportsDateView: state => {
      let pharmacyReports = state.pharmacyReports.filter(
        item => item.report_type === "regular"
      );
      let reports = filterData(pharmacyReports, "date");
      return reports;
    },
    pharmacyReportsPharmacyView: state => {
      let pharmacyReports = state.pharmacyReports.filter(
        item => item.report_type === "regular"
      );
      let reports = filterData(pharmacyReports, "pharmacy");
      return reports;
    },
    totalPharmacyReportsCount: state => state.pharmacyReports.length
  },
  mutations: {},
  actions: {
    fetchPharmacyReports(module, payload = {}) {
      if (!module.state.pharmacyReports.length || payload.force) {
        module.state.pharmacyReports = [];
        module.state.pharmacyReportsFetched = false;
        let start = null;
        let end = null;
        if(payload.start) {
          start = payload.start;
        }
        if(payload.end) {
          end = payload.end;
        }
        return httpCall
          .get("otc-rep/v1/reports/pharmacy",{start, end})
          .then(({ data }) => {
            module.state.pharmacyReports = data.data;
            module.state.pharmacyReportsFetched = true;
          })
          .catch(err => console.log(err));
      }
    }
  }
};
