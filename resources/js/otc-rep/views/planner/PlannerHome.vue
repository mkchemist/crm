<template>
  <div class="shadow px-0 rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-calendar-check"></span>
      <span>Planner</span>
    </p>
    <div class="p-2">
      <div class="p-2 text-center shadow-sm rounded my-2">
        <router-link to="/planner/add/day" class="btn btn-sm btn-primary">
          <span class="fa fa-plus-circle"></span>
          <span>Plan a day</span>
        </router-link>
        <router-link
          to="/planner/add/health-day"
          class="btn btn-sm btn-warning"
        >
          <span class="fa fa-plus-circle"></span>
          <span>Plan a health day</span>
        </router-link>
        <button class="btn btn-sm btn-success">
          <span class="fa fa-check-circle"></span>
          <span>Submit</span>
        </button>
      </div>
      <div>
        <vue-cal
          :selectedDate="$attrs.date"
          :activeView="'week'"
          :disableViews="['years', 'year']"
          :startWeekOnSunday="true"
          :events="plans"
          :time="false"
          class="vuecal--green-theme"
          style="max-height:400px;overflow:auto"
          v-if="plans.length"
          :hide-weekdays="[5]"
        />
        <div class="py-5" v-else>
          <no-data-to-show />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

export default {
  components: {
    VueCal
  },
  computed: {
    plans() {
      return this.$store.getters.allPlans
    }
  }
};
</script>

<style></style>
