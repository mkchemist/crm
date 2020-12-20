<template>
  <div>
      <navbar />
      <div class="my-2 bg-white p-2" style="min-height:600px">
        <router-view class="page-fade"></router-view>
      </div>
  </div>
</template>

<script>
/**
 * //TODO create requests page
 * to controller every customer request
 *
 *
 */
import Navbar from "./components/Navbar.vue";
export default {
  components: {
    Navbar
  },
  mounted() {
    this.$store.dispatch('getCycles')
    .then(() => this.$store.dispatch('getActiveCycle'))
  }
}
</script>

<style lang="scss">
body{
  background-color: #38c172 !important;
}
</style>
