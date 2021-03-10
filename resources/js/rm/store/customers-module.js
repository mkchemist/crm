import { logger } from "../../helpers/helpers";
import { httpCall, UrlHelper } from "../../helpers/http-service";

export default {
  state: {
    activeCustomers: [],
    isActiveCustomersFetched: false,
    inactiveCustomers: [],
    isInactiveCustomersFetched: false
  },
  getters: {
    activeCustomers: state => state.activeCustomers,
    inactiveCustomers: state => state.inactiveCustomers,
    isActiveCustomersFetched: state => state.isActiveCustomersFetched,
    isInactiveCustomersFetched: state => state.isInactiveCustomersFetched
  },
  mutations: {
    resetActiveCustomers(state) {
      state.isActiveCustomersFetched = false;
      state.activeCustomers = [];
    },
    loadActiveCustomers(state, payload) {
      state.activeCustomers = [...state.activeCustomers, ...payload];
    },
    markActiveCustomersAsDone(state) {
      state.isActiveCustomersFetched = true;
    },
    resetInactiveCustomers(state) {
      state.inactiveCustomers = [];
      state.isInactiveCustomersFetched = false;
    },
    loadInactiveCustomers(state, payload) {
      state.inactiveCustomers = [...state.inactiveCustomers, ...payload];
    },
    markInactiveCustomersAsDone(state) {
      state.isInactiveCustomersFetched = true;
    }
  },
  actions: {
    fetchCustomers({ dispatch }, payload = {}) {
      dispatch("fetchActiveCustomers", payload)

    },
    fetchActiveCustomers({ dispatch, commit, state }, payload = {}) {
      let url = payload.url || "rm/v1/customers";
      let base = payload.base || false;
      let add = payload.add || false;

      if (!state.activeCustomers.length || payload.force ) {
          if (!add) {
            commit("resetActiveCustomers");
          }
        return httpCall
          .get(url, {}, base)
          .then(({ data, status }) => {
            let res = data.data;
            commit("loadActiveCustomers", res);
            if (data.next_page_url) {
              state.lastPage = data.last_page;
              state.currentPage = data.current_page + 1;
              dispatch("fetchActiveCustomers", {
                force: true,
                base: true,
                url: UrlHelper.addToken(data.next_page_url),
                add: true
              });
            } else {
              commit("markActiveCustomersAsDone");
            }
          })
          .catch(err => {
            logger(err.message, "danger");
          });
      }
    },
    fetchInactiveCustomers({ dispatch, commit, state }, payload = {}) {
      let url = payload.url || "rm/v1/customers";
      let base = payload.base || false;
      let add = payload.add || false;
      let inactive = true;

      if (!state.inactiveCustomers.length || payload.force) {
        if (!add) {
          commit("resetInactiveCustomers");
        }
        return httpCall
          .get(url, { inactive }, base)
          .then(({ data, status }) => {
            let res = data.data;
            commit("loadInactiveCustomers", res.data);
            if (res.next_page_url) {
              state.lastPage = res.last_page;
              state.currentPage = res.current_page + 1;
              dispatch("fetchInactiveCustomers", {
                force: true,
                base: true,
                url: UrlHelper.addToken(res.next_page_url),
                add: true
              });
            } else {
              commit("markInactiveCustomersAsDone");
            }
          })
          .catch(err => {
            logger(err.message, "danger", err.stack);
          });
      }
    }
  }
};
