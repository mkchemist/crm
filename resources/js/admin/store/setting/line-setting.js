import { httpCall } from "../../../helpers/http-service"

export default {
  state: {
    lines: [],
    isFetched: false,
  },
  getters: {
    allLines : state => state.lines,
    isLinesFetched: state => state.isFetched,
    products : state =>  {
      let products = {};
      state.lines.map(line => {
        line.products.map(product => {
          if(!products[product.name]) {
            products[product.name] = "";
          }
        })
      });
      return products;
    },
  },
  mutations: {

  },
  actions: {
    getAllLines: ({state}, force) => {
      if(!state.lines.length || force) {
        state.lines =[];
        state.isFetched  = false;
        return httpCall.get('admin/v1/setting/lines')
        .then(({data}) => {
          state.lines = data.data
          state.isFetched = true;
        })
      }
    },

  }
}
