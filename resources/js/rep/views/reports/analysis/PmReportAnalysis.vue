<template>
  <div class="px-0 shadow pb-5">
    <p class="alert alert-success">
      <span class="fa fa-chart-line"></span>
      <span class="font-weight-bold">PM report analysis</span>
    </p>
    <div class="p-2">
      <div class="p-2">
        <router-link to="/reports" class="btn btn-sm btn-dark">
          <span><i class="fa fa-chevron-circle-left"></i></span>
          <span>back</span>
        </router-link>
        <button class="btn btn-sm btn-success" @click="exportTable">
          <span><i class="fa fa-file-excel"></i></span>
          <span>Export</span>
        </button>
      </div>
      <table
        class="table table-sm small table-bordered text-center table-responsive"
        v-if="Object.keys(reportData).length"
        id="analysis-table"
      >
        <thead>
          <tr>
            <th rowspan="2">Item</th>
            <th rowspan="2">Total Plans</th>
            <th rowspan="2">Total Visits</th>
            <th rowspan="2">%</th>
            <th rowspan="2">Plan days</th>
            <th rowspan="2">Report days</th>
            <th rowspan="2">%</th>
            <th rowspan="2">Avg. visits/day</th>
            <th rowspan="2">Plans Customers</th>
            <th rowspan="2">Visits Customers</th>
            <th
              :colspan="Object.keys(reportData.plan_specialty).length"
              class="bg-primary text-light"
            >
              Plan Specaialty
            </th>
            <th
              :colspan="Object.keys(reportData.report_specialty).length"
              class="bg-info text-light"
            >
              Report Specaialty
            </th>
            <th
              :colspan="Object.keys(reportData.plan_params).length"
              class="bg-primary text-light"
            >
              Plan Parameters
            </th>
            <th
              :colspan="Object.keys(reportData.report_params).length"
              class="bg-info text-light"
            >
              Report Parameters
            </th>
          </tr>
          <tr>
            <th v-for="(sp, i) in reportData.plan_specialty" :key="i + '_plan'">
              {{ i }}
            </th>
            <th
              v-for="(sp, i) in reportData.report_specialty"
              :key="i + '_report'"
            >
              {{ i }}
            </th>
            <th v-for="(item, i) in reportData.plan_params" :key="i + '_plan'">
              {{ i }}
            </th>
            <th
              v-for="(item, i) in reportData.report_params"
              :key="i + '_report'"
            >
              {{ i !== 'null' ? i : 'NN' }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="font-weight-bold">
            <td>Value</td>
            <td>{{ reportData.total_plans }}</td>
            <td>{{ reportData.total_reports }}</td>
            <td>
              {{
                (
                  (reportData.total_reports / reportData.total_plans) *
                  100
                ).toFixed(0)
              }}
              %
            </td>
            <td>{{ reportData.plan_days }}</td>
            <td>{{ reportData.report_days }}</td>
            <td>
              {{
                ((reportData.report_days / reportData.plan_days) * 100).toFixed(
                  0
                )
              }}
              %
            </td>
            <td>
              {{ reportData.total_reports/reportData.report_days }}
            </td>
            <td>{{ reportData.plan_customers }}</td>
            <td>{{ reportData.report_customers }}</td>
            <td v-for="(sp, i) in reportData.plan_specialty" :key="i + '_plan'">
              {{ sp.length }}
            </td>
            <td
              v-for="(sp, i) in reportData.report_specialty"
              :key="i + '_report'"
            >
              {{ sp.length }}
            </td>
            <td v-for="(item, i) in reportData.plan_params" :key="i + '_plan'">
              {{ item.length }}
            </td>
            <td
              v-for="(item, i) in reportData.report_params"
              :key="i + '_report'"
            >
              {{ item.length }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ExportToExcel, filterData } from "../../../../helpers/helpers";
export default {
  created() {
    this.$store.dispatch("reportGetAll");
    this.$store.dispatch("getPlanner");
  },
  data: () => ({
  }),
  component: {},
  computed: {
    reportData() {
      let reports = this.$store.getters.pmVisits;
      let plans = this.$store.getters.plans;
      let data = {};
      data["total_plans"] = plans.length;
      data["total_reports"] = reports.length;
      data["plan_params"] = filterData(plans, "param");
      data["plan_specialty"] = filterData(plans, "specialty");
      data["report_params"] = filterData(reports, "customer.params.0.current");
      data["report_specialty"] = filterData(reports, "customer.specialty");
      data["plan_days"] = Object.keys(filterData(plans, "start")).length;
      data["report_days"] = Object.keys(filterData(reports, "date")).length;
      data["plan_customers"] = Object.keys(filterData(plans, "title")).length;
      data["report_customers"] = Object.keys(
        filterData(reports, "customer_name")
      ).length;
      return data;
    }
  },
  methods: {
    exportTable(){
      ExportToExcel('#analysis-table', 'pm-report-analysis')
    }
  }
};
</script>

<style lang="scss" scoped>
table thead th {
  vertical-align: middle !important;
}
</style>
