<template>
  <div>
    <requests-report :users="[]" :manager="false" :ownerId="$store.state.AppModule.user.id" />
  </div>
</template>

<script>
import RequestsReport from "../../../components/RequestsReport.vue"

export default {
  components: { RequestsReport },

}
</script>

<style>

</style>
