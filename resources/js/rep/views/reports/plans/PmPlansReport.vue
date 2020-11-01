<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-user-md"></i></span>
      <span class="font-weight-bold">PM Plans</span>
    </p>
    <div class="p-2">
      <div v-if="plans.length">
        <table-component
          :data="plans"
          :heads="heads"
          :notResponsive="true"
          headClass="bg-success text-light"
          orderBy='Date,asc'
        ></table-component>
      </div>
      <div v-else-if="isFetched" class="text-center">
        <p class="text-muted">No plans found</p>
        <router-link to="/planner/add-pm" class="btn btn-sm btn-primary">
          <span><i class="fa fa-plus-circle"></i></span>
          <span>plan</span>
        </router-link>
      </div>
      <loader-component v-else></loader-component>
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
        name: "title"
      },
      {
        title: "Specialty",
        name: "specialty"
      },
      {
        title: 'Parameter',
        name: 'param'
      },
      {
        title: 'Frequency',
        name: 'freq'
      },
      {
        title: 'Planned',
        name: 'plans_count'
      },
      {
        title: "Type",
        name: "type"
      }
    ]
  }),
  computed: {
    isFetched() {
      return this.$store.getters.isPlansFetched;
    },
    plans() {
      return this.$store.getters.plans;
    }
  }
};
</script>

<style></style>
