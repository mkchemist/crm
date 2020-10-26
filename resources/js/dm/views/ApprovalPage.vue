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
    links:[
      {
        title: 'Frequency Approval',
        icon : 'fa-wave-square',
        link: '/approval'
      },
      {
        title: 'Parameters Approval',
        icon : 'fa-check',
        link: '/approval/parameter'
      },
      {
        title: 'Customers Approval',
        icon : 'fa-user-check',
        link: '/approval/customers'
      },
      {
        title: 'Customers Details Approval',
        icon: 'fa-user-check',
        link: '/approval/customer-details'
      },
      {
        title: 'Workplaces Approval',
        icon : 'fa-hospital-alt',
        link: '/approval/workplaces'
      },
      {
        title: 'Pharmacies Approval',
        icon : 'fa-store-alt',
        link: '/approval/pharmacies'
      }
    ]
  })
}
</script>

<style>

</style>
