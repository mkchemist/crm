import { VISIT_SUBMIT_SUMMERY } from "../../../../helpers/constants";
import { httpCall } from "../../../../helpers/http-service";

export default {
  state: {
    reports: [],
    fetched: false,
    loadingStart: false,
    dayListReports: [],
    isDayListReportsFetched: false,
    users: [],
    isUserRelationsFetched: false,
    moduleUser: JSON.parse(document.getElementById("user").value),
    coachModuleFetchingCoach: null,
  },
  getters: {
    coachModuleReports: state => state.reports,
    isCoachReportModuleReportsFetched: state => state.fetched,
    isCoachReportModuleLoadingStarted: state => state.loadingStart,
    coachModuleDayListReports: state => state.dayListReports,
    isCoachReportModuleDayListReportsFetched: state =>
      state.isDayListReportsFetched,
    allCoachModuleUsers: state => state.users,
    coachModuleReps: state =>{
      if(state.moduleUser.role === "rep") {
        return [state.moduleUser];
      }
      return state.users.rep ? state.users.rep : []
    },
    coachModuleDistrictManagers: state =>
      state.users.dm ? state.users.dm : [],
    coachModuleAreaManagers: state => (state.users.am ? state.users.am : []),
    coachModuleRegionalManagers: state =>
      state.users.rm ? state.users.rm : [],
    shouldStartOnload: state => ['dm','rep'].includes(state.moduleUser.role),
    coachModuleCoaches: state => {
      let coaches = []

      if(state.users.dm) {
        coaches = [...coaches, ...state.users.dm]
      }
      if(state.users.am) {
        coaches = [...coaches, ...state.users.am]
      }
      if(state.users.rm) {
        coaches = [...coaches, ...state.users.rm]
      }
      if(state.users.marketing) {
        coaches = [...coaches, ...state.users.marketing]
      }
      if(state.moduleUser.role !== "rep") {
        coaches = [...coaches, state.moduleUser];
      }
      return coaches;
    }
  },
  mutations: {
    setCoachModuleFetchingCoach(state, payload) {
      state.coachModuleFetchingCoach = payload;
    },
    setCoachModuleUserRelations(state, payload = {}) {
      let users = payload.users || [];
      let isUserRelationsFetched = payload.fetched || false;
      state.users = users;
      state.isUserRelationsFetched = isUserRelationsFetched;
    },
    setCoachModuleDayListReports(state, payload = {}) {
      let data = payload.data || [];
      let fetched = payload.fetched || false;
      state.loadingStart = true;
      state.dayListReports = data;
      state.isDayListReportsFetched = fetched;
    },

  },
  actions: {
    fetchCoachReportModuleUserRelations(module, payload = {}) {
      if (!module.state.users.length || payload.force) {
        /*   module.state.fetched = false;
        module.state.users = []; */
        module.commit("setCoachModuleUserRelations");
        return httpCall
          .get("v1/user/relations")
          .then(({ data }) => {
            /* module.state.users = data.data;
            module.state.fetched = true; */
            module.commit("setCoachModuleUserRelations", {
              users: data.data,
              fetched: true
            });
          })
          .catch(err => console.log(err));
      }
    },
    fetchCoachReportsModuleReports(module, payload = {}) {
      if (
        (module.getters.shouldStartOnload && !module.state.reports.length) ||
        payload.force
      ) {
        let start = null
        let end = null
        if(payload.withCycle) {
          start = payload.start,
          end  = payload.end
        }
        module.commit("setCoachModuleDayListReports");
        return httpCall
          .get("v1/coach-reports", {
            coach: module.state.coachModuleFetchingCoach,
            start,
            end
          })
          .then(({ data }) => {
            data.data.forEach(row => {
              try {
                row['summery'] = JSON.parse(row['summery'])
              }catch(e) {
                row['summery'] = VISIT_SUBMIT_SUMMERY
              }
            });
            /*  module.state.fetched = true;
            module.state.reports = data.data; */
            module.commit("setCoachModuleDayListReports", {
              data: data.data,
              fetched: true
            });
          })
          .catch(err => console.log(err));
      }
    }
  }
};
