<template>
  <div class="px-0 shadow my-2">
    <p class="alert alert-success">
      <span><i class="fa fa-check-circle"></i></span>
      <span>Validation</span>
    </p>
    <div class="p-2">
      <!-- validation navbar -->
      <ul class="nav justify-content-center">
        <li class="nav-item mx-1">
          <router-link to="/validation" class="btn btn-sm btn-success">
            <span><i class="fa fa-check-circle"></i></span>
            <span>New Customers</span>
          </router-link>
        </li>
        <li class="nav-item mx-1">
          <router-link to="/validation/customers" class="btn btn-sm btn-success">
            <span><i class="fa fa-check-circle"></i></span>
            <span>Customers</span>
          </router-link>
        </li>
        <li class="nav-item mx-1">
          <router-link to="/validation/frequency" class="btn btn-sm btn-success">
            <span><i class="fa fa-check-circle"></i></span>
            <span>Frequency</span>
          </router-link>
        </li>
        <li class="nav-item mx-1">
          <router-link to="/validation/parameters" class="btn btn-sm btn-success">
            <span><i class="fa fa-check-circle"></i></span>
            <span>Parameters</span>
          </router-link>
        </li>
        <li class="nav-item mx-1">
          <router-link to="/validation/workplaces" class="btn btn-sm btn-success">
            <span><i class="fa fa-check-circle"></i></span>
            <span>Workplaces</span>
          </router-link>
        </li>
        <li class="nav-item mx-1">
          <router-link to="/validation/pharmacies" class="btn btn-sm btn-success">
            <span><i class="fa fa-check-circle"></i></span>
            <span>Pharmacies</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="p-2 pb-5">
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
