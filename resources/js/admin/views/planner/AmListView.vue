<template>
  <div>
    <div class="p-2">
       <div class="p-2 text-right">
        <button class="btn btn-sm skin-btn" @click="startLoading">
          <span class="fa fa-download"></span>
          <span>Start loading</span>
        </button>
      </div>
      <div v-if="plans.length">
        <table-component :data="plans" :heads="heads" :headClass="`skin-table`">
           <template v-slot:head:before>
            <th>Business Unit Manager</th>
            <th>Area Manager</th>
            <th>District Manager</th>
          </template>
          <template v-slot:body:before="{ item }">
            <td>{{ getRepRegionalManager(item.user_id) }}</td>
            <td>{{ getRepAreaManager(item.user_id) }}</td>
            <td>{{ getRepManager(item.user_id) }}</td>
          </template>
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
    },
    dms() {
      return this.$store.getters.dms
    },
    rms() {
      return this.$store.getters.rms
    },
    ams(){
      return this.$store.getters.ams
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
    },
    getRepManager(id) {
      let manager ="-------";
      this.dms.map(user => {
        let reps =user.relations.reps;
        if(reps.includes(id)) {
          manager = user.name;
        }
      })
      return manager;
    },
    getRepAreaManager(id) {
      let manager ="-------";
      this.ams.map(user => {
        let reps =user.relations.reps;
        if(reps.includes(id)) {
          manager = user.name;
        }
      })
      return manager;
    },
    getRepRegionalManager(id) {
      let manager ="-------";
      this.rms.map(user => {
        let reps =user.relations.reps;
        if(reps.includes(id)) {
          manager = user.name;
        }
      })
      return manager;
    }
  }
}
</script>

<style>

</style>
