<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-check"></i></span>
        <span class="font-weight-bold">Parameters Approval</span>
      </p>

      <div class="p-2">
        <div class="btn-group btn-group-sm">
          <button class="btn btn-secondary" @click="approveRequests" :disabled="!customers.length">
            <span>Approve</span>
            <span v-if="selected_customers.length" class="text-primary bg-light px-1 rounded-circle">{{
              selected_customers.length
            }}</span>
          </button>
          <button class="btn btn-secondary" @click="rejectRequests" :disabled="!customers.length">
            <span>Reject</span>
            <span v-if="selected_customers.length" class="text-primary bg-light px-1 rounded-circle">{{
              selected_customers.length
            }}</span>
          </button>
        </div>
        <div class="p-2" id="request_table_container">
          <table-component
            :data="customers"
            :heads="heads"
            headClass="bg-success text-light"
            v-if="customers.length"
          >
            <template v-slot:head:before>
              <th><input type="checkbox" @click="selectAll" /></th>
            </template>
            <template v-slot:body:before="{ item }">
              <td>
                <input
                  type="checkbox"
                  :value="item.id"
                  @click="selectCustomer(item.id)"
                />
              </td>
            </template>
          </table-component>
          <div v-else-if="isFetched">
            <no-data-to-show :title="`No Requests found`" />
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
import TableComponent from "../../../components/TableComponent";
import NoDataToShow from '../../../components/NoDataToShow.vue';
export default {
  components: {
    TableComponent,
     NoDataToShow
  },
  created() {

    this.fetchList();
  },
  data: () => ({
    customers: [],
    isFetched: false,
    selected_customers: [],
    request_state: null,
    heads: [
      {
        title: "Rep",
        name: "user.name"
      },
      {
        title: "Customer",
        name: "customer.name"
      },
      {
        title: "Specialty",
        name: "customer.specialty"
      },
      {
        title: "Area",
        name: "customer.area"
      },
      {
        title: "Brick",
        name: "customer.brick"
      },
      {
        title: "From",
        name: "current"
      },
      {
        title: "To",
        name: "next"
      },
      {
        title: "Adress",
        name: "customer.address"
      },
      {
        title: "Date",
        name: "updated_at"
      }
    ]
  }),
  methods: {
    /**
     * fetch parameter request list
     *
     */
    fetchList() {
      httpCall.get("dm/v1/approval/parameters").then(({ data }) => {
        this.isFetched = true;
        data.message = "list loaded";
        this.handleResponse(data, data => {
          this.customers = data.data;
        });
      });
    },
    /**
     * select all customers
     *
     */
    selectAll(e) {
      let checked = e.target.checked;
      let inputs = Array.from(
        document.querySelectorAll(
          '#request_table_container input[type="checkbox"]'
        )
      );
      inputs.map(input => {
        if (checked) {
          input.checked = true;
        } else {
          input.checked = false;
        }
      });
      if (checked) {
        this.selected_customers = this.customers.map(customer => customer.id);
      } else {
        this.selected_customers = [];
      }
    },
    /**
     * select customer
     *
     * @param {int} id
     */
    selectCustomer(id) {
      /** event target [input that clicked] */
      let _target = event.target;
      let checked = _target.checked;
      if (checked) {
        if (!this.selected_customers.includes(id)) {
          this.selected_customers.push(id);
        }
      } else {
        if (this.selected_customers.includes(id)) {
          this.selected_customers.splice(
            this.selected_customers.indexOf(id),
            1
          );
        }
      }
    },
    /**
     * send request
     *
     */
    sendRequests() {
      let data = {
        ids: JSON.stringify(this.selected_customers),
        state: this.request_state
      }
      httpCall.post('dm/v1/approval/parameters',data)
      .then(res => {
        res.message = res.data.data;
        this.handleResponse(res)
      }).finally(() => {
        this.customers = [];
        this.fetchList();
        this.selected_customers = [];
      });
    },
    /**
     * Approve requests
     */
    approveRequests() {
      this.request_state = "approved";
      this.sendRequests();
    },
    /**
     * reject requests
     *
     */
    rejectRequests() {
      this.request_state = "rejected";
      this.sendRequests();
    }
  }
};
</script>

<style></style>
