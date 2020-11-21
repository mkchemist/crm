<template>
  <div class="row mx-auto">
    <div class="col-lg-3">
      <data-filter
        :data="{
          reports: $store.getters.allRepPmReports,
          plans: $store.getters.repPlans
        }"
        :keys="{ rep: 'user_id', date: 'date' }"
        :onUpdate="handlePerformanceFilter"
        :onReset="handlePerformanceReset"
      ></data-filter>
      <div class="my-2 border p-2 rounded">
        <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
          <span><i class="fa fa-chevron-circle-left"></i></span>
          <span>back</span>
        </router-link>
      </div>
    </div>
    <div class="col-lg-9">
      <div class="px-0 shadow">
        <p class="alert alert-success">
          <span><i class="fa fa-book-reader"></i></span>
          <span class="font-weight-bold">View Pm report analysis </span>
        </p>
        <div class="p-2">
          <div class="p-2" v-if="reports.length && plans.length">
            <div
              v-if="Object.keys(analysisReport).length === 0"
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
                    <th rowspan="2">total visited Customers</th>
                    <th rowspan="2">%</th>
                    <th :colspan="sp_list.size" class="bg-secondary text-light">
                      Planned Specialty
                    </th>
                    <th :colspan="sp_list.size" class="bg-light">
                      Reported Specialty
                    </th>
                    <th
                      :colspan="params_list.size"
                      class="bg-secondary text-light"
                    >
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
                      {{
                        (rep.total_visits / rep.total_planned).toFixed(2) * 100
                      }}
                    </td>
                    <td>{{ rep.planned_customers }}</td>
                    <td>{{ rep.visits_customers }}</td>
                    <td>
                      {{
                        (rep.visits_customers / rep.planned_customers).toFixed(
                          2
                        ) * 100
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
            class="d-flex justify-content-center align-items-center"
          >
            <p class="font-weight-bold">No data to show</p>
          </div>
          <div v-else>
            <loader-component></loader-component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../../components/TableComponent";
import { ExportToExcel, filterData, sortBy } from "../../../../helpers/helpers";
import DataFilter from "../../../components/DataFilter";
export default {
  mounted() {
    this.$store.dispatch("getAllRepPmReports").finally(() => {
      this.$store.dispatch("getPlans").finally(() => {});
    });
  },
  computed: {
    reports() {
      if (!this.isFiltered) {
        return this.$store.getters.allRepPmReports;
      }
      return this.filteredData.reports;
    },
    fetched() {
      return this.$store.getters.isRepPmReportsFetched;
    },
    isPlanFetched() {
      return this.$store.getters.isPlanFetched;
    },
    reps() {
      return sortBy(this.$store.getters.allReps, "name", "asc");
    },
    plans() {
      if (!this.isFiltered) {
        return this.$store.getters.repPlans;
      }
      return this.filteredData.plans;
    },
    analysisReport() {
      if (!this.fetched || !this.isPlanFetched) {
        return {};
      }
      let data = this.processRepReport();
      return data;
    }
  },
  components: {
    TableComponent,
    DataFilter
  },
  data: () => ({
    params_list: new Set(),
    sp_list: new Set(),
    filteredData: {
      reports: [],
      plans: []
    },
    isFiltered: false
  }),
  methods: {
    processRepReport() {
      try {
        let repsData = this.collectRepData();
        let analysis = {};
        Object.keys(repsData).forEach(rep => {
          if (!analysis[rep]) {
            analysis[rep] = {};
          }
          let data = repsData[rep];
          let reports = filterData(data.reports, [
            "customer",
            "specialty",
            "param",
            "coach"
          ]);
          let plans = filterData(data.plans, ["title", "specialty", "param"]);
          analysis[rep] = {
            total_visits: data.reports.length,
            total_planned: data.plans.length,
            planned_customers: plans.title ? Object.keys(plans.title).length : 0,
            visits_customers: reports.customer ? Object.keys(reports.customer).length:0,
            planned_params:  plans.param || {},
            report_params: reports.param || {},
            coach_visits: reports.coach ? Object.keys(reports.coach).length: 0,
            planned_specialty: plans.specialty || {},
            report_specialty : reports.specialty|| {}
          }
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
        return analysis;
      } catch (e) {
        console.log(e);
      }
    },
    collectRepData() {
      let analysis = {};
      this.reps.forEach(rep => {
        if (rep.id !== this.$store.state.user.id) {
          analysis[rep.name] = {};
          let plans = filterData(this.plans, "user_name");
          let reports = filterData(this.reports, "user_name");
          analysis[rep.name].plans = plans[rep.name] ? plans[rep.name] : [];
          analysis[rep.name].reports = reports[rep.name]
            ? reports[rep.name]
            : [];
        }
      });
      return analysis;
    },
    exportToExcel() {
      ExportToExcel("#pm_analysis_report", "rep-pm-analysis");
    },
    handlePerformanceFilter(resolve) {
      resolve.then(data => {
        this.filteredData = data;
        this.isFiltered = true;
      });
    },
    handlePerformanceReset() {
      this.isFiltered = false;
      this.filteredData = {
        reports: [],
        plans: []
      };
    }
  }
};
</script>

<style lang="scss" scoped>
th, tr, td {
    vertical-align: middle !important;
    text-align: center;
  }
</style>
