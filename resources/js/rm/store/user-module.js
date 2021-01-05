import { httpCall } from "../../helpers/http-service"

export default {
  state: {
    user: JSON.parse(document.getElementById('user').value),
    reps: [],
    dm : [],
    areaManagers: [],
    isRelationFetched: false
  },
  getters: {
    allReps: state => state.reps,
    allDm: state => state.dm,
    allAreaManagers: state => state.areaManagers,
    isRelationFetched: state => state.isRelationFetched
  },
  mutations: {
    setReps(state, payload) {
      state.reps = payload
    },
    setDm(state, payload) {
      state.dm = payload
    },
    setAreaManagers(state, payload) {
      state.areaManagers = payload
    }
  },
  actions: {
    getAllRelations(module, payload) {
      module.state.reps = [];
      module.state.dm = [];
      module.state.areaManagers = [];
      module.state.isRelationFetched = false;
      httpCall.get('rm/v1/user-relations')
      .then(({data}) => {
        module.commit('setReps', data.data.reps);
        module.commit('setDm', data.data.dm);
        module.commit('setAreaManagers', data.data.area_managers);
        module.state.isRelationFetched = true
      }).catch(err => console.log(err))
    }
  }
}
