<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">Add PM Report</span>
    </p>
    <div>
      <customer-visit-component :users="reps" :user="user" :onSave="onSaveReport" />
    </div>
  </div>
</template>

<script>
import CustomerVisitComponent from "../../../components/CustomerVisitComponent.vue"
export default {
  components: { CustomerVisitComponent },
  computed: {
    reps() {
      return this.$store.getters.dmReps
    },
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    onSaveReport() {
      this.$store.dispatch('getAllRepPmReports', {force: true})
      this.$swal({
        title: 'Success',
        text : 'Report added successfully',
        icon: 'success'
      });
      this.$router.push('/reports/view/pm')
    }
  }
}
</script>

<style>

</style>
