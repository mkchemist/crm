<template>
  <div>
    <activity-report :backLink="`/reports`" :users="users" :cycle="activeCycle" />
  </div>
</template>

<script>
import ActivityReport from '../../../components/ActivityReport.vue'
export default {
  components: { ActivityReport },
  computed: {
    users() {
      return this.$store.getters.managerReps;
    },
    activeCycle() {
      return this.$store.getters.activeCycle;
    }
  }
}
</script>

<style>

</style>
