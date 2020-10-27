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
/**
 * //TODO add report button in customer card
 *
 */
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
      },
      {
        title: "All",
        icon: 'fa-user-md',
        link: "/customers/all"
      },
      {
        title: 'Favorite List',
        icon: 'fa-star',
        link:'/customers/favorite-list'
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
