<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">{{ `New ${type} visit` }}</span>
    </p>
    <div class="p-2">
      <!-- Visit Info -->
      <div class="p-2 rounded border">
        <p class="text-muted lead">Visit Info.</p>
        <div class="row mx-auto">
          <div class="col-lg">
            <div
              class="mb-1 border-bottom small form-inline justify-content-between"
            >
              <span>Date</span>
              <input
                type="date"
                v-model="visit_date"
                required
                :max="new Date().format()"
              />
            </div>
            <p class="mb-1 border-bottom small clearfix">
              <span>User</span>
              <span class="font-weight-bold text-primary float-right">{{
                user.name
              }}</span>
            </p>
            <p class="mb-1 border-bottom small clearfix">
              <span>Rep</span>
              <span class="font-weight-bold text-primary float-right">{{
                rep.name
              }}</span>
            </p>
            <p class="mb-1 border-bottom small clearfix">
              <span>Customer</span>
              <span class="font-weight-bold text-primary float-right">{{
                customer.name
              }}</span>
            </p>
            <p
              class="mb-1 border-bottom small clearfix"
              v-if="type === 'pharmacy'"
            >
              <span>Type</span>
              <span class="font-weight-bold text-primary float-right">{{
                customer.type
              }}</span>
            </p>
            <p
              class="mb-1 border-bottom small clearfix"
              v-if="type !== 'pharmacy'"
            >
              <span>Specialty</span>
              <span class="font-weight-bold text-primary float-right">{{
                customer.specialty
              }}</span>
            </p>
            <p
              class="mb-1 border-bottom small clearfix"
              v-if="type !== 'pharmacy'"
            >
              <span>Parameter</span>
              <span class="font-weight-bold text-primary float-right">{{
                customer.params && customer.params.length
                  ? customer.params[0].current
                  : "NN"
              }}</span>
            </p>
          </div>
          <div class="col-lg">
            <p class="mb-1 border-bottom small clearfix">
              <span>Address</span>
              <span class="font-weight-bold text-primary float-right">{{
                customer.address
              }}</span>
            </p>
            <p class="mb-1 border-bottom small clearfix">
              <span>Brick</span>
              <span class="font-weight-bold text-primary float-right">{{
                customer.brick
              }}</span>
            </p>
            <p class="mb-1 border-bottom small clearfix">
              <span>Area</span>
              <span class="font-weight-bold text-primary float-right">{{
                customer.area
              }}</span>
            </p>
            <p class="mb-1 border-bottom small clearfix">
              <span>District</span>
              <span class="font-weight-bold text-primary float-right">{{
                customer.district
              }}</span>
            </p>
            <p class="mb-1 border-bottom small clearfix">
              <span>Territory</span>
              <span class="font-weight-bold text-primary float-right">{{
                customer.territory
              }}</span>
            </p>
          </div>
        </div>
      </div>
      <!-- end Visit Info -->
      <div class="p-2">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(saveReport)">
            <!-- Coaching Visit -->
            <div class="my-2 p-2" v-if="type === 'coaching'">
              <table class="table table-sm small table-bordered">
                <thead>
                  <tr class="bg-success text-light">
                    <th>Item</th>
                    <th>Mark</th>
                  </tr>
                </thead>
                <tbody v-for="(row, key) in data" :key="`main_${key}`">
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
                      <select v-model="data[key][i]" class="coach-select">
                        <template v-if="key==='Customer Parameter'">
                          <option value="HH">HH</option>
                          <option value="HM">HM</option>
                          <option value="HL">HL</option>
                          <option value="MH">MH</option>
                          <option value="MM">MM</option>
                          <option value="ML">ML</option>
                          <option value="LH">LH</option>
                          <option value="LM">LM</option>
                          <option value="LL">LL</option>
                          <option value="NN">NN</option>
                        </template>
                        <template v-else>
                        <option value="">N</option>
                        <option value="S">S</option>
                        <option value="U">U</option>
                        </template>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- End of coach visits -->
            <!-- Single Visit -->
            <div v-if="['single', 'pharmacy'].includes(type)">
              <div class="p-2 border rounded">
                <visit-products
                  :data="products"
                  :pharmacyProducts="type === 'pharmacy' ? true : false"
                />
              </div>
              <div class="row mx-auto border rounded my-1 p-2">
                <div class="col-lg" v-if="type !== 'pharmacy'">
                  <label for="" class="text-muted">Comment</label>
                  <textarea
                    cols="30"
                    rows="5"
                    v-model="visit_comment"
                    placeholder="write visit comment"
                    class="form-control form-control-sm"
                  ></textarea>
                </div>
                <div class="col-lg" v-if="type !== 'pharmacy'">
                  <label for="" class="text-muted">General Feedback</label>
                  <textarea
                    cols="30"
                    rows="5"
                    v-model="visit_feedback"
                    placeholder="write visit comment"
                    class="form-control form-control-sm"
                  ></textarea>
                </div>
                <div class="col-lg" v-if="type === 'pharmacy'">
                  <label for="" class="text-muted">General Feedback</label>
                  <ValidationProvider
                    name="feedback"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <span v-if="errors[0]" class="text-danger small">{{
                      errors[0]
                    }}</span>
                    <textarea
                      cols="30"
                      rows="5"
                      v-model="visit_feedback"
                      placeholder="write visit comment"
                      :class="
                        `form-control form-control-sm ${
                          errors[0] ? 'border border-danger' : ''
                        }`
                      "
                    ></textarea>
                  </ValidationProvider>
                </div>
              </div>
            </div>
            <hr />
            <!-- Report control -->
            <div class="my-2 form-group text-right">
              <router-link :to="backUrl" class="btn btn-sm btn-dark">
                <span class="fa fa-chevron-circle-left"></span>
                <span>back</span>
              </router-link>
              <button class="btn btn-sm btn-success" type="submit">
                <span class="fa fa-save"></span>
                <span>Save</span>
              </button>
            </div>
          </form>
        </ValidationObserver>
        <!-- end of single visit -->
      </div>
    </div>
  </div>
</template>

<script>
import { COACH_REPORT } from "../helpers/constants";
import VisitProducts from "../rep/components/VisitProducts.vue";
export default {
  components: { VisitProducts },
  created() {
    this.data = this.createCoachReportTemplate();
  },
  props: {
    customer: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    rep: {
      type: Object
    },
    type: {
      type: String,
      default: () => "single"
    },
    backUrl: {
      type: String,
      default: () => "/reports"
    },
    onSave: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    data: {},
    products: [],
    visit_date: null,
    visit_comment: null,
    visit_feedback: null
  }),
  methods: {
    createCoachReportTemplate() {
      return Object.assign({},COACH_REPORT)
    },
    saveReport() {
      if (!this.visit_date) {
        this.$swal({
          text: "Visit Date Required",
          title: "You must pick a date",
          icon: "warning"
        });
        return;
      }
      if (["single", "pharmacy"].includes(this.type) && !this.products.length) {
        this.$swal({
          text: "No Products Provided",
          title: "You must pick at least one Product",
          icon: "warning"
        });
        return;
      }
      if (this.type === "pharmacy" && !this.visit_feedback) {
        this.$swal({
          text: "No Feedback Provided",
          title: "You provide a visit general feedback",
          icon: "warning"
        });
        return;
      }
      this.onSave({
        date: this.visit_date,
        comment: this.visit_comment,
        feedback: this.visit_feedback,
        coach: this.data,
        products: this.products
      });
    }
  },
  destroyed() {
    this.data = {};
  }
};
</script>

<style></style>
