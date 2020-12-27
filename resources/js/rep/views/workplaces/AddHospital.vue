<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-plus-circle"></i></span>
        <span class="font-weight-bold">Add new Hospital</span>
      </p>
      <div class="my-2 p-2">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(onSubmit)">
            <!-- hospital info. -->
            <div class="row mx-auto my-1">
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
                    name="name"
                    id="name"
                    class="form-control form-control-sm"
                    placeholder="Enter hospital name"
                    v-model="hospital.name"
                  />
                </ValidationProvider>
              </div>
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
                    v-model="hospital.type"
                  >
                    <option value="">Select hospital type</option>
                    <option v-for="(item, i) in types" :key="i" :value="item">{{
                      item
                    }}</option>
                  </select>
                </ValidationProvider>
              </div>
            </div>
            <!-- hospital location info. --->
            <div class="row mx-auto my-1">
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
                    :class="
                      `form-control form-control-sm ${
                        errors[0] ? 'border border-danger' : ''
                      }`
                    "
                    placeholder="Enter Hospital address"
                    v-model="hospital.address"
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
                    v-model="hospitalLocation"
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
            <!-- hospital Phone --->
            <div class="row mx-auto my-1">
              <div class="col-lg">
                <label for="phone" class="text-muted">phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  class="form-control form-control-sm"
                  placeholder="Enter Hospital phone"
                  v-model="hospital.phone"
                />
              </div>
              <div class="col-lg"></div>
            </div>
            <hr />
            <div class="form-group text-right">
              <router-link to="/workplaces" class="btn  btn-sm btn-dark">
                <span><i class="fa fa-chevron-circle-left"></i></span>
                <span>back</span>
              </router-link>
              <button class="btn btn-sm btn-success">
                <span><i class="fa fa-save"></i></span>
                <span>save</span>
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
  mounted() {
    this.$store.dispatch("getUserLocations");
  },
  methods: {
    /**
     * adding new hospital
     *
     */
    onSubmit() {
      if (!this.hospitalLocation.brick) {
        this.$toasted.error("You must select workplace brick");
        return;
      }
      let request = {
        ...this.hospital,
        ...this.hospitalLocation
      };
      httpCall
        .post("rep/v1/workplaces", request)
        .then(({ data }) => {
          data.message = "hospital added successfully";
          this.handleResponse(data, data => {
            this.$store.dispatch("workplaceGetAll", true).then(() => {
              this.$router.replace("/workplaces");
            });
          });
        })
        .finally(() => {});
    }
  },
  data: () => ({
    hospital: {
      name: null,
      type: null,
      address: null,
      brick: null,
      phone: null
    },
    hospitalLocation: {}
  }),
  computed: {
    types() {
      return this.$store.getters.hospitalTypes;
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
