<template>
  <div>
      <div class="row mx-auto">
        <customers-side-bar />
        <div class="col-lg-9 p-2">
          <router-view></router-view>
        </div>
      </div>
  </div>
</template>

<script>
import CustomersSideBar from "../components/CustomersSideBar.vue";
export default {
  components: {
    CustomersSideBar
  }
}
</script>

<style>

</style>
