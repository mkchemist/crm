<template>
  <div>
    <div class="p-2">
      <div class="p-2 text-right">
        <button class="btn btn-sm btn-primary" @click="startLoading">
          <span class="fa fa-download"></span>
          <span>Start loading</span>
        </button>
      </div>
      <hr>
      <div v-if="plans.length">
        <table-component
          :data="plans"
          :heads="heads"
          :headClass="`bg-success text-light`"
          :unselectable="true"
        >
        </table-component>
      </div>
      <div v-else-if="!startRequest" class="d-flex align-items-center justify-content-lg-center" style="height:300px">
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
import TableComponent from "../../../components/TableComponent.vue";
export default {
  mounted(){
  },
  components: { TableComponent, NoDataToShow },
  computed: {
    plans() {
      return this.$store.getters.pmPlans;
    },
    isPlanFetched() {
      return this.$store.getters.isPlanFetched;
    }
  },
  data: () => ({
    startRequest: false,
    heads: [
      {
        title: "Date",
        name: "Date"
      },
      {
        title: "Rep",
        name: "Rep"
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
        title: 'Parameter',
        name: 'Parameter',
        fallback: 'NN'
      },
      {
        title: 'Frequency',
        name: 'Frequency',
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
      },

    ]
  }),
  methods: {
    startLoading() {
      this.startRequest = true;
      this.$store.dispatch('fetchAllPlans')
      .then(() => {

      })
    }
  }
};
</script>

<style></style>
