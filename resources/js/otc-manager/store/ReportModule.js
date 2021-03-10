import { httpCall, UrlHelper } from "../../helpers/http-service";
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
      state.reports = [...state.reports, ...payload]
    },
    markAsDone(state) {
      state.fetched = true;
    }
  },
  actions: {
    fetchReports(module, payload = {}) {
      if(!module.state.reports.length || payload.force) {
        let start = payload.start || null;
        let end = payload.end|| null;
        let url = payload.url || 'otc-manager/v1/reports';
        let base = payload.base || false;
        let adding = payload.adding || false;
        if(!adding) {
          module.commit('resetReports');
        }
        return httpCall.get(url, {start, end}, base)
        .then(({data,status}) => {
          if(status === 200) {
            module.commit('loadReports', data.data);
            if(data.links.next) {
              let url = UrlHelper.addToken(data.links.next);
              module.dispatch('fetchReports', {
                url,
                base: true,
                adding: true,
                start,
                end,
                force: true
              })
            } else {
              module.commit('markAsDone');
            }
          } else {
            Vue.toasted.error('Something went wrong');
          }
        }).catch(err => console.log(err))
      }
    }
  }
}
