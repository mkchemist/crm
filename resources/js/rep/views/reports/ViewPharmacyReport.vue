<template>
  <div>
    <h1>View Pharmacy Report</h1>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('pharmacyReportGetAll');
  }
}
</script>

<style>

</style>
