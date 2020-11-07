import { httpCall } from "../../helpers/http-service"

export default {
  state: {
    coaching_reports: [],
    is_coaching_reports_fetched: false,
    rep_reports: [],
    is_rep_reports_fetched: false,
    select_report_rep: null
  },
  getters: {
    coachingReports: state => state.coaching_reports,
    isCoachingReportsFetched: state => state.is_coaching_reports_fetched,
    repReports: state => state.rep_reports,
    isRepReportsFetched: state => state.is_rep_reports_fetched,
    selectedReportRep: state => state.selected_report_rep
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
    }
  }
}
