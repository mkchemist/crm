<template>
  <div>
    <requests-report :users="reps" :manager="true" :ownerId="$store.state.user.id"/>
  </div>
</template>

<script>
import RequestsReport from '../../../components/RequestsReport.vue'
export default {
  components: { RequestsReport },
  computed: {
    reps() {
      return this.$store.getters.allReps;
    }
  }
}
</script>

<style>

</style>
