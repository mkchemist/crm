<template>
  <div>
      <div class="row mx-auto">
        <div class="col-lg-3">
          <div class="" id="today_plan_section">
            <today-plan />
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
export default {
  components: {
    TodayPlan
  },
}
</script>

<style>

</style>
