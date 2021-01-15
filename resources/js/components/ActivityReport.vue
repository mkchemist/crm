<template>
  <div class="p-2">
    <div class="p-2 row mx-auto">
      <!-- side controller -->
      <div class="col-lg-3">
        <!-- user control -->
        <user-filter-box
          :users="users"
          :data="reportData"
          :on-filter="onFilterData"
          :on-reset="resetDataFilter"
        />
        <!-- end of user control -->
        <!-- Date control -->
        <date-filter-box
          :data="reportData"
          :on-filter="onFilterData"
          :on-reset="resetDataFilter"
          :dateField="`start`"
        />
        <router-link :to="`${backLink ? backLink : '/reports'}`" class="btn btn-sm btn-dark btn-block my-2">
          <span class="fa fa-chevron-circle-left"></span>
          <span>back</span>
        </router-link>
        <!-- End of Date control -->
      </div>
      <!-- end of side controller -->
      <!-- Data view -->
      <div class="col-lg mx-auto px-0 shadow pb-5">
        <p class="alert alert-success">
          <span class="fa fa-book-reader"></span>
          <span class="font-weight-bold">View {{ title }} reports</span>
        </p>
        <div class="p-2">
          <div v-if="reportData.length">
            <table-component
              :data="reportData"
              :heads="tableHeaders"
              :notResponsive="true"
              :headClass="`bg-success text-light`"
            >
            </table-component>
          </div>
          <div v-else-if="isReportsFetched">
            <no-data-to-show title="No reports found" />
          </div>
          <loader-component v-else></loader-component>
        </div>
      </div>
      <!-- end of data view -->
    </div>
  </div>
</template>

<script>
import { httpCall } from "../helpers/http-service";
import DateFilterBox from "./DateFilterBox.vue";
import NoDataToShow from "./NoDataToShow.vue";
import TableComponent from "./TableComponent.vue";
import UserFilterBox from "./UserFilterBox.vue";
export default {
  components: { UserFilterBox, DateFilterBox, NoDataToShow, TableComponent },
  mounted() {
    if (!this.$route.query.type) {
      this.$router.push("/reports/activity-report?type=field-activity");
    }
    let type = this.$route.query.type;
    if (type === "non-field-activity") {
      this.report_type = "non-field-activity";
    } else {
      this.report_type = "field-activity";
    }

    this.getReports();
  },
  props: ["users", "backLink"],
  data: () => ({
    reportRawData: [],
    reportData: [],
    isReportsFetched: false,
    tableHeaders: [
      {
        title: "User",
        name: "user"
      },
      {
        title: "Start Date",
        name: "start"
      },
      {
        title: "End date",
        name: "end"
      },
      {
        title: "Activity",
        name: "content"
      },
      {
        title: "Comment",
        name: "comment",
        fallback: "-------------------"
      }
    ]
  }),
  computed: {
    title() {
      if (this.$route.query.type === "non-field-activity") {
        return "Non Field activity";
      }
      return "Field Activity";
    }
  },
  methods: {
    getReports() {
      let request = {
        type: this.report_type
      };
      this.isReportsFetched = false;
      this.reports = [];
      httpCall
        .get("activity-reports", request)
        .then(({ data }) => {
          this.reportData = data.data;
          this.reportRawData = data.data;
          this.isReportsFetched = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onFilterData(data) {
      this.reportData = [];
      let async = () => Promise.resolve(data);

      async().then(data => (this.reportData = data));
    },
    resetDataFilter() {
      let async = () => Promise.resolve(this.reportRawData);
      this.reportData = [];
      async().then(data => (this.reportData = data));
    }
  }
};
</script>

<style></style>
