import { Calendar } from "../../helpers/date-helpers";
import { httpCall } from "../../helpers/http-service";

export default {
  state: {
    /** current active cycle of plans and reports */
    activeCycle: {  },
    /** report interval between report date and today */
    reportInterval: null,
    /** user can edit report date */
    canEditReportDate: null,
    /** all registered cycle plans */
    cycles: [],
    /** current cycle of view */
    currentViewCycle: {},
    /** user line */
    line : null,
    /** report Interval min date */
    reportIntervalMin: null,
  },
  getters: {
    /** current active cycle of plans and reports */
    activeCycle: state => state.activeCycle,
    /** report interval between report date and today */
    reportInterval: state => state.reportInterval,
    /** user can edit report date */
    canEditReportDate: state => state.canEditReportDate,
    /** all registered cycle plans */
    cycles: state => state.cycles,
    /** current cycle of view */
    currentViewCycle: state => state.currentViewCycle,
    /* user line */
    line : state => state.line,
    /** report Interval Min date */
    reportIntervalMin: state => state.reportIntervalMin
  },
  mutations: {
    /**
     * update current view cycle
     * @param {object} state
     * @param {object} payload
     */
    setCurrentViewCycle(state, payload) {
      state.currentViewCycle = payload;
    },
    setMinReportInterval(state) {
      let interval = state.reportInterval;
      let calendar = new Calendar;
      state.reportIntervalMin = calendar.subtract(interval).toString()
    },
    resetActiveCycle(state) {
      state.activeCycle = state.currentViewCycle;
    }
  },
  actions: {
    /**
     * fetching all application settings
     *
     * @return void
     */
    fetchingApplicationSettings(module) {
         module.state.activeCycle = {};
         module.state.currentViewCycle = {};
        module.state.cycles = [];
        module.state.reportInterval = null;
        module.state.canEditReportDate = null;
        module.state.line = [];
        module.state.currentViewCycle = null;
      return httpCall.get('app-setting')
      .then(({data}) => {
        module.state.activeCycle = data.data.activeCycle;
        module.state.currentViewCycle = data.data.activeCycle;
        module.state.cycles = data.data.cycles;
        module.state.reportInterval = data.data.reportInterval;
        module.state.canEditReportDate = data.data.canEditReportDate === 'true' ? true :false;
        module.state.line = data.data.line;
        module.state.currentViewCycle = data.data.activeCycle;
        module.commit('setMinReportInterval');
      }).catch(err => console.log(err));
    }
  }
};
