<template>
  <div class="px-0">
    <p class="alert alert-success">
      <span class="fa fa-gift"></span>
      <span class="font-weight-bold">Product View</span>
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
              <th>Pharmacy</th>
              <th class="export-remove" >Action</th>
              <th>Date</th>
              <th>Product</th>
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
              <th>General Feedback</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(pharmacy, index) in Object.keys(reportCollection)"
            >
              <tr :key="`report_pharmacy_name_${pharmacy}_${index}`">
                <td :rowspan="reportCollection[pharmacy].length + 1">
                  {{ pharmacy }}
                </td>
              </tr>
              <tr
                v-for="(report, i) in reportCollection[pharmacy]"
                :key="`report_${i}_${index}`"
                class="row-striped"
              >
                <td class="export-remove">
                  <router-link
                    :to="`/reports/edit/pharmacy/${report.id}`"
                    class="btn btn-sm btn-warning"
                  >
                    <span class="fa fa-edit"></span>
                  </router-link>
                  <delete-report-button :itemId="report.id"/>
                </td>
                <td>{{ report.date }}</td>
                <td class="export-bold">{{ report.product }}</td>
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
                <td>{{ report.feedback }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div v-else-if="isFetched">
        <no-data-to-show />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import { ExportToExcel, filterData } from "../../../../helpers/helpers";
import DeleteReportButton from '../../../components/DeleteReportButton.vue';
export default {
  components: {
    DeleteReportButton
  },
  computed: {
    reports() {
      return this.$store.getters.pharmacyReports;
    },
    isFetched() {
      return this.$store.getters.pharmacyReportsFetched;
    },
    reportCollection() {
      let reports;
      reports = filterData(this.reports, "pharmacy");
      return reports;
    }
  },
  data: () => ({

  }),
  methods: {
    exportToExcel() {
      let table, target;
      table = document.getElementById("report_table");
      target = table.cloneNode();
      target.innerHTML = table.innerHTML;
      this._normalizeExportedTable(target);
      ExportToExcel(target, `${this.$store.getters.user.name}_pharmacy_report_`);
    },
    _normalizeExportedTable(target) {
      let rows;
      target.style.textAlign = "center !important";
      target.querySelectorAll('td').forEach(item => {
        item.style.verticalAlign = 'middle';
        item.style.textAlign = 'center';
        if(item.classList.contains('export-bold')) {
          item.style.fontWeight = 'bolder';
        }
      })
      target.querySelectorAll('.export-remove').forEach(item => {
        item.remove();
      })
      rows = target.querySelectorAll(".row-striped");
      rows.forEach((row, i) => {
        if (i === 0) {
          row.style.backgroundColor = "#e2eaec";
        }
        if (i !== 0 && i % 2 === 0) {
          row.style.backgroundColor = "#e2eaec";
        }
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
