<template>
  <div class="px-0 shadow pb-5 rounded">
    <p class="alert alert-success">
      <span class="fa fa-list"></span>
      <span class="font-weight-bold">Planner list</span>
    </p>
    <div class="px-2">
      <ul class="nav">
        <li class="nav-item border">
          <router-link to="/planner" class="nav-link" active-class="bg-primary text-light" exact>
            <span>PM</span>
          </router-link>
        </li>
        <li class="nav-item border">
          <router-link to="/planner/am" class="nav-link" active-class="bg-primary text-light" exact>
            <span>AM</span>
          </router-link>
        </li>
      </ul>
      <div class="border px-2">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  computed: {
    plans() {
      return this.$store.getters.allPlans
    }
  },
  data: () => ({

  }),
  methods: {

  }
}
</script>

<style>

</style>
