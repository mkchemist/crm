<template>
  <div>
    <div class="row mx-auto">
      <div class="col-lg-3" id="side_datepicker">
        <div class="p-2 border rounded my-1 shadow">
          <label for="active_cycle" class="small text-muted"
            >Current Cycle</label
          >
          <select
            name="active_cycle"
            id="active_cycle"
            class="form-control form-control-sm"
            v-model="activeCycle"
            :disabled="!cycles.length || !activeCycle"
          >
            <option
              v-for="(cycle, i) in cycles"
              :key="`cycle_${i}`"
              :value="cycle"
              >{{ cycle.name }}</option
            >
          </select>
          <div class="p-2 text-right">
            <button class="btn btn-sm btn-primary" @click="selectCycle">
              <span class="fa fa-check-circle"></span>
              <span>select</span>
            </button>
            <button class="btn btn-sm btn-dark" @click="resetCycle">
              <span class="fa fa-redo"></span>
              <span>reset</span>
            </button>
          </div>
        </div>
        <vue-cal
          class="vuecal--date-picker vuecal--rounded-theme vuecal--green-theme"
          xsmall
          :time="false"
          active-view="month"
          :disable-views="['years', 'year', 'week', 'day']"
          hide-view-selector
          :selectedDate="date"
          @cell-click="onDayClick"
          style="max-height:250px"
          :startWeekOnSunday="true"
          :hideWeekdays="[5]"
          :events="plans"
        >
          <template v-slot:arrow-prev>
            <i class="fa fa-chevron-circle-left text-success"></i>
          </template>
          <template v-slot:arrow-next>
            <i class="fa fa-chevron-circle-right text-success"></i>
          </template>
        </vue-cal>
      </div>
      <div class="col-lg-9">
        <div class="px-0 shadow pb-3">
          <router-view class="page-fade" :date="date"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
export default {
  created() {
    this.$store.dispatch('getNonFieldActivityPlans')
    .then(() => {

      this.$store.dispatch("customerGetAll").then(() => {
        this.$store.dispatch("getPlanner");
        this.$store.dispatch("getWorkplacePlanner");
      });
    })
  },
  components: {
    VueCal
  },
  data: () => ({
    date: new Date().format("YYYY-MM-DD")
  }),
  methods: {
    onDayClick(date) {
      this.date = new Date(date).format("YYYY-MM-DD");
    },
    selectCycle() {
      this.$store.dispatch('getPlanner', {force: true, cycle : this.activeCycle})
      .then(()=> {
        this.$store.dispatch('getWorkplacePlanner', {force: true, cycle: this.activeCycle})
      })
    },
    resetCycle() {
      this.$store.dispatch('getPlanner', true)
      .then(() => {
        this.$store.dispatch('getWorkplacePlanner', true)
      })
    }
  },
  computed: {
    submittedDays() {
      return this.$store.getters.submittedDays;
    },
    plans() {
      return this.$store.getters.allPlans;
    },
    cycles() {
      return this.$store.getters.repCycles;
    },
    activeCycle: {
      get() {
        return this.$store.getters.repActiveCycle;
      },
      set(cycle) {
        return this.$store.state.AppModule.activeCycle = cycle
      }
    },
  }
};
</script>

<style></style>
