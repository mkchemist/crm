import Vue from "vue";
import { httpCall } from "../helpers/http-service";
export default {
  state: {
    all: [],
    fetched: false,
    pharmacies: []
  },
  mutations: {},
  getters: {
    allWorkplaces: state => {
      return state.all;
    },
    pharmacies: state => {
      return state.pharmacies;
    }
  },
  actions: {
    /**
     * get all workplaces
     *
     * @param {object} {state}
     */
    workplaceGetAll: ({ state }) => {
      if (!state.all.length) {
        httpCall.get("rep/v1/workplaces").then(({ data }) => {
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
    pharmacyGetAll: ({state}) => {
      if(!state.pharmacies.length) {
        httpCall.get('rep/v1/pharmacies')
        .then(({data}) => {
          if(data.code === 201) {
            state.pharmacies = data.data;
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
