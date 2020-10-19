<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-check"></i></span>
        <span class="font-weight-bold">Parameters Approval</span>
      </p>

      <div class="p-2">
        <div class="btn-group btn-group-sm">
          <button class="btn btn-secondary">Approve all</button>
          <button class="btn btn-secondary">Reject all</button>
          <button class="btn btn-secondary">Approve selected</button>
          <button class="btn btn-secondary">Reject selected</button>
        </div>
        <div class="p-2" id="request_table_container">
          <table-component
            :data="customers"
            :heads="heads"
            headClass="bg-success text-light"
            v-if="customers.length"
          >
            <template v-slot:head:before>
              <th><input type="checkbox" @click="selectAll"></th>
            </template>
            <template v-slot:body:before="{item}">
              <td><input type="checkbox" :value="item.id"></td>
            </template>

          </table-component>
          <div v-else-if="isFetched">
            <p class="text-dark text-center lead">No data to show</p>
          </div>
          <div v-else>
            <loader-component></loader-component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
import TableComponent from "../../../components/TableComponent"
export default {
  components:{
    TableComponent
  },
  created() {
    this.fetchList();
  },
  data: () => ({
    customers: [],
    isFetched: false,
    selected_customers: [],
    heads: [
      {
        title: 'Rep',
        name: 'user.name'
      },
      {
        title: 'Customer',
        name: 'customer.name'
      },
      {
        title: 'Specialty',
        name: 'customer.specialty'
      },
      {
        title: 'Area',
        name: 'customer.area'
      },
      {
        title: 'Brick',
        name: 'customer.brick'
      },
      {
        title: 'From',
        name: 'current'
      },
      {
        title: 'To',
        name: 'next'
      },
      {
        title: 'Adress',
        name: 'customer.address'
      },
      {
        title: 'Date',
        name: 'updated_at'
      }
    ]
  }),
  methods: {
    fetchList() {
      httpCall.get("dm/v1/approval/parameters").then(({ data }) => {
        console.log(data)
        this.isFetched = true
        data.message = "list loaded";
        this.handleResponse(data, data => {
          this.customers = data.data;
        });
      });
    },
    selectAll() {
      let inputs = Array.from(document.querySelectorAll('#request_table_container input[type="checkbox"]'));
      inputs.map(input => {
        input.checked = true;
      })
      this.selected = this.customers.map(customer => customer.id);
    }
  }
};
</script>

<style></style>
