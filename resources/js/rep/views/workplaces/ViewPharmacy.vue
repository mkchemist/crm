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
      <div class="p-2" v-if="pharmacy">
        <div class="border my-2 p-2 rounded">
          <p class="lead text-muted">Pharmacy Info.</p>
          <hr>
          <div class="row mx-auto">
            <div class="col-lg">
              <p  class="mb-0 small">Name: <span class="text-primary">{{ pharmacy.name }}</span></p>
              <p  class="mb-0 small">Type: <span class="text-primary">{{ pharmacy.type }}</span></p>
              <p  class="mb-0 small">Key Person: <span class="text-primary">{{ pharmacy.key_person }}</span></p>
            </div>
            <div class="col-lg">
              <p  class="mb-0 small">Address: <span class="text-primary">{{ pharmacy.address }}</span></p>
              <p  class="mb-0 small">Brick: <span class="text-primary">{{ pharmacy.brick }}</span></p>
            </div>
          </div>
        </div>
        <div class="my-2 border p-2 rounded">
          <p class="lead text-muted">Pharmacy Reports</p>
          <div class="p-2 text-right">
            <router-link :to="`/reports/add/pharmacy/${pharmacy.id}`" class="btn btn-sm btn-primary">
              <span><i class="fa fa-plus-circle"></i></span>
              <span>report</span>
            </router-link>
          </div>
          <table class="table table-sm small">
            <thead class="bg-success text-light">
              <tr>
                <th>Date</th>
                <th>Products</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report.id">
                <td>{{ report.visit_date }}</td>
                <td>
                  <ul v-for="(product,i) in JSON.parse(report.products)" :key="i" class="nav">
                    <li class="nav-item col-12" v-for="(val, key) in product" :key="`${key}-${i}`">
                      <span>{{ key.toUpperCase() }}</span> : <span class="font-weight-bold text-primary">{{ val }}</span>
                    </li>
                  </ul>
                </td>
                <td>{{ report.general_feedback }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <loader-component v-else />
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../../helpers/http-service';
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
        data.message = "Pharmacy loaded";
        this.handleResponse(data, data => {
          this.pharmacy = data.data;
          this.reports = data.data.report;
        })
      });
    }
  },
  data: () => ({
    pharmacy: null,
    reports: []
  })
}
</script>

<style>

</style>
