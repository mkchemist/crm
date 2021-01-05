<template>
  <div>
    <requests-report :users="[]" :manager="true" :ownerId="null" />
  </div>
</template>

<script>
import RequestsReport from '../../../components/RequestsReport.vue'
export default {
  components: {
    RequestsReport

  }
}
</script>

<style>

</style>
