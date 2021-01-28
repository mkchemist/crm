<template>
  <div class="p-2 row mx-auto bg-light pb-5">
    <div class="col-lg-3 shadow p-2 rounded bg-white" id="date_picker">
      <user-filter-box :data="$store.getters.allPlans" :users="reps" :onReset="onReset"  :onFilter="onFilter"  />
     <!--  <cycle-selection :onSelect="onSelectCycle" :onReset="onResetCycle" /> -->
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
        :min-date="activeCycle.start"
        :events="plans"
      />
    </div>
    <div class="col-lg-9 bg-white">
      <router-view :date="date" :user="user" :data="plans"></router-view>
    </div>
  </div>
</template>

<script>

import VueCal from 'vue-cal'
import "vue-cal/dist/vuecal.css"
import CycleSelection from '../../components/CycleSelection.vue'
import UserFilterBox from '../../components/UserFilterBox.vue'
import { asyncDataFlow } from '../../helpers/http-service'
export default {
  mounted() {
    this.$store.dispatch('fetchPlans');
  },
  components: {
    VueCal,
    CycleSelection,
    UserFilterBox
  },
  computed: {
    activeCycle() {
      return this.$store.getters.activeCycle
    },
    reps() {
      return this.$store.getters.managerReps
    },
    plans() {
      if(this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$store.getters.allPlans
    }
  },
  data : () => ({
    date: new Date().format(),
    shouldRenderFilter: false,
    filteredList: [],
    user: null
  }),
  methods: {
    onDayClick(e) {
      this.date = new Date(e).format()
    },
    /* onSelectCycle() {
     let {start, end} = this.activeCycle;
    this.$store.dispatch('fetchPlans', {force: true, start, end});
    },
    onResetCycle() {
      this.$store.commit('resetActiveCycle')
       let {start, end} = this.activeCycle;
    this.$store.dispatch('fetchPlans', {force: true, start, end});
    }, */
    onFilter(data, user) {
      this.user =user;
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(data, data => this.filteredList = data);
    },
    onReset() {
      this.filteredList = [];
      this.user =null;
      asyncDataFlow(this.$store.getters.allPlans, data => this.filteredList = data);
    }
  }
}
</script>

<style>

</style>
