<template>
  <div class="p-2">
    <router-view class="page-fade"></router-view>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('fetchReports')
  }
}
</script>

<style>

</style>
