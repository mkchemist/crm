<template>
  <div>
    <navbar />
    <div class="my-2 bg-white shadow rounded " style="min-height:600px">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
export default {
  components: { Navbar },
  mounted() {
    this.$store.dispatch('fetchingApplicationSettings');
    this.$store.dispatch('getAppUserLocations')
  }
}
</script>

<style lang="scss">
  body {
    background-color: #38c172!important;
  }
</style>
