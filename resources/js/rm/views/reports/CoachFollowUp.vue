<template>
  <coach-follow-up-component :reps="reps" :districtManagers="districtManagers" />
</template>

<script>
import CoachFollowUpComponent from '../../../components/CoachFollowUpComponent.vue';
import CoachReportComponent from "../../../components/CoachReportComponent.vue";
import NoDataToShow from "../../../components/NoDataToShow.vue";
import { ExportToExcel } from '../../../helpers/helpers';
import { httpCall } from "../../../helpers/http-service";
export default {
  components: { NoDataToShow, CoachReportComponent, CoachFollowUpComponent },

  computed: {
    /* all reps */
    reps() {
      if(this.coach) {
        let reps = JSON.parse(this.coach.user_relations).reps;
        return this.$store.getters.allReps.filter(rep => reps.includes(rep.id));
      }
      return this.$store.getters.allReps;
    },
    /* all district managers */
    districtManagers() {
      return this.$store.getters.allDm;
    }
  },

};
</script>

<style></style>
