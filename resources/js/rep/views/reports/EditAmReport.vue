<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-edit"></i></span>
        <span class="font-weight-bold" v-if="visit"
          >Edit visit {{ visit.customer.name }} on {{ visit.date }}</span
        >
        <span v-else class="font-weight-bold">Edit vist</span>
      </p>
      <div class="p-2" v-if="visit">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(saveReport)">
            <!-- visit customer and date -->
            <div class="row mx-auto my-2 border rounded p-2">
              <div class="col-lg">
                <label for="customer" class="text-muted">Customer</label>
                <ValidationProvider
                  name="customer"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span class="text-danger small">{{ errors[0] }}</span>
                  <input
                    type="text"
                    name="customer"
                    id="customer"
                    v-model="visit.customer.name"
                    class="form-control form-control-sm"
                    readonly
                  />
                </ValidationProvider>
              </div>
              <div class="col-lg">
                <label for="date" class="text-muted">Date:</label>
                <ValidationProvider
                  name="date"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span class="text-danger">{{ errors[0] }}</span>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    class="form-control form-control-sm"
                    v-model="visit.date"
                    :disabled="!canEditReportDate"
                    :min="minVisitDate"
                  />
                </ValidationProvider>
              </div>
            </div>
            <!-- end of customer and date -->

            <!-- visit products -->
            <div class="form-group border rounded p-2">
              <visit-products :data="visit.products" />
            </div>
            <!-- end visit products -->
            <!-- visit comment and general feedback-->
            <div class="row mx-auto my-2 border rounded p-2">
              <div class="col-lg">
                <label for="comment" class="text-muted">Comment</label>
                <textarea
                  name="comment"
                  id="comment"
                  rows="5"
                  class="form-control form-control-sm"
                  v-model="visit.comment"
                  placeholder="write visit comment"
                ></textarea>
              </div>
              <div class="col-lg">
                <label for="general_feedback" class="text-muted"
                  >General Feedback</label
                >
                <textarea
                  name="general_feedback"
                  id="general_feedback"
                  rows="5"
                  class="form-control form-control-sm"
                  v-model="visit.general_feedback"
                  placeholder="write visit general feedback"
                ></textarea>
              </div>
            </div>
            <!-- end visit comment and feedback -->
            <hr />
            <!-- form control -->
            <div class="form-group text-right">
              <router-link to="/reports" class="btn btn-sm btn-dark">
                <span><i class="fa fa-chevron-circle-left"></i></span>
                <span class="font-weight-bold">back</span>
              </router-link>
              <button class="btn btn-sm btn-success">
                <span><i class="fa fa-save"></i></span>
                <span class="font-weight-bold">save</span>
              </button>
            </div>
            <!-- end of form control -->
          </form>
        </ValidationObserver>
      </div>
      <div
        class="p-2 d-flex justify-content-center align-items-center"
        v-else
        style="height:400px"
      >
        <div class="spinner-border"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Calendar } from "../../../helpers/date-helpers";
import { httpCall } from "../../../helpers/http-service";
import VisitProducts from "../../components/VisitProducts";

export default {
  mounted() {
    let id = this.$route.params.id;
    httpCall.get("rep/v1/reports/am/" + id).then(({ data }) => {
      data.message = "visit loaded";
      this.handleResponse(data, data => {
        this.visit = data.data;
      });
    });
  },
  data: () => ({
    visit: null
  }),
  computed: {
    reportInterval() {
      return this.$store.getters.reportInterval;
    },
    canEditReportDate() {
      return this.$store.getters.canEditReportDate;
    },
    minVisitDate() {
      let date = new Calendar(this.visit.date);
      return date.subtract(this.reportInterval).toString();
    }
  },
  methods: {
    /**
     * save report
     */
    saveReport() {
      let id = this.$route.params.id;
      let data = {};
      Object.assign(data, this.visit);
      data.products = JSON.stringify(data.products);
      data["_method"] = "PUT";
      httpCall.post("rep/v1/reports/am/" + id, data).then(({ data }) => {
        data.message = "visit added successfully";
        this.handleResponse(data, data => {
          this.$store.dispatch("amGetAll", true);
          //this.$store.dispatch('customerGetAll', true);
          this.$router.replace("/reports/view/am");
        });
      });
    }
  },
  components: {
    VisitProducts
  }
};
</script>

<style></style>
