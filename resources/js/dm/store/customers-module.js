import { httpCall } from "../../helpers/http-service";
import Vue from "vue";


export default{
  state: {
    customers: [],
    active_customers: [],
    inactive_customers: [],
    fetched: false
  },
  getters: {
    allCustomers: state => {
      return state.customers;
    },
    activeCustomers: state => {
      return state.customers.filter((customer) => customer.parameter !== "NN");
    },
    inactiveCustomers: state => {
      return state.customers.filter(customer => ["NN","XX"].includes(customer.parameter));
    },
    isCustomersFetched: state => state.fetched
  },
  mutations: {

  },
  actions: {
    /**
     * get all customers
     *
     * @param {customer module} state
     * @param {boolean} force
     */
    customersGetAll({state}, force) {
      if(!state.customers.length || force) {
        httpCall.get("dm/v1/customers")
        .then(({data}) => {
          state.customers = data.data
          Vue.toasted.success('customer list loaded')
        }).finally(() => {
          state.fetched = true;
        })
      }
    },

  }
}
