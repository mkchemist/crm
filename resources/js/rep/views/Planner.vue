<template>
  <div>
    <div class="row mx-auto">
      <div class="col-lg-3" id="side_datepicker">
        <cycle-selection :onSelect="selectCycle" :onReset="resetCycle" />
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
          :min-date="activeCycle.start"
        :hide-weekdays="[5]"

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
import CycleSelection from '../../components/CycleSelection.vue';
export default {
  mounted() {
    this.$store.dispatch('collectPlans', {force: true})
    .then(() => {
      this.$store.dispatch('customerGetAll')
    })
  },
  components: {
    VueCal,
    CycleSelection
  },
  data: () => ({
    date: new Date().format("YYYY-MM-DD")
  }),
  methods: {
    onDayClick(date) {
      this.date = new Date(date).format("YYYY-MM-DD");
    },
    selectCycle() {
      let payload = {
        force: true,
        start: this.activeCycle.start,
        end: this.activeCycle.end
      }
      this.$store.dispatch('collectPlans', payload)
    },
    resetCycle() {
      this.$store.commit('resetActiveCycle');
      this.$store.dispatch('collectPlans', {force: true})
    },
  },
  computed: {
    plans() {
      return this.$store.getters.allPlans;
    },
    cycles() {
      return this.$store.getters.cycles;
    },
    activeCycle() {
        return this.$store.getters.activeCycle
    }

  }
};
</script>

<style></style>
