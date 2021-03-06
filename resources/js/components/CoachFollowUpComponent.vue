<template>
  <div class="row mx-auto">
    <!-- left side -->
    <div class="col-lg-3">
      <!-- follow up control -->
      <div class="p-2 rounded border">
        <!-- coach control -->
        <div class="form-group" v-if="districtManagers.length">
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
            :disabled="!reps.length"
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

          <router-link :to="backUrl" class="btn btn-sm btn-block btn-dark">
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
            <table class="table table-bordered table-sm small table-striped">
              <thead>
                <tr>
                  <th>Coaches</th>
                  <th>Total Visits</th>
                  <th>Covered Customers</th>
                  <th>Working Days</th>
                  <th>Average per day</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(coach,i) in summery" :key="`summery_coach_${i}`">
                  <td>{{ coach.name }}</td>
                  <td>{{ coach.totalVisits }}</td>
                  <td>{{ coach.coveredCustomers }}</td>
                  <td>{{ coach.workingDays }}</td>
                  <td>{{ coach.totalVisits / coach.workingDays }}</td>
                </tr>
              </tbody>
            </table>
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
import { COACH_REPORT } from '../helpers/constants';
import { ExportToExcel, filterData } from '../helpers/helpers';
import { httpCall } from "../helpers/http-service";
import CoachReportComponent from './CoachReportComponent.vue';
import NoDataToShow from './NoDataToShow.vue';
export default {
  components: { NoDataToShow, CoachReportComponent },
  props: {
    reps: {
      type:Array,
      default: () => []
    },
    districtManagers: {
      type: Array,
      default: () => []
    },
    backUrl: {
      type: String,
      default: () => "/reports"
    }
  },
  computed: {

    summery() {
      let summery = {}
      if(this.reports.length) {
        try{
          let coachReports = filterData(this.reports, 'coach.name')
          for(let key in coachReports) {
            if(!summery[key]) {
              summery[key] = {};
            }
            summery[key]['name'] = key;
            summery[key]['workingDays'] = Object.keys(filterData(coachReports[key],'visit_date')).length;
            summery[key]['coveredCustomers'] = Object.keys(filterData(coachReports[key],'customer_id')).length;
            summery[key]['totalVisits'] = coachReports[key].length;
          }

        }catch(e) {
          console.log(e)
        }
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
        .get("v1/coach-follow-up", {
          rep: this.rep.id,
          coach: this.coach ? this.coach.id : null
        })
        .then(({ data }) => {
          data.data.forEach(report => {
            try {
              report.data = JSON.parse(report.data)
            } catch(e) {
              report.data = COACH_REPORT
            }
          })
          this.reports = data.data;
          this.fetched = true;
        })
        .catch(err => console.log(err));
    },
    exportToExcel() {
      let table = document.getElementById('rep_follow_up');
      let target = table.cloneNode();
      target.innerHTML = table.innerHTML;
      this.createTableExcelStyling(target);
      ExportToExcel(target, `${this.rep.name} coach follow up`)
    },
    createTableExcelStyling(dom) {
      let tables = dom.querySelectorAll('table');
      let rows = dom.querySelectorAll('tr');
      let cells = dom.querySelectorAll('td');
      let headers = dom.querySelectorAll('.export-table-headers');
      tables.forEach(table => {
        table.style.border="1px solid";
      })
      rows.forEach(row => {
        row.style.border="1px solid";
      })
      cells.forEach(cell => {
        cell.style.border="1px solid";
      })
      headers.forEach(header => {
        header.style.backgroundColor = "lightblue";
      })
    }
  }
};
</script>

<style></style>
