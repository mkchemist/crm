import { httpCall } from "../../../../helpers/http-service";

export default {
  namespaced: true,

  state: {
    bricks: [],
    isBrickFetched: false
  },


  getters: {
    bricks: state => state.bricks,
    isBricksFetched: state => state.isBrickFetched
  },


  mutations: {
    loadBricks(state, payload) {
      state.bricks = payload;
      state.isBrickFetched = true;
    }
  },


  actions: {

    startBricksFetchRequest(module, payload = {}) {
      if(!module.state.bricks.length || payload.force) {
          return httpCall.get('v1/user-customers/bricks')
          .then(({data}) => {
            module.commit('loadBricks', data.data);
          }).catch(err => console.log(err))
      }
    }


  }
}
