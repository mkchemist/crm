<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-address-card"></i></span>
        <span class="font-weight-bold">View Pharmacy {{ pharmacy ? pharmacy.name : null }} Card</span>
      </p>
      <div class="p-2 text-right">
        <router-link to="/workplaces/pharmacies" class="btn btn-sm btn-dark">
          <span><i class="fa fa-chevron-circle-left"></i></span>
          <span>back</span>
        </router-link>
        <router-link :to="`/workplaces/pharmacy/edit/${$route.params.id}`" class="btn btn-sm btn-warning">
          <span><i class="fa fa-edit"></i></span>
          <span>edit</span>
        </router-link>
      </div>
      <div class="p-2" v-if="pharmacy">
        <div class="border my-2 p-2 rounded">
          <p class="lead text-muted">Pharmacy Info.</p>
          <hr>
          <div class="row mx-auto">
            <div class="col-lg">
              <p  class="mb-0 small">Name: <span class="text-primary">{{ pharmacy.name }}</span></p>
              <p  class="mb-0 small">Type: <span class="text-primary">{{ pharmacy.type }}</span></p>
              <p  class="mb-0 small">Key Person: <span class="text-primary">{{ pharmacy.key_person }}</span></p>
            </div>
            <div class="col-lg">
              <p  class="mb-0 small">Address: <span class="text-primary">{{ pharmacy.address }}</span></p>
              <p  class="mb-0 small">Brick: <span class="text-primary">{{ pharmacy.brick }}</span></p>
            </div>
          </div>
        </div>
        <div class="my-2 border p-2 rounded">
          <p class="lead text-muted">Pharmacy Reports</p>
          <div class="p-2 row mx-auto align-items-center">
            <router-link :to="`/reports/add/pharmacy/${pharmacy.id}`" class="btn btn-sm btn-primary">
              <span><i class="fa fa-plus-circle"></i></span>
              <span>report</span>
            </router-link>
            <input type="checkbox" class="mx-2" @click="toggleOtherRepsReports">
            <span class="small">Other reps</span>
            <div class="form-inline p-2 mx-2 border rounded">
               <label class="small text-muted">from</label>
              <input
                type="date"
                class="form-control form-control-sm col-lg mx-2"
                v-model="report_start"
              />
              <label class="small text-muted">to</label>
              <input
                type="date"
                class="form-control form-control-sm col-lg mx-2"
                v-model="report_end"
              />
              <a
                href=""
                @click.prevent="resetReports"
                class="badge badge-primary"
              >
                <span class="fa fa-redo"></span>
              </a>
            </div>
          </div>
          <div v-if="reportCollection.length">
            <table class="table table-sm small">
              <thead class="bg-success text-light">
                <tr>
                  <th>Date</th>
                  <th v-if="view_other_reps_reports">Rep</th>
                  <th>Products</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in reportCollection" :key="report.id">
                  <td>{{ report.visit_date }}</td>
                  <td v-if="view_other_reps_reports">{{ report.user.name }}</td>
                  <td>
                    <ul v-for="(product,i) in JSON.parse(report.products)" :key="i" class="nav">
                      <li class="nav-item col-12" v-for="(val, key) in product" :key="`${key}-${i}`">
                        <span>{{ key.toUpperCase() }}</span> : <span class="font-weight-bold text-primary">{{ val }}</span>
                      </li>
                    </ul>
                  </td>
                  <td>{{ report.general_feedback }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <no-data-to-show title="No reports found" />
          </div>
        </div>
      </div>
      <loader-component v-else />
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../../helpers/http-service';
import NoDataToShow from "../../../components/NoDataToShow";
import { filterByDate } from '../../../helpers/helpers';

export default {
  mounted() {
    this.loadPharmacy()
  },
  computed: {
    reportCollection() {
      let reports = [];
      if(!this.view_other_reps_reports) {
        reports = this.reports;
      } else {
        reports = this.other_reprts_reports;
      }

      reports = filterByDate(reports, 'visit_date', {start: this.report_start, end: this.report_end});
      return reports;
    }
  },
  methods: {
    /** get pharmacy id */
    getPharmacyId() {
      return this.$route.params.id;
    },
    /** load pharmacy */
    loadPharmacy() {
      let id = this.getPharmacyId();
      httpCall.get('rep/v1/pharmacies/'+id)
      .then(({data}) => {
        data.message = "Pharmacy loaded";
        this.handleResponse(data, data => {
          this.pharmacy = data.data;
          this.reports = data.data.report;
        })
      });
    },
    /** toggle other reps reports */
    toggleOtherRepsReports() {
      if(event.target.checked) {
        this.view_other_reps_reports = true;
        if(!this.other_reprts_reports.length) {
          httpCall.get('rep/v1/other-reps/pharmacy-reports/'+this.$route.params.id)
          .then(({data}) => {
            this.handleResponse(data, data => {
              this.other_reprts_reports = data.data;
            })
          }).catch(err => {
            console.log(err)
          })
        }
      } else {
        this.view_other_reps_reports = false;
      }
    },
    /** reset pharmacy reports */
    resetReports() {
      this.report_start = null;
      this.report_end = null;
    }
  },
  data: () => ({
    pharmacy: null,
    reports: [],
    view_other_reps_reports: false,
    other_reprts_reports: [],
    report_start: null,
    report_end: null
  }),
  components: {
    NoDataToShow
  }
}
</script>

<style>

</style>
