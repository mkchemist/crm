<template>
  <div class="px-0 shadow rounded my-2 pb-5">
    <p class="alert alert-success">
      <span class="fa fa-cog"></span>
      <span class="font-weight-bold">Setting</span>
    </p>
    <div class="p-2">
      <nav>
        <ul class="nav nav-tabs">
          <li class="nav-item border" >
            <router-link to="/setting" class="nav-link" active-class="bg-success text-light" exact>
              <span class="fa fa-cogs"></span>
              <span>General</span>
            </router-link>
          </li>
          <li class="nav-item border">
            <router-link to="/setting/cycle" class="nav-link" active-class="bg-success text-light" exact>
              <span class="fa fa-hourglass-start"></span>
              <span>Cycle</span>
            </router-link>
          </li>
          <li class="nav-item border">
            <router-link to="/setting/lines" class="nav-link" active-class="bg-success text-light" exact>
              <span class="fa fa-users"></span>
              <span>Lines</span>
            </router-link>
          </li>
          <li class="nav-item border">
            <router-link to="/setting/requests" class="nav-link" active-class="bg-success text-light" exact>
              <span class="fa fa-dollar-sign"></span>
              <span>Requests</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
    <div class="p-2 pb-5">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NoDataToShow from '../../components/NoDataToShow.vue';
export default {
  components: { NoDataToShow },
  data: () => ({
    AppSetting: {}
  }),
  methods: {
    saveSetting() {}
  }
};
</script>

<style></style>
