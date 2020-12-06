<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span class="fa fa-book-reader"></span>
      <span>View visit {{ visit ? visit.customer.name : '' }} coach evaluation</span>
    </p>
    <div class="p-2">
      <div class="text-right p-2 my-1">
        <router-link to="/reports/view/coaching-report" class="btn btn-sm btn-dark">
          <span class="fa fa-chevron-circle-left"></span>
          <span>back</span>
        </router-link>
      </div>
      <div v-if="visit">
        <!-- Customer info.  -->
        <div class="p-2 row mx-auto border rounded">
          <div class="col-lg small">
            <p class="mb-0">
              <span>Name: </span><span class="font-weight-bold">{{ visit.customer.name }}</span>
            </p>
            <p class="mb-0">
              <span>Title: </span><span class="font-weight-bold">{{ visit.customer.title }}</span>
            </p>
            <p class="mb-0">
              <span>Specialty: </span><span class="font-weight-bold">{{ visit.customer.specialty }}</span>
            </p>
          </div>
          <div class="col-lg small">
            <p class="mb-0">
              <span>Phone: </span><span class="font-weight-bold">{{ visit.customer.phone }}</span>
            </p>
            <p class="mb-0">
              <span>Address: </span><span class="font-weight-bold">{{ visit.customer.address }}</span>
            </p>
            <p class="mb-0">
              <span>Brick: </span><span class="font-weight-bold">{{ visit.customer.brick }}</span>
            </p>
          </div>
        </div>

        <!-- report details -->
        <div class="p-2">
          <table class="table table-sm small table-bordered">
            <thead>
            <tr class="bg-success text-light">
              <th class="col-8">Item</th>
              <th class="col-4">Mark</th>
            </tr>
            </thead>
           <tbody v-for="(data, key) in JSON.parse(visit.data)" :key="`key_${key}`">
             <tr><td colspan="2" class="bg-dark text-light">{{ key }}</td></tr>
             <tr v-for="(val, item) in data" :key="`key_${key}_item_${item}`">
               <td>{{ item }}</td>
               <td>{{ val }}</td>
             </tr>
           </tbody>
          </table>
        </div>
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../../helpers/http-service';
export default {
  mounted() {
    this.getVisit();
  },
  components: {

  },
  data: () => ({
    visit: null,
    fetched: false
  }),
  methods: {
    getVisit() {
      let id = this.$route.params.id;
      this.fetched = false;
      this.visit = null;
      httpCall.get('rep/v1/reports/coaching/'+id)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.visit = data.data;
          this.fetched = true
        })
      }).catch(err => {
        this.$toasted.error('Something went wrong', {
          icon: 'sad'
        })
        console.log(err)
      })
    }
  }

}
</script>

<style>

</style>
