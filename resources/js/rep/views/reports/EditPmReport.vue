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
            <!-- visit coach -->
            <div class="row mx-auto my-2 border rounded p-2">
              <div class="col-lg-6">
                <label for="" class="text-muted small">Visit type</label>
                <select
                  name="visit_type"
                  id=""
                  v-model="visit.visit_type"
                  class="form-control form-control-sm"
                  @change="handleVisitType"
                >
                  <option
                    :value="type"
                    v-for="(type, i) in visit_types"
                    :key="`visit_type_${i}`"
                    >{{ type | capital }}</option
                  >
                </select>
              </div>
              <div class="col-lg-6" v-if="visit.dual">
                 <div class="form-group">
                  <ValidationProvider
                    name="dual_with"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <label for="" class="text-muted small">Coach 1</label>
                    <span class="text-danger small" v-if="errors[0]"
                      >you must select a coach</span
                    >
                    <select
                      name="dual_with"
                      id="dual_with"
                      class="form-control form-control-sm"
                      v-model="visit.dual_with"
                    >
                      <option value="">Select coach</option>
                      <option
                        :value="coach.id"
                        v-for="coach in coaches"
                        :key="coach.id"
                        >{{ coach.name }}</option
                      >
                    </select>
                  </ValidationProvider>
                </div>
                <div class="form-group">

                    <label for="" class="text-muted small">Coach 2</label>

                    <select
                      name="coach2_id"
                      id="coach2_id"
                      class="form-control form-control-sm"
                      v-model="visit.coach2_id"
                    >
                      <option value="">Select coach</option>
                      <option
                        :value="coach.id"
                        v-for="coach in coach2"
                        :key="coach.id"
                        >{{ coach.name }}</option
                      >
                    </select>

                </div>
              </div>
            </div>
            <!-- end visit coach -->
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
import { httpCall } from "../../../helpers/http-service";
import { Calendar } from "../../../helpers/date-helpers";
import VisitProducts from "../../components/VisitProducts";
import { visitTypes } from '../../../helpers/constants';

export default {
  mounted() {
    let id = this.$route.params.id;
    httpCall.get("rep/v1/reports/pm/" + id).then(({ data }) => {
      data.message = "visit loaded";
      this.handleResponse(data, data => {
        this.visit = data.data;
        this.visit.dual = false;
        if (data.data.visit_type === "double visit") {
          this.visit.dual = true;
        }
      });
    });
    this.$store.dispatch("getCoaches");
  },
  computed: {
    coaches() {
      return this.$store.getters.coaches;
    },
    coach2() {
      return this.$store.getters.coaches.filter(coach => coach.id !== this.visit.dual_with)
    },
    reportInterval() {
      return this.$store.getters.reportInterval;
    },
    canEditReportDate() {
      return this.$store.getters.canEditReportDate
    },
    minVisitDate() {
      let date = new Calendar(this.visit.date);
      return date.subtract(this.reportInterval).toString();
    }
  },
  data: () => ({
    visit: null,
    visit_types: visitTypes
  }),
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
      httpCall.post("rep/v1/reports/pm/" + id, data).then(({ data }) => {
        data.message = "visit added";
        this.handleResponse(data, data => {
          this.$store.dispatch("reportGetAll", true);
          this.$store.dispatch("customerGetAll", true);
          this.$router.replace("/reports/view/pm");
        });
      });
    },
    handleVisitType() {
      if (this.visit.visit_type === "double visit") {
        this.visit.dual = true;
      } else {
        this.visit.dual = false;
      }
    }
  },
  components: {
    VisitProducts
  },
  filters: {
    capital: v => {
      if (!v) return "";
      v = v.toString();
      return v.toUpperCase();
    }
  }
};
</script>

<style></style>
