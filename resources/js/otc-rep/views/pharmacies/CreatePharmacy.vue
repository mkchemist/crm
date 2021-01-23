<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">New Pharmacy</span>
    </p>
    <div class="p-2">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(savePharmacy)">
          <!-- Pharmacy name -->
          <div class="row mx-auto">
            <!-- Pharmacy Name -->
            <div class="col-lg form-group">
              <label for="name" class="text-muted">Name</label>
              <ValidationProvider
                name="name"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small" v-if="errors[0]"
                  >Pharmacy Name is missing</span
                >
                <input
                  type="text"
                  name="name"
                  id="name"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  v-model="pharmacy.name"
                  placeholder="Write pharmacy name"
                />
              </ValidationProvider>
            </div>
          </div>
          <!-- Pharmacy name and type -->
          <div class="row mx-auto">
            <!-- Pharmacy Type -->
            <div class="col-lg form-group">
              <label for="type" class="text-muted">Type</label>
              <ValidationProvider
                name="type"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small" v-if="errors[0]"
                  >Pharmacy type is missing</span
                >
                <select
                  name="type"
                  id="type"
                  v-model="pharmacy.type"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                >
                  <option :value="null">Select Pharmacy Type</option>
                  <option
                    :value="type"
                    v-for="(type, i) in types"
                    :key="`pharmacy_type_${type}_${i}`"
                    >{{ type }}</option
                  >
                </select>
              </ValidationProvider>
            </div>
            <!-- Pharmacy Key person -->
            <div class="col-lg form-group">
              <label for="key_person" class="text-muted">Key Person</label>
              <input
                type="text"
                name="key_person"
                id="key_person"
                v-model="pharmacy.key_person"
                class="form-control form-control-sm"
                placeholder="write ket person name"
              />
            </div>
          </div>
          <!-- Pharmacy Locations -->
          <div class="row mx-auto">
            <!-- address -->
            <div class="col-lg form-group">
              <label for="address" class="text-muted">Address</label>
              <ValidationProvider
                name="address"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small" v-if="errors[0]"
                  >Pharmacy address is missing</span
                >
                <input
                  type="text"
                  name="address"
                  id="address"
                  v-model="pharmacy.address"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  placeholder="write pharmacy address"
                />
              </ValidationProvider>
            </div>
            <!-- Brick -->
            <div class="col-lg form-group">
              <label for="brick" class="text-muted">Brick</label>
              <ValidationProvider
                name="brick"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small" v-if="errors[0]"
                  >you must a brick</span
                >
                <select
                  name="brick"
                  id="brick"
                  v-model="brick"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  :disabled="!locations.length"
                >
                  <option :value="null">Select Brick</option>
                  <option
                    :value="location"
                    v-for="(location, i) in locations"
                    :key="`location_${location.brick}_${i}`"
                    >{{ location.brick }}</option
                  >
                </select>
              </ValidationProvider>
            </div>
          </div>
          <hr />
          <div class="form-group text-right">
            <router-link to="/pharmacies" class="btn btn-sm btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>Back</span>
            </router-link>
            <button class="btn btn-sm btn-secondary" type="reset">
              <span class="fa fa-redo"></span>
              <span>Reset</span>
            </button>
            <button class="btn btn-sm btn-success" type="submit">
              <span class="fa fa-save"></span>
              <span>Save</span>
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../../helpers/http-service';
export default {
  computed: {
    locations() {
      return this.$store.getters.appUserLocations;
    },
    types() {
      return this.$store.getters.pharmacyTypes;
    }
  },
  data: () => ({
    pharmacy: {
      name: null,
      key_person: null,
      type: null,
      address: null
    },
    brick: null
  }),
  methods: {
    savePharmacy() {
      let request = Object.assign({},this.pharmacy, this.brick);
      httpCall.post('otc-rep/v1/pharmacies', request)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.$router.push('/pharmacies')
        })
      }).catch(err => console.log(err))
    },
    getSelectedBrickLocation(brick) {}
  }
};
</script>

<style></style>
