<template>
  <div class="bg-success">
    <navbar />

    <div class="my-2 bg-white p-2" style="min-height:600px">
      <router-view class="page-fade"></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
  components: { Navbar },
  mounted() {
    Promise.all([
      this.$store.dispatch('getAllRelations'),
     this.$store.dispatch('fetchingApplicationSettings')

    ])
  }
}
</script>

<style lang="scss">
body{
  background-color: #38c172 !important;
}
</style>
