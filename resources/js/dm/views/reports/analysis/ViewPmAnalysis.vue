<template>
  <div class="row mx-auto">
    <div class="col-lg-3">
      <data-filter
        :data="{
          plans: $store.getters.repPlans,
          reports: $store.getters.allRepPmReports
        }"
        :keys="{ rep: 'user_id', date: 'date' }"
        :on-update="handleFilterUpdate"
        :on-reset="handleFilterReset"
      />
      <div class="p-2 my-2 border rounded">
        <router-link to="/reports" class="btn btn-sm btn-dark btn-block">
          <span><i class="fa fa-chevron-circle-left"></i></span>
          <span>back</span>
        </router-link>
      </div>
    </div>
    <!-- end of side bar -->
    <!-- start of main section -->
    <div class="col-lg-9 px-0 shadow rounded pb-5">
      <p class="alert alert-success">
        <span><i class="fa fa-book-reader"></i></span>
        <span class="font-weight-bold">PM report analysis</span>
      </p>
      <div class="p-2">
        <div v-if="reports.length && plans.length">
          <div v-if="isLoading" class="text-center">
            <p class="spinner-grow"></p>
            <p>Processing data</p>
          </div>
          <div v-else class="p-2">
            <div class="p-2">
              <button class="btn btn-sm btn-success" @click="exportTable">
                <span><i class="fa fa-file-excel"></i></span>
                <span>Export</span>
              </button>
            </div>
            <table
              class="table table-bordered rounded table-responsive table-sm small"
              id="analysis-tbl"
            >
              <thead>
                <tr>
                  <th rowspan="2">Rep</th>
                  <th rowspan="2">Total Planned</th>
                  <th rowspan="2">Total Achieved</th>
                  <th rowspan="2">%</th>
                  <th rowspan="2">Planned days</th>
                  <th rowspan="2">Achieved days</th>
                  <th rowspan="2">Plan visit/day</th>
                  <th rowspan="2">Report visit/day</th>
                  <th rowspan="2">Coaching visits</th>
                  <th
                    :colspan="specialtyCollection.size"
                    class="bg-secondary text-light"
                  >
                    Plan Specialites
                  </th>
                  <th
                    :colspan="specialtyCollection.size"
                    class="bg-primary text-light"
                  >
                    Report Specialites
                  </th>
                  <th
                    :colspan="parameterCollection.size"
                    class="bg-secondary text-light"
                  >
                    Plan Parameters
                  </th>
                  <th
                    :colspan="parameterCollection.size"
                    class="bg-primary text-light"
                  >
                    Plan Parameters
                  </th>
                </tr>
                <tr>
                  <th
                    v-for="(item, index) in specialtyCollection"
                    :key="`plan_specialty_collection_${index}`"
                    class="bg-secondary text-light"
                  >
                    {{ item }}
                  </th>
                  <th
                    v-for="(item, index) in specialtyCollection"
                    :key="`report_specialty_collection_${index}`"
                    class="bg-primary text-light"
                  >
                    {{ item }}
                  </th>
                  <th
                    v-for="(item, index) in parameterCollection"
                    :key="`plan_parameter_collection_${index}`"
                    class="bg-secondary text-light"
                  >
                    {{ item }}
                  </th>
                  <th
                    v-for="(item, index) in parameterCollection"
                    :key="`report_parameter_collection_${index}`"
                    class="bg-primary text-light"
                  >
                    {{ item }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, rep) in kpiReport" :key="`rep_${rep}_kpi`">
                  <td>{{ rep }}</td>
                  <td>{{ data.plans.total }}</td>
                  <td>{{ data.reports.total }}</td>
                  <td>
                    {{
                      (data.reports.total / data.plans.total).toFixed(3) * 100
                    }}
                  </td>
                  <td>{{ Object.keys(data.plans.start).length }}</td>
                  <td>{{ Object.keys(data.reports.date).length }}</td>
                  <td>
                    {{
                      (
                        data.plans.total / Object.keys(data.plans.start).length
                      ).toFixed(2)
                    }}
                  </td>
                  <td>
                    {{
                      (
                        data.reports.total /
                        Object.keys(data.reports.date).length
                      ).toFixed(2)
                    }}
                  </td>
                  <td>{{ data.reports.coach.length }}</td>
                  <td
                    v-for="(item, index) in specialtyCollection"
                    :key="`plan_rep_specialty_collection_${index}`"
                  >
                    {{
                      data.plans.specialty[item]
                        ? data.plans.specialty[item].length
                        : 0
                    }}
                  </td>
                  <td
                    v-for="(item, index) in specialtyCollection"
                    :key="`report_rep_specialty_collection_${index}`"
                  >
                    {{
                      data.reports.specialty[item]
                        ? data.reports.specialty[item].length
                        : 0
                    }}
                  </td>
                  <td
                    v-for="(item, index) in parameterCollection"
                    :key="`plan_rep_parameter_collection_${index}`"
                  >
                    {{
                      data.plans.param[item] ? data.plans.param[item].length : 0
                    }}
                  </td>
                  <td
                    v-for="(item, index) in parameterCollection"
                    :key="`report_rep_parameter_collection_${index}`"
                  >
                    {{
                      data.reports.param[item]
                        ? data.reports.param[item].length
                        : 0
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="p-2">
            <button
              class="btn btn-sm btn-primary"
              @click="generatePerformanceChart"
            >
              <span v-if="!showPerformanceChart">Draw performance chart</span>
              <span v-else>Hide performance chart</span>
            </button>
          </div>
          <chart-view
            v-if="showPerformanceChart"
            :chart-data="chartData"
            :labels="dateCollection"
          />
        </div>
        <div v-else-if="isPlanFetched && isReportsFetched">
          <p class="text-center">No data to show</p>
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ExportToExcel,
  filterData,
  sortDates
} from "../../../../helpers/helpers";
import DataFilter from "../../../components/DataFilter";
import ChartView from "../../../../components/ChartView"
import { CHART_COLOR_LIST } from '../../../../helpers/constants';
export default {
  components: {
    DataFilter,
    ChartView
  },
  mounted() {
    this.$store.dispatch("getAllRepPmReports").finally(() => {
      this.$store.dispatch("getPlans").finally(() => {
        this.generateAnalysisReport();
      });
    });
  },
  data: () => ({
    isLoading: false,
    kpiReport: {},
    specialtyCollection: new Set(),
    parameterCollection: new Set(),
    dateCollection: [],
    customPlans: [],
    customReports: [],
    chartData: [],
    showPerformanceChart: false
  }),
  computed: {
    reports() {
      if (this.customReports.length) {
        return this.customReports;
      }
      return this.$store.getters.allRepPmReports;
    },
    plans() {
      if (this.customPlans.length) {
        return this.customPlans;
      }
      return this.$store.getters.repPlans;
    },
    isReportsFetched() {
      return this.$store.getters.isRepPmReportsFetched;
    },
    isPlanFetched() {
      return this.$store.getters.isPlanFetched;
    }
  },
  methods: {
    handleFilterUpdate(res) {
      res
        .then(data => {
          this.customReports = data.reports;
          this.customPlans = data.plans;
        })
        .finally(() => {
          this.generateAnalysisReport();
        });
    },
    handleFilterReset() {
      this.customReports = [];
      this.customPlans = [];
      this.generateAnalysisReport();
    },
    getDataByRep(data, key) {
      return filterData(data, key);
    },
    generateDataCollection() {
      this.plans.map(plan => {
        this.specialtyCollection.add(plan.specialty);
        this.parameterCollection.add(plan.param);
        if(!this.dateCollection.includes(plan.start)) {
          this.dateCollection.push(plan.start);
        }
      });
      this.reports.map(report => {
        this.specialtyCollection.add(report.specialty);
        this.parameterCollection.add(report.param);
        if(!this.dateCollection.includes(report.date)) {
          this.dateCollection.push(report.date);
        }
      });
      this.dateCollection = sortDates(this.dateCollection);
    },
    generateAnalysisReport() {
      this.isLoading = true;
      this.chartData = [];
      this.generateDataCollection();
      let getData = () =>
        new Promise((res, rej) => {
          let kpi = {};
          let plans = this.getDataByRep(this.plans, "user_name");
          let reports = this.getDataByRep(this.reports, "user_name");
          Object.keys(plans).forEach((rep,i) => {
            let processingData = () =>
              new Promise((resolve, reject) => {
                try {
                  let repPlans = filterData(plans[rep], [
                    "specialty",
                    "title",
                    "start",
                    "param"
                  ]);
                  repPlans["total"] = plans[rep].length;
                  let repReports = filterData(reports[rep], [
                    "specialty",
                    "customer",
                    "date",
                    "param"
                  ]);
                  repReports["coach"] = reports[rep].filter(
                    item => item.coach !== null
                  );
                  repReports["total"] = reports[rep].length;
                  resolve({ plans: repPlans, reports: repReports });
                } catch (e) {
                  reject(e);
                }
              });
            processingData()
              .then(data => {
                kpi[rep] = {};
                kpi[rep] = data;
                let repDailyPerformance = [];
                this.dateCollection.forEach(date=> {
                  let len = 0;
                  if(data.reports.date[date]) {
                    len = data.reports.date[date].length
                  }
                  repDailyPerformance.push(len)
                });
                let colors = CHART_COLOR_LIST;
                this.chartData.push({
                  label: rep,
                  data: repDailyPerformance,
                  borderColor: colors[i],
                  borderWidth:2,
                  backgroundColor: colors[i],
                  fill: false
                })
                res(kpi);
              })
              .catch(err => {
                rej(err);
              });
          });
        });
      getData()
        .then(data => (this.kpiReport = data))
        .finally(() => (this.isLoading = false))
        .catch(err => console.log(err));
    },
    exportTable() {
      ExportToExcel("#analysis-tbl", "rep-pm-analysis-" + new Date());
    },
    generatePerformanceChart() {
      if(this.showPerformanceChart) {
        this.showPerformanceChart = false;
      } else {
        this.showPerformanceChart = true;
      }
    }
  }
};
</script>

<style></style>
