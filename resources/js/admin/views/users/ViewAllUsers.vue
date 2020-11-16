<template>
  <div class="p-2">
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-book-reader"></i></span>
        <span class="font-weight-bold">View All Users</span>
      </p>
      <div v-if="users.length" class="shadow border rounded p-2">
        <table-component :heads="heads" :data="users" :unselectable="true" head-class="bg-success text-light" :not-responsive="true">

        </table-component>
      </div>
      <div v-else-if="fetched" class="text-center">
        <p class="font-weight-bold">no data to show</p>
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    users() {
      return this.$store.getters.users;
    },
    fetched() {
      return this.$store.getters.allUsersFetched;
    }
  },
  data: () => ({
    heads: [
      {
        title: 'Fullname',
        name: 'name'
      },
      {
        title: 'Username',
        name: 'username'
      },
      {
        title: 'E-mail',
        name: 'email'
      },
      {
        title: 'Line',
        name: 'line'
      },
      {
        title: 'Role',
        name: 'role'
      },
      {
        title: 'Area',
        name: 'area'
      },
      {
        title : 'District',
        name: 'district'
      },
      {
        title: 'Territory',
        name: 'territory'
      },
      {
        title: 'Region',
        name: 'region'
      }
    ]
  })
}
</script>

<style>

</style>
