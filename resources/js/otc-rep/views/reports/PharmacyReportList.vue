<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-book-reader"></span>
      <span class="font-weight-bold">Pharmacy Report List</span>
    </p>
    <div class="row mx-auto p-2">
      <div class="col-lg-3">
        <cycle-selection :onSelect="onSelectCycle" :onReset="onResetCycle" />
        <sidebar-component :links="views" />
        <div class="my-2">
          <router-link
            to="/reports/add/pharmacy"
            class="btn btn-sm btn-block btn-primary"
          >
            <span class="fa fa-plus-circle"></span>
            <span>Add Report</span>
          </router-link>
          <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
            <span class="fa fa-chevron-circle-left"></span>
            <span>back</span>
          </router-link>
        </div>
      </div>
      <div class="col-lg-9 px-0 shadow rounded pb-5">
        <div v-if="plans.length">
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
import SidebarComponent from "../../../components/SidebarComponent.vue";
export default {
  mounted() {
    this.$store.dispatch("fetchPharmacyReports");
  },
  components: {
    SidebarComponent,
    CycleSelection
  },
  computed: {

    plans() {
      return this.$store.getters.pharmacyReports;
    },
    fetched() {
      return this.$store.getters.pharmacyReportsFetched;
    },
    activeCycle() {
      return this.$store.getters.activeCycle
    }
  },
  data: () => ({
    views: [
      {
        title: "Pharmacy View",
        icon: "fa-store",
        link: "/reports/view/pharmacy"
      },
      {
        title: "Date View",
        icon: "fa-calendar-alt",
        link: "/reports/view/pharmacy/date"
      },
      {
        title: "Product View",
        icon: "fa-gift",
        link: "/reports/view/pharmacy/product"
      },
      {
        title: "Table View",
        icon: "fa-table",
        link: "/reports/view/pharmacy/table"
      }
    ]
  }),
  methods: {
    onSelectCycle() {
      this.$store.dispatch("fetchPharmacyReports",{
        force: true,
        start: this.activeCycle.start,
        end: this.activeCycle.end
      });
    },
    onResetCycle() {
      this.$store.commit('resetActiveCycle');
      this.$store.dispatch("fetchPharmacyReports", {
        force: true,
        start: this.activeCycle.start,
        end: this.activeCycle.end
      });
    }
  }
};
</script>

<style></style>
