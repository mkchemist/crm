import { httpCall } from "../../../../helpers/http-service";

// user data
let user = JSON.parse(document.getElementById('user').value);
let token = document.getElementById('token').value;


export default {
  namespaced: true,
  state: {
    user,
    token,
    relatedUsers: [],
    userProducts: [],
  },
  getters: {
    /** current module user */
    user: state => state.user,
    /* user relations */
    relations: state => state.relatedUsers,
    /* user reps */
    reps: state => state.relatedUsers.reps,
    /* user business unit */
    regionalManager: state => state.relatedUsers.rm,
    /* user products */
    userProducts: state => state.userProducts,
  },
  mutations: {
    loadRelatedUsers(state, payload) {
      state.relatedUsers = payload;
    },
    loadProducts(state, payload) {
      state.userProducts = payload;
    }
  },
  actions: {
    /**
     * start related user fetch request
     *
     * @param {Object} module
     * @param {Object} payload
     */
    startRelatedUserRequest(module, payload = {}) {
      if(!module.state.relatedUsers.length || payload.force) {
        return httpCall.get('v1/user/relations')
        .then(({data}) => {
          if(data.code) {
            module.commit('loadRelatedUsers', data.data)
          }
        }).catch(err => console.log(err))
      }
    },
    /**
     * start loading user products
     *
     * @param {Object} module
     * @param {Object} payload
     */
    startUserProductsRequest(module, payload = {}) {
      if(!module.state.userProducts.length || payload.force) {
        return httpCall.get('line-products')
        .then(({data}) => {
          module.commit('loadProducts',data.data);
        }).catch(err => console.log(err))
      }
    },


  }
}
