
let user = JSON.parse(document.getElementById('user').value)

export default  {
  state: {
    /** user data */
    user,
  },
  getters: {
    /* user data */
    user : state => state.user,
    /* user reps */
    reps : state => JSON.parse(state.user.user_relations).reps,
    /* user district manager */
    districtManager : state => JSON.parse(state.user.user_relations).dm,
    /* area managers */
    areaManager : state => JSON.parse(state.user.user_relations).am,
    /* Regional Manager */
    regionalManager : state => JSON.parse(state.user.user_relations).rm,
    /* user title */
    userTitle : state => state.user.role,
    /** user line  */
    userLine : state => JSON.parse(state.user.line).join(' | ')
  },
  mutations: {

  },
  actions: {

  }
}
