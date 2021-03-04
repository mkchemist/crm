<template>
  <div>
    <navbar />
    <div class="container-fluid bg-white shadow rounded p-2" style="min-height:600px">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
  components: { Navbar },

}
</script>

<style>

</style>
