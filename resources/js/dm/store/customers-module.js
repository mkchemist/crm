import { httpCall } from "../../helpers/http-service";
import Vue from "vue";


export default{
  state: {
    customers: [],
    active_customers: [],
    inactive_customers: [],
    fetched: false,
    activeCustomersFetched: false,
    inactiveCustomersFetched: false
  },
  getters: {
    allCustomers: state => {
      return [...state.active_customers, ...state.inactive_customers];
    },
    activeCustomers: state => {
      return state.active_customers;
    },
    inactiveCustomers: state => {
      return state.inactive_customers
    },
    isCustomersFetched: state => state.fetched,
    isActiveCustomersFetched: state => state.activeCustomersFetched,
    isInactiveCustomersFetched: state => state.inactiveCustomersFetched
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
    customersGetAll({dispatch}, force) {
      /* if(!state.customers.length || force) {
        state.fetched = false;
        state.customers = [];
        return httpCall.get("dm/v1/customers")
        .then(({data}) => {
          state.customers = data.data
          state.fetched = true;
          Vue.toasted.success('customer list loaded')
        })
      } */
      dispatch('fetchActiveCustomers')
      .then(() => {
        dispatch("fetchInactiveCustomers");
      })
    },
    fetchActiveCustomers({state}, force) {
      if(!state.active_customers.length || force) {
        state.fetched = false;
        state.customers = [];
        return httpCall.get("dm/v1/customers",{active:true})
        .then(({data}) => {
          state.activeCustomersFetched = true;
          state.active_customers = data.data
          state.fetched = true;
          Vue.toasted.success('active customers list loaded')
        })
      }
    },
    fetchInactiveCustomers({state}, force) {
      if(!state.inactive_customers.length || force) {
        state.fetched = false;
        state.customers = [];
        return httpCall.get("dm/v1/customers")
        .then(({data}) => {
          state.inactiveCustomersFetched = true;
          state.inactive_customers = data.data
          state.fetched = true;
          Vue.toasted.success('inactive customers list loaded')
        })
      }
    }

  }
}
