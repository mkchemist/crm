import { httpCall } from "../../helpers/http-service";

export default {
  state: {
    pharmacies: [],
    fetched: false
  },
  getters: {
    allPharmacies: state => state.pharmacies,
    isPharmaciesFetched: state=> state.fetched
  },
  mutations: {
    resetPharmacies(state) {
      state.fetched = false;
      state.pharmacies = [];
    },
    loadPharmacies(state, payload = {}) {
      state.pharmacies = payload.data;
      state.fetched = payload.fetched;
    }
  },
  actions: {
    /**
     * fetching pharmacies
     *
     *
     * @param {Object} module
     * @param {Object} payload
     */
    fetchPharmacies(module, payload = {}) {
      if(!module.state.pharmacies.length || payload.force) {
        module.commit('resetPharmacies');
        let rep = payload.rep || null;

        return httpCall.get('otc-manager/v1/pharmacies', {rep})
        .then(({data}) => {
          module.commit('loadPharmacies', {
            data: data.data,
            fetched: true
          })
        }).catch(err => console.log(err))

      }
    },
    collectPharmaciesParts(module, payload) {
      module.state.pharmacies = [...pharmacies, ...payload.data]
    }
  }
}
