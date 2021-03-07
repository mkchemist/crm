<template>
  <div class="">
    <div class="p-2">
      <div v-if="requests.length">
        <data-table-component
          :cols="cols"
          :data="requestsData"
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
            <button
              type="button"
              class="btn btn-sm btn-primary"
              @click="navigateToRequest()"
            >
              <span class="fa fa-book"></span>
              <span>view</span>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-warning"
              v-if="selectedRequest.canEdit()"
              @click="navigateToRequest(true)"
            >
              <span class="fa fa-edit"></span>
              <span>edit</span>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              v-if="selectedRequest.canDelete()"
              @click="cancelRequest"
            >
              <span class="fa fa-trash"></span>
              <span>cancel</span>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-success"
              v-if="selectedRequest.canSubmit()"
              @click="submitRequest"
            >
              <span class="fa fa-paper-plane"></span>
              <span>submit</span>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-success"
              v-if="selectedRequest.canApprove()"
              @click="approveRequest"
            >
              <span class="fa fa-check-circle"></span>
              <span>approve</span>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              v-if="selectedRequest.canApprove()"
              @click="rejectRequest"
            >
              <span class="fa fa-times-circle"></span>
              <span>reject</span>
            </button>
          </div>
        </div>
        <div class="p-2 my-1"></div>
      </template>
    </modal-fade>
    <modal-fade
      :id="`set_cost_modal`"
      :show="showCostModal"
      @onClose="closeCostModal"
    >
      <template v-slot:header>
        <span class="">Set Cost Modal</span>
      </template>
      <template v-slot:body>
        <div class="form-group">
          <label for="" class="text-muted">Cost</label>
          <input
            type="number"
            min="1"
            class="form-control form-control-sm"
            v-model="set_cost"
          />
        </div>
        <div class="form-group text-right">
          <button class="btn btn-sm btn-primary" @click="setRequestCost">
            <span class="fa fa-wrench"></span>
            <span>Set</span>
          </button>
          <button class="btn btn-sm btn-dark" @click="closeCostModal">
            <span class="fa fa-times"></span>
            <span>Cancel</span>
          </button>
        </div>
      </template>
    </modal-fade>
    <data-filter-box
      :show="showFilterBox"
      :onClose="closeFilterBox"
      :onReset="onReset"
      :onFilter="onFilter"
      :queryKeys="filterQueryKeys"
      :data="requests"
      :queryOnly="false"
    />
  </div>
</template>

<script>
import DataFilterBox from "../../../../../components/DataFilterBox.vue";
import DataTableComponent from "../../../../../components/DataTableComponent.vue";
import ModalFade from "../../../../../components/ModalFade.vue";
import NoDataToShow from "../../../../../components/NoDataToShow.vue";
import PageTitleComponent from "../../../../../components/PageTitleComponent.vue";
import { asyncDataFlow, httpCall } from "../../../../../helpers/http-service";
import { CustomerRequest } from "../../helpers";
export default {
  mounted() {},
  components: {
    DataTableComponent,
    PageTitleComponent,
    NoDataToShow,
    ModalFade,
    DataFilterBox
  },
  computed: {
    fetched() {
      return this.$store.getters["RequestModule/fetched"];
    },
    requestsData() {
      let requests = this.requests;
      let isSuperUser = ["admin", "accountant"].includes(this.user.role);
      requests.forEach(request => {
        request["cost"] = request.cost / request.quantity;
        request["total_cost"] = request.cost;
        request["line"] = request.user.line.join(" | ");
        request["bu"] = this.getBUName(request);
        request["am"] = this.getAMName(request);
        if (isSuperUser) {
          request["total_benefits"] =
            parseInt(request.total_rx) *
            parseInt(request.rx_months) *
            this.priceList[request.product];
          request["cost_benefit_ratio"] = (
            (request["total_cost"] / request["total_benefits"]) *
            100
          ).toFixed(1);
          request["recommendation"] = this.handleRequestRecommendationState(
            request.cost_benefit_ratio
          );
        }
      });
      return requests;
    },
    requests() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$store.getters["RequestModule/requests"];
    },
    priceList() {
      return this.$store.getters["PriceListModule/priceList"];
    },
    isPriceListFetched() {
      return this.$store.getters["PriceListModule/isFetched"];
    },
    user() {
      return this.$store.getters["UserModule/user"];
    },
    users() {
      let users = [];
      let relatedUsers = this.$store.getters["UserModule/relations"];
      try {
        for (let key in relatedUsers) {
          users = [...users, ...relatedUsers[key]];
        }
        return users;
      } catch (e) {
        console.log(e);
        return users;
      }
    },
    buttons() {
      let actionButton = this.createActionButton();
      let newRequestButton = this.createNewRequestButton();
      let refreshButton = this.createRefreshButton();

      let buttons = [newRequestButton, refreshButton, actionButton];
      buttons.push({
        text: `<i class="fa fa-filter"></i> Filter`,
        action: (e, dt) => {
          this.showFilterBox = true;
        }
      });
      if (["accountant", "admin"].includes(this.user.role)) {
        buttons.push({
          text: `<i class="fa fa-wrench"></i> Set cost`,
          action: (e, dt) => {
            let row = dt.rows({ selected: true }).data()[0];
            if (!row) {
              this.$swal({
                title: "Warning",
                text: "You don't select any request",
                toast: true,
                icon: "warning"
              });
              return;
            }
            this.selectedRow = row;
            this.openCostModal();
          }
        });
      }
      return buttons;
    },
    cols() {
      let shared_request_info = [
        {
          title: "Submitted",
          name: "state",
          renderAs: (el, value) => {
            switch (value) {
              case "created":
                $(el).html(`<i class="fa fa-times text-danger"><i> No`)
                break;
              case "canceled":
                $(el).html(`<i class="fa fa-trash text-muted"><i> No`)
                break;
              default:
                $(el).html(`<i class="fa fa-check text-success"><i> Yes`)
            }
          }
        },
        {
          title: "Status",
          name: "state"
        },
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
          name: "cost"
        },
        {
          title: "Quantity",
          name: "quantity"
        },
        {
          title: "Total Cost",
          name: "total_cost"
        }
      ];
      let shared_user_info = [
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
          name: "line"
        },
        {
          title: "Business Unit",
          name: "bu"
        },
        {
          title: "Area Manager",
          name: "am"
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
          title: "Area Manager Approval",
          name: "area_manager_approval"
        },
        {
          title: "Area Manager Approval Date",
          name: "area_manager_approval_date"
        },
        {
          title: "Business Unit Approval Date",
          name: "business_unit_approval"
        },
        {
          title: "Business Unit Approval",
          name: "business_unit_approval_date"
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
      ];
      let cols = [];
      let isSuperAdmin = ["admin", "accountant"].includes(this.user.role);
      if (isSuperAdmin) {
        cols = [
          {
            title: "Recommendation",
            name: "recommendation",
            renderAs: (x, d) => {
              let color, icon;
              if (d === "Recommended") {
                color ="bg-success text-light"
                icon ="fa fa-check-circle"
              } else if (d === "Risky") {
                color ="bg-warning text-dark"
                icon ="fa fa-exclamation-triangle"
              } else {
                color ="bg-danger text-light"
                icon ="fa fa-times-circle"
              }
              return $(x).html(`<span class="${color} p-1">${d} <span class="${icon}"></span></span>`)
            }
          },

          ...shared_request_info,
          {
            title: "Total Request Benefits",
            name: "total_benefits"
          },
           {
            title: "Cost Benefit Ratio",
            name: row => `${row.cost_benefit_ratio} %`
          },
          ...shared_user_info
        ];
      } else {
        cols = [...shared_request_info, ...shared_request_info];
      }
      return cols;
    },
    filterQueryKeys() {
      let keys = [
        {
          title: "Type",
          name: "type"
        },
        {
          title: "Serial",
          name: "serial"
        },
        {
          title: "Apply Date",
          name: "apply_date"
        },
        {
          title: "State",
          name: "state"
        },
        {
          title: "Business Unit",
          name: "bu"
        },
        {
          title: "Area Manager",
          name: "am"
        },
        {
          title: "Requested By",
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
          title: "Approved By Area Manager",
          name: "area_manager_approval"
        },
        {
          title: "Approved By Business unit",
          name: "business_unit_approval"
        },
        {
          title: "Cost",
          name: "total_cost"
        }
      ];
      if (["admin", "accountant"].includes(this.user.role)) {
        keys.push({
          title: "Recommendation",
          name: "recommendation"
        });
      }
      return keys;
    }
  },
  data: () => ({
    showActionModal: false,
    selectedRequest: null,
    selectedRow: null,
    showCostModal: false,
    set_cost: 1,
    shouldRenderFilter: false,
    filteredList: [],
    showFilterBox: false
  }),
  methods: {
    openActionModal() {
      this.showActionModal = true;
    },
    closeActionModal() {
      let promise = Promise.resolve(false);
      return promise.then(d => (this.showActionModal = d));
    },
    navigateToRequest(withEdit = false) {
      this.closeActionModal().finally(() => {
        this.$router.push(
          `/customers-requests/view/${this.selectedRow.serial}?withEdit=${withEdit}`
        );
      });
    },
    createActionButton() {
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
      return actionButton;
    },
    createNewRequestButton() {
      let _this = this;
      let newRequestButton = {
        text: `<i class="fa fa-plus-circle mr-1"></i> Request`,
        action: (e, dt) => {
          _this.$router.push("/customers-requests/add");
        }
      };
      return newRequestButton;
    },
    createRefreshButton() {
      let _this = this;
      return {
        text: `<i class="fa fa-redo mr-1"></i> Refresh`,
        action: () => {
          _this.$store.dispatch("RequestModule/fetchCustomerRequests", {
            force: true
          });
        }
      };
    },
    cancelRequest() {
      if (!this.selectedRow) {
        return;
      }
      this.closeActionModal();
      httpCall
        .post("v1/requests/cancel/" + this.selectedRow.serial)
        .then(({ data }) => {
          if (data.code === 200) {
            this.$swal({
              toast: true,
              title: "Success",
              text: data.message,
              icon: "success"
            });
            this.$store.dispatch("RequestModule/fetchCustomerRequests", {
              force: true
            });
          } else {
            this.$swal({
              toast: true,
              title: "Error",
              text: "Something wrong happen",
              icon: "error"
            });
          }
        })
        .catch(err => console.log(err));
    },
    submitRequest() {
      if (!this.selectedRow) {
        return;
      }
      this.closeActionModal();
      httpCall
        .post("v1/requests/submit/" + this.selectedRow.serial)
        .then(({ data }) => {
          if (data.code === 200) {
            this.$swal({
              toast: true,
              title: "Success",
              text: data.message,
              icon: "success"
            });
            this.$store.dispatch("RequestModule/fetchCustomerRequests", {
              force: true
            });
          } else {
            this.$swal({
              toast: true,
              title: "Error",
              text: "Something wrong happen",
              icon: "error"
            });
          }
        })
        .catch(err => console.log(err));
    },
    approveRequest() {
      this.sendApprovalRequest("approved");
    },
    rejectRequest() {
      this.sendApprovalRequest("rejected");
    },
    sendApprovalRequest(state) {
      if (!this.selectedRow) {
        return;
      }
      let text = "Are you sure, you want to approve this request";
      if (state === "rejected") {
        text = "Are you sure, you want to reject this request";
      }
      this.$swal({
        title: "Info",
        text,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: `<i class="fa fa-check-circle"></i> Go`,
        cancelButtonText: `<i class="fa fa-times-circle"></i> Cancel`
      })
        .then(res => {
          if (res.isConfirmed) {
            httpCall
              .post("v1/requests/approve", {
                state,
                serial: this.selectedRow.serial
              })
              .then(({ data }) => {
                if (data.code === 200) {
                  this.$swal({
                    title: "Success",
                    icon: "success",
                    text: data.message
                  });
                  this.$store.dispatch("RequestModule/fetchCustomerRequests", {
                    force: true
                  });
                } else {
                  this.$swal({
                    title: "Error",
                    icon: "error",
                    text: "Something wrong happen"
                  });
                }
              });
          }
        })
        .catch(err => console.log(err));
    },
    openCostModal() {
      this.showCostModal = true;
    },
    closeCostModal() {
      this.showCostModal = false;
    },
    setRequestCost() {
      httpCall
        .post("v1/requests/set-cost", {
          serial: this.selectedRow.serial,
          cost: this.set_cost
        })
        .then(({ data }) => {
          if (data.code === 200) {
            this.$swal({
              title: "Success",
              icon: "success",
              text: data.message
            });
            this.$store.dispatch("RequestModule/fetchCustomerRequests", {
              force: true
            });
          } else {
            this.$swal({
              title: "Error",
              icon: "error",
              text: "Something wrong happen"
            });
          }
        })
        .catch(err => console.log(err));
    },
    onFilter(q, d) {
      this.filteredList = [];
      this.shouldRenderFilter = true;
      asyncDataFlow(d, d => (this.filteredList = d));
    },
    onReset() {
      this.filteredList = [];
      asyncDataFlow([], d => {
        this.filteredList = d;
        this.shouldRenderFilter = false;
      });
    },
    closeFilterBox() {
      this.showFilterBox = false;
    },
    getBUName(row) {
      let users = this.users.filter(user => user.role === "rm");
      let name = "----------";
      if (row.user.role === "rm") {
        return row.user.name;
      } else {
        users.map(user => {
          let rel = JSON.parse(user.user_relations);
          if (rel[row.user.role].includes(row.user.id)) {
            name = user.name;
          }
        });
        return name;
      }
    },
    getAMName(row) {
      let users = this.users.filter(user => user.role === "am");
      let name = "----------";
      if (["am", "rm"].includes(row.user.role)) {
        return row.user.name;
      } else {
        users.map(user => {
          let rel = JSON.parse(user.user_relations);
          if (rel[row.user.role].includes(row.user.id)) {
            name = user.name;
          }
        });
        return name;
      }
    },
    handleRequestRecommendationState(ratio) {
      let tag, color, icon;
      if (ratio <= 10) {
        tag = "Recommended";
      } else if (10 < ratio <= 20) {
        tag = "Risky";
      } else {
        tag = "Should be avoided";
      }
      return tag;
    }
  }
};
</script>

<style></style>
