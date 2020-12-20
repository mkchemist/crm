<template>
  <div>
    <div class="px-0 shadow rouned pb-4">
      <p class="alert alert-success">
        <span><i class="fa fa-address-card"></i></span>
        <span>View Hospital {{ hospital ? hospital.name : null }}</span>
      </p>
      <div class="p-2 text-right">
        <router-link to="/workplaces" class="btn btn-sm btn-dark">
          <span><i class="fa fa-chevron-circle-left"></i></span>
          <span>back</span>
        </router-link>
        <router-link
          :to="`/workplaces/hospital/edit/${$route.params.id}`"
          class="btn btn-sm btn-warning"
        >
          <span><i class="fa fa-edit"></i></span>
          <span>edit</span>
        </router-link>
      </div>
      <div class="p-2">
        <!-- hospital info -->
        <div class="border p-2 rounded">
          <p class="lead text-muted">Hospital Info.</p>
          <hr />
          <div class="row mx-auto" v-if="hospital">
            <div class="col-lg">
              <p class="mb-0 small">
                Name:
                <span class="font-weight-bold text-primary">{{
                  hospital.name
                }}</span>
              </p>
              <p class="mb-0 small">
                Type:
                <span class="font-weight-bold text-primary">{{
                  hospital.type
                }}</span>
              </p>
              <p class="mb-0 small">
                Phone:
                <span class="font-weight-bold text-primary">{{
                  hospital.phone
                }}</span>
              </p>
            </div>
            <div class="col-lg">
              <p class="mb-0 small">
                Address:
                <span class="font-weight-bold text-primary">{{
                  hospital.address
                }}</span>
              </p>
              <p class="mb-0 small">
                Brick:
                <span class="font-weight-bold text-primary">{{
                  hospital.brick
                }}</span>
              </p>
            </div>
          </div>
          <div v-else-if="hospital_error" class="text-center">
            <p>
              <span><i class="fa fa-exclamation-triangle fa-4x"></i></span>
            </p>
            <p class="lead">{{ hospital_error }}</p>
          </div>
          <loader-component v-else />
        </div>
        <!-- hospital Department -->
        <div class="border p-2 rounded my-2">
          <p class="lead text-muted">Hospital Departments</p>
          <hr />
          <!-- add new department button -->
          <div class="p-2 text-right">
            <button
              class="btn btn-sm btn-primary"
              @click="openAddDepartmentCard"
            >
              <span><i class="fa fa-plus-circle"></i></span>
              <span>Add</span>
            </button>
          </div>

          <!-- add new department component -->
          <div class="border my-2 p-3 bg-light" v-if="open_add_card">
            <add-workplace-department
              @onCancel="closeAddDepartmentCard"
              @onAdd="addDepartment"
            />
          </div>
          <!-- workplace departments components -->
          <div v-if="hospital && hospital.depart.length">
            <workplace-department-component
              :data="hospital.depart"
              @onEdit="editDepartment"
              @onDelete="deleteDeparts"
            />
          </div>

          <div v-else-if="departments_error" class="text-center">
            <p>
              <span><i class="fa fa-exclamation-triangle fa-4x"></i></span>
            </p>
            <p class="lead">{{ departments_error }}</p>
          </div>
          <div v-else-if="fetched">
            <no-data-to-show />
          </div>
          <loader-component v-else />
        </div>
        <div class="my-2 border p-2 rounded">
          <p class="lead text-muted">Hospital Plans</p>
          <div class="p-2 row mx-auto align-items-center">
            <router-link to="/planner/add-am" class="btn btn-sm btn-primary">
              <span class="fa fa-plus-circle"></span>
              <span>Add</span>
            </router-link>
            <input type="checkbox" class="mx-2" @click="toggleOtherRepsPlans" />
            <span class="small ">Other reps</span>
            <div class="form-inline p-2 border rounded mx-2">
              <label class="small text-muted">from</label>
              <input
                type="date"
                class="form-control form-control-sm col-lg mx-2"
                v-model="plan_start"
              />
              <label class="small text-muted">to</label>
              <input
                type="date"
                class="form-control form-control-sm col-lg mx-2"
                v-model="plan_end"
              />
              <a
                href=""
                @click.prevent="resetPlans"
                class="badge badge-primary"
              >
                <span class="fa fa-redo"></span>
              </a>
            </div>
          </div>
          <div class="p-2">
            <table class="table table-sm small" v-if="plans.length">
              <thead>
                <tr class="bg-success text-light">
                  <th>Date</th>
                  <th v-if="view_other_reps_plans">Rep</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="plan in plansCollection" :key="plan.id">
                  <td>{{ plan.plan_date }}</td>
                  <td v-if="view_other_reps_plans">{{ plan.user.name }}</td>
                  <td>{{ plan.submitted ? "Submitted" : "No" }}</td>
                </tr>
              </tbody>
            </table>
            <div v-else-if="fetched">
              <no-data-to-show />
            </div>
            <loader-component v-else></loader-component>
          </div>
        </div>
        <!-- hospital Reports -->
        <div class="border p-2 rounded my-2">
          <p class="lead text-muted">Hospital Reports</p>
          <div class="p-2 row mx-auto align-items-center" v-if="hospital">
            <router-link
              :to="`/reports/add/am/${hospital.id}`"
              class="btn btn-sm btn-primary"
            >
              <span><i class="fa fa-plus-circle"></i></span>
              <span>new report</span>
            </router-link>
            <input
              type="checkbox"
              class="mx-2"
              @click="toggleOtherRepsReports"
            />
            <span class="small">Other reps</span>
            <div class="form-inline border rounded mx-2 p-2">
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
          <div class="p-2" v-if="Object.keys(reports).length">
            <table class="table table-sm small table-responsive-sm">
              <thead>
                <tr class="bg-success text-light">
                  <td>Customer</td>
                  <td v-if="view_other_reps_reports">Rep</td>
                  <td>Comment</td>
                  <td>Products</td>
                  <td>Feedback</td>
                </tr>
              </thead>
              <tbody v-for="(date, i) in reportsCollection" :key="i">
                <tr class="bg-secondary">
                  <td colspan="5">
                    <a
                      :href="`#details_${i}`"
                      data-toggle="collapse"
                      class="text-light text-decoration-none"
                      >{{ i }}</a
                    >
                  </td>
                </tr>
                <tr
                  v-for="report in date"
                  :key="report.id"
                  :id="'details_' + i"
                  class="collapse"
                >
                  <td>{{ report.customer.name }}</td>
                  <td v-if="view_other_reps_reports">{{ report.user.name }}</td>
                  <td>{{ report.comment }}</td>
                  <td>
                    <ul
                      v-for="(product, i) in JSON.parse(report.products)"
                      :key="i"
                      class="nav border-bottom"
                    >
                      <li
                        v-for="(val, key) in product"
                        :key="key"
                        class="nav-item col-12"
                      >
                        <span
                          >{{ key }} :<span
                            class="font-weight-bold text-primary"
                            >{{ val }}</span
                          ></span
                        >
                      </li>
                    </ul>
                  </td>
                  <td>{{ report.general_feedback }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="p-2" v-else-if="fetched">
            <no-data-to-show />
          </div>
          <loader-component v-else></loader-component>
        </div>
        <!-- end of hospital Reports -->
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
import WorkplaceDepartmentComponent from "../../components/WorkplaceDepartment";
import AddWorkplaceDepartment from "../../components/AddWorkplaceDepartment";
import NoDataToShow from "../../../components/NoDataToShow";
import { filterByDate } from "../../../helpers/helpers";
export default {
  created() {
    this.getHospital();
  },
  data: () => ({
    hospital: null,
    reports: [],
    plans: [],
    fetched: false,
    hospital_error: null,
    departments: [],
    departments_error: null,
    open_add_card: false,
    view_other_reps_plans: false,
    view_other_reps_reports: false,
    other_reps_plans: [],
    other_reps_reports: [],
    plan_start: null,
    plan_end: null,
    report_start: null,
    report_end: null
  }),
  components: {
    WorkplaceDepartmentComponent,
    AddWorkplaceDepartment,
    NoDataToShow
  },
  computed: {
    plansCollection() {
      let plans = [];
      if (this.view_other_reps_plans) {
        plans = this.other_reps_plans;
      } else {
        plans = this.plans;
      }
      plans = filterByDate(plans, "plan_date", {
        start: this.plan_start,
        end: this.plan_end
      });
      return plans;
    },
    reportsCollection() {
      let reports = {};
      if (this.view_other_reps_reports) {
        reports = this.other_reps_reports;
      } else {
        reports = this.reports;
      }
      let res = {};
      Object.keys(reports).map(day => {
        let data = filterByDate(reports[day], "visit_date", {
          start: this.report_start,
          end: this.report_end
        });
        if (data.length) {
          res[day] = data;
        }
      });
      reports = res;
      return reports;
    }
  },
  methods: {
    /**
     * get hospital id
     */
    getHospitalId() {
      return this.$route.params.id;
    },
    /**
     * get hospital
     *
     */
    getHospital() {
      this.fetched = false;
      let id = this.getHospitalId();
      httpCall.get("rep/v1/workplaces/" + id).then(({ data }) => {
        this.fetched = true;
        data.message = "hospital loaded";
        this.handleResponse(data, data => {
          this.hospital = data.data;
          this.reports = data.reports;
          this.plans = data.plans;
        });
      });
    },
    /**
     * open add card
     */
    openAddDepartmentCard() {
      this.open_add_card = true;
    },
    /**
     * close add card
     *
     */
    closeAddDepartmentCard() {
      this.open_add_card = false;
    },
    /**
     * add department
     *
     * @param {object} department
     */
    addDepartment(department) {
      let id = this.getHospitalId();
      httpCall
        .post("rep/v1/workplace-department", {
          ...department,
          workplace_id: id
        })
        .then(({ data }) => {
          data.message = "department added";
          this.handleResponse(data, data => {
            this.getHospital();
            this.$store.dispatch("workplaceGetAll");
          });
        });
    },
    /**
     * edit department
     *
     * @param {object} department
     */
    editDepartment(department) {
      httpCall
        .post("rep/v1/workplace-department/" + department.id, {
          ...department,
          _method: "PUT"
        })
        .then(({ data }) => {
          data.message = data.data;
          this.handleResponse(data, data => {
            this.getHospital();
            this.$store.dispatch("workplaceGetAll");
          });
        });
    },
    /**
     * delete department
     *
     * @param {int} id
     */
    deleteDeparts(id) {
      console.log(id);
      httpCall
        .post("rep/v1/workplace-department/" + id, {
          _method: "DELETE"
        })
        .then(({ data }) => {
          this.$toasted.success("Department deleted");
          this.getHospital();
        });
    },
    /**
     * toggle view of other reps plans
     * and fetching other reps plans if
     * not fetched
     */
    toggleOtherRepsPlans() {
      if (event.target.checked) {
        this.view_other_reps_plans = true;
        if (!this.other_reps_plans.length) {
          httpCall
            .get("rep/v1/other-reps/workplace-plans/" + this.$route.params.id)
            .then(({ data }) => {
              this.handleResponse(data, data => {
                this.other_reps_plans = data.data;
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      } else {
        this.view_other_reps_plans = false;
      }
    },
    /**
     * toggle view of other reps reports and
     * view other reps reports if not
     * fetched
     */
    toggleOtherRepsReports() {
      if (event.target.checked) {
        this.view_other_reps_reports = true;
        if (!this.other_reps_reports.length) {
          httpCall
            .get("rep/v1/other-reps/workplace-reports/" + this.$route.params.id)
            .then(({ data }) => {
              this.handleResponse(data, data => {
                this.other_reps_reports = data.data;
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      } else {
        this.view_other_reps_reports = false;
      }
    },
    resetPlans() {
      this.plan_start = null;
      this.plan_end = null;
    },
    resetReports() {
      this.report_start = null;
      this.report_end = null;
    }
  }
};
</script>

<style lang="scss" scoped>
tr,
td,
th {
  white-space: pre-wrap;
}
</style>
