<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span class="fa fa-store-alt"></span>
      <span class="font-weight-bold">View Pharmacy Plans</span>
    </p>
    <div class="p-2">
      <div class="p-2" v-if="plans.length">
        <data-table-component :cols="cols" :data="plans"/>
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import DataTableComponent from '../../components/DataTableComponent.vue'
export default {
  mounted() {
    this.$store.dispatch('getUserLocations')
  },
  components: {DataTableComponent},
  computed: {
    plans() {
      if(!this.locations.length) {
        return [];
      }
      let plans = this.$attrs.data.filter(item => item.class==="pharmacy-plan")
      plans.forEach(plan => {
        let brick = this.locations.filter(item => item.brick === plan.brick)[0];
        plan['territory'] = brick.territory;
        plan['area'] = brick.area;
        plan['district'] = brick.district;
        plan.submitted = plan.submitted === 1 ? "Yes" : 'No';
        plan.approved = plan.approved === 1 ? "Yes" : "No";
      })
      return plans
    },
    locations() {
      return this.$store.getters.userLocations
    }
  },
  data: () => ({
    cols: [
      {
        title: 'Rep',
        name: 'rep'
      },
      {
        title: 'Date',
        name: 'start'
      },
      {
        title: 'Brick',
        name: 'brick'
      },
      {
        title: 'Area',
        name: 'area'
      },
      {
        title: 'District',
        name: 'district'
      },
      {
        title: 'Territory',
        name: 'territory'
      },
      {
        title: "Submitted",
        name: 'submitted'
      },
      {
        title: "Approved",
        name: "approved"
      }
    ]
  })
}
</script>

<style>

</style>
