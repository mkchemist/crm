<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span class="fa fa-book-reader"></span>
      <span class="font-weight-bold">Plan Analysis report</span>
    </p>
    <div class="p-2">
      <!-- start analysis control -->
      <div class="p-2 text-right">
        <router-link to="/reports" class="btn btn-sm btn-dark">
          <span class="fa fa-chevron-circle-left"></span>
          <span>Back</span>
        </router-link>
        <button
          type="button"
          class="btn btn-sm btn-primary"
          @click="fetchAnalysisReport"
        >
          <span class="fa fa-download"></span>
          <span>Generate Analysis</span>
        </button>
      </div>

      <!-- analysis data view -->
      <div class="p-2">
        <div v-if="Object.keys(analysisReport).length">
          <div class="p-2">
            <button
              type="button"
              class="btn btn-sm btn-success"
              @click="exportToExcel"
            >
              <span class="fa fa-file-excel"></span>
              <span>Export</span>
            </button>
          </div>
          <table
            class="table table-responsive table-sm small table-striped table-bordered"
            id="export_table"
          >
            <thead>
              <tr>
                <th rowspan="3">District Manager</th>
                <th rowspan="3">Rep</th>
                <th rowspan="3">Total Frequency</th>
                <th rowspan="3">Total Plans</th>
                <th rowspan="3">Difference</th>
                <th :colspan="specialties.size * 2" class="text-center">
                  Specialty
                </th>
                <th :colspan="parameter.size * 2" class="text-center">
                  Parameter
                </th>
              </tr>
              <tr>
                <th
                  v-for="(sp, i) in specialties"
                  :key="`specialty_${i}`"
                  colspan="2"
                  class="text-center"
                >
                  {{ sp }}
                </th>
                <th
                  v-for="(param, i) in parameter"
                  :key="`parameter_${i}`"
                  colspan="2"
                  class="text-center"
                >
                  {{ param }}
                </th>
              </tr>
              <tr>
                <template v-for="(sp, i) in specialties">
                  <th>Frequency</th>
                  <th>Planned</th>
                </template>
                <template v-for="param in parameter">
                  <th>Frequency</th>
                  <th>Planned</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="rep in Object.keys(analysisReport)"
                :key="`rep_${rep}_report`"
              >
                <td>{{ getDistrictName(analysisReport[rep].user_id) }}</td>
                <td>{{ rep }}</td>
                <td>{{ analysisReport[rep].total_frequency }}</td>
                <td>{{ analysisReport[rep].total_planned }}</td>
                <td>
                  {{
                    analysisReport[rep].total_frequency -
                      analysisReport[rep].total_planned
                  }}
                </td>
                <template v-for="sp in specialties">
                  <td>
                    {{
                      analysisReport[rep][sp]
                        ? analysisReport[rep][sp].frequency
                        : 0
                    }}
                  </td>
                  <td>
                    {{
                      analysisReport[rep][sp]
                        ? analysisReport[rep][sp].planned
                        : 0
                    }}
                  </td>
                </template>
                <template v-for="sp in parameter">
                  <td>
                    {{
                      analysisReport[rep][sp]
                        ? analysisReport[rep][sp].frequency
                        : 0
                    }}
                  </td>
                  <td>
                    {{
                      analysisReport[rep][sp]
                        ? analysisReport[rep][sp].planned
                        : 0
                    }}
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="!loadingStarted" class="text-center text-primary py-5">
          <p>Click generate analysis report to view analysis data</p>
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
import NoDataToShow from "../../../components/NoDataToShow.vue";
import { ExportToExcel, sortBy } from "../../../helpers/helpers";
import { httpCall } from "../../../helpers/http-service";
export default {
  components: {
    NoDataToShow
  },
  mounted() {},
  computed: {
    dms() {
      return this.$store.getters.allDm;
    },
    analysisReport() {
      let report = {};
      if (this.customers.length) {
        this.customers.map(customer => {
          let rep = customer.rep;
          let sp = customer.specialty;
          let param = customer.parameter;
          if (!report[rep]) {
            report[rep] = {
              total_planned: 0,
              total_frequency: 0
            };
          }

          if (!report[rep][sp]) {
            report[rep][sp] = {
              planned: 0,
              frequency: 0
            };
          }
          report[rep][sp].planned += customer.plans;
          report[rep][sp].frequency += customer.frequency;

          if (!report[rep][param]) {
            report[rep][param] = {
              planned: 0,
              frequency: 0
            };
          }

          report[rep][param].planned += customer.plans;
          report[rep][param].frequency += customer.frequency;
          report[rep].total_planned += customer.plans;
          report[rep].total_frequency += customer.frequency;
          report[rep].user_id = customer.user_id;
          this.specialties.add(sp);
          this.parameter.add(param);
        });
      }
      return report;
    }
  },
  data: () => ({
    customers: [],
    fetched: false,
    loadingStarted: false,
    specialties: new Set(),
    parameter: new Set()
  }),
  methods: {
    fetchAnalysisReport() {
      this.customers = [];
      this.fetched = false;
      this.loadingStarted = true;
      httpCall
        .get("rm/v1/reports/analysis/plan")
        .then(({ data }) => {
          this.customers = sortBy(data.data, "rep");
          this.fetched = true;
        })
        .catch(err => console.log(err));
    },
    getDistrictName(id) {
      let manager = "-------";
      this.dms.map(dm => {
        let reps = JSON.parse(dm.user_relations).reps;
        if (reps.includes(id)) {
          manager = dm.name;
        }
      });
      return manager;
    },
    exportToExcel() {
      ExportToExcel("#export_table", "Plan Analysis report");
    }
  }
};
</script>

<style></style>
