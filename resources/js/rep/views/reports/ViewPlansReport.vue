<template>
  <div class="px-0 pb-3 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-book-open"></i></span>
      <span class="font-weight-bold">View plans report</span>
    </p>
    <div class="p-2">
      <div class="row mx-auto">
        <div class="col-lg-3">
          <side-bar  :links="links" />
        </div>
        <div class="col-lg-9">
          <router-view class="page-fade"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import SideBar from '../../../components/SidebarComponent';
export default {
  created() {
    this.$store.dispatch('getWorkplacePlanner')
    .then(() => {
      this.$store.dispatch('getPlanner');
    })
  },
  components: {
    SideBar
  },
  data: () => ({
    links: [
      {
        title: 'PM plans',
        link: '/reports/view/plans/',
        icon: 'fa-user-md'
      },
      {
        title: 'AM plans',
        link: '/reports/view/plans/am',
        icon: 'fa-hospital-alt'
      },
      {
        title: 'Back',
        link: '/reports',
        icon: 'fa-chevron-left'
      }
    ]
  }),
  computed: {

  }
}
</script>

<style>

</style>
