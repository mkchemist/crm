<template>
  <div>
    <activity-report :users="[]" :cycle="activeCycle"/>
  </div>
</template>

<script>
import ActivityReport from '../../../components/ActivityReport.vue'
export default {
  components: { ActivityReport },
  computed: {
    activeCycle() {
      return this.$store.getters.activeCycle;
    }
  }
}
</script>

<style>

</style>
