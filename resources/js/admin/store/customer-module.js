
let token = document.getElementById('token').value;
let base_url = document.getElementById('APP_API_URL').value;
export default {
  state: {
    customers: [],
    isCustomersFetched: false,
    total_pages: 'loading',
    current_page: 1,
    startLoading: false
  },
  getters: {
    allCustomers: state => state.customers,
    currentLoadingPage: state => state.current_page,
    totalLoadingPages : state => state.total_pages,
    isCustomersFetched: state => state.isCustomersFetched,
    customersStartLoading: state => state.startLoading
  },
  mutations: {
    setCustomers(state, payload) {
      state.customers = [...state.customers, ...payload];
    }
  },
  actions: {
    fetchCustomers(module, payload) {
      module.state.startLoading = true;
      module.state.isCustomersFetched = false;
      if(payload.reset) {
        module.state.customers = [];
        module.state.total_pages = 'loading';
        module.state.current_page = 1;
      }
      let url = `${base_url}admin/v1/customers?api_token=${token}`;
      if(payload && payload.url) {
        url = payload.url;
      }
      if(payload.territory) {
        url= `${url}&territory=${payload.territory}`
      }
      return fetch(url)
      .then(res => res.json())
      .then(data => {
        module.commit('setCustomers',data.data.data)
        module.state.total_pages = data.data.last_page;
        module.state.current_page = data.data.current_page;
        if(data.data.next_page_url !== null) {
          module.dispatch('fetchCustomers', {url: `${data.data.next_page_url}&api_token=${token}`,territory: payload.territory})
        } else {
          module.state.isCustomersFetched = true

        }
      })
    }
  }
}
