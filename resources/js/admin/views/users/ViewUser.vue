<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-book-reader"></i></span>
      <span>View User</span>
    </p>
    <div class="p-2">
      <div class="p-2">
        <!-- user selection-->
        <div class="form-group row mx-auto" v-if="users.length">
          <select
            name="users"
            id="users"
            class="form-control form-control-sm col-lg"
            v-model="userIndex"
          >
            <option value="">All</option>
            <option v-for="(user, i) in users" :value="i" :key="user.id">{{
              user.name
            }}</option>
          </select>
          <button
            class="btn btn-sm btn-primary col-lg-auto mx-1"
            @click="selectUser"
            :disabled="!users.length"
          >
            <span><i class="fa fa-check-circle"></i></span>
            <span>Select</span>
          </button>
        </div>
        <loader-component v-else></loader-component>
        <!-- end of user selection -->
        <!-- user info.-->
        <div class="p-2 border rounded" v-if="user">
          <div class="row mx-auto">
            <div class="col-lg">
              <p class="lead text-muted">User Info.</p>
              <hr />
              <p class="mb-0">Username: <span class="font-weight-bold text-primary">{{ user.username }}</span></p>
              <p class="mb-0">Name: <span class="font-weight-bold text-primary">{{ user.name }}</span></p>
              <p class="mb-0">E-mail: <span class="font-weight-bold text-primary">{{ user.email }}</span></p>
              <p class="mb-0">Line: <span class="font-weight-bold text-primary">{{ user.line }}</span></p>
              <p class="mb-0">Role: <span class="font-weight-bold text-primary">{{ user.role }}</span></p>
            </div>
            <div class="col-lg">
              <p class="lead text-muted">Area Info.</p>
              <hr />
              <p class="mb-0">Area: <span class="font-weight-bold text-primary">{{ user.area }}</span></p>
              <p class="mb-0">District: <span class="font-weight-bold text-primary">{{ user.district }}</span></p>
              <p class="mb-0">Territory: <span class="font-weight-bold text-primary">{{ user.territory }}</span></p>
              <p class="mb-0">Region: <span class="font-weight-bold text-primary">{{ user.region }}</span></p>
            </div>
          </div>
        </div>
        <div class="p-2 user-info-waiting" v-else>
          <p>
            <span><i class="fa fa-info-circle"></i></span>
            <span>No user selected, select user first to show info.</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("getAllUsers");
  },
  computed: {
    users() {
      return this.$store.getters.users;
    },
    isUsesFetched() {
      return this.$store.getters.allUsersFetched;
    }
  },
  data: () => ({
    userIndex: "",
    user: null
  }),
  methods: {
    selectUser() {
      if (this.userIndex === "") {
        return;
      }
      this.user = this.users[this.userIndex];
    }
  }
};
</script>

<style></style>
