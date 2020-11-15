import { httpCall } from "../../helpers/http-service";
import { ResponseHandler } from "../../helpers/response-handler";

export default {
  state: {
    reports: [],
    fetched: false,
    repReports: [],
    allHospitalReports: [],
    allRepHospitalReports:[],
    isHospitalReportsFetched : false,
    allPharmaciesReports: [],
    allRepPharmaciesReports : [],
    isPharmaciesReportsFetched: false
  },
  getters: {
    repPmReports: state => state.repReports,
    isRepPmReportsFetched: state => state.fetched,
    allRepPmReports : state => state.reports,
    allHospitalReports: state => state.allHospitalReports,
    allRepHospitalReports: state => state.allRepHospitalReports,
    isHospitalReportsFetched : state=>state.isHospitalReportsFetched,
    allPharmaciesReports: state => state.allPharmaciesReports,
    allRepPharmaciesReports: state => state.allRepPharmaciesReports,
    isPharmaciesReportsFetched: state => state.isPharmaciesReportsFetched
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
    },
    setRepHospitalsReports(state, data) {
      state.allRepHospitalReports = data;
    },
    setRepPharmaciesReports(state, data) {
     state.allRepPharmaciesReports = data;
    }

  },
  actions: {
    /**
     * get all customers rep reports
     *
     * @param {VuexStore} {state}
     * @param {boolean} force
     */
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
    },
    /**
     * get all am hospitals reports
     *
     * @param {VuexStore} {state}
     * @param {boolean} force
     */
    getAllHospitalReports({state}, force) {
      if(!state.allHospitalReports.length || force) {
        state.isHospitalReportsFetched = false;
        return httpCall.get('dm/v1/reports/workplaces/hospitals')
        .then(({data}) => {
          state.allRepHospitalReports = data.data;
          state.allHospitalReports = data.data;
          state.isHospitalReportsFetched = true;
        });
      }
    },
    /**
     * get all pharmaceis reports
     *
     * @param {VuexStore} {state}
     * @pararm {boolean} force
     */
    getAllPharmaciesReports({state}, force) {
      if(!state.allPharmaciesReports.length || force) {
        state.isPharmaciesReportsFetched = false;
        return httpCall.get('dm/v1/reports/workplaces/pharmacies')
        .then(({data}) => {
          state.allPharmaciesReports = data.data;
          state.allRepPharmaciesReports = data.data;
          state.isPharmaciesReportsFetched = true;
        })
      }
    }
  }
};
