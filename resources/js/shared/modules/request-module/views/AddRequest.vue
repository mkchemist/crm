<template>
  <div>
    <div class="px-0 shadow rounded pb-5">
      <p class="alert alert-success">
        <span class="fa fa-plus-circle"></span>
        <span class="font-weight-bold">Add new request</span>
      </p>

      <div class="p-2">
        <!-- Request Container -->
        <div class="border p-2">
          <ValidationObserver v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(saveRequest)">
              <!-- Brick selection and Request Owner -->
              <div class="row mx-auto my-2 border rounded">
                <div class="col-lg">
                  <label for="by" class="font-weight-bold small"
                    >Requested By</label
                  >
                  <ValidationProvider
                    name="Requested By"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <span class="text-danger small" v-if="errors[0]"
                      >* required</span
                    >
                    <select
                      name=""
                      id=""
                      v-if="shouldOpenRequestOwnerSelector"
                      v-model="request.user_id"
                      :class="`form-control form-control-sm ${errors[0] ? 'border border-danger': ''}`"
                    >
                      <option :value="null">Select User</option>
                      <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }} ({{ user.role }})  ({{ JSON.parse(user.line).join(" | ") }}) </option>
                    </select>
                    <input
                      v-else
                      type="text"
                      :value="user.name"
                      class="form-control form-control-sm"
                      :disabled="true"
                    />
                  </ValidationProvider>
                </div>
                <!-- Brick Selection -->
                <div class="col-lg">
                  <label for="brick" class="font-weight-bold small"
                    >Brick</label
                  >
                  <select
                    name="brick"
                    id="brick"
                    class="form-control form-control-sm"
                    v-model="fetch_brick"
                    v-if="isBricksFetched"
                  >
                    <option :value="null">Select Brick</option>
                    <option
                      v-for="(brick, _bi) in bricks"
                      :key="`brick_${_bi}`"
                      :value="brick.brick"
                      >{{ brick.brick }}</option
                    >
                  </select>
                  <div v-else class="text-center p-0 mb-0">
                    <div class="spinner-border text-info small spin"></div>
                    <span class="mx-1 text-muted">Loading Bricks</span>
                  </div>
                  <button
                    class="btn btn-sm btn-block btn-primary my-1"
                    :disabled="!fetch_brick"
                    @click="fetchBrickCustomersAndPharmacies"
                    type="button"
                  >
                    <span class="fa fa-check-circle"></span>
                    <span>ok</span>
                  </button>
                </div>
              </div>
              <!-- Query date and apply date -->
              <div class="row mx-auto my-2 border rounded">
                <div class="col-lg">
                  <label for="query_date" class="font-weight-bold small"
                    >Query date</label
                  >
                  <input
                    type="date"
                    class="form-control form-control-sm"
                    :value="today"
                    :disabled="true"
                  />
                  <span class="form-text small text-muted"
                    >* date of querying request</span
                  >
                </div>

                <!-- Apply Date -->
                <div class="col-lg">
                  <label for="apply_date" class="font-weight-bold small"
                    >Apply date</label
                  >
                  <ValidationProvider
                    name="Apply Date"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <input
                      type="date"
                      name="apply_date"
                      id="apply_date"
                      :class="
                        `form-control form-control-sm ${
                          errors[0] ? 'border border-danger' : ''
                        }`
                      "
                      v-model="request.apply_date"
                    />
                    <span class="form-text small text-muted"
                      >* date of execution</span
                    >
                  </ValidationProvider>
                </div>
              </div>
              <!-- Customers and Pharmacies -->
              <div class="row mx-auto border rounded my-2 p-2">
                <!-- Customers -->
                <div class="col-lg-6 border rounded my-lg-0 my-1">
                  <p class="mb-1 font-weight-bold small">Customers</p>
                  <add-request-customer-component
                    :customers="customers"
                    :requestCustomers="request.customers"
                  />
                </div>
                <!-- Pharmacies -->
                <div class="col-lg-6 border rounded my-lg-0 my-1">
                  <p class="mb-1 font-weight-bold small">Pharmacies</p>
                  <add-request-pharmacy-component
                    :pharmacies="pharmacies"
                    :requestPharmacies="request.pharmacies"
                  />
                </div>
              </div>

              <!-- Request products -->
              <div class="my-2 border p-2">
                <add-request-product-selection
                  :requestProducts="request.products"
                />
              </div>
              <!-- Request Type -->
              <div class="row mx-auto border rounded my-2 p-2">
                <!-- Type selection -->
                <div class="col-lg-4">
                  <div class="form-group">
                    <label for="type" class="small font-weight-bold"
                      >Request Type</label
                    >
                    <ValidationProvider
                      name="Request Type"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <span class="text-danger small" v-if="errors[0]"
                        >* required</span
                      >
                      <select
                        name="type"
                        id="type"
                        v-model="request.type"
                        :class="
                          `form-control form-control-sm ${
                            errors[0] ? 'border border-danger' : ''
                          }`
                        "
                        :disabled="!types.length"
                        @change="resetRequestForm"
                      >
                        <option :value="null">Select Request Type</option>
                        <option
                          v-for="(type, ti) in types"
                          :key="`type_${ti}`"
                          :value="type"
                          >{{ type }}</option
                        >
                      </select>
                    </ValidationProvider>
                    <button
                      class="btn btn-sm btn-block btn-primary my-1"
                      :disabled="!request.type"
                      @click="openRequestForm"
                      type="button"
                    >
                      <span class="fa fa-check-circle"></span>
                      <span>Open Request Form</span>
                    </button>
                  </div>
                </div>
                <!-- Type Form -->
                <div class="col-lg-8">
                  <div v-if="show_request_form">
                    <group-meeting-request-form
                      v-if="request.type === 'Group Meeting'"
                      :request="request"
                    />
                    <gift-request-form
                      v-if="request.type === 'Gift'"
                      :request="request"
                    />
                    <brand-reminder-request-form
                      v-if="request.type === 'Brand Reminder'"
                      :request="request"
                    />

                    <conference-request-form
                      v-if="
                        [
                          'International Conference',
                          'Local Conference'
                        ].includes(request.type)
                      "
                      :request="request"
                    />
                    <dinner-request-form
                      v-if="request.type === 'Dinner'"
                      :request="request"
                    />
                    <donation-request-form
                      v-if="
                        ['Samples', 'Study', 'Donation'].includes(request.type)
                      "
                      :request="request"
                    />
                    <hotel-reservation-request-form
                      v-if="
                        ['Club', 'Hotel Reservation'].includes(request.type)
                      "
                      :request="request"
                    />

                    <ticket-reservation-request-form
                      v-if="request.type === 'Ticket Reservation'"
                      :request="request"
                    />
                  </div>
                </div>
              </div>

              <!-- Request cost and Quantity -->
              <div class="row mx-auto p-2 border rounded">
                <p class="col-12 alert alert-warning font-weight-bold" v-if="!canSetPrice">
                  Request cost will be determined later by Customers Request Manager
                </p>
                <div class="col-lg">
                  <label for="cost" class="font-weight-bold small">Cost</label>
                  <ValidationProvider
                    name="Request Cost"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <span class="text-danger small" v-if="errors[0]"
                      >* required</span
                    >
                    <input
                      type="number"
                      min="1"
                      :class="
                        `form-control form-control-sm ${
                          errors[0] ? 'border border-danger' : ''
                        }`
                      "
                      v-model="request.cost"
                      :disabled="!canSetPrice"
                    />
                  </ValidationProvider>
                </div>
                <div class="col-lg">
                  <label for="quantity" class="font-weight-bold small"
                    >Quantity</label
                  >
                  <ValidationProvider
                    name="Request Quantity"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <span class="text-danger small" v-if="errors[0]"
                      >* required</span
                    >
                    <input
                      type="number"
                      min="1"
                      :class="
                        `form-control form-control-sm ${
                          errors[0] ? 'border border-danger' : ''
                        }`
                      "
                      v-model="request.quantity"
                      :disabled="!canSetPrice"
                    />
                  </ValidationProvider>
                </div>
                <div class="col-lg">
                  <label for="total_cost" class="small font-weight-bold"
                    >Total Cost</label
                  >
                  <input
                    type="text"
                    class="bg-primary text-light form-control form-control-sm"
                    :value="request.quantity * request.cost"
                    :disabled="true"
                  />
                </div>
              </div>
              <hr />
              <!-- Form controller -->
              <div class="form-group text-right">
                <router-link
                  to="/customers-requests"
                  class="btn btn-sm btn-dark col-2"
                >
                  <span class="fa fa-chevron-circle-left"></span>
                  <span>back</span>
                </router-link>
                <button class="btn btn-sm btn-primary col-2" type="submit">
                  <span class="fa fa-save"></span>
                  <span>save</span>
                </button>
              </div>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { serialize, sortBy } from "../../../../helpers/helpers";
import { httpCall } from "../../../../helpers/http-service";
import AddRequestCustomerComponent from "../components/AddRequestCustomerComponent";
import AddRequestPharmacyComponent from "../components/AddRequestPharmacyComponent";
import GiftRequestForm from "../components/GiftRequestForm";
import DinnerRequestForm from "../components/DinnerRequestForm";
import BrandReminderRequestForm from "../components/BrandReminderRequestForm";
import ConferenceRequestForm from "../components/ConferenceRequestForm";
import DonationRequestForm from "../components/DonationRequestForm";
import GroupMeetingRequestForm from "../components/GroupMeetingRequestForm";
import HotelReservationRequestForm from "../components/HotelReservationRequestForm";
import TicketReservationRequestForm from "../components/TicketReservationRequestForm";
import AddRequestProductSelection from "../components/AddRequestProductSelection.vue";

/** new request object */
const newRequest = {
  user_id: null,
  customers: [],
  pharmacies: [],
  products: [],
  apply_date: null,
  type: null,
  cost: 1,
  quantity: 1,
  comment: {
    item: null,
    desc: null
  },
  others: null
};

export default {
  components: {
    AddRequestPharmacyComponent,
    AddRequestCustomerComponent,
    GiftRequestForm,
    DinnerRequestForm,
    BrandReminderRequestForm,
    ConferenceRequestForm,
    DonationRequestForm,
    GroupMeetingRequestForm,
    HotelReservationRequestForm,
    TicketReservationRequestForm,
    AddRequestProductSelection
  },

  computed: {
    users() {
      let relatedUsers = this.$store.getters['UserModule/relations'];
      let users = [];
      for(let key in relatedUsers) {
        users = [...users, ...relatedUsers[key]];
      }
      return sortBy(users, 'name');
    },
    user() {
      return this.$store.state.CustomerRequestModule.UserModule.user;
    },
    bricks() {
      return sortBy(this.$store.getters["LocationsModule/bricks"], "brick");
    },
    isBricksFetched() {
      return this.$store.getters["LocationsModule/isBricksFetched"];
    },
    types() {
      return this.$store.getters["RequestModule/types"];
    },
    shouldOpenRequestOwnerSelector() {
      if (["admin", "accountant"].includes(this.user.role)) {
        return true;
      }
      return false;
    },
    canSetPrice() {
      if (
        !["Samples", "Study", "Club", "Hotel Reservation", "Donation"].includes(
          this.request.type
        ) && ["admin", "accountant"].includes(this.user.role)
      ) {
        return true;
      }
      return false;
    },
    today() {
      let date = new Date();
      if(date.format) {
        date = date.format()
        console.log('with Format')
      } else {
        date = date.toISOString()
        date = date.split('T');
        date = date[0];
      }
      return date;
    }
  },
  data: function() {
    return {
      fetch_brick: null,
      customers: [],
      pharmacies: [],
      isFetchingRequestLoaded: false,
      request: Object.assign({}, newRequest),
      show_request_form: false
    };
  },
  methods: {
    showAlert(text, title = "Warning", icon = "warning") {
      this.$swal({
        title,
        text,
        icon
      });
    },
    prepareRequest() {
      let request = Object.assign({}, this.request);
      if (!this.shouldOpenRequestOwnerSelector) {
        request.user_id = [this.user.id];
      }
      request = serialize(request, [
        "user_id",
        "products",
        "pharmacies",
        "customers",
        "comment"
      ]);
      return request;
    },
    /* Save request */
    saveRequest() {
      if (!this.request.products.length) {
        this.showAlert("You must pick at least one product");
        return;
      }
      if (!this.request.customers.length) {
        this.showAlert("You add at least one customer to complete request");
        return;
      }
      if (!this.request.pharmacies.length) {
        this.showAlert("You must pick one pharmacy at least");
        return;
      }
      if (!this.request.comment.item || !this.request.comment.desc) {
        this.showAlert("You must complete request details");
      }
      let request = this.prepareRequest();
      return httpCall
        .post("v1/requests", request)
        .then(({ data }) => {
          if (data.code === 200) {
            this.showAlert(data.message, "Success", "success");
            this.request = Object.assign({}, newRequest);
            this.$store.dispatch("RequestModule/fetchCustomerRequests", {force: true})
          } else {
            if (!data.message) {
              data.message = "Something wrong happened";
            }
            this.showAlert(data.message, "Error", "error");
          }
        })
        .catch(err => console.log(err));
    },
    /* fetching brick customers and pharmacies */
    fetchBrickCustomersAndPharmacies() {
      httpCall
        .get("v1/user-customers/customers/" + this.fetch_brick, {
          withRequests: true
        })
        .then(({ data }) => {
          this.customers = data.data;
        })
        .then(() => {
          httpCall
            .get("v1/user-customers/pharmacies/" + this.fetch_brick)
            .then(({ data }) => {
              this.pharmacies = data.data;
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    },
    /* open request form */
    openRequestForm() {
      this.show_request_form = true;
    },
    /* reset request form when changing request type */
    resetRequestForm() {
      this.request.comment.item = null;
      this.request.comment.desc = null;
      this.show_request_form = false;
    }
  }
};
</script>

<style></style>
