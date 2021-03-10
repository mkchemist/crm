import { httpCall, UrlHelper } from "../../helpers/http-service";

export default {
  state: {
    pharmacies: [],
    fetched: false,
    pagination: {
      current: 1,
      total: null,
      from: 0,
      to: 3000,
      last: null
    }

  },
  getters: {
    allPharmacies: state => state.pharmacies,
    isPharmaciesFetched: state=> state.fetched,
    pharmacyPagination: state => state.pagination
  },
  mutations: {
    resetPharmacies(state) {
      state.fetched = false;
      state.pharmacies = [];
    },
    loadPharmacies(state, payload) {
      state.pharmacies = [...state.pharmacies,...payload];
    },
    updatePagination(state, payload) {
      state.pagination = payload
    },
    setAsDone(state) {
      state.fetched = true;
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
        let url = payload.url || "otc-manager/v1/pharmacies";
        let base = payload.base || false;
        if(!payload.paginate) {
          module.commit('resetPharmacies');
        }
        let rep = payload.rep || null;

        return httpCall.get(url, {rep}, base)
        .then(({data}) => {
          module.commit('loadPharmacies', data.data.data)
          module.commit('updatePagination', {
            total: data.data.total,
            current: data.data.current_page,
            from : data.data.from,
            to: data.data.to,
            last: data.data.last_page
          })
          if(data.data.next_page_url) {
            let url = UrlHelper.addToken(data.data.next_page_url);
            module.dispatch('fetchPharmacies', {
              url,
              force: true,
              base: true,
              paginate: true
            })
          } else {
            module.commit('setAsDone');
          }
        }).catch(err => console.log(err))

      }
    },
    collectPharmaciesParts(module, payload) {
      module.state.pharmacies = [...pharmacies, ...payload.data]
    }
  }
}
