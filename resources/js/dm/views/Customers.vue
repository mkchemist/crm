<template>
  <div>
    <div class="row mx-auto">
      <div class="col-lg-3 px-0">
        <side-bar :links="sidebarLinks"/>
      </div>
      <div class="col-lg-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "../../components/SidebarComponent";
export default {
  components: {
    SideBar
  },
  data: () => ({
    sidebarLinks : [
      {
        title: 'Active',
        icon : 'fa-unlock',
        link: '/customers'
      },
      {
        title: 'In-active',
        icon: 'fa-lock',
        link: '/customers/inactive'
      }
    ]
  }),
  created() {
    this.$store.dispatch("customersGetAll")
  }
}
</script>

<style>

</style>
