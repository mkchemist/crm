<template>
  <div>
    <coach-follow-up-component :reps="reps" :districtManagers="districtManagers" backUrl="/coach"/>
  </div>
</template>

<script>
import CoachFollowUpComponent from '../../../../components/CoachFollowUpComponent.vue'
import { sortBy } from '../../../../helpers/helpers';
export default {
  components: { CoachFollowUpComponent },
  computed: {
    reps() {
      return sortBy(this.$store.getters.coachModuleReps, 'name');
    },
    districtManagers() {
      let coaches = this.$store.getters.coachModuleDistrictManagers;
      return sortBy(this.$store.getters.coachModuleDistrictManagers, 'name');
    }
  }
}
</script>

<style>

</style>
