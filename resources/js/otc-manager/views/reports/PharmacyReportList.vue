<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-book-reader"></span>
      <span class="font-weight-bold">Pharmacy Reports</span>
    </p>
    <div class="p-2">
      <div class="row mx-auto">
        <div class="col-lg-3">
          <cycle-selection :onSelect="selectCycle" :onReset="resetCycle" />
          <sidebar-component :links="views" />
          <router-link to="/reports" class="btn btn-sm btn-dark btn-block my-2">
            <span class="fa fa-chevron-circle-left"></span>
            <span>back</span>
          </router-link>
        </div>
        <div class="col-lg-9 pb-5 shadow rounded px-0">
          <div v-if="reports.length && fetched">
            <router-view :data="reports" :withUsername="true"></router-view>
          </div>
          <div v-else-if="fetched" class="p-5">
            <no-data-to-show />
          </div>
          <loader-component v-else></loader-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CycleSelection from '../../../components/CycleSelection.vue'
import SidebarComponent from '../../../components/SidebarComponent.vue'
export default {
  components: {
    SidebarComponent,
    CycleSelection

  },
  computed: {
    reports() {
      return this.$store.getters.pharmacyReports
    },
    fetched() {
      return this.$store.getters.isReportsFetched;
    },
    activeCycle() {
      return this.$store.getters.activeCycle;
    }
  },
  data:() => ({
    views: [
      {
        title: 'Pharmacy View',
        icon: 'fa-store-alt',
        link: '/reports/view/pharmacy'
      },
      {
        title: 'Date View',
        icon: 'fa-calendar-alt',
        link: '/reports/view/pharmacy/date'
      },
      {
        title: 'Product View',
        icon: 'fa-gift',
        link: '/reports/view/pharmacy/product'
      },
      {
        title: "Table View",
        icon: "fa-table",
        link: "/reports/view/pharmacy/table"
      }
    ]
  }),
  methods: {
    selectCycle() {
      let {start, end} = this.activeCycle;
      this.$store.dispatch('fetchReports', {start, end, force: true})
    },
    resetCycle() {
      this.$store.commit('resetActiveCycle');
      let {start, end} = this.activeCycle;
      this.$store.dispatch('fetchReports',{start, end, force: true})
    }
  }
}
</script>

<style>

</style>
