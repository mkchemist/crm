<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">Add Health Day Report</span>
    </p>
    <div class="p-2">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveReport)">
          <!-- Date and Pharmacy -->
          <div class="row mx-auto border p-2">
            <!-- Date control -->
            <div class="col-lg mx-1 border p-2">
              <label for="" class="text-muted">Date</label>
              <ValidationProvider
                name="Visit Date"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small" v-if="errors[0]">{{
                  errors[0]
                }}</span>
                <input
                  type="date"
                  :min="reportIntervalMin"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  v-model="visit.date"
                  :max="new Date().format()"
                />
              </ValidationProvider>
            </div>
            <!-- End of date control -->
            <!-- Pharmacy Control -->
            <div class="col-lg row mx-auto mx-1 border p-2">
              <!-- Filter Control -->
              <div class="col-lg-auto">
                <button
                  class="btn btn-sm btn-primary"
                  type="button"
                  @click="openFilterBox"
                >
                  <span class="fa fa-filter"></span>
                  <span>Filter</span>
                </button>
                <data-filter-box
                  :data="pharmacies"
                  :onClose="closeFilterBox"
                  :onFilter="onFilter"
                  :onReset="onReset"
                  :show="showFilterBox"
                  :queryOnly="false"
                  :queryKeys="['area', 'brick']"
                />
              </div>
              <!-- End of Filter Control -->
              <!-- Pharmacy Select -->
              <div class="col-lg form-group">
                <label for="" class="text-muted">Pharmacy</label>
                <ValidationProvider
                  name="Health day pharmacy"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span class="text-danger small" v-if="errors[0]">{{
                    errors[0]
                  }}</span>
                  <select
                    name="pharmacy"
                    id="pharmacy"
                    :class="
                      `form-control form-control-sm ${
                        errors[0] ? 'border border-danger' : ''
                      }`
                    "
                    v-model="visit.pharmacy"
                    :disabled="!pharmacies.length"
                  >
                    <option :value="null">Select Pharmacy</option>
                    <option
                      :value="pharmacy.id"
                      v-for="pharmacy in pharmacies"
                      :key="pharmacy.id"
                      >{{ pharmacy.name }}</option
                    >
                  </select>
                </ValidationProvider>
              </div>
              <!-- End of Pharmacy Select -->
            </div>
            <!-- End of Pharmacy Control -->
          </div>
          <!-- End of Date and Pharmacy -->
          <!-- Visit Products -->
          <div class="p-2 my-2 border">
            <otc-visit-products
              :data="visit.products"
              :maxCompetitorCount="3"
              :maxProductCount="1"
              :pharmacyProducts="true"
            />
          </div>
          <!-- End of Visit Products -->
          <!-- No of cases and  Summery-->
          <div class="row mx-auto p-2 border">
            <div class="col-lg-3 border p-2">
              <label for="" class="text-muted">Total Cases</label>
              <ValidationProvider
                name="Total health day cases"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small" v-if="errors[0]">{{
                  errors[0]
                }}</span>
                <input
                  type="number"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  v-model="visit.no_cases"
                  :min="0"
                />
                <span class="text-muted small">
                  * write number of cases in health day
                </span>
              </ValidationProvider>
            </div>
            <div class="col-lg mx-1 p-2 border">
              <label for="" class="text-muted">Summery</label>
              <ValidationProvider
                name="Health day summery"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small" v-if="errors[0]">{{
                  errors[0]
                }}</span>
                <textarea
                  name="summery"
                  v-model="visit.summery"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  rows="5"
                  placeholder="Write health day summery"
                ></textarea>
              </ValidationProvider>
            </div>
          </div>
          <!-- End of cases and Summery -->
          <!-- Report Control -->
          <div class="form-group text-right my-2 p-2">
            <router-link to="/reports" class="btn btn-sm btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
            <button type="reset" class="btn btn-sm btn-secondary">
              <span class="fa fa-redo"></span>
              <span>reset</span>
            </button>
            <button class="btn btn-sm btn-success" type="submit">
              <span class="fa fa-save"></span>
              <span>save</span>
            </button>
          </div>
          <!-- End of Report Control -->
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import DataFilterBox from "../../../components/DataFilterBox.vue";
import { asyncDataFlow, httpCall } from "../../../helpers/http-service";
import OtcVisitProducts from "../../components/OtcVisitProducts.vue";

export default {
  components: {
    OtcVisitProducts,
    DataFilterBox
  },
  mounted() {
    this.$store.dispatch("fetchPharmacies");
  },
  computed: {
    pharmacies() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$store.getters.allPharmacies;
    },
    isPharmaciesFetched() {
      return this.$store.getters.isPharmaciesFetched;
    },
    reportIntervalMin() {
      return this.$store.getters.reportIntervalMin;
    }
  },
  data: () => ({
    visit: {
      pharmacy: null,
      no_cases: 0,
      summery: null,
      date: new Date().format(),
      products: [],
      type: "health-day"
    },
    showFilterBox: false,
    shouldRenderFilter: false,
    filteredList: []
  }),
  methods: {
    saveReport() {
      if (!this.visit.products.length) {
        this.$toasted.error("You must pick one product at least");
        return;
      }
      let request = Object.assign({}, this.visit);
      request.products = JSON.stringify(request.products);
      request.comment = JSON.stringify({
        no_cases: this.visit.no_cases,
        summery: this.visit.summery
      });

      httpCall
        .post("otc-rep/v1/reports/pharmacy", request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("fetchPharmacyReports", { force: true });
            this.$router.push("/reports/view/health-day");
          });
        })
        .catch(err => console.log(err));
    },
    onFilter(q, d) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(d, d => (this.filteredList = d));
    },
    onReset() {
      this.filteredList = [];
      asyncDataFlow([], d => {
        this.shouldRenderFilter = false;
        this.filteredList = [];
      });
    },
    openFilterBox() {
      this.showFilterBox = true;
    },
    closeFilterBox() {
      this.showFilterBox = false;
    }
  }
};
</script>

<style></style>
