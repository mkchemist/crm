import { httpCall } from "../../../../helpers/http-service";

export default {
  namespaced: true,

  state: {
    types: [],
    requests: [],
    fetched: false
  },

  getters: {
    types: state => state.types,
    requests: state => state.requests,
    fetched: state=> state.fetched
  },

  mutations: {
    loadTypes(state, payload) {
      state.types = payload;
    },
    resetRequests(state) {
      state.requests = [];
      state.fetched = false;
    },
    loadRequests(state, payload) {
      state.requests = payload;
      state.fetched = true;
    }
  },

  actions: {
    /**
     * get request types
     *
     * @param {Object} module
     */
    fetchRequestTypes(module) {
      if(!module.state.types.length) {
        return httpCall.get('request-types')
        .then(({data}) => {
          module.commit('loadTypes', data.data);
        }).catch(err => console.log(err))
      }
    },

    /**
     * get requests
     *
     * @param {Object} module
     * @param {Object} payload
     */
    fetchCustomerRequests(module, payload = {}) {
      if(!module.state.requests.length || payload.force) {
        return httpCall.get('v1/requests')
        .then(({data}) => {
          module.commit('loadRequests', data.data);
        }).catch(err => console.log(err))
      }
    }
  }
}
