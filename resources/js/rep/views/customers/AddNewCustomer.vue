<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-plus-circle"></i></span>
        <span class="font-weight-bold">Add new customer</span>
      </p>
      <div class="p-2">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(onSubmit)">
            <!-- customer information part -->
            <p>Customer Info.</p>
            <hr />
            <div class="row mx-auto">
              <div class="form-group col-lg">
                <label for="title" class="text-muted">Title</label>
                <select
                  name="title"
                  id="title"
                  class="form-control form-control-sm"
                  v-model="customer.title"
                >
                  <option value="">Select title</option>
                  <option v-for="(item, i) in title" :key="i" :value="item">{{
                    item
                  }}</option>
                </select>
              </div>
              <div class="form-group col-lg">
                <label for="name" class="text-muted">Name</label>
                <ValidationProvider
                  name="name"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span class="text-danger small">{{ errors[0] }}</span>
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    id="name"
                    name="name"
                    placeholder="Customer name"
                    v-model="customer.name"
                  />
                </ValidationProvider>
              </div>
            </div>

            <div class="row mx-auto">
              <div class="form-group col-lg">
                <label for="specialty" class="text-muted">Specialty</label>
                <ValidationProvider
                  name="specialty"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span class="text-danger small">{{ errors[0] }}</span>
                  <select
                    name="specialty"
                    id="specialty"
                    class="form-control form-control-sm"
                    v-model="customer.specialty"
                  >
                    <option value="">Select specialty</option>
                    <option
                      v-for="(item, i) in specialty"
                      :key="i"
                      :value="item"
                      >{{ item }}</option
                    >
                  </select>
                </ValidationProvider>
              </div>
              <div class="form-group col-lg">
                <label for="workplace" class="text-muted">Workplace</label>
                <select
                  name="workplace"
                  id="workplace"
                  class="form-control form-control-sm"
                  v-model="customer.workplace_id"
                >
                  <option value="">Select workplace</option>
                  <option
                    v-for="workplace in workplaces"
                    :key="workplace.id"
                    :value="workplace.id"
                    >{{ workplace.name }}</option
                  >
                </select>
              </div>
              <div class="form-group col-lg">
                <label for="brick" class="text-muted">Brick</label>
                <ValidationProvider
                  name="brick"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span class="text-danger small">{{ errors[0] }}</span>
                  <select
                    name="brick"
                    id="brick"
                    class="form-control form-control-sm"
                    v-model="customerLocation"
                  >
                    <option value="">select brick</option>
                    <option
                      v-for="(val, key) in userLocations"
                      :key="`brick_${key}`"
                      :value="val"
                      >{{ val.brick }}</option
                    >
                  </select>
                </ValidationProvider>
              </div>
            </div>

            <div class="row mx-auto">
              <div class="form-group col-lg">
                <label for="address" class="text-muted">Address</label>
                <ValidationProvider
                  name="address"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span class="text-danger small">{{ errors[0] }}</span>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    :class="
                      `form-control form-control-sm ${
                        errors[0] ? 'border border-danger' : ''
                      }`
                    "
                    placeholder="Enter customer address"
                    v-model="customer.address"
                  />
                </ValidationProvider>
              </div>
              <div class="form-group col-lg">
                <label for="phone" class="text-muted">Phone</label>
                <ValidationProvider
                  name="phone"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span class="text-danger small">{{ errors[0] }}</span>
                  <input
                    type="phone"
                    id="phone"
                    name="phone"
                    :class="
                      `form-control form-control-sm ${
                        errors[0] ? 'border border-danger' : ''
                      }`
                    "
                    placeholder="Enter customer phone"
                    v-model="customer.phone"
                  />
                </ValidationProvider>
              </div>
            </div>

            <hr />
            <div class="form-group text-right">
              <router-link to="/customers" class="btn btn-dark">
                <span><i class="fa fa-chevron-circle-left"></i></span>
                <span>back</span>
              </router-link>
              <button class="btn btn-success" type="submit">
                <span><i class="fa fa-save"></i></span>
                <span>add</span>
              </button>
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
export default {
  data: () => ({
    customer: {
      name: "",
      title: "",
      specialty: "",
      workplace_id: "",
      brick: "",
      address: "",
      phone: ""
    },
    customerLocation: {}
  }),
  mounted() {
    this.$store.dispatch("getUserLocations").then(() => {
      this.$store.dispatch("workplaceGetAll");
    });
  },
  computed: {
    specialty() {
      return this.$store.getters.specialty;
    },
    param() {
      return this.$store.getters.param;
    },
    title() {
      return this.$store.getters.title;
    },
    workplaces() {
      return this.$store.getters.allWorkplaces;
    },
    userLocations() {
      return this.$store.getters.userLocations;
    }
  },
  methods: {
    onSubmit() {
      let customer = { ...this.customer, ...this.customerLocation };
      this.$store.dispatch("addNewCustomer", customer);
    }
  }
};
</script>

<style></style>
