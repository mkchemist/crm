<template>
  <div>
    <div class="row mx-auto">
      <div class="col-lg-3 p-2">
        <today-plan />
      </div>
      <div class="col-lg-6 p-2">
        <broadcasting-messages />
      </div>
    </div>
  </div>
</template>

<script>
import BroadcastingMessages from '../../components/BroadcastingMessages.vue'
import TodayPlan from '../../otc-rep/components/TodayPlan.vue'
export default {
  components: { TodayPlan, BroadcastingMessages },

}
</script>

<style>

</style>
