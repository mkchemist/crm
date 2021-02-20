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
    getAllRepPmReports({ state }, payload) {
      if (!state.reports.length || payload) {
        state.fetched = false;
        let start = null,end = null;
        if(payload && typeof payload === "object" &&payload.cycle) {
          start = payload.cycle.start || null;
          end = payload.cycle.end || null;
        }
        return httpCall.get("dm/v1/reports/pm", {start,end}).then(({ data }) => {
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
    getAllHospitalReports({state}, payload) {
      if(!state.allHospitalReports.length || payload) {
        state.isHospitalReportsFetched = false;
        let start = null,end = null;
        if(payload && typeof payload === "object" &&payload.cycle) {
          start = payload.cycle.start || null;
          end = payload.cycle.end || null;
        }
        return httpCall.get('dm/v1/reports/workplaces/hospitals', {start, end})
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
    getAllPharmaciesReports({state}, payload) {
      if(!state.allPharmaciesReports.length || payload) {
        state.isPharmaciesReportsFetched = false;
        let start = null,end = null;
        if(payload && typeof payload === "object" &&payload.cycle) {
          start = payload.cycle.start || null;
          end = payload.cycle.end || null;
        }
        return httpCall.get('dm/v1/reports/workplaces/pharmacies', {start, end})
        .then(({data}) => {
          state.allPharmaciesReports = data.data;
          state.allRepPharmaciesReports = data.data;
          state.isPharmaciesReportsFetched = true;
        })
      }
    }
  }
};
