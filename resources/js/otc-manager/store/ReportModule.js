import { httpCall } from "../../helpers/http-service";
import Vue from 'vue';
export default {
  state: {
    reports: [],
    fetched: false,
  },
  getters: {
    pharmacyReports: state=> state.reports.filter(item => item.report_type === 'regular'),
    healthDayReports: state => state.reports.filter(item => item.report_type === 'health-day'),
    isReportsFetched: state => state.fetched
  },
  mutations: {
    resetReports(state) {
      state.reports = [];
      state.fetched = false;
    },
    loadReports(state, payload) {
      state.reports = payload.data
      state.fetched = true;
    }
  },
  actions: {
    fetchReports(module, payload = {}) {
      if(!module.state.reports.length || payload.force) {
        module.commit('resetReports');
        return httpCall.get('otc-manager/v1/reports')
        .then(({data}) => {
          if(data.code === 200) {
            module.commit('loadReports', {data: data.data});
          } else {
            Vue.toasted.error('Something went wrong');
          }
        }).catch(err => console.log(err))
      }
    }
  }
}
