<template>
  <div class="row mx-auto pb-5">
    <div class="col-lg-3 rounded border py-3">
        <cycle-selection :onSelect="onSelectCycle" :onReset="onResetCycle" />

      <router-link to="/reports" class="btn btn-sm btn-primary btn-block">
        <span class="fa fa-plus-circle"></span>
        <span>Add Health Day report</span>
      </router-link>
      <router-link to="/reports" class="btn btn-sm btn-dark btn-block">
        <span class="fa fa-chevron-circle-left"></span>
        <span>back</span>
      </router-link>
    </div>
    <div class="col-lg-9 pb-5">
      <div class="px-0 shadow rounded">
        <p class="alert alert-success">
          <span class="fa fa-gift"></span>
          <span class="font-weight-bold">Health Day Report list</span>
        </p>
        <div class="p-2">
          <div class="p-2" v-if="reports.length">
            <div class="my-2 p-2">
              <button class="btn btn-sm btn-success" @click="exportToExcel">
                <span class="fa fa-file-excel"></span>
                <span>Export</span>
              </button>
            </div>
            <table
              class="table  table-bordered table-sm small table-responsive table-striped text-center"
              id="report_table"
            >
              <thead>
                <tr>
                  <th class="export-remove">Action</th>
                  <th>Pharmacy</th>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Total Cases</th>
                  <th>Rate</th>
                  <th>Stock</th>
                  <th>Order</th>
                  <th>Distributor</th>
                  <th>Competitor 1</th>
                  <th>Competitor 1 Rate</th>
                  <th>Competitor 1 Stock</th>
                  <th>Competitor 2</th>
                  <th>Competitor 2 Rate</th>
                  <th>Competitor 2 Stock</th>
                  <th>Competitor 3</th>
                  <th>Competitor 3 Rate</th>
                  <th>Competitor 3 Stock</th>
                  <th>Health Day Summery</th>
                  <th>Address</th>
                  <th>Brick</th>
                  <th>Area</th>
                  <th>District</th>
                  <th>Territory</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(report, i) in reports"
                  :key="`report_${report.id}_${i}`"
                  class="row-striped"
                >
                  <td class="export-remove">
                    <router-link
                      :to="`/reports/edit/health-day/${report.id}`"
                      class="btn btn-sm btn-warning"
                    >
                      <span class="fa fa-edit"></span>
                    </router-link>
                    <delete-report-button :itemId="report.id" />
                  </td>
                  <td>{{ report.pharmacy }}</td>
                  <td>{{ report.date }}</td>
                  <td class="export-bold">{{ report.product }}</td>
                  <td>{{ report.comment.no_cases }}</td>
                  <td>{{ report.rate }}</td>
                  <td>{{ report.stock }}</td>
                  <td>{{ report.order }}</td>
                  <td>{{ report.distributor }}</td>
                  <td>{{ report.competitor1 }}</td>
                  <td>{{ report.competitor1_rate }}</td>
                  <td>{{ report.competitor1_stock }}</td>
                  <td>{{ report.competitor2 }}</td>
                  <td>{{ report.competitor2_rate }}</td>
                  <td>{{ report.competitor2_stock }}</td>
                  <td>{{ report.competitor3 }}</td>
                  <td>{{ report.competitor3_rate }}</td>
                  <td>{{ report.competitor3_stock }}</td>
                  <td>{{ report.comment.summery }}</td>
                  <td>{{ report.address }}</td>
                  <td>{{ report.brick }}</td>
                  <td>{{ report.area }}</td>
                  <td>{{ report.district }}</td>
                  <td>{{ report.territory }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else-if="isFetched">
            <no-data-to-show />
          </div>
          <loader-component v-else></loader-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ExportToExcel, filterData } from "../../../helpers/helpers";
import CycleSelection from '../../../components/CycleSelection.vue';
import DeleteReportButton from "../../components/DeleteReportButton.vue";
export default {
  mounted() {
    this.$store.dispatch("fetchPharmacyReports");
  },
  components: {
    DeleteReportButton,
    CycleSelection
  },
  computed: {
    reports() {
      return this.$store.getters.healthDayReports;
    },
    isFetched() {
      return this.$store.getters.pharmacyReportsFetched;
    },
    activeCycle() {
      return this.$store.getters.activeCycle
    }
  },
  data: () => ({}),
  methods: {
    exportToExcel() {
      let table, target;
      table = document.getElementById("report_table");
      target = table.cloneNode();
      target.innerHTML = table.innerHTML;
      this._normalizeExportedTable(target);
      ExportToExcel(
        target,
        `${this.$store.getters.user.name}_pharmacy_report_`
      );
    },
    _normalizeExportedTable(target) {
      let rows;
      target.style.textAlign = "center !important";
      target.querySelectorAll("td").forEach(item => {
        item.style.verticalAlign = "middle";
        item.style.textAlign = "center";
        if (item.classList.contains("export-bold")) {
          item.style.fontWeight = "bolder";
        }
      });
      target.querySelectorAll(".export-remove").forEach(item => {
        item.remove();
      });
      rows = target.querySelectorAll(".row-striped");
      rows.forEach((row, i) => {
        if (i === 0) {
          row.style.backgroundColor = "#e2eaec";
        }
        if (i !== 0 && i % 2 === 0) {
          row.style.backgroundColor = "#e2eaec";
        }
      });
    },
    onSelectCycle() {
      this.$store.dispatch("fetchPharmacyReports",{
        force: true,
        start: this.activeCycle.start,
        end: this.activeCycle.end
      });
    },
    onResetCycle() {
      this.$store.commit('resetActiveCycle');
      this.$store.dispatch("fetchPharmacyReports", {
        force: true,
        start: this.activeCycle.start,
        end: this.activeCycle.end
      });
    }
  }
};
</script>

<style lang="scss" scoped>
table {
  td {
    vertical-align: middle;
    text-align: center;
  }
}
</style>
