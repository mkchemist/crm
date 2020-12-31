<template>
  <div class="px-0 shadow rounded my-2 pb-5">
    <p class="alert alert-success">
      <span class="fa fa-calendar-check"></span>
      <span class="font-weight-bold">Planner Controller</span>
    </p>
    <div class="px-2">
      <ul class="nav" v-if="navLinks.length">
        <li
          v-for="(row, index) in navLinks"
          :key="`nav_link_${index}`"
          class="nav-item border"
        >
          <router-link
            :to="row.link"
            class="nav-link"
            active-class="bg-primary text-light"
            exact
          >
            <span v-if="row.icon" :class="`fa ${row.icon}`"></span>
            <span>{{ row.title }}</span>
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
  mounted() {
    this.$store.dispatch('fetchAllPlans')
  },
  data: () => ({
    navLinks: [
      {
        title: 'List plans',
        icon : 'fa-calendar-check',
        link: '/planner'
      },
      {
        title: 'Approvals',
        icon: 'fa-check-circle',
        link: '/planner/approval'
      }
    ]
  })
};
</script>

<style></style>
