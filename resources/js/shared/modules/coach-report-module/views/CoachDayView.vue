<template>
  <div class="my-2 px-0 shadow pb-5 rounded">
    <p class="alert alert-success">
      <span class="fa fa-handshake"></span>
      <span class="font-weight-bold"
        >Coaching report of {{ $route.query.date }}</span
      >
    </p>
    <div class="p-2">
      <div class="p-2" v-if="reports.length">
        <div class="p-2 my-2 border rounded">
          <p class="lead text-muted">Coaching Day Summery</p>
          <div class="p-2">
            <table
              class="table table-sm small table-bordered table-striped table-responsive"
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Coach</th>
                  <th>Rep</th>
                  <th>Total Visits</th>
                  <th>Brick</th>
                  <th>Area</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ reports[0].visit_date }}</td>
                  <td>{{ reports[0].coach.name }}</td>
                  <td>{{ reports[0].rep.name }}</td>
                  <td>{{ reports.length }}</td>
                  <td>{{ reports[0].customer.brick }}</td>
                  <td>{{ reports[0].customer.area }}</td>
                  <td>{{ reports[0].day_submitted ? "TRUE" : "FALSE" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <data-table-component :cols="cols" :data="reports" :buttons="buttons" />
      </div>
      <div class="p-2" v-else-if="fetched">
        <no-data-to-show
          :title="`Error in loading this day reports`"
          :errorFlag="true"
          :bold="true"
        />
      </div>
      <loader-component v-else></loader-component>
      <div v-if="reports.length && canSubmit">
        <modal-fade
          :show="showSubmitModal"
          @onClose="closeSubmitModal"
          :headerStyle="`bg-success text-light`"
          :footer="true"
        >
          <template v-slot:header>
            <span>Submit Day {{ reports[0].visit_date }} </span>
          </template>
          <template v-slot:body>
            <day-submit-summery-component :summery="daySummery" />
          </template>
          <template v-slot:footer>
            <!-- Control start -->
            <div class="form-group text-right">
              <button class="btn btn-sm btn-success" @click="submitDay">
                <span class="fa fa-save"></span>
                <span>Save</span>
              </button>
            </div>
          </template>
        </modal-fade>
      </div>
    </div>
  </div>
</template>

<script>
import DataTableComponent from "../../../../components/DataTableComponent.vue";
import ModalFade from "../../../../components/ModalFade.vue";
import NoDataToShow from "../../../../components/NoDataToShow.vue";
import { VISIT_SUBMIT_SUMMERY } from "../../../../helpers/constants";
import { httpCall } from "../../../../helpers/http-service";
import DaySubmitSummeryComponent from "../component/DaySubmitSummeryComponent.vue";
export default {
  mounted() {
    this.startFetchingRequest();
  },
  components: {
    NoDataToShow,
    DataTableComponent,
    ModalFade,
    DaySubmitSummeryComponent
  },
  computed: {
    buttons() {
      let buttons = [
        {
          text: '<span class="fa fa-chevron-circle-left mx-1"></span> back',
          action: (e, dt) => this.$router.push("/coach/list")
        },
        {
          text: `<span class="fa fa-book-reader mx-1"></span> View`,
          action: (e, dt) => {
            let row = dt.rows({ selected: true }).data()[0];
            if (!row) {
              this.$toasted.info("You must pick a visit", {
                icon: "exclamation-triangle"
              });
              return;
            }
            this.$router.push("/coach/report/" + row.id);
          }
        }
      ];
      if (this.canSubmit) {
        let label = this.reports[0].day_submitted === 1 ? "Edit" : "Submit";
        buttons.push({
          text: `<span class="fa fa-check-circle mx-1"></span> ${label}`,
          action: () => {
            this.openSubmitModal();
          }
        });
      }
      if (this.owner.id === this.reports[0].coach_id || this.owner.role === "admin") {
        buttons.push({
          text: '<span class="fa fa-trash mx-1"></span> Delete day',
          action: () => {
            this.removeDay();
          }
        });
      }
      return buttons;
    },
    owner() {
      return this.$store.state.CoachReportModule.moduleUser;
    },
    canSubmit() {
      let user = this.owner.id;
      if (!this.reports[0]) {
        return false;
      }
      try {
        if (
          this.reports[0].day_submitted === 0 &&
          this.reports[0].coach_id === user
        ) {
          return true;
        }
        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  },
  data: () => ({
    reports: [],
    fetched: false,
    cols: [
      {
        title: "Date",
        name: "visit_date"
      },
      {
        title: "Coach",
        name: "coach.name"
      },
      {
        title: "Rep",
        name: "rep.name"
      },
      {
        title: "Line",
        name: row => JSON.parse(row.rep.line).join(" | ")
      },
      {
        title: "Customer",
        name: "customer.name"
      },
      {
        title: "Specialty",
        name: "customer.specialty"
      },
      {
        title: "Title",
        name: "customer.title"
      },
      {
        title: "Parameter",
        name: row => {
          if (row.customer.params.length) {
            return row.customer.params[0].current;
          }
          return "NN";
        }
      },
      {
        title: "Brick",
        name: "customer.brick"
      },
      {
        title: "Area",
        name: "customer.area"
      },
      {
        title: "District",
        name: "customer.district"
      },
      {
        title: "Territory",
        name: "customer.territory"
      }
    ],
    showSubmitModal: false,
    daySummery: {}
  }),
  methods: {
    /**
     * collect request parameter
     *
     * @return {Object}
     */
    createRequestParameter() {
      return {
        rep: parseInt(this.$route.query.rep),
        coach: parseInt(this.$route.query.coach),
        date: this.$route.query.date
      };
    },
    /**
     * start fetching current request
     *
     *
     */
    startFetchingRequest() {
      let request = this.createRequestParameter();
      this.reports = [];
      this.fetched = false;
      return httpCall
        .get("v1/coach-reports/view/day", request)
        .then(({ data }) => {
          this.handleResponse(
            data,
            data => {
              data.data.forEach(report => {
                try {
                  report.day_summery = JSON.parse(report.day_summery);
                } catch (e) {
                  report.day_summery = VISIT_SUBMIT_SUMMERY;
                }
              });
              this.reports = data.data;
              this.fetched = true;
            },
            data => {
              this.$router.back();
            }
          );
          this.daySummery = this.reports[0].day_summery;
        })
        .catch(err => console.log(err));
    },
    /**
     * open submit modal
     *
     */
    openSubmitModal() {
      this.showSubmitModal = true;
    },
    /**
     * close submit modal
     */
    closeSubmitModal() {
      this.showSubmitModal = false;
    },
    /**
     * submit all day
     *
     */
    submitDay() {
      this.showSubmitModal = false;
      let request = this.createRequestParameter();
      request["summery"] = JSON.stringify(this.daySummery);
      httpCall
        .post("v1/coach-reports/day/submit", request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("fetchCoachReportsModuleReports", {
              force: true
            });
            this.startFetchingRequest();
          });
        })
        .catch(err => console.log(err));
    },
    /**
     * remove coaching day
     *
     *
     */
    removeDay() {
      this.$swal({
        title: "Are you sure?",
        text: "you want to delete this coaching day",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(res => {
        if(res.isConfirmed) {
          let request = this.createRequestParameter();
          httpCall
            .post("v1/coach-reports/day/delete", request)
            .then(({ data }) => {
              this.handleResponse(data, data => {
                this.$swal({
                  text: 'Deleted',
                  icon: 'success'
                });
                this.$router.back();
                this.$store.dispatch('fetchCoachReportsModuleReports', {force: true})
              });
            })
            .catch(err => console.log(err));
        }
      });
    }
  }
};
</script>

<style></style>
