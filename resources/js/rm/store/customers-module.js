import { httpCall } from "../../helpers/http-service"

export default {
  state: {
    customers:[],
    fetched: false,
    currentPage: 1,
    lastPage: '~'
  },
  getters: {
    allCustomers : state => state.customers,
    isCustomersFetched : state => state.fetched,
    activeCustomers: state => state.customers.filter(customer => {
      if(customer.params.length && !['NN','XX'].includes(customer.params[0].current)) {
        return true;
      }
      return false
    }),
    inactiveCustomers: state => state.customers.filter(customer => {
      if(!customer.params.length || ['NN','XX'].includes(customer.params[0].current)) {
        return true;
      }
      return false
    }),
    customersCurrentPageLoading: state => state.currentPage,
    customersLoadingLastPage: state => state.lastPage
  },
  mutations: {
    loadCustomers(state, payload) {
      state.customers = [...state.customers, ...payload]
    }
  },
  actions: {
    fetchCustomers(module, payload = {}) {
      if(!payload.url) {
        payload.url = document.getElementById('APP_API_URL').value+'rm/v1/customers';
      }
      let token = document.getElementById('token').value;
      let delimiter = payload.url.match(/\?/) ? '&': '?';
      let url = payload.url+delimiter+'api_token='+token;
      fetch(url)
      .then(res => res.json())
      .then(data => {
        module.commit('loadCustomers', data.data.data);
        module.state.currentPage += 1;
        module.state.lastPage = data.data.last_page
        if(data.data.next_page_url) {
          module.dispatch('fetchCustomers',{url: data.data.next_page_url})
        } else {
          module.state.fetched = true;
        }
      })
    }
  }
}
