<template>
  <div class="px-0 pb-3 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-hospital"></i></span>
      <span class="font-weight-bold">AM Plans</span>
    </p>
    <div class="p-2">
      <div class="p-2" v-if="plans.length">
        <table-component
          :heads="heads"
          :data="plans"
          :notResponsive="true"
          headClass="bg-success text-light"
          orderBy="Date,asc"
        ></table-component>
      </div>
      <div v-else-if="fetched" class="text-center">
        <p class="text-muted">No plans found</p>
        <router-link to="/planner/add-am" class="btn btn-sm btn-primary">
          <span><i class="fa fa-paper-plane"></i></span>
          <span>New AM visit</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../../components/TableComponent";

export default {
  components: {
    TableComponent
  },
  data: () => ({
    heads: [
      {
        title: "Date",
        name: "start"
      },
      {
        title: "Name",
        name: "name"
      },
      {
        title: "Workplace Type",
        name: "workplace.type"
      },
      {
        title: "Address",
        name: "workplace.address"
      }
    ]
  }),
  computed: {
    plans() {
      return this.$store.getters.amPlans;
    },
    fetched() {
      return this.$store.getters.isPlansFetched;
    }
  }
};
</script>

<style></style>
