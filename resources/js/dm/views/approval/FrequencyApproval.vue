<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-wave-square"></i></span>
        <span class="font-weight-bold">Frequency Approval</span>
      </p>
      <div class="p-2">
        <div class="p-2">
          <div class="btn-group btn-group-sm" role="group">
            <button class="btn btn-sm btn-secondary">
              <span>Approval All</span>
            </button>
            <button class="btn btn-sm btn-secondary">
              <span>Reject All</span>
            </button>
            <button class="btn btn-sm btn-secondary">
              <span>Approve Selected</span>
            </button>
            <button class="btn btn-sm btn-secondary">
              <span>Reject Selected</span>
            </button>
          </div>
        </div>
        <div class="p-2 my-3 border rounded" id="request_table_container">
          <table-component v-if="customers.length"
            :heads="heads"
            :data="customers"
            headClass="bg-success text-light"
          >
          <template v-slot:head:before>
            <th><input type="checkbox" @click="collectAllCustomers"></th>
          </template>
          <template v-slot:head>
            <th>Date</th>
          </template>
          <template v-slot:body:before="{item}">
            <td><input type="checkbox" :value="item.customer.id" :disabled="item.approved === 1"></td>
          </template>
          <template v-slot:body="{item}">
            <td>{{ item.modified_at ? item.updated_at : item.created_at }}</td>
          </template>
          </table-component>
          <div v-else-if="isFetched">
            <p class="text-dark lead text-center">No data to show</p>
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
import { httpCall } from '../../../helpers/http-service'
import TableComponent from "../../../components/TableComponent";

export default {
  created() {
    this.fetchRequestList();
  },

  data: () => ({
    customers: [],
    isFetched: false,
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
        title: 'Parameter',
        name: 'customer.get_user_params.0.current'
      },
      {
        title: 'Area',
        name: 'user.area'
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
        title:'Address',
        name: 'customer.address'
      }
    ],
    selected_customers : []
  }),

  methods: {
    /**
     * fetching request frequency list
     *
     */
    fetchRequestList() {
      httpCall.get('dm/v1/approval/frequency')
      .then(({data}) => {
        data.message = "list loaded";
        this.handleResponse(data, data => {
          this.customers = data.data;
          this.isFetched = true;
        });
      })
    },
    /**
     * collect all customers request
     *
     */
    collectAllCustomers() {
      let _inputs = Array.from(document.querySelectorAll('#request_table_container input[type="checkbox"]'));
      _inputs.map((input) => {
        if(input.disabled !== true) {
          input.checked = true;
        }
      });
      let x = Array.from(this.customers.map(customer => customer.approved !== 1 ? customer.id : null));
      x = x.filter(i => i !== null);
      console.log(x)
    }
  },
  components: {
    TableComponent
  }
}
</script>

<style>

</style>
