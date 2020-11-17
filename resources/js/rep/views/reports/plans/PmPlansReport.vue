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
        >
        <template v-slot:head>
          <th>Unplanned</th>
          <th>Status</th>
          <th>Type</th>
        </template>
        <template v-slot:body="{item}">
          <td>{{ item.freq - item.plans_count }}</td>
          <td :class="unplannedStatus(item).style">{{ unplannedStatus(item).title }}</td>
          <td>{{ item.type }}</td>
        </template>
        </table-component>
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
    ]
  }),
  computed: {
    isFetched() {
      return this.$store.getters.isPlansFetched;
    },
    plans() {
      return this.$store.getters.plans;
    }
  },
  methods: {
    unplannedStatus(item) {
      let freq = item.freq,
          plans = item.plans_count;
      let res = {};
      if(freq - plans > 0) {
        res = {
          style: 'bg-danger text-light',
          title: 'Missed'
        }
      } else if(freq === 0 && freq-plans === 0) {
        res = {
          style : 'bg-dark text-light',
          title: 'not targeted'
        }
      } else if(freq !== 0 && freq - plans === 0) {
        res = {
          style: 'bg-success text-light',
          title: 'accomplished'
        }
      } else if(freq - plans < 0) {
        res = {
          style: 'bg-primary text-light',
          title: 'over'
        }
      }

      return res;
    }
  }
};
</script>

<style></style>
