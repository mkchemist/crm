<template>
  <div class="px-0 shadow my-2 pb-5">
    <p class="alert alert-success">
      <span><i class="fa fa-users-cog"></i></span>
      <span class="font-weight-bold">Users Controller Page</span>
    </p>
    <div class="my-2 p-2">
      <section class="p-2">
        <nav class="nav justify-content-center nav-tabs">
          <li class="nav-item mx-lg-1">
            <router-link to="/users" class="nav-link small" active-class="bg-primary text-light" exact>
              <span><i class="fa fa-users"></i></span>
              <span>All</span>
            </router-link>
          </li>
          <li class="nav-item mx-lg-1">
            <router-link to="/users/add" class="nav-link small" active-class="bg-primary text-light" exact>
              <span><i class="fa fa-user-plus"></i></span>
              <span>add</span>
            </router-link>
          </li>
          <li class="nav-item mx-lg-1">
            <router-link to="/users/view" class="nav-link small" active-class="bg-primary text-light" exact>
              <span><i class="fa fa-user-edit"></i></span>
              <span>view</span>
            </router-link>
          </li>
          <li class="nav-item mx-lg-1">
            <router-link to="/users/delete" class="nav-link small" active-class="bg-primary text-light" exact>
              <span><i class="fa fa-trash"></i></span>
              <span>remove</span>
            </router-link>
          </li>
          <li class="nav-item mx-lg-1">
            <router-link to="/users/activate" class="nav-link small" active-class="bg-primary text-light" exact>
              <span><i class="fa fa-user-slash"></i></span>
              <span>activate</span>
            </router-link>
          </li>
        </nav>
      </section>

      <main class="p-2">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('getAllUsers');
  }
}
</script>

<style>

</style>
