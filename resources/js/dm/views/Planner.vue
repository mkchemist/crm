<template>
  <div>
    <div class="row mx-auto bg-light p-2">
      <div class="col-lg-3">
        <cycle-selection :onSelect="onSelectCycle" :onReset="onResetCycle" />
        <div class="border p-2 rounded shadow-sm bg-white">
          <div class="form-group">
            <label for="rep" class="small text-muted p-1">Planner of :</label>
            <select
              name="rep"
              id="rep"
              class="form-control form-control-sm"
              v-model="plannerUser"
              @change="getUserPlanner"
            >
              <option :value="$store.state.user.id">{{
                $store.state.user.name
              }}</option>
              <option :value="rep.id" v-for="rep in reps" :key="rep.id">{{
                rep.name
              }}</option>
            </select>
          </div>
        </div>
        <div class="my-2 bg-white date-picker">
          <vue-cal
            class="vuecal--date-picker vuecal--green-theme rounded shadow-sm"
            xsmall
            hide-view-selector
            active-view="month"
            :disable-views="['years', 'year', 'week', 'day']"
            :selectDate="date"
            @cell-click="d => (date = new Date(d).format('YYYY-MM-DD'))"
            :startWeekOnSunday="true"
            :hide-weekdays="[5]"
          />
        </div>
      </div>
      <div class="col-lg-9">
        <router-view class="page-fade" :date="date"></router-view>
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
    this.$store.dispatch("fetchAllPlans", { force: true });
    this.setPlannerUser(this.$store.state.user.id);
  },
  components: {
    VueCal,
    CycleSelection
  },
  computed: {
    reps() {
      return this.$store.getters.allReps;
    },
    activeCycle() {
      return this.$store.getters.activeCycle
    }
  },
  data: () => ({
    date: new Date().format("YYYY-MM-DD"),
    plannerUser: null
  }),
  methods: {
    getUserPlanner() {
      this.$store.commit("setCurrentUserId", this.plannerUser);
    },
    setPlannerUser(id) {
      this.plannerUser = id;
      this.getUserPlanner();
    },
    onSelectCycle() {
      this.$store.dispatch("fetchAllPlans", { force: true, cycle: this.activeCycle });
    },
    onResetCycle() {
      this.$store.commit('resetActiveCycle');
      this.$store.dispatch("fetchAllPlans", { force: true, cycle: this.activeCycle });
    }
  }
};
</script>

<style></style>
