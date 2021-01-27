<template>
  <button type="button" class="btn btn-sm btn-danger" @click="deleteRecord">
    <span :class="`fa ${icon}`"></span>
    <span v-if="title">{{ title }}</span>
  </button>
</template>

<script>
import { httpCall } from '../../helpers/http-service';
export default {
  props: {
    icon: {
      type: String,
      default: () => 'fa-trash'
    },
    title: {
      type: String
    },
    itemId: {
      type: Number,
      required: true
    }
  },
  methods: {
    deleteRecord() {
      let confirmation = confirm('Do you want to delete this report');

      if(confirmation) {
        httpCall.post('otc-rep/v1/reports/pharmacy/'+this.itemId, {_method: 'DELETE'})
        .then(({data}) => {
          this.handleResponse(data, data => {
            this.$store.dispatch('fetchPharmacyReports', {force: true})
          });
        }).catch(err => console.log(err))
      }
    }
  }
}
</script>

<style>

</style>
