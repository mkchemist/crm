<template>
  <div>
      <navbar />
      <div class="bg-white my-2 p-2" style="min-height:700px">
        <router-view></router-view>
      </div>
  </div>
</template>

<script>

import Navbar from "./components/Navbar"
export default {
  components: {
    Navbar
  },
  mounted(){
    this.$store.dispatch('fetchingApplicationSettings')
    .then(() => {
      this.$store.dispatch('getAllReps');

    })
  }
}
</script>

<style>
body{
  background-color: #38c172;
}
</style>
