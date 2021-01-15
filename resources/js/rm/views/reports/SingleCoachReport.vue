<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-primary">
      <span class="fa fa-book-reader"></span>
      <span>View Coach Report</span>
    </p>
    <div class="p-2">
      <div class="p-2 text-right">
        <button  class="btn btn-sm btn-dark" @click="()=> $router.back()">
          <span class="fa fa-chevron-circle-left"></span>
          <span>Back</span>
        </button>
        <button class="btn btn-sm btn-success" @click="exportToExcel">
          <span class="fa fa-file-excel"></span>
          <span>Export</span>
        </button>
      </div>
      <div class="p-2" v-if="report" id="coach_report">
        <coach-report-component  :report="report" />
      </div>

      <div v-else-if="fetched">
        <no-data-to-show />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import CoachReportComponent from '../../../components/CoachReportComponent.vue';
import NoDataToShow from "../../../components/NoDataToShow.vue";
import { ExportToExcel } from "../../../helpers/helpers";
import { httpCall } from "../../../helpers/http-service";
export default {
  components: { NoDataToShow, CoachReportComponent },
  mounted() {
    this.fetchReport();
  },
  data: () => ({
    report: null,
    fetched: false
  }),
  methods: {
    /**
     * get report ID
     *
     * @return {int}
     */
    getReportId() {
      return this.$route.params.id;
    },
    /**
     * fetch coach report
     *
     */
    fetchReport() {
      let id = this.getReportId();
      this.fetched = false;
      this.report = null;
      httpCall
        .get(`rm/v1/reports/coach-report/single/${id}`)
        .then(({ data }) => {
          this.report = data.data;
          this.fetched = true;
        })
        .catch(err => console.log(err));
    },
    /**
     * export coach report to excel file
     *
     */
    exportToExcel() {
      ExportToExcel(
        "#coach_report",
        `${this.report.customer.name}_visit_by_${this.report.rep.name}_evaluation`
      );
    }
  }
};
</script>

<style></style>
