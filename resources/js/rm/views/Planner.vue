<template>
  <div>
    <div class="row mx-auto p-2">
      <div class="col-lg-3 p-2">
        <div class="px-2 py-3 my-2 shadow rounded">
          <label for="" class="text-muted">Planner User</label>
          <select v-model="rep" class="form-control form-control-sm">
            <option :value="null">Select User</option>
            <option v-for="rep in reps" :key="rep.id"  :value="rep.id">{{ rep.name }} ({{ rep.role }})</option>
          </select>
        </div>
        <cycle-selection :onReset="onCycleReset" :onSelect="onCycleSelect" />
        <vue-cal
          :disableViews="['year', 'years', 'day', 'week']"
          activeView="month"
          :small="true"
          class="vuecal--rounded-theme vuecal--green-theme vuecal--date-picker bg-white"
          @cell-click="onDayClick"
          :selected-date="date"
          style="max-height:300px"
          :startWeekOnSunday="true"
          :hide-weekdays="[5]"
          :min-date="activeCycle.start"
        />
      </div>
      <div class="col-lg-9">
        <router-view :date="date" :data="plans"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import CycleSelection from "../../components/CycleSelection.vue";
import { sortBy } from '../../helpers/helpers';
export default {
  mounted() {
    this.$store.dispatch("fetchPlansCollection")
  },
  components: {
    VueCal,
    CycleSelection
  },
  computed: {
    activeCycle() {
      return this.$store.getters.activeCycle
    },
    plans() {
      if(this.rep === null) {
        return [];
      }
      try{
        let plans = this.$store.getters.allPlans
        plans = plans.filter(plan => plan.user_id === this.rep);
        console.log(plans.filter(plan => plan.type=== 'AM'))
        return plans
      }catch(err) {
        console.log(err)
        return []
      }
    },
    reps() {
      let reps = sortBy(this.$store.getters.allReps,'name');
      let dm = sortBy(this.$store.getters.allDm,'name');
      let am = sortBy(this.$store.getters.allAreaManagers, 'name');
      let user = this.$store.state.UserModule.user;
      return [
        ...reps,
        ...dm,
        ...am,
        user,
      ]
    }
  },
  data: () => ({
    date: new Date().format(),
    rep: null
  }),
  methods: {
    onDayClick(e) {
      console.log('clicked')
      this.date = new Date(e).format();
    },
    onCycleSelect() {},
    onCycleReset() {}
  }
};
</script>

<style></style>
