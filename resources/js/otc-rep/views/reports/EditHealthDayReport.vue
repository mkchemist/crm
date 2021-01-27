<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-warning">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">Edit Health Day Report</span>
    </p>
    <div class="p-2">
      <div v-if="visit">
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
                    v-model="visit.visit_date"
                    :max="new Date().format()"
                    :disabled="!canEditReportDate"
                  />
                </ValidationProvider>
              </div>
              <!-- End of date control -->
              <!-- Pharmacy Control -->
              <div class="col-lg border p-2">
                <!-- Pharmacy name -->
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
                    <input
                      type="text"
                      :value="visit.pharmacy.name"
                      class="form-control form-control-sm"
                      :disabled="true"
                    />
                  </ValidationProvider>
                </div>
                <!-- End of Pharmacy name -->
              </div>
              <!-- End of Pharmacy Control -->
            </div>
            <!-- End of Date and Pharmacy -->
            <!-- Visit Products -->
            <div class="p-2 my-2 border">
              <otc-visit-products
                :data="visitProducts"
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
                    v-model="visit.comment.no_cases"
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
                    v-model="visit.comment.summery"
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
              <router-link to="/reports/view/health-day" class="btn btn-sm btn-dark">
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
      <div v-else-if="error">
        <no-data-to-show
          :title="error"
          icon="fa-exclamation-triangle"
          iconColor="text-danger"
        />
      </div>
      <div v-else-if="fetched">
        <no-data-to-show />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
import OtcVisitProducts from "../../components/OtcVisitProducts.vue";

export default {
  components: {
    OtcVisitProducts
  },
  mounted() {
    this.getReport();
  },
  computed: {
    reportIntervalMin() {
      return this.$store.getters.reportIntervalMin;
    },
    canEditReportDate() {
      return this.$store.getters.canEditReportDate;
    }
  },

  data: () => ({
    visit: null,
    fetched: false,
    error: null,
    error_code: null,
    visitProducts: []
  }),
  watch: {
    "visitProducts.0.name": function(_new, _old) {
      if (_new !== this.visit.product) {
        this.visitProducts[0].rate = null;
        this.visitProducts[0].stock = 0;
        this.visitProducts[0].order = 0;
        this.visitProducts[0].distributor = null;
        this.visitProducts[0].competitors.forEach(item => {
          item.name = null;
          item.stock = 0;
          item.rate = null;
        });
      } else {
        this.visitProducts = this.createVisitProduct();
      }
    }
  },
  methods: {
    /* get report */
    getReport() {
      let id = this.$route.params.id;
      return httpCall
        .get("otc-rep/v1/reports/pharmacy/" + id)
        .then(({ data }) => {
          this.handleResponse(
            data,
            data => {
              this.visit = data.data;
              this.fetched = true;
              this.error = null;
              this.error_code = null;
              this.visitProducts = this.createVisitProduct();
              this.visit.comment = JSON.parse(this.visit.comment)
            },
            data => {
              if (data.code === 204) {
                this.fetched = true;
                this.error_code = data.code;
                this.error = "Invalid Pharmacy Report ID";
              }
            }
          );
        })
        .catch(err => console.log(err));
    },
    saveReport() {
      if (!this.visit.product) {
        this.$toasted.error("You must add one product at least", {
          icon: "fa-exclamation"
        });
        return;
      }
      if (!this.visit.competitor1) {
        this.$toasted.error("You must add one product at least", {
          icon: "fa-exclamation"
        });
        return;
      }
      let request = Object.assign({}, this.visit);
      request = { ...request, ...this._normalizeProducts() };
      request.comment = JSON.stringify(request.comment);

      request._method = "PUT";
      let id = this.$route.params.id;
      httpCall
        .post("otc-rep/v1/reports/pharmacy/" + id, request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("fetchPharmacyReports", { force: true });
            this.$router.push("/reports/view/health-day");
          });
        })
        .catch(err => console.log(err));
    },
    /**
     * create visit products
     *
     *
     * @return {Array}
     */
    createVisitProduct() {
      if (this.visit) {
        let products = [];
        let visit = this.visit;
        let product = {
          name: visit.product,
          rate: visit.rate,
          stock: visit.stock,
          order: visit.order,
          dist: visit.distributor,
          competitors: [
            {
              name: visit.competitor1,
              rate: visit.competitor1_rate,
              stock: visit.competitor1_stock
            }
          ]
        };

        if (this.visit.competitor2) {
          product.competitors.push({
            name: visit.competitor2,
            rate: visit.competitor2_rate,
            stock: visit.competitor2_stock
          });
        }
        if (this.visit.competitor3) {
          product.competitors.push({
            name: visit.competitor3,
            rate: visit.competitor3_rate,
            stock: visit.competitor3_stock
          });
        }
        products.push(product);
        return products;
      }
      return [];
    },
    /**
     * normalize product details
     *
     *
     * @return {Object}
     */
    _normalizeProducts() {
      let product = Object.assign({}, this.visitProducts[0]);
      let res = {
        product: product.name,
        stock: product.stock,
        rate: product.rate,
        order: product.order,
        distributor: product.dist,
        competitor1: product.competitors[0].name,
        competitor1_rate: product.competitors[0].rate,
        competitor1_stock: product.competitors[0].stock
      };
      if (product.competitors[1]) {
        res["competitor2"] = product.competitors[1].name;
        res["competitor2_rate"] = product.competitors[1].rate;
        res["competitor2_stock"] = product.competitors[1].stock;
      }
      if (product.competitors[2]) {
        res["competitor3"] = product.competitors[2].name;
        res["competitor3_rate"] = product.competitors[2].rate;
        res["competitor3_stock"] = product.competitors[2].stock;
      }

      return res;
    }
  }
};
</script>

<style></style>
