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
        <button class="btn btn-primary btn-sm" @click="$store.dispatch('getCoachingReports', true)">
          <span><i class="fa fa-redo"></i></span>
          <span>reload list</span>
        </button>
        <button
          class="btn btn-sm btn-success"
          :disabled="!submitted_reports.length"
          @click="submitReports"
        >
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
            <th><input type="checkbox" @click="addAllToSubmiited" /></th>
            <th>Actions</th>
          </template>
          <template v-slot:head>
            <th>Submitted</th>
          </template>
          <template v-slot:body:before="{ item }">
            <td>
              <input
                type="checkbox"
                @click="addReportToSubmitted(item.id)"
                :disabled="item.coach_submit === 1"
                :checked="item.coach_submit === 1"
              />
            </td>
            <td>
              <div v-if="item.coach_submit === 0">
                <router-link
                  :to="`/reports/add/coach-report/${item.id}`"
                  class="badge badge-primary custom-btn"
                >
                  <span><i class="fa fa-check"></i></span>
                  <span>Coach</span>
                </router-link>
                <button
                  class="badge badge-danger custom-btn"
                  @click="openRejectModal(item.id)"
                >
                  <span><i class="fa fa-times"></i></span>
                  <span>Reject</span>
                </button>
              </div>
              <div v-else>
                <router-link
                  :to="`/reports/add/coach-report/${item.id}`"
                  class="badge badge-primary custom-btn"
                >
                  <span><i class="fa fa-book-open"></i></span>
                  <span>View</span>
                </router-link>
              </div>
            </td>
          </template>
          <template v-slot:body="{ item }">
            <td class="text-center">
              <span v-if="item.coach_submit"
                ><i class="fa fa-check text-success"></i
              ></span>
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
    <modal-fade :show="show_reject_modal" id="reject_modal_fade">
      <template v-slot:header>
        <span class="font-weight-bold text-danger">
          Are you sure, you want to reject this report ?
        </span>
      </template>
      <template v-slot:body>
        <div class="text-center">
          <button class="btn btn-danger btn-sm" @click="rejectCoachReport">
            <span><i class="fa fa-trash"></i></span>
            <span>reject</span>
          </button>
          <button class="btn btn-dark btn-sm" @click="show_reject_modal = false">
            <span><i class="fa fa-chevron-circle-left"></i></span>
            <span>cancel</span>
          </button>
        </div>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import { filterData } from "../../../helpers/helpers";
import TableComponent from "../../../components/TableComponent";
import { httpCall } from "../../../helpers/http-service";
import ModalFade from "../../../components/ModalFade";
export default {
  components: {
    TableComponent,
    ModalFade
  },
  data: () => ({
    heads: [
      {
        title: "Rep",
        name: "rep"
      },
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
    submitted_reports: [],
    show_reject_modal : false,
    rejected_report: false
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
      if (checked && !this.submitted_reports.includes(id)) {
        this.submitted_reports.push(id);
      } else {
        if (this.submitted_reports.includes(id)) {
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
      let inputs = document.querySelectorAll(
        '#coach-report-table input[type="checkbox"]'
      );
      if (target.checked) {
        this.reports.map(report => {
          if (!report.coach_submit) {
            this.submitted_reports.push(report.id);
          }
        });
        inputs.forEach(input => {
          if (input.disabled === false) {
            input.checked = true;
          }
        });
      } else {
        this.submitted_reports = [];
        inputs.forEach(input => {
          if (input.disabled === false) {
            input.checked = false;
          }
        });
      }
    },
    /**
     * submit reports
     *
     */
    submitReports() {
      if (!this.submitted_reports.length) {
        this.$toasted.error("No report selected");
        return;
      }
      let data = {
        ids: JSON.stringify(this.submitted_reports)
      };
      httpCall.post("dm/v1/reports/coach/submit", data).then(({ data }) => {
        this.handleResponse(data, data => {
          this.$store.dispatch("getCoachingReports", true);
        });
      });
    },
    openRejectModal(id) {
      this.show_reject_modal = true;
      this.rejected_report = id;
    },
    rejectCoachReport() {
      if(!this.rejected_report) {
        return;
      }
      let id = this.rejected_report;
      httpCall.post("dm/v1/reports/coach/"+id, {_method: 'DELETE'})
      .then(res => {
        let data = res.data;
        this.handleResponse(data, data => {
          this.rejected_report = false;
          this.show_reject_modal = false;
          this.$store.dispatch("getCoachingReports", true);
        }, data => {
          this.rejected_report = false;
          this.show_reject_modal = false;
        });
      })
    }
  }
};
</script>

<style lang="scss" scoped>
tr,
td,
th {
  vertical-align: middle !important;
}
</style>
