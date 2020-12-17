<template>
  <div>
    <div class="px-0 shadow pb-3">
      <p class="alert alert-success">
        <span><i class="fa fa-plus-circle"></i></span>
        <span class="font-weight-bold">Add new Pharmacy</span>
      </p>
      <div class="p-2">
        <validationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(onSubmit)">
            <!-- pharmacy info -->
            <div class="row mx-auto">
              <div class="col-lg">
                <label for="name" class="text-muted">Name</label>
                <ValidationProvider
                  name="name"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span class="text-danger small">{{ errors[0] }}</span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    class="form-control form-control-sm"
                    placeholder="Enter pharmacy name"
                    v-model="pharmacy.name"
                  />
                </ValidationProvider>
              </div>
            </div>

            <div class="row mx-auto">
              <div class="col-lg">
                <label for="type" class="text-muted">Type</label>
                <ValidationProvider
                  name="type"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span class="text-danger small">{{ errors[0] }}</span>
                  <select
                    name="type"
                    id="type"
                    class="form-control form-control-sm"
                    v-model="pharmacy.type"
                  >
                    <option value="">Select type</option>
                    <option v-for="(type, i) in types" :key="i" :value="type">{{
                      type
                    }}</option>
                  </select>
                </ValidationProvider>
              </div>
              <div class="col-lg">
                <label for="key_person" class="text-muted">Key Person</label>
                <input
                  type="text"
                  class="form-control form-control-sm"
                  id="key_person"
                  name="key_person"
                  placeholder="Enter key person name"
                  v-model="pharmacy.key_person"
                />
              </div>
            </div>

            <!-- pharamcy location info -->
            <div class="row mx-auto">
              <div class="col-lg">
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
                    class="form-control form-control-sm"
                    v-model="pharmacy.address"
                    placeholder="Enter pharmacy address"
                  />
                </ValidationProvider>
              </div>
              <div class="col-lg">
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
                    v-model="pharmacyLocation"
                    :class="
                      `form-control form-control-sm ${
                        errors[0] ? 'border border-danger' : ''
                      }`
                    "
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
            <hr />
            <div class="form-group text-right">
              <router-link
                to="/workplaces/pharmacies"
                class="btn btn-sm btn-dark"
              >
                <span><i class="fa fa-chevron-circle-left"></i></span>
                <span>back</span>
              </router-link>
              <button class="btn btn-sm btn-success">
                <span><i class="fa fa-save"></i></span>
                <span>save</span>
              </button>
            </div>
          </form>
        </validationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
export default {
  mounted() {
    this.$store.dispatch("getUserLocations");
  },
  methods: {
    /**
     * adding new pharmacy
     */
    onSubmit() {
      let request = {
        ...this.pharmacy,
        ...this.pharmacyLocation
      };
      httpCall.post("rep/v1/pharmacies", request).then(({ data }) => {
        data.message = "Pharmacy added";
        this.handleResponse(data, data => {
          this.$store.dispatch("pharmacyGetAll", true).then(() => {
            this.$router.replace("/workplaces/pharmacies");
          });
        });
      });
    }
  },
  data: () => ({
    pharmacy: {
      name: "",
      type: "",
      key_person: "",
      address: "",
      brick: "",
      area: ""
    },
    pharmacyLocation: {}
  }),
  computed: {
    types() {
      return this.$store.getters.pharmacyTypes;
    },
    userLocations() {
      return this.$store.getters.userLocations;
    },
    isUserLocationsFetched() {
      return this.$store.getters.isUserLocationsFetched;
    }
  }
};
</script>

<style></style>
