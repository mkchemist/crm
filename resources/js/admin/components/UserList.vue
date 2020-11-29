<template>
  <div>
    <div v-if="users.length" class="p-2 row mx-auto">
      <select
        name="user"
        id="user"
        v-model="index"
        class="form-control form-control-sm col-lg"
      >
        <option value="">all</option>
        <option v-for="(user, i) in users" :key="user.id" :value="i">{{
          user.name
        }}</option>
      </select>
      <button class="btn btn-sm btn-primary col-lg-auto mx-1" @click="selectUser">
        <span><i class="fa fa-check-circle"></i></span>
        <span>select</span>
      </button>
    </div>
    <loader-component v-else></loader-component>
  </div>
</template>

<script>
export default {
  computed: {
    users() {
      return this.$store.getters.users;
    },
    isFetched() {
      return this.$store.getters.allUsersFetched;
    }
  },
  methods: {
    selectUser() {
      if (this.index === "") {
        return;
      }
      this.user = this.users[this.index];
      this.$emit("selectUser", this.user);
    }
  },
  data: () => ({
    index: "",
    user: null
  })
};
</script>

<style></style>
