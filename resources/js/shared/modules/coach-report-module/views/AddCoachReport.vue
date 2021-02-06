<template>
  <div>
    <customer-visit-component
      :users="users"
      :visitType="`coaching`"
      :user="currentUser"
      :backUrl="`/coach`"
      :onSave="onSaveReport"
    />
  </div>
</template>

<script>
import CustomerVisitComponent from "../../../../components/CustomerVisitComponent.vue";
export default {
  components: {
    CustomerVisitComponent
  },
  computed: {
    users() {
      return this.$store.getters.coachModuleReps;
    },
    currentUser() {
      return this.$store.state.CoachReportModule.moduleUser;
    }
  },
  methods: {
    onSaveReport() {
      this.$store.dispatch("fetchCoachReportsModuleReports", {force: true});
      this.$swal({
        title: 'Report Saved',
        icon: 'success'
      });
    }
  }
};
</script>

<style></style>
