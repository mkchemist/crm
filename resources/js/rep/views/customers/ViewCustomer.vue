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
              <button
                class="btn btn-sm btn-primary"
                @click="open_plan_modal = true"
              >
                <span><i class="fa fa-plus-circle"></i></span>
                <span>new plan</span>
              </button>
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
            <div class="p-2" v-if="plans.length > 0">
              <table class="table table-sm small table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>State</th>
                    <th>Dual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="plan in plans" :key="plan.id">
                    <td>{{ plan.plan_date }}</td>
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
            <div class="my-2 p-2">
              <router-link :to="`/reports/add/pm/${customer.id}`" class="btn btn-sm btn-primary">
                <span><i class="fa fa-plus-circle"></i></span>
                <span>new visit</span>
              </router-link>
            </div>
            <div v-if="reports.length">
              <table class="table table-sm small table-responsive">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Comment</th>
                    <th>Products</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="report in reports" :key="report.id">
                    <td>{{ report.date }}</td>
                    <td>{{ report.dual_with }}</td>
                    <td>{{ report.comment }}</td>
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
                    <td>{{ report.general_feedback }}</td>
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
    }
  },
  data: () => ({
    customer: null,
    plans: [],
    reports: [],
    isFetched: false,
    err_message: null,
    new_plan_date: new Date().format("YYYY-MM-DD"),
    open_plan_modal: false
  }),
  computed: {
    customers() {
      return this.$store.getters.all;
    }
  },
  components: {
    ModalFade
  }
};
</script>

<style></style>
