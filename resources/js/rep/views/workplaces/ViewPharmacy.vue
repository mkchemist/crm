<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-address-card"></i></span>
        <span class="font-weight-bold">View Pharmacy {{ pharmacy ? pharmacy.name : null }} Card</span>
      </p>
      <div class="p-2 text-right">
        <router-link to="/workplaces/pharmacies" class="btn btn-sm btn-dark">
          <span><i class="fa fa-chevron-circle-left"></i></span>
          <span>back</span>
        </router-link>
        <router-link :to="`/workplaces/pharmacy/edit/${$route.params.id}`" class="btn btn-sm btn-warning">
          <span><i class="fa fa-edit"></i></span>
          <span>edit</span>
        </router-link>
      </div>
      <div class="p-2">
        <div v-if="pharmacy" class="border my-2 p-2 rounded">
          <p class="lead text-muted">Pharmacy Info.</p>
          <hr>
          <div class="row mx-auto">
            <div class="col-lg">
              <p>Name: <span class="text-primary">{{ pharmacy.name }}</span></p>
              <p>Type: <span class="text-primary">{{ pharmacy.type }}</span></p>
              <p>Key Person: <span class="text-primary">{{ pharmacy.key_person }}</span></p>
            </div>
            <div class="col-lg">
              <p>Address: <span class="text-primary">{{ pharmacy.address }}</span></p>
              <p>Brick: <span class="text-primary">{{ pharmacy.brick }}</span></p>
            </div>
          </div>
        </div>
        <div v-else-if="load_pharmacy_error" class="text-center">
          <p class="lead mb-0">Oops</p>
          <p class="lead mb-0 text-danger">Error {{ load_pharmacy_error }}</p>
          <p class="text-muted">Something went wrong</p>
        </div>
        <loader-component v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../helpers/http-service';
export default {
  created() {
    this.loadPharmacy()
  },
  methods: {
    getPharmacyId() {
      return this.$route.params.id;
    },
    loadPharmacy() {
      let id = this.getPharmacyId();
      httpCall.get('rep/v1/pharmacies/'+id)
      .then(({data}) => {
        if(data.code === 400 || data.code === 301) {
          this.handleResponseError(data);
          this.load_pharmacy_error = data.code;
        } else {
          this.$toasted.show('Pharmacy laoded', {
            type: 'info',
            icon: 'check',
            theme: 'bubble'
          });
          this.pharmacy = data.data;
        }
      });
    }
  },
  data: () => ({
    pharmacy: null,
    load_pharmacy_error: false
  })
}
</script>

<style>

</style>
