<template>
  <div class="row mx-auto p-2 pb-5">
    <div class="col-lg-3">
      <user-filter-box
        :users="users"
        :data="requests"
        :onFilter="onFilter"
        :onReset="onReset"
      />
      <date-filter-box
        :data="requests"
        :onFilter="onFilter"
        :onReset="onReset"
        :dateField="`query_date`"
      />
    </div>
    <div class="col-lg-9 px-0 shadow rounded pb-5">
      <p class="alert alert-success">
        <span class="fa fa-dollar-sign"></span>
        <span class="font-weight-bold">View Request report</span>
      </p>
      <div class="p-2">
        <div v-if="requests.length">
          <div class="p-2 text-right" v-if="manager">
            <button class="btn btn-sm btn-primary">
              <span class="fa fa-check-circle"></span>
              <span>approve</span>
            </button>
            <button class="btn btn-sm btn-secondary">
              <span class="fa fa-times-circle"></span>
              <span>approve</span>
            </button>
          </div>
          <table-component
            :data="requests"
            :heads="tableHeads"
            :headClass="`bg-success text-light`"
          >
            <template v-slot:head:before>
              <th v-if="manager"><input type="checkbox" /></th>
              <th>Actions</th>
            </template>
            <template v-slot:body:before="{ item }">
              <td v-if="manager"><input type="checkbox" /></td>
              <td>
                <button
                  class="btn btn-sm btn-warning"
                  v-if="ownerId === item.user_id"
                  @click="openEditModal(item)"
                >
                  <span class="fa fa-edit"></span>
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  v-if="ownerId === item.user_id"
                  @click="openDeleteModal(item)"
                >
                  <span class="fa fa-trash"></span>
                </button>
              </td>
            </template>
            <template v-slot:head>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Cost</th>
              <th>State</th>
              <th>Comment</th>
            </template>
            <template v-slot:body="{ item }">
              <td>{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.price * item.quantity }}</td>
              <td>{{ item.state }}</td>
              <td>{{ item.comment }}</td>
            </template>
          </table-component>
        </div>
        <div v-else-if="isRequestsFetched">
          <no-data-to-show :title="`No requests found`" />
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
    <modal-fade
      id="edit_modal"
      :show="show_edit_modal"
      :headerStyle="`bg-primary text-light`"
      @onClose="closeEditModal"
    >
      <template v-slot:header v-if="selected_request">
        <span>Edit Request for{{ selected_request.customer.name }}</span>
      </template>
      <template v-slot:body v-if="selected_request" class="pb-5">
        <div class="row mx-auto">
          <div class="col-lg">
            <label class="text-muted">Type</label>
            <select
              name="type"
              id="type"
              v-model="selected_request.type"
              class="form-control form-control-sm"
            >
              <option
                v-for="(type, i) in request_types"
                :key="`type_${i}`"
                :value="type"
                >{{ type }}</option
              >
            </select>
          </div>
          <div class="col-lg">
            <label class="text-muted">Apply Date</label>
            <input
              type="date"
              name="apply_date"
              id="apply_date"
              v-model="selected_request.apply_date"
              class="form-control form-control-sm"
            />
          </div>
        </div>
        <div class="row mx-auto my-2">
          <div class="col-lg">
            <label class="text-muted">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              v-model="selected_request.price"
              class="form-control form-control-sm"
              :min="0"
            />
          </div>
          <div class="col-lg">
            <label class="text-muted">Quantity</label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              v-model="selected_request.quantity"
              class="form-control form-control-sm"
              :min="1"
            />
          </div>
        </div>
        <hr />
        <div class="my-1 form-group text-right">
          <button class="btn btn-sm btn-secondary" @click="closeEditModal">
            <span class="fa fa-chevron-circle-left"></span>
            <span>cancel</span>
          </button>
          <button class="btn btn-sm btn-warning" @click="updateRequest">
            <span class="fa fa-edit"></span>
            <span>edit</span>
          </button>
        </div>
      </template>
    </modal-fade>
    <modal-fade
      id="delete_modal"
      :show="show_delete_modal"
      :headerStyle="`bg-danger text-light`"
      @onClose="closeDeleteModal"
    >
      <template v-slot:header v-if="selected_request">
        <span>Delete Request for{{ selected_request.customer.name }}</span>
      </template>
      <template v-slot:body v-if="selected_request">
        <div class="text-center">
          <span class="fa fa-exclamation-triangle fa-3x text-danger"></span>
          <p>
            Are you sure you want to remove this request ?
          </p>
          <div class="">
            <button class="btn btn-sm btn-secondary" @click="closeDeleteModal">
              <span class="fa fa-chevron-circle-left"></span>
              <span>cancel</span>
            </button>
            <button class="btn btn-sm btn-danger" @click="deleteRequest">
              <span class="fa fa-trash"></span>
              <span>delete</span>
            </button>
          </div>
        </div>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import { httpCall } from "../helpers/http-service";
import DateFilterBox from "./DateFilterBox.vue";
import ModalFade from "./ModalFade.vue";
import NoDataToShow from "./NoDataToShow.vue";
import TableComponent from "./TableComponent.vue";
import UserFilterBox from "./UserFilterBox.vue";
export default {
  mounted() {
    this.getAllRequests();
    this.getRequestTypes();
  },
  props: {
    users: {
      type: Array,
      required: true
    },
    manager: {
      type: Boolean,
      required: true
    },
    ownerId: {
      type: Number,
      required: true
    }
  },
  components: {
    UserFilterBox,
    DateFilterBox,
    NoDataToShow,
    TableComponent,
    ModalFade
  },
  data: () => ({
    requests: [],
    _rawRequests: [],
    isRequestsFetched: false,
    tableHeads: [
      {
        title: "User",
        name: "user.name"
      },
      {
        title: "Customer",
        name: "customer.name"
      },
      {
        title: "Request",
        name: "type"
      },
      {
        title: "Query Date",
        name: "query_date"
      },
      {
        title: "Apply Date",
        name: "apply_date"
      }
    ],
    show_edit_modal: false,
    show_delete_modal: false,
    selected_request: null,
    request_types: []
  }),
  methods: {
    /** get requests type */
    getRequestTypes() {
      httpCall
        .get("request-types")
        .then(({ data }) => {
          this.request_types = data.data;
        })
        .catch(err => console.log(err));
    },
    /** get all requests */
    getAllRequests() {
      this.requests = [];
      this.isRequestsFetched = false;
      httpCall
        .get("customer-requests")
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.requests = data.data;
            this._rawRequests = data.data;
            this.isRequestsFetched = true;
          });
        })
        .catch(err => console.log(err));
    },
    /** filter data */
    onFilter(data) {
      this.requests = [];
      let async = () => Promise.resolve(data);
      async().then(data => (this.requests = data));
    },
    /** reset filter */
    onReset() {
      this.requests = [];
      let async = () => Promise.resolve(this._rawRequests);
      async().then(data => (this.requests = data));
    },
    /**
     *  open edit modal
     *
     * @param {object} request
    */
    openEditModal(request) {
      this.selected_request = request;
      this.show_edit_modal = true;
    },
    /**
     *  open delete modal
     *
     * @param {object} request
     */
    openDeleteModal(request) {
      this.show_delete_modal = true;
      this.selected_request = request;
    },
    /** close edit modal */
    closeEditModal() {
      this.show_edit_modal = false;
    },
    /**
     * close delete modal
     */
    closeDeleteModal() {
      this.show_delete_modal = false;
    },
    /**
     * update request
     */
    updateRequest(){
      let request = {
        type: this.selected_request.type,
        apply_date: this.selected_request.apply_date,
        price: this.selected_request.price,
        quantity: this.selected_request.quantity,
        _method: 'PUT'
      }
      let id = this.selected_request.id;
      httpCall.post('customer-requests/'+id, request)
      .then(({data}) => {
        this.handleResponse(data ,data => {
          this.getAllRequests();
          this.closeEditModal();
        });
      }).catch(err => console.log(err));
    },
    /**
     * delete request
     */
    deleteRequest(){
      let id = this.selected_request.id;
      httpCall.post('customer-requests/'+id, {_method: 'DELETE'})
      .then(({data}) => {
        this.handleResponse(data ,data => {
          this.getAllRequests();
          this.closeDeleteModal();
        })
      }).catch(err => console.log(err));
    }
  }
};
</script>

<style></style>
