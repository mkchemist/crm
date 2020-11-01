<template>
  <div>
      <div class="row mx-auto">
        <div class="col-lg-3">
          <div class="" id="today_plan_section">
            <today-plan />
          </div>
        </div>
        <div class="col-lg-9">
          <div class="row mx-auto">
            <div class="col-lg">

            </div>
            <div class="col-lg-auto">
              <p class="lead text-center text-muted">Quick Analysis</p>
              <hr>
              <div class="border rounded p-2">
                <knob-card :val="reportPercent" :max="100">
                  <p class="text-muted font-italic small">Plan achievment %</p>
                </knob-card>
              </div>
              <div class="border rounded p-2 my-1">
                <knob-card :val="planPercent" :max="planPercent > 100 ? 200 : 100">
                  <p class="text-muted font-italic small">Plan versus Frequency %</p>
                </knob-card>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
/**
 * //TODO add notification module
 * //TODO add requests module that show eveny request state
 *
 */
import TodayPlan from "../components/TodayPlan";
import KnobCard from "../components/KnobCard"
export default {
  components: {
    TodayPlan,
    KnobCard
  },
  created() {
    this.$store.dispatch("getPlanner").then(() => {
      this.$store.dispatch("reportGetAll");
    }).then(() => {
      this.$store.dispatch("customerGetAll")
    });
  },
  computed: {
    reportPercent() {
      let reports = this.$store.getters.pmVisits;
      let plans = this.$store.getters.plans;
      let percent = (reports.length / plans.length) * 100;
      return parseInt(percent.toFixed(1));
    },
    planPercent() {
      let freq = 0;
      this.$store.getters.all.map(customer => freq += customer.current_freq)
      let plans = this.$store.getters.plans;
      return parseInt(((plans.length/freq)*100).toFixed(1));
    }
  }
}
</script>

<style>

</style>
