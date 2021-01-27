<template>
  <div class="px-0 shadow pb-5">
    <p class="alert alert-success">
      <span><i class="fa fa-times-circle"></i></span>
      <span>Delete User</span>
    </p>
    <div class="p-2 my-1">
      <!-- users list -->
      <user-list @selectUser="selectUser" />
      <div class="p-2 my-2 border bg-dark text-light rounded pb-5" v-if="user">
        <p class="lead text-center">Are you sure to delete {{ user.name }} from users, instead you can de-active this user ?</p>
        <div class="text-center">
          <button class="btn btn-sm btn-light" @click="$router.back()">
            <span><i class="fa fa-chevron-circle-left"></i></span>
            <span>back</span>
          </button>
          <button class="btn btn-sm btn-warning" @click="deActiveUser" v-if="user.active === 1">
            <span><i class="fa fa-user-slash"></i></span>
            <span>de-active</span>
          </button>
          <button class="btn btn-sm btn-danger" @click="deleteUser">
            <span><i class="fa fa-trash"></i></span>
            <span>delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sortBy } from '../../../helpers/helpers';
import { httpCall } from '../../../helpers/http-service';
import UserList from '../../components/UserList.vue'
export default {
  mounted() {

  },
  computed: {
    users() {
      return sortBy(this.$store.getters.users, 'name');
    },
    fetched() {
      return this.$store.getters.allUsersFetched;
    },
  },
  components: {
    UserList
  },
  data:() => ({
    user : null,
  }),
  methods: {
    selectUser(data) {
      this.user = data;
    },
    deleteUser() {
      let id = this.user.id;
      httpCall.post("admin/v1/users/"+id, {_method: 'DELETE'})
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.$store.dispatch('getAllUsers', true);
          this.$router.push("/users");
        });
      });
    },
    deActiveUser() {
      let id = this.user.id;
      httpCall.post("admin/v1/users/deactive/"+id)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.$store.dispatch("getAllUsers", true);
          this.$router.push("/users");
        });
      });
    }
  }
}
</script>

<style>

</style>
