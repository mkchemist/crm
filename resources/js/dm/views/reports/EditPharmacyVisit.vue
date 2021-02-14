<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-edit"></span>
      <span class="font-weight-bold"
        >Edit {{ report ? report.pharmacy.name : "" }} visit</span
      >
    </p>
    <div class="p-2">
      <div v-if="report">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(saveReport)">
            <!-- Date and Pharmacy  -->
            <div class="row mx-auto border rounded p-2">
              <div class="col-lg border rounded p-2 mx-1">
                <label for="">Date</label>
                <input
                  type="date"
                  class="form-control form-control-sm"
                  :value="report.visit_date"
                  :disabled="!canEditReportDate"
                  :max="new Date().format()"
                  :min="reportIntervalMin"
                />
              </div>
              <div class="col-lg border rounded p-2 mx-1">
                <label for="">Pharmacy</label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  :value="report.pharmacy.name"
                  disabled
                />
              </div>
            </div>
            <!-- End of date and pharmacy -->
            <!-- visit products -->
            <div class="my-2 p-2 border rounded">
              <visit-products
                :data="report.products"
                :pharmacyProducts="true"
              />
            </div>
            <!-- End of visit products -->
            <!-- Visit feedback -->
            <div class="my-2 p-2 border rounded">
              <label for="">General Feedback</label>
              <ValidationProvider
                name="General Feedback"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small" v-if="errors[0]">{{
                  errors[0]
                }}</span>
                <textarea
                  cols="30"
                  rows="8"
                  :class="`form-control form-control-sm ${errors[0] ? 'border border-danger' : ''}`"
                  v-model="report.general_feedback"
                ></textarea>
              </ValidationProvider>
            </div>
            <!-- End of visit feedback -->
            <!-- Report control -->
            <div class="form-group text-right">
              <router-link
                to="/reports/view/pharmacy"
                class="btn btn-sm btn-dark"
              >
                <span class="fa fa-chevron-circle-left"></span>
                <span>back</span>
              </router-link>
              <button class="btn btn-sm btn-secondary" type="reset" @click="getReport">
                <span class="fa fa-redo"></span>
                <span>reset</span>
              </button>
              <button class="btn btn-sm btn-success" type="submit">
                <span class="fa fa-save"></span>
                <span>Save</span>
              </button>
            </div>
            <!-- end of report control -->
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
import VisitProducts from "../../../rep/components/VisitProducts.vue";
export default {
  components: { VisitProducts },
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
    report: null,
    fetched: false
  }),
  methods: {
    getReport() {
      let id = this.$route.params.id;
      return httpCall
        .get("dm/v1/reports/workplaces/show/pharmacy/" + id)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            data.data["products"] = JSON.parse(data.data["products"]);
            this.report = data.data;
          });
        })
        .catch(err => console.log(err));
    },
    saveReport() {
      if(!this.report.products.length) {
        this.$swal({
          title: "Error",
          text: "You must pick one product at least",
          icon: "error"
        });
        return;
      }
      let request = Object.assign({}, this.report);
      request.products = JSON.stringify(request.products);
      request['_method'] = "PUT"
      let id = this.$route.params.id;
      return httpCall.post('v1/single-visit/pharmacy/'+id, request)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.$swal({
            title : "Success",
            icon: "success"
          });
          this.$store.dispatch("getAllPharmaciesReports", {force: true});
          this.$router.push("/reports/view/pharmacy");
        });
      }).catch(err => console.log(err))
    }
  }
};
</script>

<style></style>
