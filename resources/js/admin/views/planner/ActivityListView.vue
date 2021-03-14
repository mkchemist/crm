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
      return this.$store.getters.amPlans
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
        title: 'Workplace',
        name: 'workplace.name'
      },
      {
        title: 'Submitted',
        name: 'submitted'
      },
      {
        title: 'Address',
        name: 'workplace.address'
      },
      {
        title: 'Brick',
        name: 'workplace.brick'
      },
      {
        title: 'Area',
        name: 'workplace.area'
      },
      {
        title: 'District',
        name: 'workplace.district'
      },
      {
        title: 'Territory',
        name: 'workplace.territory'
      },
      {
        title : 'Region',
        name: 'workplace.region'
      },

    ]
  })
}
</script>

<style>

</style>
