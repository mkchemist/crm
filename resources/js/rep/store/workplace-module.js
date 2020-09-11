import Vue from "vue";
import { httpCall } from "../helpers/http-service";
export default {
  state: {
    all: [],
    fetched: false
  },
  mutations: {},
  getters: {
    allWorkplaces: state => {
      return state.all;
    }
  },
  actions: {
    workplaceGetAll: ({ state }) => {
      if (!state.all.length) {
        httpCall.get("rep/v1/workplaces").then(({ data }) => {
          if (data.code === 201) {
            state.fetched = true;
            state.all = data.data;
            Vue.toasted.show('Workplace list loaded', {
              type: 'success',
              icon: 'check'
            })
          }
        });
      }
    }
  }
};
