<template>
  <div class="px-0 shadow pb-5">
    <p class="alert alert-success">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">Create Coach report</span>
    </p>
    <div class="row mx-auto px-0">
      <div class="col-lg-3 p-2">
        <div class="border rounded p-2">
          <!-- Rep select -->
          <div class="form-group">
            <label for="rep" class="text-muted small">Rep</label>
            <select
              name="rep"
              id="rep"
              v-model="rep"
              class="form-control form-control-sm"
              :disabled="!allReps.length"
              v-if="activeCustomers.length"
            >
              <option value="">All</option>
              <option v-for="rep in allReps" :key="rep.id" :value="rep">{{
                rep.name
              }}</option>
            </select>
            <loader-component v-else></loader-component>
          </div>
          <hr />
          <!-- Brick Select -->
          <div class="form-group">
            <label for="brick" class="text-muted small">Brick</label>
            <select
              name="brick"
              id="brick"
              v-model="brick"
              class="form-control form-control-sm"
              :disabled="!Object.keys(bricks).length || !rep"
            >
              <option value="">All</option>
              <option
                v-for="brick in Object.keys(bricks)"
                :key="`brick_${brick}`"
                :value="brick"
              >
                <span>{{ brick }} ({{ bricks[brick].length }})</span>
              </option>
            </select>
          </div>
          <hr />
          <!-- Customer Select -->
          <div class="form-group">
            <label for="customer" class="text-muted small">customer</label>
            <select
              name="customer"
              id="customer"
              v-model="customer"
              class="form-control form-control-sm"
              :disabled="!customers || !rep"
            >
              <option :value="null">All</option>
              <option
                v-for="customer in customers"
                :key="customer.id"
                :value="customer"
              >
                <span>{{ customer.name }}</span>
              </option>
            </select>
          </div>
        </div>
        <div class="my-1 p-2 border rounded">
          <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
            <span class="fa fa-chevron-circle-left"></span>
            <span>back</span>
          </router-link>
        </div>
      </div>
      <div class="col-lg-9 p-2">
        <div class="p-2 shadow pb-5">
          <div v-if="customer" class="px-0 shadow rounded">
            <p class="alert alert-success">
              <span class="fa fa-check-double"></span>
              <span>Dr {{ customer.name }} visit evaluation</span>
            </p>
            <!-- report control -->
            <div class="p-2 row mx-auto">
              <div class="col-lg">
                <div class="form-inline">
                  <label for="visit_date" class="text-muted small mr-2"
                    >Date :
                  </label>
                  <input
                    type="date"
                    name="visit_date"
                    id="visit_date"
                    class="form-control form-control-sm"
                    v-model="date"
                  />
                </div>
              </div>
              <div class="col-lg text-right">
                <button
                  class="btn btn-sm btn-secondary"
                  @click="closeSelectedCustomer"
                >
                  <span class="fa fa-times-circle"></span>
                  <span>close</span>
                </button>
                <button class="btn btn-sm btn-success" @click="submitReport">
                  <span class="fa fa-check-circle"></span>
                  <span>submit</span>
                </button>
              </div>
            </div>
            <!-- Customer info -->
            <div class="p-2">
              <div class="border p-1 rounded row mx-auto">
                <div class="col-lg">
                  <p class="mb-0 small">
                    Name:
                    <span class="font-weight-bold">{{ customer.name }}</span>
                  </p>
                  <p class="mb-0 small">
                    Specialty:
                    <span class="font-weight-bold">{{
                      customer.specialty
                    }}</span>
                  </p>
                  <p class="mb-0 small">
                    Title:
                    <span class="font-weight-bold">{{ customer.title }}</span>
                  </p>
                  <p class="mb-0 small">
                    Parameter:
                    <span class="font-weight-bold">{{
                      customer.parameter
                    }}</span>
                  </p>
                  <p class="mb-0 small">
                    Frequency:
                    <span class="font-weight-bold">{{
                      customer.current_freq
                    }}</span>
                  </p>
                </div>
                <div class="col-lg">
                  <p class="mb-0 small">
                    address:
                    <span class="font-weight-bold">{{ customer.address }}</span>
                  </p>
                  <p class="mb-0 small">
                    brick:
                    <span class="font-weight-bold">{{ customer.brick }}</span>
                  </p>
                  <p class="mb-0 small">
                    workplace:
                    <span class="font-weight-bold">{{
                      customer.workplace
                    }}</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- coach report -->
            <div class="my-2 p-2">
              <table class="table table-sm small table-bordered">
                <thead>
                  <tr class="bg-success text-light">
                    <th>Item</th>
                    <th>Mark</th>
                  </tr>
                </thead>
                <tbody v-for="(row, key) in report" :key="`main_${key}`">
                  <tr>
                    <td
                      colspan="2"
                      class="font-weight-bold bg-secondary text-light"
                    >
                      {{ key }}
                    </td>
                  </tr>
                  <tr
                    v-for="(r, i) in row"
                    :key="`main_${key}_${i}`"
                    class="text-muted"
                  >
                    <td>{{ i }}</td>
                    <td>
                      <select
                        name=""
                        id=""
                        v-model="report[key][i]"
                        class="coach-select"
                      >
                        <option value="">N</option>
                        <option value="S">S</option>
                        <option value="U">U</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            class="p-2 d-flex align-items-center justify-content-center"
            style="min-height:400px"
            v-else
          >
            <no-data-to-show title="Select customer first" :bold="true"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { filterData } from "../../../helpers/helpers";
import NoDataToShow from "../../../components/NoDataToShow";
import { COACH_REPORT } from "../../../helpers/constants";
import { httpCall } from "../../../helpers/http-service";
export default {
  mounted() {
    this.$store.dispatch("getAllReps").then(() => {
      this.$store.dispatch("customersGetAll");
    });
  },
  components: {
    NoDataToShow
  },
  computed: {
    allReps() {
      return this.$store.getters.allReps;
    },
    isRepsFetched() {
      return this.$store.getters.isRepsFetched;
    },
    activeCustomers() {
      return this.$store.getters.activeCustomers;
    },
    bricks() {
      if (this.rep !== "") {
        let area = JSON.parse(this.rep.area);
        let district = JSON.parse(this.rep.district);
        let territory = JSON.parse(this.rep.territory);
        return filterData(
          this.activeCustomers,
          "brick",
          item => {
            if(area.length && area[0] !== 'all') {
              return area.includes(item.area)
            } else if(district.length && district[0] !== 'all') {
              return district.includes(item.district)
            } else if(territory.length && territory[0] !== 'all') {
              return territory.includes(item.territory)
            } else {
              return false
            }

          }
        );
      }
      return filterData(this.activeCustomers, "brick");
    },
    customers() {
      if (this.brick !== "") {
        return this.bricks[this.brick];
      }
      return this.activeCustomers;
    },
    isCustomersFetched() {
      return this.$store.getters.isCustomersFetched;
    }
  },
  data: () => ({
    rep: "",
    brick: "",
    customer: null,
    report: COACH_REPORT,
    date: null
  }),
  methods: {
    closeSelectedCustomer() {
      this.customer = null;
    },
    /**
     * submit report
     *
     */
    submitReport() {
      if (!this.date) {
        this.$toasted.error("you must pick date");
        return;
      }
      if (!this.customer) {
        this.$toasted.error("you must pick customer");
        return;
      }
      if (!this.rep) {
        this.$toasted.error("you must select rep");
        return;
      }
      let request = {
        rep: this.rep.id,
        customer: this.customer.id,
        data: JSON.stringify(this.report),
        date: this.date
      };
      httpCall
        .post("dm/v1/reports/coach", request)
        .then(({ data }) => {
          console.log(data);
          this.handleResponse(data, data => {
            this.$store.dispatch("getAllCoachReports", true).then(() => {
              this.$router.push("/reports/view/coach-report");
            });
          });
        })
        .catch(err => {
          this.$toasted.error("Something went wrong", {
            icon: "sad"
          });
          console.log(err);
        });
    },

  }
};
</script>

<style></style>
