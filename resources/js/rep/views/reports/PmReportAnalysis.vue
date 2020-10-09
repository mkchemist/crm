<template>
  <div>
    <p>distinct customers length : {{ Object.keys(pmData.customers).length }} </p>
    <p>distinct days length : {{ Object.keys(pmData.days).length }} </p>
  </div>
</template>

<script>
import { filterData } from '../../helpers/helpers';
export default {
  beforeMount() {
    this.$store.dispatch('reportGetAll');
  },
  computed : {
    // TODO will collecting all data
    pmData() {
      let reports  = this.$store.getters.allVisits;
      let customers = filterData(reports, 'customer.name');
      let days = filterData(reports, 'date')
      return {
        customers,
        days
      }
    }
  }
}
</script>

<style>

</style>
