<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">Create new Request</span>
    </p>
    <div class="p-2 pb-5">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(submitRequest)">
          <!-- Customer and type -->
          <div class="row mx-auto p-2">
            <!-- customer -->
            <div class="col-lg border rounded mx-1 p-2">
              <label class="text-muted">Customer</label>
              <ValidationProvider name="customer" rules="required" v-slot="{errors}">
                <span v-if="errors[0]" class="text-danger small">{{ errors[0] }}</span>
                <select
                  name="customer"
                  id="customer"
                  v-model="request.customer_id"
                  :class="`form-control form-control-sm ${errors[0] ? 'border border-danger': ''}`"
                >
                  <option :value="null">select</option>
                  <option
                    v-for="customer in customers"
                    :key="customer.id"
                    :value="customer.id"
                    >{{ customer.name }}</option
                  >
                </select>
              </ValidationProvider>
              <customer-select-filter
                :data="$store.getters.active"
                class="my-2"
              />
            </div>
            <!-- type -->
            <div class="col-lg border rounded mx-1 p-2">
              <label class="text-muted">Request type</label>
              <ValidationProvider name="type" rules="required" v-slot="{errors}">
                <span v-if="errors[0]" class="text-danger small">{{ errors[0] }}</span>
                <select
                  name="type"
                  id="type"
                  :class="`form-control form-control-sm ${errors[0] ? 'border border-danger': ''}`"
                  v-model="request.type"
                >
                  <option :value="null">Select type</option>
                  <option
                    v-for="(type, i) in requestTypes"
                    :key="`request_${i}`"
                    :value="type"
                    >{{ type }}</option
                  >
                </select>
              </ValidationProvider>
            </div>
          </div>
          <!-- price and quantity -->
          <div class="row mx-auto p-2 my-1">
            <!-- price -->
            <div class="col-lg border rounded mx-1 p-2">
              <label class="text-muted">Price</label>
              <input
                type="number"
                class="form-control form-control-sm"
                v-model="request.price"
                :min="0"
                placeholder="Request price"
              />
              <small class="text-muted my-1">* This field is optional</small>
            </div>
            <!-- type -->
            <div class="col-lg border rounded mx-1 p-2">
              <label class="text-muted">Quantity</label>
              <input
                type="number"
                class="form-control form-control-sm"
                v-model="request.quantity"
                :min="1"
                placeholder="Request quantity"
              />
              <small class="text-muted my-1">* This field is optional</small>
            </div>
          </div>
          <!-- Dates -->
          <div class="row mx-auto p-2 my-1">
            <!-- Query Date -->
            <div class="col-lg border rounded mx-1 p-2">
              <label class="text-muted">Query Date</label>
              <ValidationProvider name="query_date" rules="required" v-slot="{errors}">
                <span v-if="errors[0]" class="text-danger small">{{ errors[0] }}</span>
              <input
                type="date"
                name="query_date"
                :class="`form-control form-control-sm ${errors[0] ? 'border border-danger': ''}`"
                v-model="request.query_date"
                :min="today"
                :disabled="true"
              />
              </ValidationProvider>
            </div>
            <!-- Apply Date -->
            <div class="col-lg border rounded mx-1 p-2">
              <label class="text-muted">Apply Date</label>
              <ValidationProvider name="apply_date" rules="required" v-slot="{errors}">
                <span v-if="errors[0]" class="text-danger small">{{ errors[0] }}</span>
                <input
                  type="date"
                  :class="`form-control form-control-sm ${errors[0] ? 'border border-danger': ''}`"
                  v-model="request.apply_date"
                  :min="today"
                />
              </ValidationProvider>
            </div>
          </div>
          <!-- Comment -->
          <div class="row mx-auto p-2 my-1">
            <!-- label -->
            <div class="col-lg  mx-1 p-2">
              <p class="text-muted mb-1">Comment</p>
              <p class="mb-0 small text-muted">* This field is optional</p>
              <small class="text-muted"
                >Write small notes about customer request</small
              >
            </div>
            <!-- Text area -->
            <div class="col-lg border rounded mx-1 p-2">
              <textarea
                name="comment"
                id="comment"
                rows="5"
                class="form-control form-control-sm"
                placeholder="write comment about request"
              ></textarea>
            </div>
          </div>
          <hr />
          <div class="form-group text-right">
            <router-link to="/reports" class="btn btn-sm btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
            <button type="reset" class="btn btn-sm btn-secondary">
              <span class="fa fa-redo"></span>
              <span>reset</span>
            </button>
            <button type="submit" class="btn btn-sm btn-primary">
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
import { httpCall } from "../../../../helpers/http-service";
import CustomerSelectFilter from "../../../components/CustomerSelectFilter.vue";
export default {
  components: {
    CustomerSelectFilter
  },
  mounted() {
    this.getRequestTypes().then(() => {
      this.$store.dispatch("customerGetAll");
    });
  },
  data: () => ({
    requestTypes: [],
    request: {
      customer_id: null,
      type: null,
      comment: "",
      quantity: 1,
      price: 0,
      query_date: new Date().format(),
      apply_date: new Date().format()
    },
    today: new Date().format()
  }),
  computed: {
    customers() {
      return this.$store.getters.customerFilter;
    }
  },
  methods: {
    /**submit request */
    submitRequest() {
      httpCall.post('customer-requests',this.request)
      .then(({data}) => {
        this.handleResponse(data ,data => {
          this.$router.push('/reports');
        })
      }).catch(err => console.log(err))
    },
    /** get requests types */
    getRequestTypes() {
      return httpCall
        .get("request-types")
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.requestTypes = data.data;
          });
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style></style>
