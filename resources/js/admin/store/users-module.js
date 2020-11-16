import { httpCall } from '../../helpers/http-service';

export default {
  state: {
    users: [],
    allUsersFetched: false
  },
  getters: {
    users: state => state.users,
    allUsersFetched: state => state.allUsersFetched
  },
  actions: {
    getAllUsers({state}, force) {
      if(!state.users.length || force) {
        state.allUsersFetched = false;
        return httpCall.get('admin/v1/users')
        .then(({data}) => {
          console.log(data);
          state.users = data.data;
          state.allUsersFetched = true;
        })
      }
    }
  }
}
