<template>
  <div class="px-0">
    <customer-visit-component :users="reps" :user="user" :onSave="onSave" :editMode="true" />
  </div>
</template>

<script>
import CustomerVisitComponent from '../../../../components/CustomerVisitComponent.vue'
export default {
  components: { CustomerVisitComponent },
  computed: {
    reps() {
      return this.$store.getters.allReps;
    },
    user() {
      return this.$store.state.UserModule.user;
    }
  },
  methods: {
    onSave(data) {
      console.log(data)
    }
  }
}
</script>

<style>

</style>
