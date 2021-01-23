<template>
  <div class="px-0 shadow rounded pb-5 my-2 bg-light">
    <p class="alert alert-success">
      <span class="fa fa-calendar-plus"></span>
      <span>Plan a day</span>
    </p>
    <div class="p-2">
      <div class="row mx-auto">
        <!-- Brick list -->
        <div class="col-lg-6 px-2">
          <div class="px-0 shadow-sm">
            <div class="bg-primary text-light p-2">
              <p class="mb-0">
                <span> Date : {{ $attrs.date }}</span>
                <span class="float-right badge badge-light">
                  selected: {{ selected.length }}</span
                >
              </p>
            </div>
            <div style="height:200px;overflow:auto" class="bg-white p-2">
              <ul class="nav" v-if="appUserLocations.length">
                <li
                  class="nav-item col-12 border-bottom"
                  v-for="(location, i) in appUserLocations"
                  :key="`location_${i}`"
                >
                  <input
                    type="checkbox"
                    @click="toggleBrickPlan(location.brick)"
                  />
                  <span class="form-check-label text-muted">{{
                    location.brick
                  }}</span>
                </li>
              </ul>
              <loader-component v-else></loader-component>
            </div>
          </div>
        </div>
        <!-- Planned list -->
        <div class="col-lg-6 px-0 px-2">
          <div class="px-0 shadow-sm">
            <div class="bg-primary text-light p-2">
              <p class="mb-0">
                <span> Date : {{ $attrs.date }}</span>
                <span class="float-right badge badge-light">
                  Planned: {{ updated.length }}</span
                >
              </p>
            </div>
            <div style="height:200px;overflow:auto" class="bg-white p-2">
              <ul class="nav" v-if="planned.length">
                <li
                  class="nav-item col-12 border-bottom clearfix"
                  v-for="(plan, i) in planned"
                  :key="`plan_${i}`"
                >
                  <input
                    type="checkbox"
                    @click="togglePlannedVisits(plan.id)"
                  />
                  <span
                    class="form-check-label text-muted small"
                    v-html="plan.title"
                  ></span>
                  <span class="float-right badge badge-info">{{
                    plan.type === "regular" ? "Brick" : "Health Day"
                  }}</span>
                </li>
              </ul>
              <div v-else class="pt-2">
                <no-data-to-show :iconColor="`text-primary`" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <planner-actions
        :date="$attrs.date"
        :store="selected"
        :update="updated"
        :type="type"
      />
    </div>
  </div>
</template>

<script>
import { checkerSelect } from "../../../helpers/helpers";
import { httpCall } from "../../../helpers/http-service";
import PlannerActions from "../../components/PlannerActions.vue";
export default {
  components: { PlannerActions },
  mounted() {
    this.$store.dispatch("getAppUserLocations");
  },
  computed: {
    planned() {
      let plans = this.$store.getters.allPlans;
      return plans.filter(plan => plan.start === this.$attrs.date);
    },
    appUserLocations() {
      return this.$store.getters.appUserLocations;
    }
  },
  data: () => ({
    selected: [],
    updated: [],
    type: "regular"
  }),
  methods: {
    /**
     * add or delete brick from plan
     *
     * @param {String} brick
     */
    toggleBrickPlan(brick) {
      this.selected = checkerSelect(this.selected, brick, event);
    },
    /**
     * add or remove planned visits
     * from plans
     *
     * @param {String} brick
     */
    togglePlannedVisits(brick) {
      this.updated = checkerSelect(this.updated, brick, event);
    }
  }
};
</script>

<style></style>
