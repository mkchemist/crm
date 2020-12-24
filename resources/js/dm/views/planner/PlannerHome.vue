<template>
  <div class="p-2 bg-white shadow" style="min-height:500px">
    <div class="p-2 text-center">
      <router-link class="btn btn-secondary btn-sm" to="/planner/add">
        <span class="fa fa-plus-circle"></span>
        <span>Add Plan</span>
      </router-link>
      <button class="btn btn-sm btn-success">
        <span><i class="fa fa-paper-plane"></i></span>
        <span>submit</span>
      </button>
    </div>
    <div class="p-2 border p-2 rounded my-1">
      <p class="clearfix">
        <span>Planner Summery</span>
        <span
          class="float-right text-primary fa fa-chevron-circle-down rotated"
          style="cursor:pointer"
          data-toggle="collapse"
          data-target="#plan_summery"
          ref="planSummeryBtn"
          @click="togglePlanSummeryIcon"
        ></span>
      </p>
      <div v-if="planSummery" id="plan_summery" class="collapse">
        <hr />
        <p class="mb-0">
          Total planner days :
          <span class="text-primary font-weight-bold">{{
            planSummery.total_days
          }}</span>
        </p>
        <p class="mb-0">
          Total {{ planSummery["is_dm"] ? "Reps" : "customers" }} :
          <span class="font-weight-bold text-primary">{{
            planSummery["total_customers"]
          }}</span>
        </p>
        <p class="mb-0">
          Total Plans:
          <span class="font-weight-bold text-primary">{{
            planSummery.total_plans
          }}</span>
        </p>
      </div>
    </div>
    <div class="">
      <vue-cal
        class="vuecal--green-theme p-2"
        :selectedDate="$attrs.date"
        active-view="week"
        :disable-views="['years', 'year']"
        :time="false"
        :hide-weekdays="[5]"
        today-button
        :events="plans"
        :startWeekOnSunday="true"
      >
        <template v-slot:arrow-prev>
          <i class="fa fa-chevron-circle-left text-success"></i>
        </template>
        <template v-slot:arrow-next>
          <i class="fa fa-chevron-circle-right text-success"></i>
        </template>
        <template v-slot:today-button>
          <button class="btn btn-sm btn-success">
            <span>today</span>
          </button>
        </template>
      </vue-cal>
    </div>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import { filterData } from "../../../helpers/helpers";
export default {
  components: {
    VueCal
  },
  data: () => ({}),
  computed: {
    plans() {
      return this.$store.getters.plans;
    },
    planSummery() {
      let summery = {};
      if (!this.plans.length) {
        return;
      }
      summery["total_plans"] = this.plans.length;
      summery["total_customers"] = Object.keys(
        filterData(this.plans, "title")
      ).length;
      summery["total_days"] = Object.keys(
        filterData(this.plans, "start")
      ).length;
      summery["is_dm"] = this.plans[0].user_id === this.$store.state.user.id;
      return summery;
    }
  },
  methods: {
    togglePlanSummeryIcon() {
      let downIcon = "fa-chevron-circle-down";
      let upIcon = "fa-chevron-circle-up";
      let el = this.$refs.planSummeryBtn;
      el.classList.toggle("rotateIcon180");
    }
  }
};
</script>

<style></style>
