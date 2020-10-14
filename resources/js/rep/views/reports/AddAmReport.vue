<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-plus-circle"></i></span>
        <span class="font-weight-bold">New AM visit</span>
      </p>
      <div class="p-2">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(saveReport)">
            <!-- date , workplace and customers -->
            <div class="row mx-auto p-2 border rounded">
              <div class="col-lg">
                <label for="date" class="text-muted">Date</label>
                <input
                  type="date"
                  v-model="visit.date"
                  class="form-control form-control-sm"
                />
              </div>
              <!-- workplace -->
              <div class="col-lg">
                <label for="workplace" class="text-muted">Workplace</label>
                <ValidationProvider
                  name="workplace_id"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span class="text-danger small" v-if="errors[0]"
                    >must select workplace</span
                  >
                  <select
                    name="workplace_id"
                    id="workplace_id"
                    v-model="visit.workplace_id"
                    :class="
                      `form-control form-control-sm ${
                        errors[0] ? 'border-danger' : ''
                      }`
                    "
                  >
                    <option value="">Select workplace</option>
                    <option
                      v-for="workplace in workplaces"
                      :key="workplace.id"
                      :value="workplace.id"
                      >{{ workplace.name }}</option
                    >
                  </select>
                </ValidationProvider>
                <div class="text-right small p-2">
                  <button
                    type="button"
                    class="btn btn-sm btn-primary"
                    @click="selectWorkplace"
                  >
                    select
                  </button>
                </div>
              </div>
              <!-- departments -->
              <div class="col-lg">
                <label for="departs" class="text-muted">Departments</label>
                <div v-if="departs">
                  <ul class="nav border rounded p-2" v-if="departs.length">
                    <li
                      class="nav-item col-12"
                      v-for="depart in departs"
                      :key="depart.id"
                    >
                      <input
                        type="checkbox"
                        @click="toggleDepart(depart.name)"
                      />
                      <span>{{ depart.name }}</span>
                    </li>
                  </ul>
                  <p v-else class="text-danger small">
                    <span>This workplace have no departments</span>
                    <router-link
                      :to="`/workplaces/hospital/view/${visit.workplace_id}`"
                      class="badge badge-primary p-1"
                      >add departments</router-link
                    >
                  </p>
                </div>
                <div v-else>
                  <p class="text-muted small">Select Workplace first</p>
                </div>
              </div>
              <!-- customers -->
              <div class="col-lg">
                <label for="customers" class="text-muted">Customers</label>
                <div v-if="customers">
                  <ul class="nav border rounded p-2" v-if="customers.length">
                    <li
                      class="nav-item col-12"
                      v-for="customer in customers"
                      :key="customer.id"
                    >
                      <input
                        type="checkbox"
                        @click="toggleCustomer(customer.id)"
                      />
                      <span>{{ customer.name }}</span>
                    </li>
                  </ul>
                  <p v-else class="text-danger small">
                    This department have no customers
                  </p>
                </div>
                <div v-else>
                  <p class="text-muted small">Select Department</p>
                </div>
              </div>
            </div>
            <!-- end of date, workplace and customers -->
            <br />
            <!-- visit products -->
            <div class="form-group p-2 border rounded">
              <visit-products :data="visit.products" />
            </div>
            <!-- visit products -->
            <br />
            <!-- comment and feedback -->
            <div class="row mx-auto p-2 rounded border">
              <div class="col-lg">
                <label for="comment" class="text-muted">Comment</label>
                <textarea
                  name="comment"
                  rows="5"
                  v-model="visit.comment"
                  placeholder="write visit comment"
                  class="form-control form-control-sm"
                ></textarea>
              </div>
              <div class="col-lg">
                <label for="general_feedback" class="text-muted"
                  >General Feedback</label
                >
                <textarea
                  name="general_feedback"
                  rows="5"
                  v-model="visit.general_feedback"
                  placeholder="write visit feedback"
                  class="form-control form-control-sm"
                ></textarea>
              </div>
            </div>
            <!-- end of comment and feedback -->
            <hr />
            <div class="form-group text-right p-2">
              <router-link to="/reports" class="btn btn-sm btn-dark">
                <span><i class="fa fa-chevron-circle-left"></i></span>
                <span>back</span>
              </router-link>
              <button class="btn btn-sm btn-success">
                <span><i class="fa fa-save"></i></span>
                <span>save</span>
              </button>
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import VisitProducts from "../../components/VisitProducts";
import { httpCall } from "../../helpers/http-service";

export default {
  created() {
    this.$store.dispatch("customerGetAll").finally(() => {
      this.$store.dispatch("workplaceGetAll");
    });
  },
  components: {
    VisitProducts
  },
  data: () => ({
    visit: {
      workplace_id: "",
      customers: [],
      date: new Date().format("YYYY-MM-DD"),
      comment: "",
      general_feedback: "",
      dual_with: "",
      products: []
    },
    departs: null,
    filter_departs: []
  }),
  computed: {
    workplaces() {
      return this.$store.getters.allWorkplaces;
    },
    customers() {
      let customers = this.$store.getters.all;
      let data = null;
      if (this.visit.workplace_id && this.filter_departs.length) {
        data = customers.filter(customer => {
          if (
            customer.workplace_id === this.visit.workplace_id &&
            this.filter_departs.includes(customer.specialty)
          ) {
            return true;
          }
          return false;
        });
      }
      return data;
    }
  },
  methods: {
    /**
     * submit am report
     */
    saveReport() {
      if (!this.visit.customers.length) {
        this.$toasted.error("must select at least one customer", {
          icon: "exclamation"
        });
        return;
      }
      if (!this.visit.products.length) {
        this.$toasted.error("must add one product at least", {
          icon: "exclamation"
        });
        return;
      }
      let data = {};
      Object.assign(data, this.visit);
      data.customers = JSON.stringify(data.customers);
      data.products = JSON.stringify(data.products);
      httpCall.post("rep/v1/reports/am", data).then(({ data }) => {
        data.message = data.data;
        this.handleResponse(data, data => {
          data.rejected.forEach(item => this.$toasted.error(item));
          if (!data.rejected.length) {
            this.$router.replace("/reports/view/am");
          }
        });
      });
    },
    /**
     * select workplace
     */
    selectWorkplace() {
      let id = this.visit.workplace_id;
      this.departs = this.workplaces.filter(workplace => {
        return workplace.id === id;
      })[0].depart;
      this.visit.customers = [];
    },
    /**
     * toggle add or remove depart in filter
     *
     * @param {string} name [department name]
     */
    toggleDepart(name) {
      if (event.target.checked) {
        if (!this.filter_departs.includes(name)) {
          this.filter_departs.push(name);
        }
      } else {
        if (this.filter_departs.includes(name)) {
          this.filter_departs.splice(this.filter_departs.indexOf(name), 1);
        }
      }
    },
    /**
     * toggle add ro remove customer from visit customers
     *
     */
    toggleCustomer(id) {
      if (event.target.checked) {
        if (!this.visit.customers.includes(id)) {
          this.visit.customers.push(id);
        }
      } else {
        if (this.visit.customers.includes(id)) {
          this.visit.customers.splice(this.visit.customers.indexOf(id), 1);
        }
      }
    }
  }
};
</script>

<style></style>
