import { httpCall } from "../../../../helpers/http-service";

export default {
  state: {
    reports: [],
    fetched: false,
    loadingStart: false,
    users: [],
    moduleUser: JSON.parse(document.getElementById("user").value),
    coachModuleFetchingCoach: null
  },
  getters: {
    coachModuleReports: state => state.reports,
    isCoachReportModuleReportsFetched: state => state.fetched,
    isCoachReportModuleLoadingStarted: state => state.loadingStart,
    allCoachModuleUsers: state => state.users,
    coachModuleReps: state => (state.users.rep ? state.users.rep : []),
    coachModuleDistrictManagers: state =>
      state.users.dm ? state.users.dm : [],
    coachModuleAreaManagers: state => (state.users.am ? state.users.am : []),
    coachModuleRegionalManagers: state =>
      state.users.rm ? state.users.rm : [],
    shouldStartOnload: state => state.moduleUser.role === "dm",
    coachModuleCoaches: state => {
      let coaches = [state.moduleUser];
      if (state.moduleUser.role === "am" && state.users.dm) {
        coaches = [...coaches, ...state.users.dm];
      }
      if (state.moduleUser.role === "rm") {
        if (state.users.dm) {
          coaches = [...coaches, ...state.users.dm];
        }
        if (state.users.am) {
          coaches = [...coaches, ...state.users.am];
        }
      }
      return coaches;
    }
  },
  mutations: {
    setCoachModuleFetchingCoach(state, payload) {
      state.coachModuleFetchingCoach = payload;
    }
  },
  actions: {
    fetchCoachReportModuleUserRelations(module, payload = {}) {
      if (!module.state.users.length || payload.force) {
        module.state.fetched = false;
        module.state.users = [];
        return httpCall
          .get("v1/user/relations")
          .then(({ data }) => {
            module.state.users = data.data;
            module.state.fetched = true;
          })
          .catch(err => console.log(err));
      }
    },
    fetchCoachReportsModuleReports(module, payload = {}) {
      if (
        (module.shouldStartOnload && !module.state.reports.length) ||
        payload.force
      ) {
        module.state.fetched = false;
        module.state.loadingStart = true;
        module.state.reports = [];
        return httpCall
          .get("v1/coach-reports", {
            coach: module.state.coachModuleFetchingCoach
          })
          .then(({ data }) => {
            module.state.fetched = true;
            module.state.reports = data.data;
          })
          .catch(err => console.log(err));
      }
    }
  }
};
