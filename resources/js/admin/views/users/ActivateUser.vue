<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-redo"></i></span>
      <span>Activate Users</span>
    </p>
    <div class="p-2">
      <div>
        <user-list  @selectUser="selectUser" :users-filter="usersFilter" />
      </div>
      <div v-if="user">
        <div class="bg-dark text-center p-2 rounded text-light">
          <p>Do you want to re-activate this user</p>
          <button class="btn btn-sm btn-secondary" @click="$router.back()">
            <span><i class="fa fa-times"></i></span>
            <span>Cancel</span>
          </button>
          <button class="btn btn-sm btn-primary" @click="activateUser">
            <span><i class="fa fa-check-circle"></i></span>
            <span>Activate</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../../helpers/http-service';
import UserList from "../../components/UserList"
export default {
  components: {
    UserList
  },
  data: () => ({
    user: null
  }),
  methods: {
    selectUser(user) {
      this.user = user
    },
    usersFilter(users){
      return users.filter(user => user.active === 0);
    },
    activateUser() {
      let id = this.user.id;
      httpCall.post('admin/v1/users/reactivate/'+id)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.$store.dispatch('getAllUsers', true)
          .finally(() => {
            this.$router.push("/users");
          });
        })
      });
    }
  }
}
</script>

<style>

</style>
