import { logger } from "../../helpers/helpers";
import { httpCall, UrlHelper } from "../../helpers/http-service";

export default {
  state: {
    pharmacies: [],
    fetched: false
  },
  getters: {
    allPharmacies: state => state.pharmacies,
    isPharmaciesFetched: state => state.fetched
  },
  mutations: {
    resetPharmacies(state) {
      state.pharmacies = [];
      state.fetched = false;
    },
    loadPharmacies(state, payload) {
      state.pharmacies = [...state.pharmacies,...payload];
    },
    markAsDone(state) {
      state.fetched = true;
    }
  },
  actions: {
    fetchPharmacies({commit, dispatch, state}, payload = {}) {
      if (!state.pharmacies.length || payload.force ||payload) {
        let url = payload.url || "otc-rep/v1/pharmacies";
        let base = payload.base || false;
        let add = payload.add || false;
        if(!add) {
         commit('resetPharmacies');
        }
        return httpCall
          .get(url, {}, base)
          .then(({ data }) => {
            commit('loadPharmacies', data.data);
            if(data.links.next) {
              dispatch('fetchPharmacies', {
                url: UrlHelper.addToken(data.links.next),
                base: true,
                add: true,
                force: true
              })
            } else {
              commit('markAsDone');
            }
          })
          .catch(err =>  {
            console.log(`[Error:${err.message}]`)
            console.log(`[Stack]: ${err.stack}`)
          });
      }
    }
  }
};
