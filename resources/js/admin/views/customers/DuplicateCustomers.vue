<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span class="fa fa-book-reader"></span>
      <span class="font-weight-bold">Duplicate Customers</span>
    </p>
    <div class="p-2">
      <div v-if="customers.length" class="p-2">
        <table-component :headClass="`skin-table`" :data="customers" :heads="tableHeads" :orderBy="`Name`">
          <template v-slot:head:before>
            <th>Validation</th>
          </template>
          <template v-slot:body:before="{item}">
            <td>
              <button class="btn btn-sm btn-success" @click="validateCustomer(item)">
                <span class="fa fa-bug"></span>
              </button>
            </td>
          </template>
        </table-component>
      </div>
      <div v-else-if="isFetched">
        <no-data-to-show />
      </div>
      <loader-component v-else></loader-component>
    </div>
    <modal-fade :show="openValidateCustomerModal" @onClose="closeValidateCustomerModal" :headerStyle="`bg-success text-light`" >
      <template v-slot:header v-if="queryCustomers.length">
        <span>Duplicate customer</span>
      </template>
      <template v-slot:body v-if="queryCustomers.length">
        <table-component :data="queryCustomers" :heads="queryCustomersHeads" :id="`validation_table`"></table-component>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import ModalFade from '../../../components/ModalFade.vue';
import NoDataToShow from '../../../components/NoDataToShow.vue';
import TableComponent from '../../../components/TableComponent.vue';
import { httpCall } from '../../../helpers/http-service';
export default {
components: {
NoDataToShow,
TableComponent,
ModalFade,

  },
  mounted(){
    this.getDuplicateCustomers();
  },
  data:() => ({
    customers: [],
    isFetched: false,
    tableHeads: [
      {
        title: 'Name',
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
        title: 'Brick',
        name: 'brick'
      },
      {
        title: 'No. of Existence',
        name: 'no_existence'
      },
      {
        title: 'Area',
        name: 'area'
      },
      {
        title: 'District',
        name: 'district'
      },
      {
        title: 'territory',
        name: 'territory'
      },
      {
        title: 'Region',
        name: 'region'
      }
    ],
    openValidateCustomerModal: false,
    queryCustomers: [],
    isQueryCustomersFetched: false,
    queryCustomersHeads: [
      {
        title: 'ID',
        name: 'id'
      },
      {
        title: 'Name',
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
        title: 'Brick',
        name:'brick'
      },
      {
        title: 'Area',
        name: 'area'
      },
      {
        title: 'District',
        name: 'district'
      },
      {
        title: 'Territory',
        name: 'territory'
      }
    ]
  }),
  methods: {
    /**
     * fetch duplicates from customers table
     */
    getDuplicateCustomers(){
      this.isFetched = false,
      this.customers= [];
      httpCall.get('admin/v1/management/duplicate-customers')
      .then(({data}) => {
        this.handleResponse(data , data => {
          this.customers = data.data;
          this.isFetched= true;
        })
      }).catch(err => console.log(err));
    },
    /**
     * validate customer
     * get all related queries in frequency and parameters
     *
     * @param {object} item
     */
    validateCustomer(item){
      this.queryCustomers = [];
        this.isQueryCustomersFetched = false;
        this.openValidateCustomerModal = true;
      httpCall.get('admin/v1/management/query-duplicate-customer',item)
      .then(({data}) => {
        this.queryCustomers = data.data;
        this.isQueryCustomersFetched = true;
      }).catch(err => console.log(err))
    },
    closeValidateCustomerModal(){
      this.queryCustomers = [];
      this.isQueryCustomersFetched = false
      this.openValidateCustomerModal = false;
    }
  }
}
</script>

<style>

</style>
