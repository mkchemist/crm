<template>
  <div>
      <div class="row mx-auto">
        <div class="col-lg-3">
          <sidebar-component :links="links" />
        </div>
        <div class="col-lg-9">
          <router-view class="page-fade"></router-view>
        </div>
      </div>
  </div>
</template>

<script>
import SidebarComponent from "../../components/SidebarComponent";
export default {
  components:{
    SidebarComponent
  },
  data: () => ({
    links: [
      {
        title: 'Add Hospital',
        link: '/workplaces/add-hospital',
        icon: 'fa-plus-circle'
      },
      {
        title: 'Add Pharmacy',
        link: '/workplaces/add-pharamcy',
        icon: 'fa-plus-circle'
      },
      {
        title: 'Hospitals',
        link: '/workplaces',
        icon: 'fa-hospital-alt'
      },
      {
        title: 'Pharmacies',
        link: '/workplaces/pharmacies',
        icon: 'fa-store'
      }
    ]
  })
}
</script>

<style>

</style>
