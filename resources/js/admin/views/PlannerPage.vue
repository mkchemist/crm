<template>
  <div class="px-0 shadow rounded my-2 pb-5">
    <p class="alert alert-success">
      <span class="fa fa-calendar-check"></span>
      <span class="font-weight-bold">Planner Controller</span>
    </p>
    <div class="px-2">
      <ul class="nav" v-if="navLinks.length">
        <li class="nav-item border">
          <router-link to="/planner" class="nav-link small font-weight-bold" active-class="active" exact>
            <span :class="`fa fa-calendar-check`"></span>
            <span>List plans</span>
          </router-link>
        </li>
         <li class="nav-item border">
          <router-link to="/planner/approval" class="nav-link small font-weight-bold" active-class="active" exact>
            <span :class="`fa fa-check-circle`"></span>
            <span>Approval Control</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="px-2">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {},
  data: () => ({
    navLinks: [
      {
        title: "List plans",
        icon: "fa-calendar-check",
        link: "/planner"
      },
      {
        title: "Approvals",
        icon: "fa-check-circle",
        link: "/planner/approval"
      }
    ]
  })
};
</script>

<style></style>
