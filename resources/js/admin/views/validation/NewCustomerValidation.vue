<template>
  <div class="px-0 shadow pb-5">
      <p class="alert alert-success">
        <span><i class="fa fa-check-circle"></i></span>
        <span class="font-weight-bold">New customers validation</span>
      </p>
      <div class="p-2 pb-5">
        <div v-if="customers.length" id="validation-data">
          <div class="p-2 text-right">
            <button class="btn btn-primary btn-sm" :disabled="!this.validated.length" @click="approveRequest">
              <span><i class="fa fa-check-circle"></i></span>
              <span>Approve</span>
              <span class="badge badge-light">{{ this.validated.length }}</span>
            </button>
            <button class="btn btn-secondary btn-sm" :disabled="!this.validated.length" @click="rejectRequest">
              <span><i class="fa fa-times-circle"></i></span>
              <span>Reject</span>
              <span class="badge badge-light">{{ this.validated.length }}</span>
            </button>
          </div>
          <table-component
            :heads="heads"
            :data="customers"
            head-class="bg-success text-light"
            :unselectable="true"
          >
            <template v-slot:head:before>
              <th>
                <input type="checkbox" @click="selectAll">
              </th>
              <th>Approved</th>
              <th>State</th>
            </template>
            <template v-slot:body:before="{item}">
              <td>
                <input type="checkbox" @click="selectCustomer(item.id)">
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
        <div v-else-if="fetched" class="text-center">
          <no-data-to-show title="No waiting response" />
        </div>
        <loader-component v-else></loader-component>
      </div>
  </div>
</template>

<script>
import { httpCall } from '../../../helpers/http-service';
import TableComponent from "../../../components/TableComponent";
import { checkerSelect } from '../../../helpers/helpers';
import NoDataToShow from "../../../components/NoDataToShow";
export default {
  mounted() {
    this.getNewCustomers();
  },
  components: {
    TableComponent,
    NoDataToShow
  },
  data: () =>({
    customers: [],
    fetched: false,
    validated:[],
    requestState: null,
    heads: [
      {
        title: 'Area',
        name: 'area',
        style: 'font-weight-bold'
      },
      {
        title: 'Customer',
        name: 'name',
        style: 'font-weight-bold'
      },
      {
        title: 'Specialty',
        name: 'specialty',
        style: 'font-weight-bold'

      },
      {
        title: 'Title',
        name: 'title'
      },
      {
        title: 'Address',
        name: 'address'
      },
      {
        title: 'Phone',
        name: 'phone'
      },
      {
        title: 'Brick',
        name: 'brick'
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
    /**
     * get all new customers
     *
     */
    getNewCustomers() {
      this.fetched = false;
      httpCall.get('admin/v1/validation/new-customers')
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.fetched = true;
          this.customers = data.data;
        });
      })
    },
    /**
     * select customer
     *
     * @param {int} id [customer id]
     */
    selectCustomer(id) {
      this.validated  = checkerSelect(this.validated, id, event);
    },
    /**
     * select all customers
     *
     */
    selectAll() {
      this.validated = [];
      if(event.target.checked) {
        this.toggleAllInputs(true);
        this.validated = this.customers.map(customer => customer.id);
      } else {
        this.toggleAllInputs(false);
        this.validated = [];
      }
    },
    /**
     * toggle select all inputs
     *
     * @param {boolean} check
     */
    toggleAllInputs(check) {
      if(undefined === check) {
        throw new Error('check value must be a boolean value');
      }
      let inputs = document.querySelectorAll('#validation-data input[type="checkbox"]');
      if(check) {
        inputs.forEach(input => input.checked = true);
      } else {
        inputs.forEach(input => input.checked = false);
      }
    },
    approveRequest() {
      this.requestState = "approved";
      this.sendRequest();
    },
    rejectRequest() {
      this.requestState = "rejected";
      this.sendRequest();
    },
    sendRequest() {
      if(!this.validated.length) {
        this.$toasted.error('No customer selected', {
          icon: 'exclamation'
        })
      }
      httpCall.post('admin/v1/validation/new-customers',{
        state: this.requestState,
        ids: JSON.stringify(this.validated)
      })
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.getNewCustomers();
          this.requestState = null;
          this.validated = [];
          this.toggleAllInputs(false);
        });
      });
    }
  }
}
</script>

<style>

</style>
