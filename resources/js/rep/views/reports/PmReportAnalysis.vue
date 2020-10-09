<template>
  <div>
    <p>Total Customers : {{ Object.keys(pmData.customers).length }}</p>
  </div>
</template>

<script>
import { sortData } from '../../helpers/helpers';
export default {
  beforeMount() {
    this.$store.dispatch('reportGetAll');
  },
  computed : {
    pmData() {
      let customers = sortData(this.$store.getters.pmVisits, 'customer_name')
      console.log(customers);
      return {
        customers
      }
    }
  }
}
</script>

<style>

</style>
