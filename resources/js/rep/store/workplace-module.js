import Vue from "vue";
import { httpCall } from "../../helpers/http-service";

export default {
  state: {
    /**
     * all workplaces
     *
     */
    all: [],
    /**
     * is customer fetched
     */
    fetched: false,
    isPharmacyFetched: false,
    /**
     * customer pharmacies
     *
     */
    pharmacies: []
  },
  mutations: {},
  getters: {
    allWorkplaces: state => {
      return state.all;
    },
    pharmacies: state => {
      return state.pharmacies;
    },
    isWorkplacesFetched: state => state.fetched,
    isPharmacyFetched : state => state.isPharmacyFetched
  },
  actions: {
    /**
     * get all workplaces
     *
     * @param {object} {state}
     */
    workplaceGetAll: ({ state }, force) => {
      if (!state.all.length || force) {
        state.fetched = false;
        return httpCall.get("rep/v1/workplaces").then(({ data }) => {
          if (data.code === 201) {
            state.fetched = true;
            state.all = data.data;
            Vue.toasted.show('Hospitals list loaded', {
              type: 'success',
              icon: 'check'
            })
          }
        });
      }
    },
    /**
     * get all pharmacies
     *
     *
     */
    pharmacyGetAll: ({state}, force) => {
      if(!state.pharmacies.length || force) {
        state.isPharmacyFetched = false;
        return httpCall.get('rep/v1/pharmacies')
        .then(({data}) => {
          if(data.code === 201) {
            state.pharmacies = data.data;
            state.isPharmacyFetched = true;
            Vue.toasted.show('Pharmacies list loaded', {
              type: 'success',
              icon: 'check'
            })
          }
        })
      }
    }
  }
};
