<template>
  <div class="row mx-auto">
    <!-- left side -->
    <div class="col-lg-3">
      <!-- follow up control -->
      <div class="p-2 rounded border">
        <!-- coach control -->
        <div class="form-group">
          <label for="" class="form-text">Coach</label>
          <select
            name="coach"
            id="coach"
            v-model="coach"
            class="form-control form-control-sm"
          >
            <option :value="null">All</option>
            <option
              :value="coach"
              v-for="coach in districtManagers"
              :key="coach.id"
              >{{ coach.name }}</option
            >
          </select>
        </div>

        <!-- rep control -->
        <div class="form-group">
          <label for="" class="form-text">Rep</label>
          <select
            name="rep"
            id="rep"
            v-model="rep"
            class="form-control form-control-sm"
          >
            <option :value="null">Select Rep</option>
            <option :value="rep" v-for="rep in reps" :key="rep.id">{{
              rep.name
            }}</option>
          </select>
        </div>

        <!-- control button -->
        <div>
          <button
            class="btn btn-sm btn-block btn-primary"
            @click="getAllReports"
            :disabled="!rep"
          >
            <span class="fa fa-check-circle"></span>
            <span>View</span>
          </button>

          <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
            <span class="fa fa-chevron-circle-left"></span>
            <span>Back</span>
          </router-link>
        </div>
      </div>
    </div>
    <!-- right side -->
    <div class="px-0 shadow rounded pb-5 col-lg-9">
      <p class="alert alert-success">
        <span class="fa fa-chart-bar"></span>
        <span>Coach Follow Up</span>
      </p>
      <div class="p-2">
        <div class="p-2 text-right" v-if="reports.length">
          <button class="btn btn-sm btn-success" @click="exportToExcel">
            <span class="fa fa-file-excel"></span>
            <span>Export</span>
          </button>
        </div>
        <div v-if="reports.length" id="rep_follow_up" >
          <div class="my-2 p-2">
            <p>Working days : <span class="badge badge-primary">{{ summery.workingDays }}</span></p>
            <p>Covered Customers : <span class="badge badge-primary">{{ summery.coveredCustomers }}</span></p>
          </div>
          <div style="max-height:600px;overflow:auto">
            <div v-for="report in reports" :key="report.id" class="p-2 shadow my-2">
              <coach-report-component :report="report" />
            </div>
          </div>
        </div>
        <div v-else-if="!loadingStarted">
          <no-data-to-show :title="`Select Rep to view follow up`" />
        </div>
        <div v-else-if="fetched">
          <no-data-to-show :title="`No Coach reports for selected rep`" />
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import CoachReportComponent from "../../../components/CoachReportComponent.vue";
import NoDataToShow from "../../../components/NoDataToShow.vue";
import { ExportToExcel } from '../../../helpers/helpers';
import { httpCall } from "../../../helpers/http-service";
export default {
  components: { NoDataToShow, CoachReportComponent },

  computed: {
    /* all reps */
    reps() {
      if(this.coach) {
        let reps = JSON.parse(this.coach.user_relations).reps;
        return this.$store.getters.allReps.filter(rep => reps.includes(rep.id));
      }
      return this.$store.getters.allReps;
    },
    /* all district managers */
    districtManagers() {
      return this.$store.getters.allDm;
    },
    summery() {
      let summery = {}
      if(this.reports.length) {
        let workingDays = new Set();
        let coveredCustomers = new Set();
        this.reports.map(report => {
          workingDays.add(report.visit_date);
          coveredCustomers.add(report.customer.id);
        })
        summery['workingDays'] = workingDays.size;
        summery['coveredCustomers'] =coveredCustomers.size;
      }
      return summery;
    }
  },
  data: () => ({
    reports: [],
    fetched: false,
    loadingStarted: false,
    coach: null,
    rep: null
  }),
  methods: {
    /**
     * get all coach reports
     */
    getAllReports() {
      if (!this.rep) {
        this.$toasted.error("You must pick a rep");
        return;
      }
      this.loadingStarted = true;
      this.fetched = false;
      this.reports = [];
      httpCall
        .get("rm/v1/reports/coach-follow-up", {
          rep: this.rep.id,
          coach: this.coach ? this.coach.id : null
        })
        .then(({ data }) => {
          this.reports = data.data;
          this.fetched = true;
        })
        .catch(err => console.log(err));
    },
    exportToExcel() {
      ExportToExcel('#rep_follow_up', `${this.rep.name} coach follow up`)
    }
  }
};
</script>

<style></style>
