<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-unlock"></i></span>
        <span class="font-weight-bold">Active customers</span>
      </p>
      <div class="p-2">
        <div class="text-right">

        </div>
        <div v-if="activeCustomers.length">
          <table-component  :heads="heads" :data="activeCustomers" />
        </div>
        <div v-else class="text-center">
          <loader-component />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
export default {
  computed: {
    activeCustomers() {
      return this.$store.getters.activeCustomers;
    },
    isFetched() {
      return this.$store.getters.isCustomersFetched;
    }
  },
  components: {
    TableComponent
  },
  data: () => ({
    heads: [
      {
        title: 'Area',
        name: 'area'
      },
      {
        title: 'Brick',
        name: 'brick'
      },
      {
        title: 'Name',
        name: 'name'
      },
      {
        title: 'Specialty',
        name: 'sepcialty'
      },
      {
        title: 'Parameter',
        name: 'param'
      },
      {
        title: 'Current Frequency',
        name: 'curren_freq'
      },
      {
        title: 'Next Frequency',
        name: 'next_freq'
      },
      {
        title: 'Reports',
        name: 'reports'
      },
      {
        title: 'Address',
        name: 'address'
      }
    ]
  })
}
</script>

<style>

</style>
