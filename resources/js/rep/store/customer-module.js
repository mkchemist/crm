/**
 * Customer module
 *
 * this module deal with all customer related http service
 *
 */
import Vue from "vue";
import { httpCall } from "../helpers/http-service"
import router from "../routes";
import { ResponseHandler } from "../helpers/response-handler";
export default {
  state: {
    /**
     * all customers
     *
     */
    all: [],
    /**
     * is customers fetched
     *
     */
    fetched: false,
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
    },
    fetched: state => {
      return state.fetched;
    }
  },
  actions: {
    /**
     * get all customers from api
     *
     * @param {object} state
     * @param {boolean} force // to force module to update customers
     */
    customerGetAll({state}, force) {
      if(!state.all.length|| force) {
        httpCall.get('rep/v1/customers')
        .then(({data}) => {
          data.message = "Customer list loaded";
          ResponseHandler.methods.handleResponse(data, (data) => {
            state.all = data.data
            state.fetched = true;
          })
        });
      }
    },

    /**
     * add new customer
     *
     * @param {object} {state, dispatch}
     * @param {object} data
     * @return {void}
     */
    addNewCustomer({dispatch}, data) {
      httpCall.post('rep/v1/customers',data)
      .then(({data}) => {
        if(data.code === 203) {
          Object.keys(data.data).forEach((key) => {
            let errors = data.data[key];
            errors.forEach((err) => {
              Vue.toasted.show(err, {
                type: 'warning',
                icon : 'times-circle',
                duration: null
              })
            });
          });
          return ;
        }
        Vue.toasted.show(`customer ${data.data.name} add successfully`, {
          type: 'success',
          icon : 'check'
        })
      }).finally(() => {
        dispatch("customerGetAll", true)
        router.replace("/customers");
      })
    }
  }
}
