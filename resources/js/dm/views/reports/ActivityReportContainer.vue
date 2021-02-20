<template>
  <div>
    <activity-report :users="reps" :cycle="activeCycle" />
  </div>
</template>

<script>
import ActivityReport from '../../../components/ActivityReport.vue'
export default {
  components: { ActivityReport },
  computed: {
    reps() {
      return [this.$store.getters.user,...this.$store.getters.allReps];
    },
    activeCycle() {
      return this.$store.getters.activeCycle;
    }
  }
}
</script>

<style>

</style>
