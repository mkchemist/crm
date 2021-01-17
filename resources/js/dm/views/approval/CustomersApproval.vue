<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-user-check"></i></span>
      <span class="font-weight-bold">Customers Approval</span>
    </p>
    <div class="p-2">
      <div class="p-2">
        <button class="btn btn-sm btn-secondary" :disabled="!selected_customers.length" @click="approveRequest">
          <span>Approve</span>
          <span>{{ selected_customers.length }}</span>
        </button>
        <button class="btn btn-sm btn-secondary" :disabled="!selected_customers.length" @click="rejectRequest">
          <span>Reject</span>
          <span>{{ selected_customers.length }}</span>
        </button>
      </div>
      <div class="p-2" id="list-container">
        <table-component
          v-if="customers.length"
          :data="customers"
          :heads="heads"
          headClass="bg-success text-light"
        >
          <template v-slot:head:before>
            <th><input type="checkbox" @click="selectAll"/></th>
          </template>
          <template v-slot:body:before="{ item }">
            <td><input type="checkbox" @click="toggleSelected(item.id)" /></td>
          </template>
        </table-component>
        <div v-else-if="isFetched" class="p-2 text-center">
          <no-data-to-show :title="`No Requests found`" />
        </div>
        <div v-else>
          <loader-component></loader-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
import TableComponent from "../../../components/TableComponent";
import NoDataToShow from '../../../components/NoDataToShow.vue';
export default {
  components: {
    TableComponent,
    NoDataToShow
  },
  created() {
    this.getNewCustomersList();
  },
  data: () => ({
    customers: [],
    isFetched: false,
    selected_customers : [],
    request_state: null,
    heads: [
      {
        title: "Area",
        name: "area"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "Name",
        name: "name"
      },
      {
        title: "Specialty",
        name: "specialty"
      },
      {
        title: "Title",
        name: "title"
      },
      {
        title: "Address",
        name: "address"
      }
    ]
  }),
  computed: {},
  methods: {
    getNewCustomersList() {
      this.isFetched = false;
      httpCall.get("dm/v1/approval/new-customers").then(({ data }) => {
        this.isFetched = true;
        this.customers = data.data;
      });
    },
    selectAll(){
      let checked = event.target.checked;
      let inputs = document.querySelectorAll('#list-container input[type="checkbox"]');
      if(checked) {
        inputs.forEach(item => item.checked = true);
        this.selected_customers = this.customers.map(customer => customer.id);
      } else {
        inputs.forEach(item => item.checked = false);
        this.selected_customers = []
      }
    },
    toggleSelected(id) {
      let cheched = event.target.checked;
      if(cheched) {
        if(!this.selected_customers.includes(id)) {
          this.selected_customers.push(id);
        }
      } else {
        if(this.selected_customers.includes(id)) {
          let i = this.selected_customers.indexOf(id);
          this.selected_customers.splice(i ,1);
        }
      }
    },
    sendRequest(){
      let data = {
        ids: JSON.stringify(this.selected_customers),
        state: this.request_state
      }
      httpCall.post('dm/v1/approval/new-customers',data)
      .then(({data}) => {
        this.$toasted.success('Requested sent');
      }).finally(() => {
        this.getNewCustomersList();
        this.selected_customers = [];
        this.request_state = null;
        document.querySelectorAll('#list-container input[type="checkbox"]')
        .forEach(input => input.checked = false);
      })
    },
    approveRequest(){
      this.request_state = "approved";
      this.sendRequest();
    },
    rejectRequest(){
      this.request_state = "rejected";
      this.sendRequest();
    }
  }
};
</script>

<style></style>
