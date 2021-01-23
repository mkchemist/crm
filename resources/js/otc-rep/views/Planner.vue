<template>
  <div class="p-2 row mx-auto bg-light pb-5">
    <div class="col-lg-3 shadow p-2 rounded bg-white">
      <cycle-selection :onSelect="onSelectCycle" :onReset="onResetCycle" />
      <vue-cal
        :disableViews="['year','years','day','week']"
        activeView="month"
        :small="true"
        class="vuecal--rounded-theme vuecal--green-theme vuecal--date-picker bg-white"
        @cell-click="onDayClick"
        :selected-date="date"
        style="max-height:300px"
        :startWeekOnSunday="true"
        :hide-weekdays="[5]"

        :events="$store.getters.allPlans"
      />
    </div>
    <div class="col-lg-9 bg-white">
      <router-view :date="date"></router-view>
    </div>
  </div>
</template>

<script>

import VueCal from 'vue-cal'
import "vue-cal/dist/vuecal.css"
import CycleSelection from '../../components/CycleSelection.vue'
export default {
  mounted() {
    this.$store.dispatch('fetchPlans');
  },
  components: {
    VueCal,
    CycleSelection
  },
  computed: {
    activeCycle() {
      return this.$store.getters.activeCycle
    }
  },
  data : () => ({
    date: new Date().format()
  }),
  methods: {
    onDayClick(e) {
      this.date = new Date(e).format()
    },
    onSelectCycle() {

    },
    onResetCycle() {
      this.$store.commit('resetActiveCycle')
    }
  }
}
</script>

<style>

</style>
