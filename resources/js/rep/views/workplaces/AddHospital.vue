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
                <input
                  type="text"
                  id="address"
                  name="address"
                  class="form-control form-control-sm"
                  placeholder="Enter Hospital address"
                  v-model="hospital.address"
                />
              </div>
              <div class="col-lg">
                <label for="brick" class="text-muted">Brick</label>
                <ValidationProvider
                  name="brick"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span class="text-danger small">{{ errors[0] }}</span>
                  <input
                    type="text"
                    id="brick"
                    name="brick"
                    class="form-control form-control-sm"
                    placeholder="Enter hospital brick"
                    v-model="hospital.brick"
                  />
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
  methods: {
    /**
     * adding new hospital
     *
     */
    onSubmit() {
      httpCall
        .post("rep/v1/workplaces", this.hospital)
        .then(({ data }) => {
          data.message = 'hospital added successfully';
          this.handleResponse(data, data => {
            this.$store.dispatch("workplaceGetAll", true).then(() => {
              this.$router.replace("/workplaces");
            });
          })
        })
        .finally(() => {
        });
    }
  },
  data: () => ({
    hospital: {
      name: null,
      type: null,
      address: null,
      brick: null,
      phone: null
    }
  }),
  computed: {
    types() {
      return this.$store.getters.hospitalTypes;
    }
  }
};
</script>

<style></style>
