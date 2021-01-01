<template>
  <div>
    <div class="p-2">
      <div v-if="plans.length">
        <table-component
          :data="plans"
          :heads="heads"
          :headClass="`bg-success text-light`"
          :unselectable="true"
        >
        </table-component>
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
    this.$store.dispatch('fetchAllPlans')
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
  })
};
</script>

<style></style>
