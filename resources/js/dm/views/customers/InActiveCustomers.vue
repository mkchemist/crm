<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-lock"></i></span>
        <span class="font-weight-bold">Inactive Customers list</span>
      </p>
      <div class="my-2">
        <table-component
          v-if="customers.length"
          :heads="heads"
          :data="customers"
          headClass="bg-success text-light"
        />
        <div v-else-if="isCustomersFetched">
          <p class="text-center text-dark font-weight-bold">No data to show</p>
        </div>
        <div v-else>
          <loader-component />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
export default {
  components: {
    TableComponent,
  },
  computed: {
    customers() {
      return this.$store.getters.inactiveCustomers;
    },
    isCustomersFetched() {
      return this.$store.getters.isCustomersFetched;
    }
  },
  data: () => ({
    heads: [
      {
        title:'Area',
        name:'area'
      },
      {
        title: 'Brick',
        name: 'brick'
      },
      {
        title: 'Name',
        name:'name'
      },
      {
        title: 'Specialty',
        name:'specialty'
      },
      {
        title: 'Parameters',
        name: 'param'
      },
      {
        title: 'Current Freq.',
        name:'current_freq'
      },
      {
        title:'Next Freq.',
        name:'next_freq'
      },
        {
          title: 'Reports',
          name: 'reports'
        },
      {
        title: 'Address',
        name:'address'
      },
    ]
  })
}
</script>

<style>

</style>
