<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">Edit Single PM visit {{ visit ? ` for Dr ${visit.customer.name}`  : ''}}</span>
    </p>
    <div class="p-2">
      <div v-if="visit">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(saveReport)">
            <!-- Customer and Date -->
            <div class="row mx-auto p-2 border rounded">
              <!-- Customer  -->
              <div class="col-lg-6 border rounded p-2">
                <div class="form-group">
                  <label for="" class="text-muted">Customer</label>
                  <input type="text" class="form-control form-control-sm" :disabled="true" readonly :value="visit.customer.name">
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
                  <input
                    name="date"
                    id="date"
                    type="date"
                    class="form-control form-control-sm"
                    v-model="visit.visit_date"
                    :disabled="!canEditReportDate"
                    :max="new Date().format()"
                    :min="reportIntervalMin"
                  />
                    <span class="text-danger small" v-if="errors[0]"
                      >* you must pick a date</span
                    >
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
                <span>Update</span>
              </button>
            </div>
          </form>
        </ValidationObserver>
      </div>
      <div v-else-if="fetchingError" class="py-5 text-danger font-weight-bold text-center">
        <p>{{ fetchingError }}</p>
        <span class="fa fa-exclamation-triangle fa-4x"></span>
        <p class="mt-2">Error {{ errorCode }}</p>
      </div>
      <loader-component v-else></loader-component>
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
    this.fetchReport();
  },
  computed: {
    canEditReportDate() {
      return this.$store.getters.canEditReportDate;
    },
    reportIntervalMin() {
      return this.$store.getters.reportIntervalMin;
    }
  },
  data: () => ({
    visit: null,
    visitTypes: visitTypes,
    fetchingError: null,
    errorCode: null
  }),
  methods: {
    fetchReport() {
      let id = this.$route.params.id;

      return httpCall.get('dm/v1/reports/pm/'+id)
      .then(({data}) => {
          this.handleResponse(data ,data => {
            this.visit = data.data;
            this.visit.products = JSON.parse(this.visit.products);
          }, data => {
          this.fetchingError = "Invalid Report ID, or it is not owned by you"
          this.errorCode = data.code
        })
      }).catch(err => console.log(err))
    },
    saveReport() {
      if(!this.visit.products.length) {
        this.$toasted.error('You must pick at least one product')
        return;
      }
      let request = Object.assign({}, this.visit);
      request.products =JSON.stringify(request.products)
      request._method = "PUT";
      let id = this.$route.params.id;
      httpCall.post('dm/v1/reports/pm/'+id, request)
      .then(({data}) => {
        this.handleResponse(data ,data => {
          this.$router.push("/reports/view/pm");
          this.$store.dispatch('getAllRepPmReports', true);
        })
      }).catch(err => console.log(err))
    },

  }
};
</script>

<style></style>
