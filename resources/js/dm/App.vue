<template>
  <div>
      <navbar />
      <div class="bg-white my-2 p-2" style="min-height:700px">
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
/**
 * //TODO creating planner page
 * //TODO creating reports page
 * //TODO createing reps reports page
 */
import Navbar from "./components/Navbar"
export default {
  components: {
    Navbar
  }
}
</script>

<style>
body{
  background-color: #38c172;
}
</style>
