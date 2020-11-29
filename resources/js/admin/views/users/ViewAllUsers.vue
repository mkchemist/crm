<template>
  <div class="p-2">
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-book-reader"></i></span>
        <span class="font-weight-bold">View All Users</span>
      </p>
      <div class="p-2">
        <div v-if="users.length" class="border rounded p-2">
          <table-component
            :heads="heads"
            :data="users"
            :unselectable="true"
            head-class="bg-success text-light"
          >
            <template v-slot:head:before>
              <th>Action</th>
            </template>
            <template v-slot:body:before="{item}">
              <td>
                <router-link :to="`/users/edit/${item.id}`" class="btn btn-sm btn-warning">
                  <span><i class="fa fa-edit"></i></span>
                </router-link>
                <router-link :to="`/users/remove/${item.id}`" class="btn btn-sm btn-danger mx-1">
                  <span><i class="fa fa-trash"></i></span>
                </router-link>
              </td>
            </template>
            <template v-slot:head>
              <th>Active</th>
            </template>
            <template v-slot:body="{item}">
              <td>{{ item.active === 1 ? 'yes' : 'no' }}</td>
            </template>
          </table-component>
        </div>
        <div v-else-if="fetched" class="text-center">
          <p class="font-weight-bold">no data to show</p>
        </div>
        <loader-component v-else></loader-component>
      </div>
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
        title: "Fullname",
        name: "name"
      },
      {
        title: "Username",
        name: "username"
      },
      {
        title: "E-mail",
        name: "email"
      },
      {
        title: "Line",
        name: "line"
      },
      {
        title: "Role",
        name: "role"
      },
      {
        title: "Area",
        name: "area"
      },
      {
        title: "District",
        name: "district"
      },
      {
        title: "Territory",
        name: "territory"
      },
      {
        title: "Region",
        name: "region"
      }
    ]
  })
};
</script>

<style></style>
