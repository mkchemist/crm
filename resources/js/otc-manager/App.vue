<template>
  <div>
    <navbar />
    <div class="bg-white my-2 p-2 rounded shadow" style="min-height:600px">
      <router-view class="page-fade" />
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
  components: { Navbar },
  mounted() {
    this.$store.dispatch('getManagerReps');
    this.$store.dispatch('fetchingApplicationSettings');
  }
}
</script>

<style>
  body {
    background-color: #38c172 !important;
  }
</style>
