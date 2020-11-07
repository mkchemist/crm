import { httpCall } from "../../helpers/http-service"

export default {
  state: {
    coaching_reports: [],
    is_coaching_reports_fetched: false,
    all_rep_reports: [],
    is_rep_reports_fetched: false,
    select_rep_id: null,
  },
  getters: {
    coachingReports: state => state.coaching_reports,
    isCoachingReportsFetched: state => state.is_coaching_reports_fetched,
    repReports: state => state.all_rep_reports,
    isRepReportsFetched: state => state.is_rep_reports_fetched,
    selectedReportRep: state => state.selected_rep_id
  },
  mutations: {

  },
  actions: {
    getCoachingReports({state}, force) {
      if(!state.coaching_reports.length || force) {
        state.is_coaching_reports_fetched = false;
        return httpCall.get('dm/v1/reports/coach')
        .then(({data}) => {
          state.is_coaching_reports_fetched = true;
          state.coaching_reports = data.data
        })
      }
    },
    getAllReports({state}, force) {
      if(!state.all_rep_reports.length || force) {
        state.is_rep_reports_fetched = false;
        httpCall.get('dm/v1/reports/pm')
        .then(({data}) => {
          state.all_rep_reports = data.data;
          state.is_rep_reports_fetched = true;
        })
      }
    }
  }
}
