<template>
  <div class="px-0">
    <p class="alert alert-success">
      <span class="fa fa-store"></span>
      <span class="font-weight-bold">Date View</span>
    </p>
    <div class="p-2">
      <div v-if="Object.keys(reports).length" class="p-2">
        <div class="p-2">
          <button class="btn btn-sm btn-success" @click="exportToExcel">
            <span class="fa fa-file-excel"></span>
            <span>Export</span>
          </button>
        </div>
        <table
          class="table table-sm small table-responsive table-bordered table-striped"
          id="pharmacy_reports"
        >
          <thead>
            <tr class="bg-success text-light">
              <th>Actions</th>
              <th>Pharmacy</th>
              <th>Date</th>
              <th>Type</th>
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
              <th>Feedback</th>
              <th>Address</th>
              <th>Brick</th>
              <th>Area</th>
              <th>District</th>
              <th>Territory</th>
            </tr>
          </thead>
          <template v-for="(key, i) in Object.keys(reports)">
            <tbody class="_removed__raw" :key="`report_date_${key}_${i}`">
              <tr class="bg-dark text-light">
                <td colspan="24">
                  <a
                    href=""
                    class="text-decoration-none text-light"
                    data-toggle="collapse"
                    :data-target="`#pharmacy_report_${i}`"
                  >
                    <span>Date : {{ key }}</span>
                    <span class="ml-3">
                      <span>No. of pharmacies</span>
                      <span class="badge badge-light">{{
                        calculateNoOfPharmacy(key)
                      }}</span>
                    </span>
                  </a>
                </td>
              </tr>
            </tbody>
            <tbody
              :id="`pharmacy_report_${i}`"
              class="collapse"
              :key="`report_body_${i}`"
            >
              <tr
                v-for="(row, index) in reports[key]"
                :key="`pharmacy_report_${key}_${i}_${index}`"
              >
                <td>
                  <router-link
                    :to="`/reports/edit/pharmacy/${row.id}`"
                    class="btn btn-sm btn-warning"
                  >
                    <span class="fa fa-edit"></span>
                  </router-link>
                  <delete-report-button :itemId="row.id" />
                </td>
                <td>{{ row.pharmacy }}</td>
                <td>{{ row.date }}</td>
                <td>{{ row.type }}</td>
                <td>{{ row.product }}</td>
                <td>{{ row.rate }}</td>
                <td>{{ row.stock }}</td>
                <td>{{ row.order }}</td>
                <td>{{ row.distributor }}</td>
                <td>{{ row.competitor1 }}</td>
                <td>{{ row.competitor1_rate }}</td>
                <td>{{ row.competitor1_stock }}</td>
                <td>{{ row.competitor2 }}</td>
                <td>{{ row.competitor2_rate }}</td>
                <td>{{ row.competitor2_stock }}</td>
                <td>{{ row.competitor3 }}</td>
                <td>{{ row.competitor3_rate }}</td>
                <td>{{ row.competitor3_stock }}</td>
                <td>{{ row.feedback }}</td>
                <td>{{ row.address }}</td>
                <td>{{ row.brick }}</td>
                <td>{{ row.area }}</td>
                <td>{{ row.district }}</td>
                <td>{{ row.territory }}</td>
              </tr>
            </tbody>
          </template>
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
import { ExportToExcel } from "../../../../helpers/helpers";
import DeleteReportButton from "../../../components/DeleteReportButton.vue";
export default {
  components: { DeleteReportButton },
  computed: {
    reports() {
      return this.$store.getters.pharmacyReportsDateView;
    },
    isFetched() {
      return this.$store.getters.pharmacyReportsFetched;
    },
    totalReports() {
      return this.$store.getters.totalPharmacyReportsCount;
    }
  },
  methods: {
    exportToExcel() {
      let filename = `${
        this.$store.getters.user.name
      }_pharmacy_reports_${new Date().format()}`;
      let target = document.getElementById("pharmacy_reports").cloneNode();
      target.innerHTML = document.getElementById("pharmacy_reports").innerHTML;
      let removedRows = target.querySelectorAll("._removed__raw");
      removedRows.forEach(row => {
        row.remove();
      });
      ExportToExcel(target, filename);
    },
    calculateNoOfPharmacy(date) {
      let reports = this.reports;
      let count = [];
      reports[date].map(report => {
        if (!count.includes(report.pharmacy)) {
          count.push(report.pharmacy);
        }
      });
      return count.length;
    }
  }
};
</script>

<style></style>
