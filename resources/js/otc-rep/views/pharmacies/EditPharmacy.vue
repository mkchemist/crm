<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-warning">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">Edit Pharmacy {{ pharmacy ? pharmacy.name : '' }}</span>
    </p>
    <div class="p-2">
      <div v-if="pharmacy">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(savePharmacy)">
            <!-- Pharmacy name -->
            <div class="row mx-auto">
              <!-- Pharmacy Name -->
              <div class="col-lg form-group">
                <label for="name" class="text-muted">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  :class="`form-control form-control-sm`"
                  :value="pharmacy.name"
                  placeholder="Write pharmacy name"
                  readonly
                  :disabled="true"
                />
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
                <input
                  type="text"
                  name="brick"
                  id="brick"
                  class="form-control form-control-sm"
                  :value="pharmacy.brick"
                  :disabled="true"
                  readonly
                />
              </div>
            </div>
            <hr />
            <div class="form-group text-right">
              <router-link to="/pharmacies" class="btn btn-sm btn-dark">
                <span class="fa fa-chevron-circle-left"></span>
                <span>Back</span>
              </router-link>
              <button class="btn btn-sm btn-secondary">
                <span class="fa fa-redo"></span>
                <span>Reset</span>
              </button>
              <button class="btn btn-sm btn-success">
                <span class="fa fa-save"></span>
                <span>Save</span>
              </button>
            </div>
          </form>
        </ValidationObserver>
      </div>
      <div v-else>
        <no-data-to-show />
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
export default {
  mounted() {
    this.fetchPharmacy();
  },
  computed: {
    locations() {
      return this.$store.getters.appUserLocations;
    },
    types() {
      return this.$store.getters.pharmacyTypes;
    }
  },
  data: () => ({
    pharmacy: null,
    fetched: false,
  }),
  methods: {
    id() {
      return this.$route.params.id;
    },
    fetchPharmacy() {
      let id = this.id();
      return httpCall
        .get("otc-rep/v1/pharmacies/" + id)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.pharmacy = data.data;
          });
        })
        .catch(err => console.log(err));
    },
    savePharmacy() {
      let id = this.id();
      let request = {
        ...this.pharmacy,
        _method: 'PUT'
      }
      return httpCall.post('otc-rep/v1/pharmacies/'+id, request)
      .then(({data}) => {
        this.handleResponse(data ,data => {
          this.$store.dispatch('fetchPharmacies',{force: true})
          this.$router.push('/pharmacies')
        });
      }).catch(err => console.log(err))
    },
    getSelectedBrickLocation(brick) {}
  }
};
</script>

<style></style>
