<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-warning">
      <span class="fa fa-edit"></span>
      <span class="font-weight-bold">Edit Pharmacy Report</span>
    </p>
    <div class="p-2">
      <ValidationObserver v-slot="{ handleSubmit }" v-if="visit">
        <form @submit.prevent="handleSubmit(saveReport)">
          <!-- Date and Pharmacy -->
          <div class="row mx-auto">
            <!-- date -->
            <div class="col-lg  mx-1 rounded form-group border p-2">
              <label for="date" class="text-muted">Date</label>
              <ValidationProvider
                name="date"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small" v-if="errors[0]"
                  >you must select date</span
                >
                <input
                  type="date"
                  name="date"
                  id="date"
                  v-model="visit.visit_date"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  :max="new Date().format()"
                  :min="$store.getters.reportIntervalMin"
                  :disabled="!canEditReportDate"
                />
              </ValidationProvider>
            </div>
            <!-- end of date -->
            <!-- pharmacy -->
            <div class="col-lg  mx-1 rounded form-group border p-2">
              <div class="row mx-auto">
                <div class="col-lg">
                  <label for="pharmacy" class="text-muted">Pharmacy</label>
                  <ValidationProvider
                    name="pharmacy"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <span v-if="errors[0]" class="text-danger small"
                      >you must select pharmacy</span
                    >
                    <input type="text" class="form-control form-control-sm" :disabled="true" :value="visit.pharmacy.name">
                  </ValidationProvider>
                </div>
              </div>
            </div>
          </div>
          <!-- end of date and pharmacy -->
          <!-- Visit products -->
          <div class="form-group border p-2">
            <otc-visit-products :data="visitProducts" :pharmacyProducts="true" :maxCompetitorCount="3" :maxProductCount="1" />
          </div>
          <!-- end of visit products -->
          <div class="form-group p-2">
            <label for="feedback" class="text-muted">Feedback</label>
            <ValidationProvider name="Feedback" rules="required" v-slot="{errors}">
              <span class="text-danger small">{{ errors[0] }}</span>
              <textarea
                name="feedback"
                id="feedback"
                cols="30"
                rows="5"
                :class="`form-control form-control-sm ${errors[0] ? 'border border-danger': ''}`"
                v-model="visit.general_feedback"
                placeholder="write general feedback"
              ></textarea>
            </ValidationProvider>
          </div>
          <hr>
          <!-- controller -->
          <div class="form-group text-right">
            <router-link to="/reports/view/pharmacy" class="btn btn-sm btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
            <button class="btn btn-sm btn-secondary" type="reset">
              <span class="fa fa-redo"></span>
              <span>Reset</span>
            </button>
            <button class="btn btn-sm btn-success" type="submit">
              <span class="fa fa-save"></span>
              <span>Save</span>
            </button>
          </div>
        </form>
      </ValidationObserver>
      <div v-else-if="error">
        <no-data-to-show  :title="error" icon="fa-exclamation-triangle" iconColor="text-danger" />
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
  components: { OtcVisitProducts },
  mounted() {
    this.getReport();
    //this.$store.dispatch("fetchPharmacies");
  },
  computed: {
    canEditReportDate() {
      return this.$store.getters.canEditReportDate;
    },

  },
  data: () => ({
    visit: null,
    fetched: false,
    error: null,
    error_code: null,
    visitProducts: null,
  }),
  watch: {
    'visitProducts.0.name': function(_new, _old) {
      if(_new !== this.visit.product) {
        this.visitProducts[0].rate = null;
        this.visitProducts[0].stock = 0;
        this.visitProducts[0].order = 0;
        this.visitProducts[0].distributor = null;
        this.visitProducts[0].competitors.forEach(item => {
          item.name = null;
          item.stock = 0;
          item.rate = null;
        })
      } else {
        this.visitProducts = this.createVisitProduct();
      }
    }
  },
  methods: {
    /* get report */
    getReport() {
      let id = this.$route.params.id;
      return httpCall.get('otc-rep/v1/reports/pharmacy/'+id)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.visit = data.data;
          this.fetched = true;
          this.error = null;
          this.error_code = null;
          this.visitProducts = this.createVisitProduct();
        }, data => {
          if(data.code === 204) {
            this.fetched = true;
            this.error_code = data.code;
            this.error = "Invalid Pharmacy Report ID";
          }
        })
      }).catch(err => console.log(err))
    },
    /* save report */
    saveReport() {
      if (!this.visit.product) {
        this.$toasted.error("You must add one product at least", {
          icon: 'fa-exclamation'
        });
        return;
      }
      if(!this.visit.competitor1) {
        this.$toasted.error("You must add one product at least", {
          icon: 'fa-exclamation'
        });
        return;
      }
      let request = Object.assign({}, this.visit);
      request = {...request,...this._normalizeProducts()}
      request._method = "PUT";
      let id = this.$route.params.id;
      httpCall.post('otc-rep/v1/reports/pharmacy/'+id, request)
      .then(({data}) => {
        this.handleResponse(data ,data => {
          this.$store.dispatch('fetchPharmacyReports', {force: true});
          this.$router.push("/reports/view/pharmacy");
        });
      }).catch(err => console.log(err));
    },
    /**
     * create visit products
     *
     *
     * @return {Array}
     */
    createVisitProduct() {
      if(this.visit) {
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
        }

        if(this.visit.competitor2) {
          product.competitors.push({
              name:   visit.competitor2,
              rate:   visit.competitor2_rate,
              stock:  visit.competitor2_stock
          })
        }
        if(this.visit.competitor3) {
          product.competitors.push({
              name:   visit.competitor3,
              rate:   visit.competitor3_rate,
              stock:  visit.competitor3_stock
          })
        }
        products.push(product)
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
      let res =  {
        product: product.name,
        stock: product.stock,
        rate: product.rate,
        order: product.order,
        distributor : product.dist,
        competitor1: product.competitors[0].name,
        competitor1_rate: product.competitors[0].rate,
        competitor1_stock : product.competitors[0].stock
      }
      if(product.competitors[1]) {
        res['competitor2'] = product.competitors[1].name;
        res['competitor2_rate'] = product.competitors[1].rate;
        res['competitor2_stock'] = product.competitors[1].stock;
      }
      if(product.competitors[2]) {
        res['competitor3'] = product.competitors[2].name;
        res['competitor3_rate'] = product.competitors[2].rate;
        res['competitor3_stock'] = product.competitors[2].stock;
      }

      return res;
    }
  }
};
</script>

<style></style>
