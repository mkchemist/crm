<template>
  <div>
    <div class="p-2">
      <div v-if="plans.length">
        <table-component :data="plans" :heads="heads" :headClass="`bg-success text-light`">

        </table-component>
      </div>
      <div class="" v-else-if="isPlanFetched">
        <no-data-to-show :title="`No plans`"/>
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import NoDataToShow from '../../../components/NoDataToShow.vue'
import TableComponent from '../../../components/TableComponent.vue'
export default {
  components:{TableComponent, NoDataToShow},
  computed: {
    plans() {
      return this.$store.getters.pmPlans
    },
    isPlanFetched() {
      return this.$store.getters.isPlanFetched
    }
  },
  data: () => ({
    heads: [
      {
        title: 'Date',
        name: 'plan_date'
      },
      {
        title: 'Rep',
        name: 'user.name'
      },
      {
        title: 'Customer',
        name: 'customer.name'
      },
      {
        title: 'Submitted',
        name: 'submitted'
      },
      {
        title: 'Address',
        name: 'customer.address'
      },
      {
        title: 'Brick',
        name: 'customer.brick'
      },
      {
        title: 'Area',
        name: 'customer.area'
      },
      {
        title: 'District',
        name: 'customer.district'
      },
      {
        title: 'Territory',
        name: 'customer.territory'
      },
      {
        title : 'Region',
        name: 'customer.region'
      },

    ]
  })
}
</script>

<style>

</style>
