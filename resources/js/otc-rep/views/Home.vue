<template>
  <div class="p-2">
    <div class="row mx-auto">
      <div class="col-lg-3">
        <today-plan />
      </div>
      <div class="col-lg-6">
        <broadcasting-messages />
      </div>
      <div class="col-lg-3"></div>
    </div>
  </div>
</template>

<script>
import BroadcastingMessages from '../../components/BroadcastingMessages.vue'
import TodayPlan from '../components/TodayPlan.vue'
export default {
  components: { BroadcastingMessages, TodayPlan },

}
</script>

<style>

</style>
