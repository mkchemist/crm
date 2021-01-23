<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-list"></span>
      <span class="font-weight-bold">View Pharmacy {{ pharmacy ? pharmacy.name : '' }}</span>
    </p>
    <div class="p-2">
      <div v-if="pharmacy">
        <div class="my-2 px-0  rounded shadow-sm">
          <p class="bg-primary text-light p-2 mb-0 lead">Pharmacy Info.</p>
          <div class="p-2 row mx-auto small">
            <div class="col-lg">
              <p class="mb-0 border-bottom">Pharmacy Name : <span class="font-weight-bold text-primary">{{ pharmacy.name }}</span></p>
              <p class="mb-0 border-bottom">Pharmacy Type : <span class="font-weight-bold text-primary">{{ pharmacy.type }}</span></p>
              <p class="mb-0 border-bottom">Key Person : <span class="font-weight-bold text-primary">{{ pharmacy.key_person || '--------' }}</span></p>
              <p class="mb-0 border-bottom">No. of visits : <span class="font-weight-bold text-primary">{{ pharmacy.reports }}</span></p>
            </div>
            <div class="col-lg">
              <p class="mb-0 border-bottom">Address : <span class="font-weight-bold text-primary">{{ pharmacy.address }}</span></p>
              <p class="mb-0 border-bottom">Brick: <span class="font-weight-bold text-primary">{{ pharmacy.brick }}</span></p>
              <p class="mb-0 border-bottom">Area : <span class="font-weight-bold text-primary">{{ pharmacy.area }}</span></p>
              <p class="mb-0 border-bottom">District : <span class="font-weight-bold text-primary">{{ pharmacy.district }}</span></p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <no-data-to-show />
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../../helpers/http-service';
export default {
  mounted() {
    this.fetchPharmacy();
  },
  data : () => ({
    pharmacy : null,
    fetched: false
  }),
  methods: {
    id() {
      return this.$route.params.id
    },
    fetchPharmacy() {
      let id = this.id();
      return httpCall.get("otc-rep/v1/pharmacies/"+id)
      .then(({data}) => {
        this.pharmacy = data.data;
        this.fetched = true;
      }).catch(err => console.log(err))
    }
  }
}
</script>

<style>

</style>
