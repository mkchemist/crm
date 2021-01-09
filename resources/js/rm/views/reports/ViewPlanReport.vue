<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-book-reader"></span>
      <span class="font-weight-bold">Plan View</span>
    </p>
    <div class="p-2 row mx-auto pb-5">
      <div class="col-lg-3">
        <sidebar-component :links="viewLinks" />
      </div>
      <div class="col-lg-9 pb-5">
        <router-view class="page-fade"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '../../../components/SidebarComponent.vue'
export default {
  components: {
    SidebarComponent
  },
  data: () => ({

     viewLinks: [
      {
        title: 'Coach Plans',
        icon: 'fa fa-book',
        link: '/reports/view/plan'
      },
      {
        title: 'Rep PM plans',
        icon: 'fa fa-book',
        link: '/reports/view/plan/pm'
      },
      {
        title: 'Rep AM plans',
        icon: 'fa fa-book',
        link: '/reports/view/plan/am'
      }
    ]
  })
}
</script>

<style>

</style>
