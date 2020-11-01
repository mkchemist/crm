<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span class="fa fa-chart-pie"></span>
      <span>Plan Report Analysis</span>
    </p>
    <div class="p-2">
      <div class="p-2">
        <router-link to="/reports" class="btn btn-dark btn-sm">
          <span class="fa fa-chevron-circle-left"></span>
          <span>back</span>
        </router-link>
        <button class="btn btn-sm btn-success" @click="exportToExcel">
          <span class="fa fa-file-excel"></span>
          <span>Export</span>
        </button>
      </div>
      <div>
        <table
          class="table table-sm small table-bordered table-responsive"
          id="analysis-table"
          v-if="!isProcessing"
        >
          <thead>
            <tr>
              <th rowspan="2">Item</th>
              <th rowspan="2">Total Planned days</th>
              <th rowspan="2">Total Frequency Sum</th>
              <th rowspan="2">Total Planned Visits</th>
              <th rowspan="2">%</th>
              <th rowspan="2">Avg/day</th>
              <th rowspan="2">Total Frequency Customers</th>
              <th rowspan="2">Total Planned Customers</th>
              <th rowspan="2">%</th>
              <th
                :colspan="Object.keys(analysisReport.freq_params).length"
                v-if="analysisReport.freq_params"
                class="text-center bg-primary text-light"
              >
                Frequency Per Parameters
              </th>
              <th
                :colspan="Object.keys(analysisReport.plan_params).length"
                v-if="analysisReport.plan_params"
                class="text-center bg-info text-light"
              >
                Plan Per Parameters
              </th>
              <th
                :colspan="Object.keys(analysisReport.freq_specialty).length"
                v-if="analysisReport.freq_specialty"
                class="text-center bg-primary text-light"
              >
                Frequency Specialty
              </th>
              <th
                :colspan="Object.keys(analysisReport.plan_specialty).length"
                v-if="analysisReport.plan_specialty"
                class="text-center bg-info text-light"
              >
                Plan Specialty
              </th>
            </tr>
            <tr>
              <td
                v-for="(val, key) in analysisReport.freq_params"
                :key="`freq_${key}`"
              >
                {{ key }}
              </td>
              <td
                v-for="(val, key) in analysisReport.plan_params"
                :key="`plan_${key}`"
              >
                {{ key }}
              </td>
              <td
                v-for="(val, key) in analysisReport.freq_specialty"
                :key="`freq_${key}`"
              >
                {{ key }}
              </td>
              <td
                v-for="(val, key) in analysisReport.plan_specialty"
                :key="`plan_${key}`"
              >
                {{ key }}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Value</td>
              <td>{{ Object.keys(analysisReport.total_planned_days).length }}</td>
              <td>{{ analysisReport.total_freq }}</td>
              <td>{{ analysisReport.total_plans }}</td>
              <td>
                {{
                  (
                    analysisReport.total_plans / analysisReport.total_freq
                  ).toFixed(2) * 100
                }}%
              </td>
              <td>
                {{
                  (
                    analysisReport.total_plans / Object.keys(analysisReport.total_planned_days).length
                  )
                }}
              </td>
              <td v-if="analysisReport.freq_customers">
                {{ Object.keys(analysisReport.freq_customers).length }}
              </td>
              <td v-if="analysisReport.plan_customers">
                {{ Object.keys(analysisReport.plan_customers).length }}
              </td>
              <td
                v-if="
                  analysisReport.freq_customers && analysisReport.plan_customers
                "
              >
                {{
                  (
                    (Object.keys(analysisReport.plan_customers).length /
                      Object.keys(analysisReport.freq_customers).length) *
                    100
                  ).toFixed(2)
                }}%
              </td>
              <td
                v-for="(val, key) in analysisReport.freq_params"
                :key="`freq_row_${key}`"
              >
                {{ val }}
              </td>
              <td
                v-for="(val, key) in analysisReport.plan_params"
                :key="`plan_row_${key}`"
              >
                {{ val }}
              </td>
              <td
                v-for="(val, key) in analysisReport.freq_specialty"
                :key="`freq_${key}`"
              >
                {{ val }}
              </td>
              <td
                v-for="(val, key) in analysisReport.plan_specialty"
                :key="`plan_${key}`"
              >
                {{ val }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center p-3 text-success">
          <div class="spinner-border"></div>
          <p>Proccessing data</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ExportToExcel, filterData } from "../../../../helpers/helpers";
import { httpCall } from "../../../../helpers/http-service";
export default {
  created() {
    httpCall
      .get("rep/v1/customers")
      .then(({ data }) => (this.customers = data.data))
      .then(() => {
        httpCall.get('rep/v1/planner')
        .then(({data}) => this.plans = data.data)
        .finally(() => {
          this.processPlanData();
        });
      })
  },
  data: () => ({
    analysisReport: {},
    customers: [],
    plans: [],
    isProcessing: true
  }),
  methods: {
    /**
     * processing data and generate data summery
     *
     */
    processPlanData() {
      this.isProcessing = true;
      let customers = this.customers;
      let total_freq = 0;
      let total_plans = 0;
      let params_per_freq = {};
      let params_per_plan = {};
      let specialty_per_freq = {};
      let specialty_per_plan = {};
      customers.map(customer => {
        total_freq += customer.current_freq;
        total_plans += customer.plans;
        if (!params_per_plan[customer.parameter]) {
          params_per_plan[customer.parameter] = 0;
        }
        if (!params_per_freq[customer.parameter]) {
          params_per_freq[customer.parameter] = 0;
        }
        if (!specialty_per_freq[customer.specialty]) {
          specialty_per_freq[customer.specialty] = 0;
        }
        if (!specialty_per_plan[customer.specialty]) {
          specialty_per_plan[customer.specialty] = 0;
        }
        params_per_freq[customer.parameter] += customer.current_freq;
        specialty_per_freq[customer.specialty] += customer.current_freq;
        params_per_plan[customer.parameter] += customer.plans;
        specialty_per_plan[customer.specialty] += customer.plans;
      });
      this.analysisReport["freq_customers"] = filterData(
        customers,
        "name",
        customer => customer.current_freq > 0
      );
      this.analysisReport["plan_customers"] = filterData(
        customers,
        "name",
        customer => customer.plans > 0
      );
      this.analysisReport["plan_params"] = params_per_plan;
      this.analysisReport["plan_specialty"] = specialty_per_plan;
      this.analysisReport["freq_params"] = params_per_freq;
      this.analysisReport["freq_specialty"] = specialty_per_freq;
      this.analysisReport["total_freq"] = total_freq;
      this.analysisReport["total_plans"] = total_plans;
      this.analysisReport['total_planned_days'] = filterData(this.plans, 'start');
      this.isProcessing = false;
    },
    exportToExcel() {
      ExportToExcel("#analysis-table", "Plan Analysis");
    }
  }
};
</script>

<style lang="css" scoped>
tr,
td,
th {
  vertical-align: middle !important;
  text-align: center;
}
</style>
