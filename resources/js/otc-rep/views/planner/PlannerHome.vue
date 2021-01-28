<template>
  <div class="shadow px-0 rounded pb-5 pt-2">
    <p class="alert alert-success">
      <span class="fa fa-calendar-check"></span>
      <span>Planner</span>
    </p>
    <div class="p-2">
      <div class="p-2 text-center shadow-sm rounded my-2">
        <button
          class="btn btn-sm btn-primary"
          @click="refreshPlans"
        >
          <span class="fa fa-redo"></span>
          <span>Refresh planner</span>
        </button>
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
        <button class="btn btn-sm btn-success" @click="submitPlans" :disabled="locked || approved">
          <span class="fa fa-check-circle"></span>
          <span v-if="approved">Plan approved</span>
          <span v-else-if="locked">Already Submitted</span>
          <span v-else>Submit</span>
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
          :hide-weekdays="[5]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { httpCall } from '../../../helpers/http-service';

export default {
  components: {
    VueCal
  },
  computed: {
    plans() {
      return this.$store.getters.allPlans
    },
    locked() {
      return this.$store.getters.isPlannerLocked;
    },
    approved() {
      return this.$store.getters.isPlannerApproved;
    }
  },
  methods: {
    submitPlans() {
      let confirmSubmit = confirm('Do yo want to submit plan');
      if(confirmSubmit) {
        return  httpCall
        .post('otc-rep/v1/planner/submit')
        .then(({data}) => {
          this.handleResponse(data, data => this.$store.dispatch('fetchPlans', {force: true}));
        }).catch(err => console.log(err))
      }
      this.$toasted.success('Plan is not submitted')
      return;
    },
    refreshPlans() {
      this.$store.dispatch('fetchPlans', {force: true});
    }
  }
};
</script>

<style></style>
