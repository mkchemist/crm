<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-users"></span>
      <span class="font-weight-bold">Line Managment</span>
    </p>
    <div class="p-2">
      <ul class="nav nav-tabs">
        <li class="nav-item border">
          <router-link to="/setting/lines" class="nav-link" active-class="bg-success text-light" exact>
            <span class="fa fa-book-reader"></span>
            <span>View All</span>
          </router-link>
        </li>
        <li class="nav-item border">
          <router-link to="/setting/lines/new" class="nav-link" active-class="bg-success text-light" exact>
            <span class="fa fa-book-reader"></span>
            <span>new lines</span>
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
  beforeCreate(){
    this.$store.dispatch('getAllLines')
  }
}
</script>

<style>

</style>
