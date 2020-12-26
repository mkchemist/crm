<template>
  <div>
    <activity-report :users="reps" />
  </div>
</template>

<script>
import ActivityReport from '../../../components/ActivityReport.vue'
export default {
  components: { ActivityReport },
  computed: {
    reps() {
      return [this.$store.getters.user,...this.$store.getters.allReps];
    }
  }
}
</script>

<style>

</style>
