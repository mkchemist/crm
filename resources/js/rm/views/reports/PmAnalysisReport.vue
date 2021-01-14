<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span class="fa fa-chart-bar"></span>
      <span class="font-weight-bold">PM Report Analysis</span>
    </p>
    <div class="p-2">
      <div class="p-2 text-right">
        <router-link to="/reports" class="btn btn-sm btn-dark">
          <span class="fa fa-chevron-circle-left"></span>
          <span>Back</span>
        </router-link>
        <button class="btn btn-sm btn-primary" @click="startAnalysis">
          <span class="fa fa-chart-bar"></span>
          <span>Start analysis</span>
        </button>
      </div>
      <div v-if="Object.keys(analysisReport).length">
        <div class="p-2">
          <button type="button" class="btn btn-sm btn-success" @click="exportToExcel">
            <span class="fa fa-file-excel"></span>
            <span>Export</span>
          </button>
        </div>
        <table class="table table-sm small table-striped table-responsive" id="pm_analysis">
          <thead>
            <tr>
              <th>Regional Manager</th>
              <th>Area Manager</th>
              <th>District Manager</th>
              <th>Rep Name</th>
              <th>Total Planned</th>
              <th>Total Visits</th>
              <th>Covered Customers</th>
              <th>Working Days</th>
              <th>Achievement %</th>
              <th>Average per day</th>
              <th class="bg-danger text-light">Uncovered</th>
              <th class="bg-warning text-dark">Missed</th>
              <th class="bg-primary text-light">Over</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rep in Object.keys(analysisReport)" :key="rep.user_id">
              <td>{{ analysisReport[rep].regional_manager }}</td>
              <td>{{ analysisReport[rep].area_manager }}</td>
              <td>{{ analysisReport[rep].district_manager }}</td>
              <td>{{ rep }}</td>
              <td>{{ analysisReport[rep].total_planned }}</td>
              <td>{{ analysisReport[rep].total_visited }}</td>
              <td>{{ analysisReport[rep].covered_customers }}</td>
              <td>{{ analysisReport[rep].working_days }}</td>
              <td>{{ ((analysisReport[rep].total_visited/analysisReport[rep].total_planned)*100).toFixed(2) }}  </td>
              <td>{{ analysisReport[rep].report_average_day }}</td>
              <td class="bg-danger text-light">{{ analysisReport[rep].uncovered.length }}</td>
              <td class="bg-warning text-dark">{{ analysisReport[rep].missed.length }}</td>
              <td class="bg-primary text-light">{{ analysisReport[rep].over.length }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="!startLoading" class="text-center text-primary py-5">
        <p>Click start analysis to loading data</p>
        <span class="fa fa-chart-bar fa-4x"></span>
      </div>
      <div v-else-if="fetched">
        <no-data-to-show />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import NoDataToShow from "../../../components/NoDataToShow.vue";
import { ExportToExcel } from '../../../helpers/helpers';
import { httpCall } from "../../../helpers/http-service";
export default {
  components: {
    NoDataToShow
  },
  mounted() {

  },
  computed: {
    districtManager() {
      return this.$store.getters.allDm;
    },
    areaManagers() {
      return this.$store.getters.allAreaManagers;
    }
  },
  data: () => ({
    analysisReport: {},
    metaData: {
      missed: [],
      uncovered: [],
      over: []
    },
    fetched: false,
    startLoading: false
  }),
  methods: {
    startAnalysis() {
      this.startLoading = true;
      this.getMissedCustomers()
    .finally(() => {
      this.getAnalysisData();
    })
    },
    getMissedCustomers() {
      return httpCall.get('rm/v1/reports/missed-customers', {user: null})
      .then(({data}) => {
        data.data.map(item => {
          if(item.difference > 0 && item.difference === item.count_of_plans) {
            this.metaData.uncovered.push(item);
          } else if(item.difference > 0 && item.difference !== item.count_of_plans) {
            this.metaData.missed.push(item)
          } else {
            this.metaData.over.push(item)
          }
        })

      }).catch(err => console.log(err))
    },
    /**
     * fetching analysis data
     *
     *
     *
     */
    getAnalysisData() {
      this.analysisReport = {};
      this.fetched = false;
      httpCall
        .get("rm/v1/reports/analysis/pm")
        .then(({ data }) => {
          this.analysisReport = this.processingAnalysisReport(
            data.plans,
            data.reports
          );
          this.fetched = true;
        })
        .catch(err => console.log(err));
    },
    /**
     * collecting and organizing analysis data
     * to generate analysis report
     *
     * @param {array} $plans [rep plans]
     * @param {array} $reports [rep reports]
     * @return {object}
     */
    processingAnalysisReport(plans, reports) {
      let analysisReport = {};
      plans.map(plan => {
        let rep = plan.rep;
        if (!analysisReport[rep]) {
          analysisReport[rep] = {};
        }
        let repData = analysisReport[rep];
        repData["district_manager"] = this.getDistrictManagerName(plan.user_id);
        repData["area_manager"] = this.getAreaManagerName(plan.user_id);
        repData["regional_manager"] = this.$store.state.UserModule.user.name;
        repData["user_id"] = plan.user_id;
        repData["covered_customers"] = plan.distinct_customer;
        repData["working_days"] = plan.days;
        repData["total_planned"] = plan.total;
        repData["plan_average_day"] = plan.avg;
      });
      reports.map(report => {
        let rep = report.rep;
        if (!analysisReport[rep]) {
          analysisReport[rep] = {};
        }
        let repData = analysisReport[rep];
        repData["working_days"] = report.days;
        repData["total_visited"] = report.total;
        repData["covered_customers"] = report.distinct_customer;
        repData["report_average_day"] = report.avg;
        repData["coach_visits"] = report.coach_visits;
        repData['missed'] = this.metaData.missed.filter(item => item.user_id === report.user_id);
        repData['uncovered'] = this.metaData.uncovered.filter(item => item.user_id === report.user_id);
        repData['over'] = this.metaData.over.filter(item => item.user_id === report.user_id);
      });

      return analysisReport;
    },
    /**
     * get name of district manager for
     * the given rep
     *
     * @param {int} id [rep id]
     * @return {string}
     */
    getDistrictManagerName(id) {
      let manager = "------";
      this.districtManager.map(user => {
        let reps = JSON.parse(user.user_relations).reps;
        if (reps.includes(id)) {
          manager = user.name;
        }
      });
      return manager;
    },
    getAreaManagerName(id) {
      let manager = "------";
      this.areaManagers.map(user => {
        let reps = JSON.parse(user.user_relations).reps;
        if (reps.includes(id)) {
          manager = user.name;
        }
      });
      return manager;
    },
    exportToExcel() {
      ExportToExcel('#pm_analysis', 'PM Analysis Report');
    }
  }
};
</script>

<style></style>
