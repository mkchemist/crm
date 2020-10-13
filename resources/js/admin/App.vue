<template>
  <div style="min-height:700px" class="bg-white shadow">
    <div class="bg-success d-flex p-2">
      <div class="col-3 text-center">
        <span class="lead text-light">Admin Dashboard</span>
      </div>
      <div class="col-9 d-flex">
        <ul class="nav ml-auto">
          <li class="nav-item">
            <a href="" class="nav-link text-light">
              <span><i class="fa fa-door-open"></i></span>
              <span>logout</span>
            </a>
          </li>
          <li class="nav-item dropdown">
            <a href="" class="nav-link text-light dropdown-toggle" data-toggle="dropdown">
              <span><i class="fa fa-cogs"></i></span>
              <span>Actions</span>
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <a href="" class="dropdown-item">link</a>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a href="" class="nav-link text-light" data-toggle="dropdown">
              <span class=""><i class="fa fa-globe-africa"></i><sup class="text-light"><b>2</b></sup></span>
            </a>
            <div class="dropdown-menu">
              <a href="" class="dropdown-item">link</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
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
export default {
  components: {
    AdminSideMenu
  }
}
</script>

<style>
  body {
    background-color: #1111 !important;
  }
</style>
