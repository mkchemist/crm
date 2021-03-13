<template>
  <div class="px-0 shadow pb-5">
    <p class="alert alert-success">
      <span><i class="fa fa-check-circle"></i></span>
      <span class="font-weight-bold">New customers validation</span>
    </p>
    <div class="p-2 pb-5">
      <div class="p-2">
        <div class="float-lg-right d-flex" id="filter_checkbox_container">
          <div class="form-group mx-2">
            <input
              type="checkbox"
              name="all"
              :checked="dataFilter === 'all'"
              @click="changeDataFilter"
            />
            <label for="" class="form-check-label text-muted">All</label>
          </div>
          <div class="form-group mx-2">
            <input
              type="checkbox"
              name="new"
              :checked="dataFilter === 'new'"
              @click="changeDataFilter"
            />
            <label for="" class="form-check-label text-muted">New</label>
          </div>
          <div class="form-group mx-2">
            <input
              type="checkbox"
              name="approved_by"
              :checked="dataFilter === 'approved by'"
              @click="changeDataFilter"
            />
            <label for="" class="form-check-label text-muted"
              >Approved by supervisor</label
            >
          </div>
          <div class="form-group mx-2">
            <input
              type="checkbox"
              name="rejected"
              :checked="dataFilter === 'rejected'"
              @click="changeDataFilter"
            />
            <label for="" class="form-check-label text-muted">Rejected</label>
          </div>
        </div>
      </div>
      <hr />
      <div v-if="customers.length" id="validation-data">
        <div class="text-right p-2">
          <button
            class="btn btn-primary btn-sm"
            :disabled="!this.validated.length"
            @click="approveRequest"
          >
            <span><i class="fa fa-check-circle"></i></span>
            <span>Approve</span>
            <span class="badge badge-light">{{ this.validated.length }}</span>
          </button>
          <button
            class="btn btn-secondary btn-sm"
            :disabled="!this.validated.length"
            @click="rejectRequest"
          >
            <span><i class="fa fa-times-circle"></i></span>
            <span>Reject</span>
            <span class="badge badge-light">{{ this.validated.length }}</span>
          </button>
          <button
            class="btn btn-sm btn-danger"
            @click="deleteRejectedCustomers"
          >
            <span class="fa fa-trash"></span>
            <span>Delete rejected</span>
          </button>
        </div>

        <data-table-component
          :cols="heads"
          :data="customers"
        >
          <template v-slot:head:before>
            <th>
              <input type="checkbox" @click="selectAll" />
            </th>
            <th>Approved</th>
            <th>State</th>
          </template>
          <template v-slot:body:before="{ item }">
            <td>
              <input type="checkbox" @click="selectCustomer(item.id)" />
            </td>
            <td>
              <span>{{
                item.approved === 1 ? "Approved" : "Not approved"
              }}</span>
            </td>
            <td>
              {{ item.state.toUpperCase() }}
            </td>
          </template>
        </data-table-component>
      </div>
      <div v-else-if="fetched" class="text-center">
        <no-data-to-show title="No waiting response" />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
import DataTableComponent from "../../../components/DataTableComponent";
import { checkerSelect } from "../../../helpers/helpers";
import NoDataToShow from "../../../components/NoDataToShow";
export default {
  mounted() {
    this.getNewCustomers();
  },
  components: {
    DataTableComponent,
    NoDataToShow
  },
  data: () => ({
    customers: [],
    raw: [],
    fetched: false,
    validated: [],
    requestState: null,
    heads: [
      {
        title: "Area",
        name: "area",
        style: "font-weight-bold"
      },
      {
        title: "Customer",
        name: "name",
        style: "font-weight-bold"
      },
      {
        title: "Specialty",
        name: "specialty",
        style: "font-weight-bold"
      },
      {
        title: "Title",
        name: "title"
      },
      {
        title: "Address",
        name: "address"
      },
      {
        title: "Phone",
        name: "phone"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "District",
        name: "district"
      },
      {
        title: "Territory",
        name: "territory"
      },
      {
        title: "Region",
        name: "region"
      }
    ],
    dataFilter: "all"
  }),

  methods: {
    /**
     * get all new customers
     *
     */
    getNewCustomers() {
      this.fetched = false;
      httpCall.get("admin/v1/validation/new-customers").then(({ data }) => {
        this.handleResponse(data, data => {
          this.fetched = true;
          this.customers = data.data;
          this.raw = data.data;
        });
      });
    },
    /**
     * select customer
     *
     * @param {int} id [customer id]
     */
    selectCustomer(id) {
      this.validated = checkerSelect(this.validated, id, event);
    },
    /**
     * select all customers
     *
     */
    selectAll() {
      this.validated = [];
      if (event.target.checked) {
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
      if (undefined === check) {
        throw new Error("check value must be a boolean value");
      }
      let inputs = document.querySelectorAll(
        '#validation-data input[type="checkbox"]'
      );
      if (check) {
        inputs.forEach(input => (input.checked = true));
      } else {
        inputs.forEach(input => (input.checked = false));
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
      if (!this.validated.length) {
        this.$toasted.error("No customer selected", {
          icon: "exclamation"
        });
      }
      httpCall
        .post("admin/v1/validation/new-customers", {
          state: this.requestState,
          ids: JSON.stringify(this.validated)
        })
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.getNewCustomers();
            this.requestState = null;
            this.validated = [];
            this.toggleAllInputs(false);
          });
        });
    },
    deleteRejectedCustomers() {
      httpCall
        .post("admin/v1/validation/new-customers/delete")
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.getNewCustomers();
            this.requestState = null;
            this.validated = [];
            this.toggleAllInputs(false);
          });
        })
        .catch(err => console.log(err));
    },
    /**
     * toggle data view
     * switch between [all, new ,approved by , rejected]
     *
     * @param {MouseEvent} e
     */
    changeDataFilter(e) {
      let name = e.target.name;
      if (e.target.checked) {
        document
          .querySelectorAll('#filter_checkbox_container input[type="checkbox"]')
          .forEach(el => {
            el.checked = false;
          });
        e.target.checked = true;
        this.dataFilter = name;
      } else {
        this.dataFilter = "all";
      }
      this.filterCustomers();
    },
    filterCustomers() {
      let data = [];
      switch (this.dataFilter) {
        case "new":
          data = this.raw.filter(
            customer =>
              customer.state.match(/New (.*)/g) ||
              customer.state.toLowerCase() === "new"
          );
          break;
        case "approved_by":
          data = this.raw.filter(customer =>
            customer.state.match(/approved by (.*)/g)
          );
          break;
        case "rejected":
          data = this.raw.filter(customer => customer.state === "rejected");
          break;
        default:
          data = this.raw;
          break;
      }
      let async = () => Promise.resolve(data);
      this.customers = [];
      async().then(data => (this.customers = data));
    }
  }
};
</script>

<style></style>
