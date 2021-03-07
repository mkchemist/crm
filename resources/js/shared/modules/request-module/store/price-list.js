import { httpCall } from "../../../../helpers/http-service";

export default {
  namespaced: true,
  state: {
    priceList: {},
    fetched: false
  },
  getters: {
    priceList: state => state.priceList,
    isFetched: state => state.fetched
  },
  mutations: {
    resetPriceList(state) {
      state.priceList = {};
      state.fetched = false;
    },
    loadPriceList(state, payload) {
      state.priceList = payload;
      state.fetched = true;
    }
  },
  actions: {
    fetchProductPriceList({state, commit}, payload = {}) {
      if(!Object.keys(state.priceList).length || payload.force) {
        commit('resetPriceList');
        return httpCall.get('v1/price-list')
        .then(({data}) => {
          commit('loadPriceList', data.data);
        }).catch(err => console.log(err))
      }
    }
  }
}
