<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-warning">
        <span><i class="fa fa-edit"></i></span>
        <span class="font-weight-bold">
          Edit Customer <span v-if="customer">{{ customer.name }}</span>
        </span>
      </p>
      <div class="my-2 p-2">
        <loader-component v-if="loading" />
        <div v-else-if="error" class="text-center">
          <p class="font-weight-lighter" style="font-size:3rem">
            Error {{ error_code }}
          </p>
          <p class="text-danger lead"><b>Oops</b> something wrong happen</p>
        </div>
        <div v-else>
          <ValidationObserver v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)">
              <p>Customer info.</p>
              <hr />
              <!-- customer specialty and brick -->
              <div class="row mx-auto">
                <div class="col-lg">
                  <label for="specialty" class="text-muted">Specialty</label>
                  <input
                    type="text"
                    id="specialty"
                    :value="customer.specialty"
                    readonly
                    disabled
                    class="form-control form-control-sm"
                  />
                </div>
                <div class="col-lg">
                  <label for="brick" class="text-muted">Brick</label>
                  <input
                    type="text"
                    id="brick"
                    :value="customer.brick"
                    readonly
                    disabled
                    class="form-control form-control-sm"
                  />
                </div>
              </div>
              <!-- end of customer specialty and brick -->

              <div class="row mx-auto my-2">
                <!-- customer title -->
                <div class="form-group col-lg">
                  <label for="title" class="text-muted">Title</label>
                  <select
                    id="title"
                    class="form-control form-control-sm"
                    v-model="customer.title"
                  >
                    <option
                      v-for="(title, i) in titles"
                      :key="i"
                      :value="title"
                      >{{ title }}</option
                    >
                  </select>
                </div>
                <!--customer workplace -->
                <div class="form-group col-lg">
                  <label for="title" class="text-muted">Workplace</label>
                  <select
                    id="title"
                    class="form-control form-control-sm"
                    v-model="customer.workplace_id"
                  >
                    <option value="">Select Workplace</option>
                    <option
                      v-for="workplace in workplaces"
                      :key="workplace.id"
                      :value="workplace.id"
                      >{{ workplace.name }}</option
                    >
                  </select>
                </div>
              </div>
              <div class="row mx-auto">
                <!-- customer address -->
                <div class="form-group col-lg">
                  <label for="specialty" class="text-muted">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    class="form-control form-control-sm"
                    placeholder="Enter customer address"
                    v-model="customer.address"
                  />
                </div>
                <!-- customer phone -->
                <div class="form-group col-lg">
                  <label for="phone" class="text-muted">Phone</label>
                  <input
                    type="phone"
                    id="phone"
                    name="phone"
                    class="form-control form-control-sm"
                    placeholder="Enter customer phone"
                    v-model="customer.phone"
                  />
                </div>
              </div>
              <!-- customer parameters part -->
              <p>Customer parameters</p>
              <hr />
              <div class="form-group row mx-auto">
                <label for="params" class="text-muted col-lg-5"
                  >Classification</label
                >
                <ValidationProvider
                  name="params"
                  rules="required"
                  v-slot="{ errors }"
                  class="col-lg"
                >
                  <span class="text-danger small">{{ errors[0] }}</span>
                  <select
                    name="params"
                    id="params"
                    class="form-control form-control-sm"
                    v-model="customer.parameter"
                  >
                    <option value="">Select Parameter</option>
                    <option v-for="(item, i) in param" :key="i" :value="item">{{
                      item
                    }}</option>
                  </select>
                </ValidationProvider>
              </div>
              <div class="form-group row mx-auto">
                <label for="frequency" class="text-muted col-lg-5"
                  >Frequency <small> ( next cycle frequency )</small>
                </label>
                <ValidationProvider
                  name="frequency"
                  rules="required"
                  v-slot="{ errors }"
                  class="col-lg"
                >
                  <span class="text-danger small">{{ errors[0] }}</span>
                  <input
                    type="number"
                    name="frequency"
                    id="frequency"
                    class="form-control form-control-sm"
                    placeholder="Enter frequency"
                    min="0"
                    max="10"
                    v-model="customer.next_freq"
                    :disabled="customer.locked_freq"
                  />
                </ValidationProvider>
              </div>

              <hr />
              <div class="form-group text-right">
                <router-link to="/customers" class="btn btn-dark">
                  <span><i class="fa fa-chevron-circle-left"></i></span>
                  <span>back</span>
                </router-link>
                <router-link :to="`/customers/view/${customer.id}`" class="btn btn-primary" v-if="customer">
                  <span><i class="fa fa-book-open"></i></span>
                  <span>view</span>
                </router-link>
                <button class="btn btn-success" type="submit">
                  <span><i class="fa fa-save"></i></span>
                  <span>update</span>
                </button>
              </div>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
export default {
  data: state => ({
    customer: null,
    loading: false,
    error: false,
    error_code: null
  }),
  created() {
    this.loading = true;
    this.$store.dispatch("workplaceGetAll");
    this.fetchCustomer();
  },
  methods: {
    fetchCustomer() {
      httpCall
      .get("rep/v1/customers/" + this.$route.params.id)
      .then(({ data }) => {
        data.message = "Customer ready";
        this.handleResponse(data,(data) => {
          this.customer =data.data.customer;
          this.loading = false
        },(data) => {
          this.error = true;
          this.loading = false;
          this.error_code = data.code;
        });
      });
    },
    onSubmit() {
      let _data = {
        ...this.customer,
        _method: "PUT"
      };
      httpCall
        .post("rep/v1/customers/" + this.$route.params.id, _data)
        .then(({ data }) => {
          data.message = "Customer updated successfully";
          this.handleResponse(data, (data) => {
            this.$router.back()
          }, (data) => {
            this.loading = false;
            this.error = true;
            this.error_code = data.code;
          });
        }).finally(() => {
          this.$store.dispatch('customerGetAll', true)
        });
    }
  },
  computed: {
    titles() {
      return this.$store.getters.title;
    },
    param() {
      return this.$store.getters.param;
    },
    workplaces() {
      return this.$store.getters.allWorkplaces;
    }
  }
};
</script>

<style></style>
