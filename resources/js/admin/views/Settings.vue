<template>
  <div class="px-0 shadow pb-5 my-2">
    <p class="alert alert-success">
      <span class="fa fa-cog"></span>
      <span class="font-weight-bold">Settings</span>
    </p>
    <div class="p-2">
      <ul class="nav nav-tabs">
        <li class="nav-item border">
          <router-link to="/settings/cycles" class="nav-link small">
            <span class="fa fa-clock"></span>
            <span>Cycles</span>
          </router-link>
        </li>
         <li class="nav-item border">
          <router-link to="/settings/general" class="nav-link small">
            <span class="fa fa-cogs"></span>
            <span>General Settings</span>
          </router-link>
        </li>
      </ul>
      <div class="border p-2 rounded">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
