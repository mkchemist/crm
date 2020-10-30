/**
 * Customer module
 *
 * this module deal with all customer related http service
 *
 */
import { httpCall } from "../../helpers/http-service"
import router from "../routes";
import { ResponseHandler } from "../../helpers/response-handler";
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
    updateCustomerInStore: (state,{id, payload}) => {
      let customer = state.all.filter(customer => customer.id === parseInt(id))[0];
      for(let key in payload) {
        customer[key] = payload[key];
      }
    }
  },
  getters: {
    /**
     * get only active customers
     * with parameters [HH,HM,HL,MH,MM,ML,LH,LM,LL]
     */
    active: state => {
      return state.all.filter(customer => !["NN","XX"].includes(customer.parameter))
    },
    /**
     * get only inactive customers
     * with parameters [NN,XX]
     */
    inactive: state => {
      return state.all.filter(customer => ["NN","XX"].includes(customer.parameter));
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
    },

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
        data.message = `customer ${data.data.name} added successfully`;
        ResponseHandler.methods.handleResponse(data, data => {
          dispatch("customerGetAll", true)
          router.replace("/customers");
        })
      })
    }
  }
}
