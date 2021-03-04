<template>
  <div class="px-0 shadow rounded">
    <page-title-component :title="`View request ${$route.params.serial}`" />
    <div class="p-2">
      <div v-if="data.length">
        <request-card
          :data="data"
          :mode="requestCardMode"
          :onSave="onSaveRequest"
          :priceList="priceList"
        >
          <template v-slot:extra-btn>
            <button
              class="btn btn-sm btn-danger"
              v-if="requestCardMode === 'view' && canEditRequest"
              @click.prevent="toggleCardMode"
              type="button"
            >
              <span class="fa fa-unlock"></span>
              <span>Edit mode</span>
            </button>
            <button
              class="btn btn-sm btn-secondary"
              v-if="requestCardMode === 'edit' && canEditRequest"
              @click="toggleCardMode"
              type="button"
            >
              <span class="fa fa-book-reader"></span>
              <span>View mode</span>
            </button>
          </template>
        </request-card>
      </div>
      <div v-else-if="fetched">
        <no-data-to-show />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import NoDataToShow from "../../../../components/NoDataToShow.vue";
import PageTitleComponent from "../../../../components/PageTitleComponent.vue";
import { httpCall } from "../../../../helpers/http-service";
import RequestCard from "../components/RequestCard.vue";
export default {
  mounted() {
    this.fetchRequest();
  },
  components: {
    NoDataToShow,
    RequestCard,
    PageTitleComponent
  },
  computed: {
    serial() {
      return this.$route.params.serial;
    },
    requestCardMode() {
      if (this.forceMode) {
        return this.forceMode;
      }
      let editable = this.$route.query.withEdit;
      if (editable === "true") {
        return "edit";
      } else {
        return "view";
      }
    },
    canEditRequest() {
      if (!this.data.length) {
        return false;
      }
      if (
        ["approved", "rejected", "pending", "confirmed"].includes(
          this.data[0].state
        )
      ) {
        return false;
      }
      return true;
    }
  },
  data: () => ({
    data: [],
    fetched: false,
    forceMode: null,
    priceList: {}
  }),
  methods: {
    fetchRequest() {
      let serial = this.serial;
      return httpCall
        .get("v1/requests/" + serial)
        .then(({ data }) => {
          this.data = data.data;
          this.priceList = data.priceList
          this.fetched = true;
        })
        .catch(err => console.log(err));
    },
    toggleCardMode() {
      if (this.requestCardMode === "view") {
        this.forceMode = "edit";
      } else {
        this.forceMode = "view";
      }
    },
    clearUnusedRequestItems(request) {
      delete request.view_customers;
      delete request.view_pharmacies;
      delete request.add_customers;
      delete request.add_products;
      delete request.added_cost;
    },
    prepareUpdateRequest(data) {
      let request = Object.assign({}, data);
      request.products = JSON.stringify(request.products);
      request.customers = JSON.stringify(request.customers);
      request.pharmacies = JSON.stringify(request.pharmacies);
      request.comment = JSON.stringify(request.comment);
      this.clearUnusedRequestItems(request);
      return request;
    },
    onSaveRequest(data) {
      let request = this.prepareUpdateRequest(data);
      request._method = "PUT";
      return httpCall.post('v1/requests/'+request.serial,request)
      .then(({data}) => {
        if(data.code === 200) {
          this.forceMode = 'view';
          this.$store.dispatch("RequestModule/fetchCustomerRequests", {force: true})
          this.$swal({
            title: 'Success',
            text: 'Request Updated successfully',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: `<i class="fa fa-chevron-left"></i> back to list`,
            cancelButtonText: `<i class="fa fa-book-reader"></i> view request`
          }).then(res => {
            if(res.isConfirmed) {
              this.$router.push("/customers-requests/list");
            }
          })
              this.fetchRequest();
        }else {

        }
      }).catch(err => console.log(err))
    }
  }
};
</script>

<style></style>
