<template>
  <div>
    <div class="px-0 shadow pb-3">
      <p class="alert alert-warning">
        Edit pharamcy {{ pharmacy?pharmacy.name : null }}
      </p>
      <div class="p-2">
        <div v-if="pharmacy">
          <ValidationObserver v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(onSubmit)">

              <div class="row mx-auto">
                <div class="col-lg">
                  <label for="name" class="text-muted">Name</label>
                  <input type="text" class="form-control form-control-sm" v-model="pharmacy.name" readonly>
                </div>
              </div>

              <div class="row mx-auto">
                <div class="col-lg">
                  <label for="type" class="text-muted">Type</label>
                  <ValidationProvider name="type" rules="required" v-slot="{ errors }">
                    <span class="text-danger small">{{ errors[0] }}</span>
                    <select name="type" id="type" class="form-control form-control-sm" v-model="pharmacy.type">
                      <option value="">Select type</option>
                      <option v-for="(type, i) in types" :key="i"  :value="type">{{ type }}</option>
                    </select>
                  </ValidationProvider>
                </div>
                <div class="col-lg">
                  <label for="key_person" class="text-muted">Key Person</label>
                  <input type="text" name="key_person" id="key_person" class="form-control form-control-sm" v-model="pharmacy.key_person">
                </div>
              </div>

              <div class="row mx-auto">
                <div class="col-lg">
                  <label for="address" class="text-muted">Address</label>
                  <input type="text" id="address" name="address" class="form-control form-control-sm" v-model="pharmacy.address">
                </div>
                <div class="col-lg">
                  <label for="brick" class="text-muted">Brick</label>
                  <ValidationProvider name="brick" rules="required" v-slot="{errors}">
                    <span class="text-danger small">{{ errors[0] }}</span>
                    <input type="text" id="brick" name="brick" class="form-control form-control-sm" v-model="pharmacy.brick">
                  </ValidationProvider>
                </div>
              </div>
              <hr>
              <div class="form-group text-right">
                <router-link to="/workplaces/pharmacies" class="btn btn-sm btn-dark">
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
        <div v-else-if="error">
          <p class="text-center">Error {{ error }}</p>
        </div>
        <loader-component v-else/>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../../helpers/http-service';
export default {
  computed: {
    types() {
      return this.$store.getters.pharmacyTypes;
    }
  },
  created() {
    let id = this.$route.params.id;
    httpCall.get('rep/v1/pharmacies/'+id)
    .then(({data}) => {
      data.message = "Pharmacy loaded";
      this.handleResponse(data, data => {
        this.pharmacy = data.data;
      });
    })
  },
  data: () =>({
    pharmacy: null,
    error: null
  }),
  methods: {
    /**
     * updating pharmacy
     */
    onSubmit() {
      let id = this.$route.params.id;
      httpCall.post('rep/v1/pharmacies/'+id, {...this.pharmacy, _method: 'PUT'})
      .then(({data}) => {
        data.message = "Phamracy updated";
        this.handleResponse(data, data => {
          this.$store.dispatch('pharmacyGetAll',true).then(() => {
            setTimeout(() => {
              this.$router.push('/workplaces/pharmacies');
            },2000);
          })
        });
      });
    }
  }
}
</script>

<style>

</style>
