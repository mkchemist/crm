<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-calendar-alt"></span>
      <span class="font-weight-bold">View Plan Report</span>
    </p>
    <div class="row mx-auto p-2">
      <div class="col-lg-3">
        <cycle-selection :onSelect="onSelectCycle" :onReset="onResetCycle" />

        <sidebar-component :links="views" />
        <router-link to="/reports" class="btn btn-dark btn-sm btn-block my-2">
          <span class="fa fa-chevron-circle-left"></span>
          <span>back</span>
        </router-link>
      </div>
      <div class="col-lg-9">
        <div class="px-0 shadow rounded" v-if="plans.length">
          <router-view :data="plans" />
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
import CycleSelection from '../../../components/CycleSelection.vue';
import SidebarComponent from '../../../components/SidebarComponent.vue'
export default {
  mounted() {
    this.$store.dispatch('fetchPlans')
  },
  components: {
    SidebarComponent,
    CycleSelection
  },
  computed: {
    plans() {
      return this.$store.getters.allPlans;
    },
    fetched() {
      return this.$store.getters.isPlannerFetched;
    },
    activeCycle() {
      return this.$store.getters.activeCycle
    }
  },
  data: () => ({
    views: [
      {
        title: 'Pharmacy Plan',
        icon: 'fa-store-alt',
        link: '/reports/view/plan'
      },
      {
        title: 'Health Day Plan',
        icon: 'fa-cogs',
        link: '/reports/view/plan/health-day'
      }
    ]
  }),
   methods: {
    onSelectCycle() {
      this.$store.dispatch("fetchPlans",{
        force: true,
        start: this.activeCycle.start,
        end: this.activeCycle.end
      });
    },
    onResetCycle() {
      this.$store.commit('resetActiveCycle');
      this.$store.dispatch("fetchPlans", {
        force: true,
        start: this.activeCycle.start,
        end: this.activeCycle.end
      });
    }
  }
}
</script>

<style>

</style>
