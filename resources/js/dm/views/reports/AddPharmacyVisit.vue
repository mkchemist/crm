<template>
  <div>
    <customer-visit-component :user="user" :users="reps" :visitType="`pharmacy`" :onSave="onSaveReport"/>
  </div>
</template>

<script>
import CustomerVisitComponent from "../../../components/CustomerVisitComponent.vue";
export default {
  components: {
    CustomerVisitComponent
  },
  computed: {
    reps() {
      return this.$store.getters.allReps
    },
    user() {
      return this.$store.getters.user
    }
  },
  methods: {
    onSaveReport() {
      this.$swal({
        title: 'Saved',
        icon:'success'
      });
      this.$store.dispatch('getAllPharmaciesReports', {force: true})
    }
  }
};
</script>

<style></style>
