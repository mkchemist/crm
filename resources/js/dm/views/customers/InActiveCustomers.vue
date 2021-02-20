<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-unlock"></i></span>
        <span class="font-weight-bold">Active customers</span>
      </p>
      <div class="p-2">
        <div class="p-2" v-if="activeCustomers.length">
          <customer-list-component
            :data="activeCustomers"
            :refreshCallback="forceRefreshCallback"
          />
        </div>
        <div v-else-if="isFetched">
          <no-data-to-show />
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import CustomerListComponent from "../../../components/CustomerListComponent.vue";
import NoDataToShow from "../../../components/NoDataToShow.vue";
export default {
  computed: {
    activeCustomers() {
      let customers = this.$store.getters.inactiveCustomers;
      return this.prepareCustomerTable(customers);
    },
    isFetched() {
      return this.$store.getters.isCustomersFetched;
    },
    reps() {
      let reps = [...this.$store.getters.allReps];
      try {
        reps.forEach(r => {
          try {
            r.area = JSON.parse(r.area);
            r.district = JSON.parse(r.district);
            r.territory = JSON.parse(r.territory);
            r.assigned_brick = JSON.parse(r.assigned_brick);
          } catch (e) {
            return;
          }
          if (r.assigned_brick[0] === "all") {
            r.assigned_brick = [];
          }
        });
      } catch (e) {
        console.log(e);
      }
      return reps;
    }
  },
  components: {
    CustomerListComponent,
    NoDataToShow
  },
  data: () => ({}),
  methods: {
    prepareCustomerTable(data) {
      data.forEach(item => {
        let { rep, line } = this.getRepName(item);
        item["rep"] = rep;
        item["line"] = line;
        item["diff"] = item.reports - item.plans;
        item["status"] = this.customerState(item);
      });
      return data;
    },
    customerState(item) {
      let diff = item.reports - item.plans;
      if (diff > 0) {
        return "over";
      } else if (diff === 0 && item.plans !== 0) {
        return "accomplished";
      } else if (diff === 0 && item.plans === 0) {
        return "not_targeted";
      } else if (diff === -1 * item.plans && item.plans !== 0) {
        return "uncovered";
      } else {
        return "under";
      }
    },
    getRepName(c) {
      let rep = "-------";
      let line = "------";
      this.reps.map(r => {
        if (
          r.assigned_brick.includes(c.brick) &&
          r.area.includes(c.area) &&
          r.territory.includes(c.territory) &&
          r.district.includes(c.district)
        ) {
            rep = r.name;
          line = r.line;
        }
      });
      return { rep, line };
    },
    forceRefreshCallback() {
      this.$store.dispatch("customersGetAll", true);
    }
  }
};
</script>

<style></style>
