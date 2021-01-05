<template>
  <div class="bg-success">
    <navbar />

    <div class="my-2 bg-white p-2">
      <router-view class="page-fade"></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
  components: { Navbar },
  mounted() {
    this.$store.dispatch('getAllRelations')
  }
}
</script>

<style lang="scss">
body{
  background-color: #38c172 !important;
}
</style>
