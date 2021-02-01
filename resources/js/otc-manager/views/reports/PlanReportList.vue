<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span class="fa fa-book-reader"></span>
      <span class="font-weight-bold">View Plan Report</span>
    </p>
    <div class="p-2 row mx-auto">
      <div class="col-lg-3">
        <sidebar-component :links="views" />
         <router-link to="/reports" class="btn btn-dark btn-sm btn-block my-2">
          <span class="fa fa-chevron-circle-left"></span>
          <span>back</span>
        </router-link>
      </div>
      <div class="col-lg-9">
        <div v-if="plans.length">
          <router-view  :data="plans" />
        </div>
        <div v-else-if="fetched">
          <no-data-to-show />
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '../../../components/SidebarComponent.vue'
export default {
  mounted() {
    this.$store.dispatch('fetchPlans');
  },
  components: {
    SidebarComponent
  },
  computed:{
    plans() {
      return this.$store.getters.allPlans;
    },
    fetched() {
      return this.$store.getters.isPlansFetched;
    }
  },
  data: () => ({
    views: [
      {
        title: 'Pharmacy Plans',
        icon: 'fa-store-alt',
        link: '/reports/view/plan'
      },
      {
        title: 'Health Day',
        icon: 'fa-cogs',
        link: '/reports/view/plan/health-day'
      }
    ]
  }),
}
</script>

<style>

</style>
