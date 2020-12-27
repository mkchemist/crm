<template>
  <div class="p-2 row mx-auto my-2 border rounded">
    <div class="col-lg-8">
      <h4 class="text-primary">Force assets refresh</h4>
      <small class="text-muted">This will generate new hashed key to refresh all application assets on all devices with all users</small>
    </div>
    <div class="col-lg-4 d-flex align-items-center justify-content-center flex-column">
      <button class="btn btn-sm btn-danger" @click="forceRefresh">
        <span class="fa fa-cloud-upload-alt"></span>
        <span>Generate new hash key</span>
      </button>
      <small class="text-muted my-1">current hash key : <span class="text-danger font-weight-bold">{{ hash_key }}</span> </small>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../helpers/http-service'
export default {
  mounted() {
    this.getHashKey();
  },
  data: () => ({
    hash_key : null
  }),
  methods:{
    getHashKey() {
      httpCall.get('admin/v1/setting/refresh-hash-key')
      .then(({data}) => {
        this.handleResponse(data ,data => {
          this.hash_key = data.data;
        });
      }).catch(err => console.log(err));
    },
    forceRefresh() {
      httpCall.post('admin/v1/setting/refresh-hash-key')
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.hash_key = data.data;
        });
      }).catch(err => console.log(err))
    }
  }
}
</script>

<style>

</style>
