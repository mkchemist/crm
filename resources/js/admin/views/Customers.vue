<template>
  <div>
    <h1>Customers Page</h1>
    <div class="p-2">
      <div v-if="customers.length">
        <table class="table table-striped table-sm small" id="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialty</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(customer,i) in customers" :key="i">
              <td>{{ customer.name }}</td>
              <td>{{ customer.specialty }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="fetched">
        <p class="text-center lead text-muted">nothing to show</p>
      </div>
      <div v-else class="d-flex justify-content-center align-items-center flex-column" style="min-height:300px">
        <div class="spinner-border text-success" style="height:100px;width:100px"></div>
        <br>
        <span class="lead font-weight-light">loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../helpers/http-service'
export default {
  created() {
    httpCall.get("admin/v1/customers")
    .then(({data}) => {
      if(data.code === 201) {
        this.customers = data.data;
        this.customers = [...this.customers, ...data.data];
        this.customers = [...this.customers, ...data.data];
        this.customers = [...this.customers, ...data.data];
        this.customers = [...this.customers, ...data.data];
        this.customers = [...this.customers, ...data.data];
        this.customers = [...this.customers, ...data.data];
        this.customers = [...this.customers, ...data.data];
        this.customers = [...this.customers, ...data.data];
        this.customers = [...this.customers, ...data.data];
        this.customers = [...this.customers, ...data.data];
        this.customers = [...this.customers, ...data.data];
        this.fetched = true;
      }
    }).finally(() => {
      $('#table').dataTable({
        dom: 'Bflrtip',
        buttons: ['excel'],
        lengthMenu: [50,100,200]
      })
    });
  },
  data: () => ({
    customers: [],
    fetched: false
  })
}
</script>

<style>

</style>
