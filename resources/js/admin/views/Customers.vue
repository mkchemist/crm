<template>
  <div class="px-0 shadow rounded my-2 pb-5">
    <p class="alert alert-success">
      <span class="fa fa-user-md"></span>
      <span class="font-weight-bold">Customer Control Center</span>
    </p>
    <div class="p-2">
      <nav class="nav">
        <li class="nav-item border">
          <router-link to="/customers" class="nav-link small font-weight-bold" active-class="active" exact>
            <span>All customers</span>
          </router-link>
        </li>
        <li class="nav-item border">
          <router-link to="/customers/duplicate-customers" class="nav-link small font-weight-bold" active-class="active" exact>
            <span>Duplicates</span>
          </router-link>
        </li>

      </nav>
    </div>
    <div class="">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
