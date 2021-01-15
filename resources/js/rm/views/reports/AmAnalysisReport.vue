<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span class="fa fa-chart-bar"></span>
      <span class="font-weight-bold">AM Report Analysis</span>
    </p>
    <div class="p-2">
      <div class="p-2 text-right">
        <router-link to="/reports" class="btn btn-sm btn-dark">
          <span class="fa fa-chevron-circle-left"></span>
          <span>Back</span>
        </router-link>
        <button type="button" class="btn btn-sm btn-primary" @click="loadingAnalysis">
          <span class="fa fa-chart-bar"></span>
          <span>Start loading</span>
        </button>
      </div>
      <div class="p-2">
        <div v-if="reports.length">
          <div class="p-2">
            <button class="btn btn-sm btn-success" type="button" @click="exportToExcel">
              <span class="fa fa-file-excel"></span>
              <span>Export</span>
            </button>
          </div>
          <table class="table table-sm small table-responsive" id="am_analysis">
            <thead class="bg-success text-light">
              <tr>
                <th>Business Unit</th>
                <th>Area Manager</th>
                <th>District Manager</th>
                <th>Rep</th>
                <th>Total Plans</th>
                <th>Total visits</th>
                <th>Planned Workplaces</th>
                <th>Covered Workplaces</th>
                <th>Working days</th>
                <th>Average / day</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report.user_id">
                <td>{{ $store.state.UserModule.user.name }}</td>
                <td>{{ getAreaManagerName(report.user_id) }}</td>
                <td>{{ getDistrictManagerName(report.user_id) }}</td>
                <td>{{ report.rep }}</td>
                <td>{{ report.total_planned }}</td>
                <td>{{ report.visits }}</td>
                <td>{{ report.planned_workplaces }}</td>
                <td>{{ report.covered_workplaces }}</td>
                <td>{{ report.working_days }}</td>
                <td>{{ report.avg ? parseInt(report.avg).toFixed(1)+' %' : '--------' }} </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="!loadingStarted" class="py-5 text-center text-primary">
          <p> Click start loading to download AM report analysis</p>
          <span class="fa fa-chart-bar fa-4x"></span>
        </div>
        <div v-else-if="fetched">
          <no-data-to-show />
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import NoDataToShow from '../../../components/NoDataToShow.vue'
import { ExportToExcel } from '../../../helpers/helpers'
import { httpCall } from '../../../helpers/http-service'
export default {
  components: { NoDataToShow },
  computed: {
    districtManagers() {
      return this.$store.getters.allDm
    },
    areaManagers() {
      return this.$store.getters.allAreaManagers
    }
  },
  data: () => ({
    reports: [],
    fetched: false,
    loadingStarted: false
  }),
  methods: {
    loadingAnalysis() {
      return httpCall.get('rm/v1/reports/analysis/am')
      .then(({data}) => {
        this.reports = data.data;
      }).catch(err => console.log(err))
    },
    exportToExcel() {
      ExportToExcel('#am_analysis', 'AM analysis report')
    },
    getDistrictManagerName(id) {
      let manager = "-----";
      this.districtManagers.map(dm => {
        let reps = JSON.parse(dm.user_relations).reps;
        if(reps.includes(id)) {
          manager = dm.name;
        }
      })
      return manager;
    },
    getAreaManagerName(id) {
      let manager = "-----";
      this.areaManagers.map(dm => {
        let reps = JSON.parse(dm.user_relations).reps;
        if(reps.includes(id)) {
          manager = dm.name;
        }
      })
      return manager;
    }
  }
}
</script>

<style>

</style>
