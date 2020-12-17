import { httpCall } from "../../../helpers/http-service"

export default {
  state: {
    lines: [],
    isFetched: false
  },
  getters: {
    allLines : state => state.lines,
    isLinesFetched: state => state.isFetched
  },
  mutations: {

  },
  actions: {
    getAllLines: ({state}, force) => {
      if(!state.lines.length || force) {
        state.lines =[];
        state.isFetched  = false;
        httpCall.get('admin/v1/setting/lines')
        .then(({data}) => {
          state.lines = data.data
          state.isFetched = true;
        })
      }
    }
  }
}
