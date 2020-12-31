<template>
  <div>
    <div class="px-0 shadow pb-3 rounded">
      <p class="alert alert-success">
        <span class="font-weight-bold">
          View Customer {{ customer ? customer.name : null }} card
        </span>
      </p>
      <div class="p-2">
        <!-- ctrl buttons section  -->
        <div v-if="customer">
          <div class="text-right p-2 m-1">
            <span class="lead">Go to :</span>
            <select
              v-if="customers.length"
              class="mr-3"
              @change="navigateToCustomer"
              v-model="$route.params.id"
            >
              <option
                v-for="item in customers"
                :key="item.id"
                :value="item.id"
                >{{ item.name }}</option
              >
            </select>
            <span v-else class="mr-3">
              <i class="fa fa-circle-notch fa-spin text-muted"></i>
            </span>
            <router-link to="/customers" class="btn btn-sm btn-dark">
              <span><i class="fa fa-chevron-circle-left"></i></span>
              <span>back</span>
            </router-link>
            <router-link
              :to="`/customers/edit/${customer.id}`"
              class="btn btn-sm btn-warning"
            >
              <span><i class="fa fa-edit"></i></span>
              <span>edit</span>
            </router-link>
          </div>
          <!--  Customer info section --->
          <div class="border m-1 p-2 rounded">
            <p class="lead">Customer info.</p>
            <hr />
            <div class="row mx-auto">
              <div class="col-lg">
                <p class="mb-0 small">
                  Name: <b class="text-primary">{{ customer.name }}</b>
                </p>
                <p class="mb-0 small">
                  Specialty:
                  <b class="text-primary">{{ customer.specialty }}</b>
                </p>
                <p class="mb-0 small">
                  Title: <b class="text-primary">{{ customer.title }}</b>
                </p>
                <p class="mb-0 small">
                  Parameter:
                  <b class="text-primary">{{ customer.parameter }}</b>
                </p>
                <p class="mb-0 small">
                  Frequency:
                  <b class="text-primary">{{ customer.current_freq }}</b>
                </p>
                <p class="mb-0 small">
                  Plans: <b class="text-primary">{{ customer.plans }}</b>
                </p>
              </div>
              <div class="col-lg">
                <p class="mb-0 small">
                  Address:
                  <b class="text-primary">{{
                    customer.address ? customer.address : "Null"
                  }}</b>
                </p>
                <p class="mb-0 small">
                  Brick: <b class="text-primary">{{ customer.brick }}</b>
                </p>
                <p class="mb-0 small">
                  Area: <b class="text-primary">{{ customer.area }}</b>
                </p>
                <p class="mb-0 small">
                  Phone:
                  <b class="text-primary">{{
                    customer.phone ? customer.phone : "Null"
                  }}</b>
                </p>
              </div>
            </div>
          </div>

          <!-- customer planned visits -->
          <div class="px-0 border my-2">
            <p class="alert alert-success">
              <span><i class="fa fa-calendar-alt"></i></span>
              <span class="font-weight-bold">Planned visits</span>
            </p>
            <div class="p-2">
              <div class="p-2 row mx-auto align-items-center">
                <button
                  class="btn btn-sm btn-primary"
                  @click="open_plan_modal = true"
                >
                  <span><i class="fa fa-plus-circle"></i></span>
                  <span>new plan</span>
                </button>
                <input type="checkbox" class="mx-1" @click="toggleOtherRepsPlans">
                <span class="small">Other reps</span>
                <div class="form-inline border rounded p-2 mx-2">
                  <label class="small mx-2">from</label>
                  <input type="date" class="form-control form-control-sm col-lg" v-model="plan_start">
                  <label class="small mx-2">to</label>
                  <input type="date" class="form-control form-control-sm col-lg" v-model="plan_end">
                  <a href="#" class="badge badge-primary mx-2" @click.prevent="resetPlan">
                    <span class="fa fa-redo"></span>
                  </a>
                </div>
              </div>
              <modal-fade
                :show="open_plan_modal"
                @onClose="() => (open_plan_modal = false)"
              >
                <template v-slot:header>
                  <p class="mb-0">Create new plan for {{ customer.name }}</p>
                </template>
                <template v-slot:body>
                  <div class="form-group">
                    <label for="date" class="text-muted small">Date</label>
                    <input
                      type="date"
                      name="plan_date"
                      id="plan_date"
                      class="form-control form-control-sm"
                      v-model="new_plan_date"
                    />
                  </div>
                  <div class="form-group text-right">
                    <button
                      class="btn btn-success btn-sm"
                      @click="addCustomerPlan"
                    >
                      <span><i class="fa fa-plus"></i></span>
                      <span>add</span>
                    </button>
                  </div>
                </template>
              </modal-fade>
            </div>
            <div class="p-2" v-if="planCollection.length > 0">
              <table class="table table-sm small table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th v-if="view_other_reps_plans">Rep</th>
                    <th>State</th>
                    <th>Dual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="plan in planCollection" :key="plan.id">
                    <td>{{ plan.plan_date }}</td>
                    <td v-if="plan.user">{{ plan.user.name }}</td>
                    <td>
                      {{ plan.submitted === 0 ? "not submitted" : "submitted" }}
                    </td>
                    <td>{{ plan.type }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="text-center p-2" v-else>
              <p class="lead text-muted">No planned visits</p>
              <router-link to="/planner/add-pm" class="btn btn-sm btn-primary">
                <span><i class="fa fa-plus-circle"></i></span>
                <span>Add new plan</span>
              </router-link>
            </div>
          </div>
          <!-- end of customer planned visits -->
          <!-- Customer Visits -->
          <div class="my-2 px-0 border">
            <p class="alert alert-success">
              <span><i class="fa fa-hands-helping"></i></span>
              <span class="font-weight-bold">Customer Reports</span>
            </p>
            <div class="my-2 p-2 row mx-auto align-items-center">
              <router-link :to="`/reports/add/pm/${customer.id}`" class="btn btn-sm btn-primary">
                <span><i class="fa fa-plus-circle"></i></span>
                <span>new visit</span>
              </router-link>
              <input type="checkbox" @click="toggleOtherRepsReports" class="mx-1">
              <span class="small">Other reps</span>
              <div class="form-inline p-2 mx-2 align-items-center border rounded">
                <label class="small">from</label>
                <input type="date" class="form-control form-control-sm col-lg mx-2" v-model="report_start">
                <label class="small">to</label>
                <input type="date" class="form-control form-control-sm col-lg mx-2" v-model="report_end">
                <a href="" @click.prevent="resetReport" class="badge badge-primary">
                  <span class="fa fa-redo"></span>
                </a>
              </div>
            </div>
            <div v-if="reportCollection.length">
              <table class="table table-sm small table-responsive">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th v-if="view_other_reps_report">Rep</th>
                    <th>Type</th>
                    <th>Comment</th>
                    <th>Products</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="report in reportCollection" :key="report.id">
                    <td>{{ report.visit_date }}</td>
                    <td v-if="report.user">{{ report.user.name }}</td>
                    <td>{{ report.dual_with?'Double visit': 'Single visit' }}</td>
                    <td>{{ report.comment ? report.comment : '-----' }}</td>
                    <td>
                      <ul
                        v-for="(product, i) in report.products"
                        :key="i"
                        class="nav border-bottom my-1"
                      >
                        <li
                          v-for="(item, key) in product"
                          :key="key"
                          class="nav-item col-12"
                        >
                          <span
                            >{{ key }} :
                            <span class="text-primary font-weight-bold">{{
                              item
                            }}</span></span
                          >
                        </li>
                      </ul>
                    </td>
                    <td>{{ report.general_feedback ? report.general_feedback : '----' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center p-2">
              <p class="text-muted">No visits for {{ customer.name }}</p>
            </div>
          </div>
          <!-- end of customer Visits -->
        </div>
        <div
          v-else-if="err_message"
          class="text-center font-weight-bold text-danger"
        >
          <p>Error : {{ err_message.code }}</p>
          <p>Message: {{ err_message.data }}</p>
        </div>
        <LoaderComponent v-else />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * //TODO add other reps plans for the customer
 * //TODO add other reps reports for the customer
 */
import { httpCall } from "../../../helpers/http-service";
import ModalFade from "../../../components/ModalFade";
import { filterByDate } from '../../../helpers/helpers';
export default {
  created() {
    this.getCustomer();
  },
  methods: {
    /**
     * get customer data from api
     */
    getCustomer() {
      this.isFetched = false;
      let id = this.$route.params.id;
      httpCall.get("rep/v1/customers/" + id).then(({ data }) => {
        this.isFetched = true;
        this.handleResponse(
          data,
          data => {
            this.customer = data.data.customer;
            this.plans = data.data.plans;
            data.data.reports.map(report => {
              report.products = JSON.parse(report.products)
            });
            this.reports = data.data.reports;
          },
          err => {
            this.err_message = err;
          }
        );
      });
    },
    navigateToCustomer() {
      let id = event.target.value;
      if (id === this.$route.params.id) {
        return;
      }
      this.$router.replace(`/customers/view/${id}`);
      this.getCustomer();
    },
    /**
     * add customer plan
     *
     */
    addCustomerPlan() {
      let data = {
        customers: JSON.stringify([this.$route.params.id]),
        date: this.new_plan_date
      };
      httpCall
        .post("rep/v1/planner", data)
        .then(({ data }) => {
          data.message = "Plan added";
          this.handleResponse(data);
        })
        .finally(() => {
          this.err_message = null;
          this.open_plan_modal = false;
          this.getCustomer();
        });
    },
    /**
     * toggle other reps plans
     */
    toggleOtherRepsPlans() {
      if(event.target.checked) {
        this.view_other_reps_plans = true;
        if(!this.other_reps_plans.length) {
          httpCall.get('rep/v1/other-reps/customer-plans/'+this.$route.params.id)
          .then(({data}) => {
            this.handleResponse(data, data => this.other_reps_plans = data.data)
          }).catch(err => {
            console.log(err)
          });

        }
      } else {
        this.view_other_reps_plans = false;
      }
    },
    /**
     * toggle other reps reports
     */
    toggleOtherRepsReports() {
      if(event.target.checked) {
        this.view_other_reps_report = true;
        if(!this.other_reps_reports.length) {
            httpCall.get('rep/v1/other-reps/customer-reports/'+this.$route.params.id)
            .then(({data}) => {
              this.handleResponse(data, data => {
                data.data.map(report => {
                  report.products = JSON.parse(report.products);
                })
                this.other_reps_reports = data.data
              });
            }).catch(err => {
              console.log(err)
            })
        }
      } else {
        this.view_other_reps_report = false;
      }
    },
    resetPlan(){
      this.plan_start = null;
      this.plan_end = null;
    },
    resetReport() {
      this.report_start = null;
      this.report_end = null;
    }
  },
  data: () => ({
    customer: null,
    plans: [],
    reports: [],
    isFetched: false,
    err_message: null,
    new_plan_date: new Date().format("YYYY-MM-DD"),
    open_plan_modal: false,
    view_other_reps_plans: false,
    view_other_reps_report: false,
    other_reps_plans: [],
    other_reps_reports: [],
    plan_start: null,
    plan_end: null,
    report_start:null,
    report_end: null
  }),
  computed: {
    customers() {
      return this.$store.getters.all;
    },
    planCollection() {
      let plans;
      if(!this.view_other_reps_plans) {
        plans = this.plans;
      } else {
        plans = this.other_reps_plans;
      }
      plans = filterByDate(plans,'plan_date', {start: this.plan_start, end: this.plan_end});
      return plans;
    },
    reportCollection() {
      let reports =[];
      if(!this.view_other_reps_report) {
        reports = this.reports;
      } else {
        reports = this.other_reps_reports;
      }
      reports = filterByDate(reports, 'visit_date', {start: this.report_start, end: this.report_end});
      return reports;
    }
  },
  components: {
    ModalFade
  }
};
</script>

<style></style>
