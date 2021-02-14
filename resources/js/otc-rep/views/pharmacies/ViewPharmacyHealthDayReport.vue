<template>
  <div>
    <div v-if="$attrs.pharmacy.reports_details.length">

    </div>
    <div v-else>
      <no-data-to-show />
    </div>
  </div>
</template>

<script>
import NoDataToShow from '../../../components/NoDataToShow.vue'
export default {
  components: { NoDataToShow },
  computed:{
    reports() {

    }
  },
  data: () => ({
    cols: [

    ]
  })
}
</script>

<style>

</style>
