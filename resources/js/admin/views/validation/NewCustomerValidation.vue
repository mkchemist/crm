<template>
  <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-check-circle"></i></span>
        <span class="font-weight-bold">New customers validation</span>
      </p>
      <div class="p-2 pb-5">
        <div v-if="customers.length">
          <table-component
            :heads="heads"
            :data="customers"
            head-class="bg-success text-light"
          >
            <template v-slot:head:before>
              <th>
                <input type="checkbox">
              </th>
              <th>Approved</th>
              <th>State</th>
            </template>
            <template v-slot:body:before="{item}">
              <td>
                <input type="checkbox">
              </td>
              <td>
                <span>{{ item.approved === 1 ? 'Approved' : 'Not approved' }}</span>
              </td>
              <td>
                {{ item.state.toUpperCase() }}
              </td>
            </template>
          </table-component>
        </div>
      </div>
  </div>
</template>

<script>
import { httpCall } from '../../../helpers/http-service';
import TableComponent from "../../../components/TableComponent";
export default {
  mounted() {
    this.getNewCustomers();
  },
  components: {
    TableComponent
  },
  data: () =>({
    customers: [],
    fetched: false,
    heads: [
      {
        title: 'Area',
        name: 'area'
      },
      {
        title: 'Customer',
        name: 'name'
      },
      {
        title: 'Specialty',
        name: 'specialty'
      },
      {
        title: 'Address',
        name: 'address'
      },
      {
        title: 'District',
        name: 'district'
      },
      {
        title: 'Territory',
        name: 'territory'
      },
      {
        title: 'Region',
        name: 'region'
      }
    ]
  }),
  methods: {
    getNewCustomers() {
      this.fetched = false;
      httpCall.get('admin/v1/validation/new-customers')
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.fetched = true;
          this.customers = data.data;
        });
      })
    }
  }
}
</script>

<style>

</style>
