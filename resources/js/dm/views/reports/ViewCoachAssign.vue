<template>
  <div class="px-0 shadow my-2">
    <p class="alert alert-success">
      <span><i class="fa fa-plus-circle"></i></span>
      <span class="font-weight-bold">Create Coaching report</span>
    </p>
    <div class="p-2">
      <div class="p-2 my-2">
        <router-link to="/reports" class="btn btn-sm btn-dark">
          <span><i class="fa fa-chevron-circle-left"></i></span>
          <span>back</span>
        </router-link>
        <router-link to="/reports" class="btn btn-sm btn-primary">
          <span><i class="fa fa-book-open"></i></span>
          <span>View all reports</span>
        </router-link>
        <button class="btn btn-sm btn-success" :disabled="!submitted_reports.length" @click="submitReports">
          <span><i class="fa fa-paper-plane"></i></span>
          <span>submit</span>
        </button>
      </div>
      <div id="coach-report-table">
        <table-component
          :heads="heads"
          :data="reports"
          headClass="bg-success text-light"
          :not-responsive="true"
          v-if="reports.length"
        >
          <template v-slot:head:before>
            <th><input type="checkbox" @click="addAllToSubmiited"></th>
            <th>Actions</th>
          </template>
          <template v-slot:head>
            <th>Submitted</th>
          </template>
          <template v-slot:body:before="{ item }">
            <td>
              <input type="checkbox" @click="addReportToSubmitted(item.id)">
            </td>
            <td>
              <router-link :to="`/reports/add/coach-report/${item.id}`" class="btn btn-primary btn-sm">
                <span><i class="fa fa-check"></i></span>
                <span>Coach</span>
              </router-link>
              <router-link to="" class="btn btn-danger btn-sm">
                <span><i class="fa fa-times"></i></span>
                <span>Reject</span>
              </router-link>
            </td>
          </template>
          <template v-slot:body="{item}">
            <td class="text-center">
              <span v-if="item.coach_submit"><i class="fa fa-check text-success"></i></span>
              <span v-else><i class="fa fa-times text-danger"></i></span>
            </td>
          </template>
        </table-component>
        <div v-else-if="isFetched">
          <p class="text-center text-muted">No coaching report assigns</p>
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import { filterData } from "../../../helpers/helpers";
import TableComponent from "../../../components/TableComponent";
import { httpCall } from '../../../helpers/http-service';
export default {
  components: {
    TableComponent
  },
  data: () => ({
    heads: [
      {
        title: "Date",
        name: "date"
      },
      {
        title: "Customer Name",
        name: "customer_name"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "Area",
        name: "area"
      },
      {
        title: "Address",
        name: "address"
      },
      {
        title: "Specialty",
        name: "customer_specialty"
      },
      {
        title: "Parameter",
        name: "customer_params"
      }
    ],
    submitted_reports : []
  }),
  created() {
    this.$store.dispatch("getCoachingReports");
  },
  computed: {
    customers() {
      return this.$store.getters.activeCustomers;
    },
    isCustomersFetched() {
      return this.$store.getters.isCustomersFetched;
    },
    areas() {
      let areas = filterData(this.customers, "area");
      return areas;
    },
    reports() {
      return this.$store.getters.coachingReports;
    },
    isFetched() {
      return this.$store.getters.isCoachingReportsFetched;
    }
  },
  methods: {
    /**
     * add/remove report from submitted reports
     *
     * @param {int} id [report id]
     */
    addReportToSubmitted(id) {
      let checked = event.target.checked;
      if(checked && !this.submitted_reports.includes(id)) {
        this.submitted_reports.push(id)
      } else {
        if(this.submitted_reports.includes(id)) {
          let index = this.submitted_reports.indexOf(id);
          this.submitted_reports.splice(index, 1);
        }
      }
    },
    /**
     * add or remove all reports from submitted reports
     *
     *
     */
    addAllToSubmiited() {
      let target = event.target;
      let inputs = document.querySelectorAll('#coach-report-table input[type="checkbox"]');
      if(target.checked) {
        this.submitted_reports = this.reports.map(report => report.id);
        inputs.forEach(input => input.checked = true);
      } else {
        this.submitted_reports = [];
        inputs.forEach(input => input.checked = false);
      }
    },
    /**
     * submit reports
     *
     */
    submitReports() {
      if(!this.submitted_reports.length) {
        this.$toasted.error('No report selected');
        return;
      }
      let data = {
        ids: JSON.stringify(this.submitted_reports)
      }
      httpCall.post('dm/v1/reports/coach/submit', data)
      .then(({data}) => {
        this.handleResponse(data, data => {
            this.$store.dispatch('getCoachingReports', true);
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  tr,td,th {
    vertical-align: middle !important;
  }
</style>
