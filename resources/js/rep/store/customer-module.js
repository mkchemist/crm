/**
 * Customer module
 *
 * this module deal with all customer related http service
 *
 */
import Vue from "vue";
import { httpCall } from "../helpers/http-service"


export default {
  state: {
    all: []
  },
  mutations: {

  },
  getters: {
    /**
     * get only active customers
     * with parameters [HH,HM,HL,MH,MM,ML,LH,LM,LL]
     */
    active: state => {
      let active = [];
      state.all.map((item) => {
        if(item.parameter !== "NN" && item.parameter !== "XX") {
          active.push(item);
        }
      })
      return active;
    },
    /**
     * get only inactive customers
     * with parameters [NN,XX]
     */
    inactive: state => {
      let active = [];
      state.all.map((item) => {
        if(item.parameter === "NN" || item.parameter === "XX") {
          active.push(item);
        }
      })
      return active;
    },
    /**
     * return all customers
     * with all parameters
     */
    all: state => {
      return state.all;
    }
  },
  actions: {
    /**
     * get all customers from api
     *
     * @param {object} state
     */
    customerGetAll({state}) {
      if(!state.all.length) {
        httpCall.get('rep/v1/customers')
        .then(http => {
          let res = http.data;
          if(res.code === 201) {
            state.all = res.data;
          }
        }).finally(() => {
          Vue.toasted.show('list loaded',{
            type: 'success',
            icon: 'check'
          })
        });
      }
    }
  }
}
