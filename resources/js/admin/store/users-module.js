import { httpCall } from '../../helpers/http-service';
import { ResponseHandler } from "../../helpers/response-handler"
import Vue from "vue";
export default {
  state: {
    users: [],
    allUsersFetched: false,
    locations: [],
    isLocationsFetched: false
  },
  getters: {
    users: state => state.users,
    reps: state => state.users.filter(user => user.role === 'rep'),
    dms : state => state.users.filter(user => user.role === 'dm'),
    ams: state => state.users.filter(user => user.role === 'am'),
    rms : state => state.users.filter(user => user.role === 'rm'),
    allUsersFetched: state => state.allUsersFetched,
    allLocations: state => state.locations,
    isAllLocationFetched : state => state.isLocationsFetched,
    allTerritories: state => {
      try {

        let data = new Set();
        state.locations.map(item => {
          data.add(item.territory)
        });
        let dataObject = [];
        data.forEach(item => {
          dataObject.push({name: item})
        })
        return dataObject;
      }catch(e) {
        console.log(e)
      }
    }
  },
  actions: {
    /**
     * get all users
     *
     * @param {object} Module.State
     * @param {boolean} force
     */
    getAllUsers({state}, force) {
      if(!state.users.length || force) {
        state.users = [];
        state.allUsersFetched = false;
        state.allUsersFetched = false;
        return httpCall.get('admin/v1/users')
        .then(({data}) => {
          state.users = data.data;
          state.allUsersFetched = true;
        })
      }
    },
    /**
     * get all available users locations
     *
     * @param {object} Module.state
     * @param {boolean} force
     */
    getAllLocations({state}, force) {
      if(!state.locations.length || force) {
        /* state.locations = [];
        state.isLocationsFetched = false; */
        httpCall.get('admin/v1/locations')
        .then(res => {
          let data =res.data;
          state.locations = data.data;
          state.isLocationsFetched = true;

        }).catch(err => {
          console.log(err);
          console.error('Error in fetching all locations');
          Vue.toasted.error('Something went error', {
            icon: 'exclamation'
          })
        })
      }
    }

  }
}
