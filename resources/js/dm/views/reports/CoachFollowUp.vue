<template>
  <div>
    <coach-follow-up-component :reps="reps" />
  </div>
</template>

<script>
import CoachFollowUpComponent from '../../../components/CoachFollowUpComponent.vue';
export default {
  components: {
    CoachFollowUpComponent

  },
  computed: {
    reps() {
      return this.$store.getters.dmReps;
    }
  }
}
</script>

<style>

</style>
