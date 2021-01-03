<template>
  <div>
    <div class="p-2">
       <div class="p-2 text-right">
        <button class="btn btn-sm btn-primary" @click="startLoading">
          <span class="fa fa-download"></span>
          <span>Start loading</span>
        </button>
      </div>
      <div v-if="plans.length">
        <table-component :data="plans" :heads="heads" :headClass="`bg-success text-light`">
        </table-component>
      </div>
       <div v-else-if="!startRequest" class="d-flex align-items-center justify-content-lg-center" style="height:300px">
        <div class="text-center">
          <p>
            <span class="fa fa-download fa-4x text-primary"></span>
          </p>
          <p class="text-primary font-weight-bold">
            <span>Click start loading to load all plans</span>
          </p>
        </div>
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
    startRequest: false,
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
  }),
  methods: {
    startLoading() {
      this.startRequest = true;
      this.$store.dispatch('fetchAllPlans')
      .then(() => {

      })
    }
  }
}
</script>

<style>

</style>
