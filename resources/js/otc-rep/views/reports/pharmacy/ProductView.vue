<template>
  <div class="px-0">
    <p class="alert alert-success">
      <span class="fa fa-gift"></span>
      <span class="font-weight-bold">Product View</span>
    </p>
    <div class="p-2">
      <div class="p-2" v-if="reports.length">
        <table-component
          :heads="heads"
          :data="reports"
          :unselectable="true"
          :headClass="`bg-success text-light`"
        ></table-component>
      </div>
      <div v-else-if="isFetched">
        <no-data-to-show />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    reports() {
      return this.$store.getters.pharmacyReports
    },
    isFetched() {
      return this.$store.getters.pharmacyReportsFetched;
    }
  },
  data: () => ({
    heads: [
      {
        title: 'Date',
        name: 'date'
      },
      {
        title: 'Pharmacy',
        name: 'pharmacy'
      },
      {
        title: 'Type',
        name: 'type'
      },
      {
        title: 'Product',
        name:' product'
      },
      {
        title: 'Rate',
        name:'rate'
      },
      {
        title: 'Stock',
        name: 'stock'
      },
      {
        title: 'Order',
        name: 'order'
      },
      {
        title: 'Distributor',
        name: 'distributor'
      },
      {
        title: 'Competitor 1',
        name: 'competitor1'
      },
      {
        title: 'Competitor 1 Rate',
        name: 'competitor1_rate'
      },
      {
        title: 'Competitor 1 Stock',
        name: "competitor1_stock"
      },
      {
        title: 'Competitor 2',
        name: 'competitor2'
      },
      {
        title: 'Competitor 2 Rate',
        name: 'competitor2_rate'
      },
      {
        title: 'Competitor 2 Stock',
        name: "competitor2_stock"
      },
      {
        title: 'Competitor 3',
        name: 'competitor3'
      },
      {
        title: 'Competitor 3 Rate',
        name: 'competitor3_rate'
      },
      {
        title: 'Competitor 3 Stock',
        name: "competitor3_stock"
      },
      {
        title: 'Feedback',
        name: 'feedback'
      }
    ]
  })
}
</script>

<style>

</style>
