<template>
  <div>
    <div class="row mx-auto">
      <div class="col-lg-3">
        <side-bar :links="links" />
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
    links: [
      {
        title: 'Hospitals',
        icon: 'fa-hospital',
        link: '/workplaces'
      },
      {
        title: 'Pharmacies',
        icon: 'fa-store',
        link: '/workplaces/pharmacies'
      }
    ]
  }),
  created(){
    this.$store.dispatch('hospitalsGetAll')
    .then(() => {
      this.$store.dispatch('pharmaciesGetAll')
    })
  }
}
</script>

<style>

</style>
