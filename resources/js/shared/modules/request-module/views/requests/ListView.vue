<template>
  <div class="">
    <div class="p-2">
      <div v-if="requests.length">
        <data-table-component
          :cols="cols"
          :data="requests"
          :buttons="buttons"
        />
      </div>
      <div v-else-if="fetched">
        <no-data-to-show />
      </div>
      <loader-component v-else></loader-component>
    </div>
    <modal-fade
      :show="showActionModal"
      @onClose="closeActionModal"
      :headerStyle="`bg-success text-light`"
      :id="`request_action_modal`"
    >
      <template v-slot:header>
        <span class="">Action Modal</span>
      </template>
      <template v-slot:body>
        <div class="text-right" v-if="selectedRequest">
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-sm btn-primary">
              <span class="fa fa-book"></span>
              <span>view</span>
            </button>
            <button type="button" class="btn btn-sm btn-warning" v-if="selectedRequest.canEdit()" @click="navigateToEdit">
              <span class="fa fa-edit"></span>
              <span>edit</span>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              v-if="selectedRequest.canDelete()"
            >
              <span class="fa fa-trash"></span>
              <span>cancel</span>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-success"
              v-if="selectedRequest.canSubmit()"
            >
              <span class="fa fa-paper-plane"></span>
              <span>submit</span>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-success"
              v-if="selectedRequest.canApprove()"
            >
              <span class="fa fa-check-circle"></span>
              <span>approve</span>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              v-if="selectedRequest.canApprove()"
            >
              <span class="fa fa-times-circle"></span>
              <span>reject</span>
            </button>
          </div>
        </div>
        <div class="p-2 my-1"></div>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import DataTableComponent from "../../../../../components/DataTableComponent.vue";
import ModalFade from "../../../../../components/ModalFade.vue";
import NoDataToShow from "../../../../../components/NoDataToShow.vue";
import PageTitleComponent from "../../../../../components/PageTitleComponent.vue";
import { CustomerRequest } from "../../helpers";
export default {
  mounted() {

  },
  components: {
    DataTableComponent,
    PageTitleComponent,
    NoDataToShow,
    ModalFade
  },
  computed: {
    fetched() {
      return this.$store.getters["RequestModule/fetched"];
    },
    requests() {
      return this.$store.getters["RequestModule/requests"];
    },
    user() {
      return this.$store.getters["UserModule/user"];
    },
    buttons() {
      let _this = this;
      let actionButton = {
        text: `<span class="mx-1 fa fa-cogs"></span> Actions`,
        action: (e, dt) => {
          let row = dt.rows({ selected: true }).data()[0];
          if (!row) {
            this.$swal({
              toast: true,
              title: "Warning",
              text: "You didn't select request, Select request to view actions",
              icon: "warning",
              timer: 3000,
              timerProgressBar: true
            });
            return;
          }
          this.selectedRequest = new CustomerRequest(row, this.user);
          _this.selectedRow = row;

          this.openActionModal();
        }
      };

      return [actionButton];
    }
  },
  data: () => ({
    cols: [
      {
        title: "Request",
        name: "type"
      },
      {
        title: "Serial",
        name: "serial"
      },
      {
        title: "Item",
        name: "comment.item"
      },
      {
        title: "Description",
        name: "comment.desc"
      },
      {
        title: "Others",
        name: "others"
      },
      {
        title: "Cost",
        name: row => row.cost / row.quantity
      },
      {
        title: "Quantity",
        name: "quantity"
      },
      {
        title: "Total Cost",
        name: row => row.cost
      },
      {
        title: "User",
        name: "user.name"
      },
      {
        title: "Role",
        name: "user.role"
      },
      {
        title: "Line",
        name: row => row.user.line.join(' | ')
      },
      {
        title: "Query Date",
        name: "query_date"
      },
      {
        title: "Apply Date",
        name: "apply_date"
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
        title: "Parameter",
        name: "customer.parameter"
      },
      {
        title: "Product",
        name: "product"
      },
      {
        title: "Rx per months",
        name: "rx_per_month"
      },
      {
        title: "Rx duration",
        name: "rx_months"
      },
      {
        title: "Total Rx",
        name: "total_rx"
      },
      {
        title: "Pharmacy 1",
        name: "pharmacy1"
      },
      {
        title: "Pharmacy 2",
        name: "pharmacy2"
      },
      {
        title: "Pharmacy 3",
        name: "pharmacy3"
      },
      {
        title: "Pharmacy 4",
        name: "pharmacy4"
      },
      {
        title: "Status",
        name: "state"
      },
      {
        title: "Area Manager Approval",
        name: "area_manager_approval"
      },
      {
        title: "Business Unit Approval",
        name: "business_unit_approval"
      },
      {
        title: "Brick",
        name: "customer.brick"
      },
      {
        title: "Area",
        name: "customer.area"
      },
      {
        title: "District",
        name: "customer.district"
      },
      {
        title: "Territory",
        name: "customer.territory"
      }
    ],
    showActionModal: false,
    selectedRequest: null,
    selectedRow: null
  }),
  methods: {
    openActionModal() {
      this.showActionModal = true;
    },
    closeActionModal() {
     let promise = Promise.resolve(false);
      return promise.then(d => this.showActionModal = d);
    },
    navigateToEdit() {
      this.closeActionModal()
      .finally(() => {
        this.$router.push("/customers-requests/view/"+this.selectedRow.serial);
      })
    }
  }
};
</script>

<style></style>
