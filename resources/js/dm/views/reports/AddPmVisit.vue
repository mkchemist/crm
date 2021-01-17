<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">Add Single PM visit</span>
    </p>
    <div class="p-2">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveReport)">
          <!-- Customer and Date -->
          <div class="row mx-auto p-2 border rounded">
            <!-- Customer  -->
            <div class="col-lg-6 border rounded mx-1 row mx-auto p-2">
              <div class="col-lg-9">
                <label for="customer" class="text-muted">Customers</label>
                <ValidationProvider
                  name="customer"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span
                    class="text-danger small font-weight-bold"
                    v-if="errors[0]"
                    >* you must select a customer</span
                  >
                  <select
                    name="customer"
                    id="customer"
                    v-model.number="visit.customer"
                    :class="
                      `form-control form-control-sm col-12 ${
                        errors[0] ? `border border-danger` : ''
                      }`
                    "
                    :disabled="!customers.length"
                  >
                    <option :value="null">{{
                      !isCustomersFetched
                        ? "loading customers"
                        : "Select Customer"
                    }}</option>
                    <option
                      :value="customer.id"
                      v-for="customer in customers"
                      :key="customer.id"
                      >{{ customer.name }}</option
                    >
                  </select>
                </ValidationProvider>
              </div>
              <div
                class="col-lg-3 d-flex flex-column align-items-center justify-content-center px-0"
              >
                <div>
                  <input
                    type="checkbox"
                    v-model="withInactive"
                    @click="toggleInactive"
                  />
                  <label class="form-check-label small">Inactive</label>
                </div>
                <button
                  class="btn btn-sm btn-primary"
                  @click="openFilterBox"
                  type="button"
                >
                  <span class="fa fa-filter" v-if="isCustomersFetched"></span>
                  <span v-else class="fa fa-spin fa-circle-notch"></span>
                  <span>Filter</span>
                </button>
                <data-filter-box
                  :queryKeys="queryData.keys"
                  :data="customers"
                  :show="showFilterBox"
                  :onClose="closeFilterBox"
                  :onReset="onReset"
                  :onFilter="onFilter"
                  :queryOnly="false"
                />
              </div>
            </div>
            <!-- Date -->
            <div class="col-lg mx-1 border rounded p-2">
              <div class="form-group">
                <label for="date" class="text-muted">Date</label>
                <ValidationProvider
                  name="date"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span class="text-danger small" v-if="errors[0]"
                    >* you must pick a date</span
                  >
                  <input
                    name="date"
                    id="date"
                    type="date"
                    class="form-control form-control-sm"
                    v-model="visit.date"
                    :max="new Date().format()"
                    :min="reportIntervalMin"
                  />
                </ValidationProvider>
              </div>
            </div>
            <!-- Visit type -->
            <div class="col-lg mx-1 border rounded p-2">
              <div class="form-group">
                <label for="visit_type" class="text-muted">Type</label>
                <select
                  name="visit_type"
                  id="visit_type"
                  class="form-control form-control-sm"
                  v-model="visit.visit_type"
                >
                  <option
                    :value="type"
                    v-for="(type, i) in visitTypes"
                    :key="`visit_type_${type}_${i}`"
                    >{{ type.toUpperCase() }}</option
                  >
                </select>
              </div>
            </div>
          </div>
          <!-- End of customer and date -->
          <!-- Visit  Products -->
          <div class="my-2 px-0 border rounded">
            <p class="lead bg-info  text-light mb-0 p-2">Products</p>
            <div class="p-2">
              <visit-products :data="visit.products" />
            </div>
          </div>
          <!-- Comment and Feedback -->
          <div class="px-0 border rounded">
            <p class="bg-info text-light mb-0 p-2">Comment and Feedback</p>
            <div class="row mx-auto p-2">
              <div class="col-lg">
                <label for="" class="text-muted">Comment</label>
                <textarea
                  name="comment"
                  id="comment"
                  cols="30"
                  rows="5"
                  class="form-control form-control-sm"
                  placeholder="write a visit comment"
                  v-model="visit.comment"
                ></textarea>
              </div>
              <div class="col-lg">
                <label for="" class="text-muted">Feedback</label>
                <textarea
                  name="feedback"
                  id="feedback"
                  cols="30"
                  rows="5"
                  class="form-control form-control-sm"
                  placeholder="write a general feedback"
                  v-model="visit.general_feedback"
                ></textarea>
              </div>
            </div>
          </div>
          <hr />
          <div class="form-group text-right">
            <router-link to="/reports" class="btn btn-dark btn-sm">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
            <button class="btn btn-secondary btn-sm" type="reset">
              <span class="fa fa-redo"></span>
              <span>reset</span>
            </button>
            <button class="btn btn-success btn-sm" type="submit">
              <span class="fa fa-save"></span>
              <span>save</span>
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import DataFilterBox from "../../../components/DataFilterBox.vue";
import { visitTypes } from "../../../helpers/constants";
import { httpCall } from '../../../helpers/http-service';
import VisitProducts from "../../../rep/components/VisitProducts.vue";
export default {
  components: {
    DataFilterBox,
    VisitProducts
  },
  mounted() {
    this.$store.dispatch("customersGetAll");
  },
  computed: {
    customers() {
      if (this.shouldRenderFilter) {
        return this.filteredData;
      }
      if (this.withInactive) {
        return this.$store.getters.allCustomers;
      }
      return this.$store.getters.activeCustomers;
    },
    reps() {
      return this.$store.getters.allReps;
    },
    isCustomersFetched() {
      return this.$store.getters.isCustomersFetched;
    },
    reportIntervalMin() {
      return this.$store.getters.reportIntervalMin
    }
  },
  data: () => ({
    visit: {
      customer: null,
      date: new Date().format(),
      products: [],
      comment: null,
      general_feedback: null,
      visit_type: visitTypes[0]
    },
    queryData: {
      keys: ["area", "brick", "specialty", "parameter", "current_freq"]
    },
    showFilterBox: false,
    shouldRenderFilter: false,
    filteredData: [],
    withInactive: false,
    visitTypes: visitTypes
  }),
  methods: {
    saveReport() {
      if(!this.visit.products.length) {
        this.$toasted.error('You must pick at least one product')
        return;
      }
      let request = Object.assign({}, this.visit);
      request.products =JSON.stringify(request.products)
      httpCall.post('dm/v1/reports/pm', request)
      .then(({data}) => {
        this.handleResponse(data ,data => {
          console.log(data)
        })
      }).catch(err => console.log(err))
    },
    openFilterBox() {
      this.showFilterBox = true;
    },
    closeFilterBox() {
      this.showFilterBox = false;
    },
    onFilter(query, data) {
      console.log(data);
      this.shouldRenderFilter = true;
      this.filteredData = data;
      let asyncFlow = () => Promise.resolve(data);
      asyncFlow().then(d => (this.filteredData = d));
      this.visit.customer = null;
    },
    onReset() {
      this.shouldRenderFilter = false;
      this.visit.customer = null;
    },
    toggleInactive(e) {
      this.shouldRenderFilter = false;
      this.filteredData = [];
      this.visit.customer = null;
    }
  }
};
</script>

<style></style>
