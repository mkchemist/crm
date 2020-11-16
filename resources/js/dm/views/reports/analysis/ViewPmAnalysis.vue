<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-book-reader"></i></span>
      <span class="font-weight-bold">View Pm report analysis </span>
    </p>
    <div class="p-2">
      <div class="p-2" v-if="reports.length">
        <div
          v-if="isProcessing"
          class="d-flex flex-column justify-content-center align-items-center"
          style="min-height:250px"
        >
          <div class="spinner-grow"></div>
          <span class="lead">Processing data</span>
        </div>
        <div v-else class="p-2">
          <div class="p-2">
            <button class="btn btn-sm btn-success" @click="exportToExcel">
              <span><i class="fa fa-file-excel"></i></span>
              <span>Export</span>
            </button>
          </div>
          <table
            class="table table-sm small table-responsive table-bordered"
            id="pm_analysis_report"
          >
            <thead>
              <tr>
                <th rowspan="2">Rep</th>
                <th rowspan="2">total planned visits</th>
                <th rowspan="2">total report visits</th>
                <th rowspan="2">%</th>
                <th rowspan="2">total planned Customers</th>
                <th rowspan="2">total visited Custiners</th>
                <th rowspan="2">%</th>
                <th :colspan="sp_list.size" class="bg-secondary text-light">
                  Planned Specialty
                </th>
                <th :colspan="sp_list.size" class="bg-light">
                  Reported Specialty
                </th>
                <th :colspan="params_list.size" class="bg-secondary text-light">
                  Planned Parameters
                </th>
                <th :colspan="params_list.size" class="bg-light">
                  Reported Parameters
                </th>
              </tr>
              <tr>
                <th
                  v-for="(item, i) in sp_list"
                  :key="`planned_specialty_${i}`"
                  class="bg-secondary text-light"
                >
                  {{ item }}
                </th>
                <th
                  v-for="(item, i) in sp_list"
                  :key="`reported_specialty_${i}`"
                  class="bg-light"
                >
                  {{ item }}
                </th>
                <th
                  v-for="(item, i) in params_list"
                  :key="`planned_parameters_${i}`"
                  class="bg-secondary text-light"
                >
                  {{ item }}
                </th>
                <th
                  v-for="(item, i) in params_list"
                  :key="`reported_parameters_${i}`"
                  class="bg-light"
                >
                  {{ item }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(rep, name) in analysisReport"
                :key="`${name}_analysis_data`"
              >
                <td>{{ name }}</td>
                <td>{{ rep.total_planned }}</td>
                <td>{{ rep.total_visits }}</td>
                <td>
                  {{ (rep.total_visits / rep.total_planned).toFixed(1) * 100 }}
                </td>
                <td>{{ rep.planned_customers }}</td>
                <td>{{ rep.visits_customers }}</td>
                <td>
                  {{
                    (rep.visits_customers / rep.planned_customers).toFixed(1) *
                      100
                  }}
                </td>
                <td
                  v-for="(sp, i) in sp_list"
                  :key="`${name}_planned_sp_${sp}_${i}`"
                >
                  {{
                    rep.planned_specialty[sp]
                      ? rep.planned_specialty[sp].length
                      : 0
                  }}
                </td>
                <td
                  v-for="(sp, i) in sp_list"
                  :key="`${name}_report_sp_${sp}_${i}`"
                >
                  {{
                    rep.report_specialty[sp]
                      ? rep.report_specialty[sp].length
                      : 0
                  }}
                </td>
                <td
                  v-for="(param, i) in params_list"
                  :key="`${name}_planned_param_${param}_${i}`"
                >
                  {{
                    rep.planned_params[param]
                      ? rep.planned_params[param].length
                      : 0
                  }}
                </td>
                <td
                  v-for="(param, i) in params_list"
                  :key="`${name}_report_param_${param}_${i}`"
                >
                  {{
                    rep.report_params[param]
                      ? rep.report_params[param].length
                      : 0
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        v-else-if="fetched"
        style="min-height:250px"
        class="d-flex justift-content-center align-items-center"
      >
        <p class="font-weight-bold">No data to show</p>
      </div>
      <div v-else>
        <loader-component></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../../components/TableComponent";
import { ExportToExcel, filterData, sortBy } from "../../../../helpers/helpers";
export default {
  mounted() {
    this.$store.dispatch("getAllRepPmReports").finally(() => {
      this.$store.dispatch("getPlans").finally(() => {
        this.processRepReport().then(data => {
          this.analysisReport = data;
          this.isProcessing = false;
        });
      });
    });
  },
  computed: {
    reports() {
      return this.$store.getters.allRepPmReports;
    },
    fetched() {
      return this.$store.getters.isRepPmReportsFetched;
    },
    reps() {
      return sortBy(this.$store.getters.allReps, "name", "asc");
    },
    plans() {
      return this.$store.getters.repPlans;
    }
  },
  components: {
    TableComponent
  },
  data: () => ({
    analysisReport: {},
    isProcessing: true,
    params_list: new Set(),
    sp_list: new Set()
  }),
  methods: {
    processRepReport() {
      return new Promise((resolve, reject) => {
        try {
          let repsData = this.collectRepData();
          let analysis = {};
          Object.keys(repsData).forEach(rep => {
            if (!analysis[rep]) {
              analysis[rep] = {};
            }
            let data = repsData[rep];
            analysis[rep]["total_visits"] = data.reports.length;
            analysis[rep]["total_planned"] = data.plans.length;
            analysis[rep]["planned_customers"] = Object.keys(
              filterData(data.plans, "title")
            ).length;
            analysis[rep]["visits_customers"] = Object.keys(
              filterData(data.reports, "customer.name")
            ).length;
            analysis[rep]["planned_specialty"] = filterData(
              data.plans,
              "specialty"
            );
            analysis[rep]["report_specialty"] = filterData(
              data.reports,
              "customer.specialty"
            );
            analysis[rep]["planned_params"] = filterData(data.plans, "param");
            analysis[rep]["report_params"] = filterData(
              data.reports,
              "customer.params.0.current"
            );
            analysis[rep]["coach_visits"] = filterData(
              data.reports,
              "coach.name"
            );
            for (let i in data.plans) {
              let item = data.plans[i];
              this.sp_list.add(item.specialty);
              this.params_list.add(item.param);
            }
            for (let i in data.reports) {
              let item = data.reports[i];
              this.sp_list.add(item.customer.specialty);
              if (item.customer.current) {
                this.params_list.add(item.current[0].param);
              }
            }
            this.params_list.add("NN");
          });
          resolve(analysis);
        } catch (e) {
          reject(e);
        }
      });
    },
    collectRepData() {
      let analysis = {};
      this.reps.forEach(rep => {
        if (this.$store.state.user.id !== rep.id) {
          if (!analysis[rep.name]) {
            analysis[rep.name] = {};
          }

          let plans = filterData(this.plans, "user_id", report => {
            return report.user_id == rep.id;
          });
          let reports = filterData(this.reports, "user_id", report => {
            return report.user_id == rep.id;
          });
          analysis[rep.name]["plans"] = plans[rep.id] ? plans[rep.id] : {};
          analysis[rep.name]["reports"] = reports[rep.id]
            ? reports[rep.id]
            : {};
        }
      });
      return analysis;
    },
    exportToExcel() {
      ExportToExcel("#pm_analysis_report", "rep-pm-analysis");
    }
  }
};
</script>

<style lang="scss" scoped>
th {
  vertical-align: middle !important;
}
</style>
