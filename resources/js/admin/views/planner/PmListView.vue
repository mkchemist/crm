<template>
  <div>
    <div class="p-2">
      <div class="p-2 text-right">
        <button class="btn btn-sm skin-btn" @click="startLoading">
          <span class="fa fa-download"></span>
          <span>Start loading</span>
        </button>
      </div>
      <hr />
      <div v-if="plans.length">
        <data-table-component :data="plans" :cols="heads" :selectable="false" :tableHeadClass="`skin-table`">
        </data-table-component>
      </div>
      <div
        v-else-if="!startRequest"
        class="d-flex align-items-center justify-content-lg-center"
        style="height:300px"
      >
        <div class="text-center">
          <p>
            <span class="fa fa-download fa-4x text-primary"></span>
          </p>
          <p class="text-primary font-weight-bold">
            <span>Click start loading to load all plans</span>
          </p>
        </div>
      </div>
      <div class="" v-else-if="isPlanFetched">
        <no-data-to-show :title="`No plans`" />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import NoDataToShow from "../../../components/NoDataToShow.vue";
import DataTableComponent from "../../../components/DataTableComponent.vue";
export default {
  mounted() {},
  components: { DataTableComponent, NoDataToShow },
  computed: {
    plans() {
      return this.$store.getters.pmPlans;
    },
    isPlanFetched() {
      return this.$store.getters.isPlanFetched;
    },
    dms() {
      return this.$store.getters.dms;
    },
    rms() {
      return this.$store.getters.rms;
    },
    ams() {
      return this.$store.getters.ams;
    },
    heads() {
      return [
        {
          title: "Business Unit",
          name: row => {return this.getRepRegionalManager(row.user_id)}
        },
        {
          title: "Area Manager",
          name: row => this.getRepAreaManager(row.user_id)
        },
        {
          title: "District Manager",
          name: row => this.getRepManager(row.user_id)
        },
        {
          title: "Rep",
          name: "Rep"
        },
        {
          title: "Date",
          name: "Date"
        },
        {
          title: "Customer",
          name: "Customer"
        },
        {
          title: "Specialty",
          name: "Specialty"
        },
        {
          title: "Parameter",
          name: "Parameter",
          fallback: "NN"
        },
        {
          title: "Frequency",
          name: "Frequency",
          fallback: 0
        },
        {
          title: "Submitted",
          name: "submitted"
        },
        {
          title: "Approved",
          name: "approved"
        },
        {
          title: "Brick",
          name: "Brick"
        },
        {
          title: "Area",
          name: "Area"
        },
        {
          title: "District",
          name: "District"
        },
        {
          title: "Territory",
          name: "Territory"
        }
      ];
    }
  },
  data: () => ({
    startRequest: false
  }),
  methods: {
    startLoading() {
      this.startRequest = true;
      this.$store.dispatch("fetchAllPlans").then(() => {});
    },
    getRepManager(id) {
      let manager = "-------";
      this.dms.map(user => {
        let reps = user.relations.reps;
        if (reps && reps.includes(id)) {
          manager = user.name;
        }
      });
      return manager;
    },
    getRepAreaManager(id) {
      let manager = "-------";

      this.ams.map(user => {
        let reps = user.relations.reps;
          if (reps && reps.includes(id)) {
            manager = user.name;
          }
      });
      return manager;
    },
    getRepRegionalManager(id) {
      let manager = "-------";
      this.rms.map(user => {
        let reps = user.relations.reps;
        if (reps && reps.includes(id)) {
          manager = user.name;
        }
      });
      return manager;
    }
  }
};
</script>

<style></style>
