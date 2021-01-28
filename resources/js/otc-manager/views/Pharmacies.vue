<template>
  <div>
    <router-view class="page-fade" />
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("fetchPharmacies");
  },

};
</script>

<style></style>
