<template>
  <div class="px-0 shadow rounded pb-5 my-2">
    <p class="alert alert-success">
      <span class="fa fa-handshake"></span>
      <span class="font-weight-bold">Coach Reports</span>
    </p>
    <div class="p-2 my-2">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {

  mounted() {
    this.$store.dispatch("fetchCoachReportModuleUserRelations");
    this.$store.dispatch("fetchCoachReportsModuleReports");
  },

};
</script>

<style></style>
