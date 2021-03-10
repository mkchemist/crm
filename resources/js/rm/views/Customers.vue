<template>
  <div class="px-0 shadow rounded pb-5" style="min-height:500px">
    <p class="alert alert-success">
      <span class="fa fa-user-md"></span>
      <span class="font-weight-bold">Customers List</span>
    </p>
    <div class="row mx-auto">
      <div class="col-lg-3">
        <sidebar-component :links="views" />
      </div>
      <div class="col-lg-9 px-0">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from "../../components/SidebarComponent.vue";
export default {
  mounted() {
    this.$store.dispatch('fetchCustomers')
  },
  components: {
    SidebarComponent
  },
  data: () => ({
    views: [
      {
        title: "Active",
        icon : 'fa-book-open',
        link: "/customers/"
      },
      {
        title: "Inactive",
        icon : 'fa-book',
        link: "/customers/inactive"
      }
    ]
  })
};
</script>

<style></style>
