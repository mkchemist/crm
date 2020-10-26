<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-user-md"></i></span>
      <span class="font-weight-bold">Cusotmer Detials Validation</span>
    </p>
    <div class="p-2">
      <div id="list-container" v-if="customers.length">
        <div class="p-2">
          <button class="btn btn-sm btn-secondary" :disabled="!this.selected_customer.length" @click="approveRequest">
            <span>Approve</span>
            <span>{{ this.selected_customer.length }}</span>
          </button>
          <button class="btn btn-sm btn-secondary" :disabled="!this.selected_customer.length" @click="rejectRequest">
            <span>Reject</span>
            <span>{{ this.selected_customer.length }}</span>
          </button>
        </div>
        <table-component :heads="heads" :data="customers" headClass="bg-success text-light">
          <template v-slot:head:before>
            <th><input type="checkbox" @click="selectAll"></th>
          </template>
          <template v-slot:body:before="{item}">
            <td>
              <input type="checkbox" @click="toggleCustomer(item.id)">
            </td>
          </template>
        </table-component>
      </div>
      <div v-else-if="isFetched" class="p-3 text-center">
        <p>No data to show</p>
      </div>
      <div class="p-2" v-else>
        <loader-component></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../../helpers/http-service'
import TableComponent from "../../../components/TableComponent"
export default {
  created() {
    this.getRequestsList();
  },
  components: {
    TableComponent
  },
  data: () => ({
    customers: [],
    isFetched: false,
    selected_customer: [],
    request_state: null,
    heads: [
      {
        title: 'Name',
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
        title: 'From Address',
        name: 'customer.address'
      },
      {
        title: 'To Address',
        name: 'address'
      },
      {
        title: 'From Phone',
        name: 'customer.phone'
      },
      {
        title: 'To Phone',
        name: 'phone'
      },
      {
        title : 'From Title',
        name: 'customer.title'
      },
      {
        title: 'To Title',
        name: 'title'
      },
      {
        title: 'From Workplace',
        name: 'customer.workplace.name'
      },
      {
        title: 'To Workplace',
        name: 'workplace.name'
      }
    ]
  }),
  computed: {

  },
  methods: {
    getRequestsList() {
      httpCall.get('dm/v1/approval/customers-details')
      .then(({data}) => {
        this.isFetched = true;
        this.customers = data.data;
      })
    },
    selectAll(){
      let inputs = document.querySelectorAll('#list-container input[type="checkbox"]');
      let checked = event.target.checked;
      if(checked) {
        inputs.forEach(input => input.checked = true);
        this.selected_customer = this.customers.map(customer => customer.id);
      } else {
        inputs.forEach(input => input.checked = false);
        this.selected_customer = [];
      }
    },
    toggleCustomer(id) {
      let checked = event.target.checked;
      if(checked) {
        if(!this.selected_customer.includes(id)) {
          this.selected_customer.push(id);
        }
      } else {
        if(this.selected_customer.includes(id)) {
          let index = this.selected_customer.indexOf(id);
          this.selected_customer.splice(index, 1);
        }
      }
    },
    sendRequest(){
      let data = {
        ids: JSON.stringify(this.selected_customer),
        state : this.request_state
      }
      httpCall.post('dm/v1/approval/customers-details', data)
      .then((res) => {
        this.$toasted.show('Requests Approved')
      }).finally(() => {
        this.getRequestsList();
        this.selected_customer = [];
        this.request_state = false;
      })
    },
    approveRequest(){
      this.request_state = "approved";
      this.sendRequest();
    },
    rejectRequest() {
      this.request_state = "rejected";
      this.sendRequest();
    }
  }
}
</script>

<style>

</style>
