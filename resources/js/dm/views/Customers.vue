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
 * //TODO remove validation and requests links
 * //TODO create customer card
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
        title: 'Favorite List',
        icon: 'fa-star',
        link:'/customers/favorite-list'
      },
      {
        title: 'Validation',
        icon: 'fa-tasks',
        link: '/customers/validation'
      },
      {
        title: 'Requests',
        icon: 'fa-search-dollar',
        link: '/customers/requests'
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
