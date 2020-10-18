<template>
  <div style="min-height:700px" class="bg-white shadow">
    <admin-navbar />
    <div class="row mx-auto">
      <div class="col-lg-3 px-0">
        <admin-side-menu />
      </div>
      <div class="col-lg-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import AdminSideMenu from "./components/AdminSideMenu.vue";
import AdminNavbar from "./components/AdminNavbar.vue";
export default {
  components: {
    AdminSideMenu,
    AdminNavbar
  }
}
</script>

<style>
  body {
    background-color: #1111 !important;
  }
</style>
