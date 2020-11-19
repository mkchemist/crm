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
    activeCustomers: [],
    inactiveCustomers: [],
    allCustomers: [],
    /**
     * is customers fetched
     *
     */
    fetched: false,
    /**
     * filtered customer list
     *
     *
     */
    customerFilter: [],
  },
  mutations: {
    updateCustomerInStore: (state,{id, payload}) => {
      let customer = state.all.filter(customer => customer.id === parseInt(id))[0];
      for(let key in payload) {
        customer[key] = payload[key];
      }
    },
    setCustomerFilter(state, customers) {
      state.customerFilter = customers;
    },
    filterCustomers(state, payload) {
      let asyncSetCustomer = () => new Promise((resolve, reject) => {
        resolve(payload.data);
      });
      state[payload.name] = [];
      asyncSetCustomer().then(data => state[payload.name] = data);
    }
  },
  getters: {
    /**
     * get only active customers
     * with parameters [HH,HM,HL,MH,MM,ML,LH,LM,LL]
     */
    active: state => {
      return state.activeCustomers
    },
    /**
     * get only inactive customers
     * with parameters [NN,XX]
     */
    inactive: state => {
      return state.inactiveCustomers
    },
    /**
     * return all customers
     * with all parameters
     */
    all: state => {
      return state.all;
    },
    allCustomers: state => state.allCustomers,
    fetched: state => {
      return state.fetched;
    },
    customerFilter: state => state.customerFilter
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
            state.allCustomers = data.data;
            state.fetched = true;
            state.customerFilter = data.data.filter(c => !["NN","XX"].includes(c.parameter))
            state.activeCustomers =data.data.filter(c => !["NN","XX"].includes(c.parameter))
            state.inactiveCustomers =data.data.filter(c => ["NN","XX"].includes(c.parameter))
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
