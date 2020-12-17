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
              </td>
            </template>
            <template v-slot:head>
              <th>Line</th>
              <th>Role</th>
              <th>Area</th>
              <th>District</th>
              <th>Territory</th>
              <th>Region</th>
              <th>Active</th>
              <th>Assigned bricks</th>
            </template>
            <template v-slot:body="{item}">
              <td>
                <ul class="nav">
                  <li class="nav col-12 p-0" v-for="(val,key) in item.line" :key="`line_${key}`">{{ val }}</li>
                </ul>
              </td>
              <td>{{ item.role }}</td>
               <td>
                <ul class="nav">
                  <li class="nav col-12 p-0" v-for="(val,key) in item.area" :key="`line_${key}`">{{ val }}</li>
                </ul>
              </td>
               <td>
                <ul class="nav">
                  <li class="nav col-12 p-0" v-for="(val,key) in item.district" :key="`line_${key}`">{{ val }}</li>
                </ul>
              </td>
               <td>
                <ul class="nav">
                  <li class="nav col-12 p-0" v-for="(val,key) in item.territory" :key="`line_${key}`">{{ val }}</li>
                </ul>
              </td>
               <td>
                <ul class="nav">
                  <li class="nav col-12 p-0" v-for="(val,key) in item.region" :key="`line_${key}`">{{ val }}</li>
                </ul>
              </td>
              <td>{{ item.active === 1 ? 'yes' : 'no' }}</td>
              <td class="text-left">
                <span v-if="!item.assigned_brick.length">No assigment</span>
                <ul class="nav col-12" v-else>
                  <li class="nav-item col-12 p-0 m-0" v-for="(item, i) in item.assigned_brick" :key="i">{{ item }}</li>
                </ul>
              </td>
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
     /*  {
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
      } */
    ]
  })
};
</script>

<style></style>
