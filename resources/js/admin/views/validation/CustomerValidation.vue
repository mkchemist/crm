<template>
  <div class="my-2 px-0 shadow pb-5">
    <p class="alert alert-success">
      <span><i class="fa fa-check-circle"></i></span>
      <span class="font-weight-bold">Validate customers details</span>
    </p>
    <div class="p-2 pb-5">
      <div v-if="requests.length" id="validation-data">
        <div class="p-2 my-1 text-right">
          <button
            class="btn btn-sm btn-info"
            @click="getAllRequests"
          >
            <span class="fa fa-redo"></span>
            <span>refresh list</span>
          </button>
          <button
            class="btn btn-sm btn-primary"
            :disabled="!validated.length"
            @click="approveRequests"
          >
            <span class="fa fa-check-circle"></span>
            <span>Approve</span>
            <span class="badge badge-light">{{ validated.length }}</span>
          </button>
          <button
            class="btn btn-sm btn-secondary"
            :disabled="!validated.length"
            @click="rejectRequests"
          >
            <span class="fa fa-times-circle"></span>
            <span>Reject</span>
            <span class="badge badge-light">{{ validated.length }}</span>
          </button>
          <button
            class="btn btn-sm btn-danger"
            @click="clearRejectedRequests"
          >
            <span class="fa fa-trash"></span>
            <span>Clear all rejected</span>
          </button>
        </div>
        <table-component
          :heads="heads"
          :data="requests"
          :orderBy="`Customer,asc`"
          head-class="bg-success text-light"
        >
          <template v-slot:head:before>
            <th>
              <input type="checkbox" @click="selectAllRequests" />
            </th>
            <th>
              State
            </th>
          </template>
          <template v-slot:body:before="{ item }">
            <td>
              <input
                type="checkbox"
                @click="selectRequest(item.id)"
                :disabled="item.state === false && item.approval === true"
              />
            </td>
            <td>
              <span>{{
                item.state === false && item.approval === true
                  ? "rejected"
                  : "Requested"
              }}</span>
            </td>
          </template>
        </table-component>
      </div>
      <div v-else-if="fetched" class="text-center">
        <no-data-to-show title="No waiting response"/>
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
import TableComponent from "../../../components/TableComponent";
import { checkerSelect } from "../../../helpers/helpers";
import NoDataToShow from "../../../components/NoDataToShow";
export default {
  mounted() {
    this.getAllRequests();
  },
  components: {
    TableComponent,
    NoDataToShow
  },
  data: () => ({
    requests: [],
    fetched: false,
    validated: [],
    requestState: null,
    heads: [
      {
        title: "Rep",
        name: "user"
      },
      {
        title: "Area",
        name: "area"
      },
      {
        title: "Customer",
        name: "customer"
      },
      {
        title: "Specialty",
        name: "specialty"
      },
      {
        title: "From Title",
        name: "old_title"
      },
      {
        title: "To Title",
        name: "new_title"
      },
      {
        title: "From Phone",
        name: "old_phone"
      },
      {
        title: "To Phone",
        name: "new_phone"
      },
      {
        title: "From Address",
        name: "old_address"
      },
      {
        title: "From Workplace",
        name: "old_workplace"
      },
      {
        title: "To Workplace",
        name: "new_workplace"
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
    ]
  }),
  methods: {
    /**
     * get all customer validation requests
     *
     */
    getAllRequests() {
      this.fetched = false;
      this.requests = [];
      httpCall
        .get("admin/v1/validation/customers")
        .then(({ data }) => {
          data.message = "Request list loaded";
          this.handleResponse(data, data => {
            this.fetched = true;
            this.requests = data.data;
          });
        })
        .catch(err => {
          this.$toasted.show("Error: something went wrong", {
            icon: "fa-bomb"
          });
        });
    },
    /**
     * select Request
     *
     * @param {int} id [request ID]
     */
    selectRequest(id) {
      this.validated = checkerSelect(this.validated, id, event);
    },
    /**
     * select All requests
     *
     */
    selectAllRequests() {
      if (event.target.checked) {
        this.toggleCheckBoxes(true);
        this.validated = [];
        this.requests.map(request => {
          if (request.approval === false && request.state === false) {
            this.validated.push(request.id);
          }
        });
      } else {
        this.toggleCheckBoxes(false);
        this.validated = [];
      }
    },
    /**
     * toggle checkboxes
     *
     */
    toggleCheckBoxes(check) {
      let inputs = document.querySelectorAll(
        '#validation-data input[type="checkbox"]'
      );
      inputs.forEach(input => {
        if (!input.disabled) {
          input.checked = check;
        }
      });
    },
    /**
     * approve requests
     *
     *
     */
    approveRequests() {
      this.requestState = "approved";
      this.sendRequests();
    },
    /**
     * reject requests
     */
    rejectRequests() {
      this.requestState = "rejected";
      this.sendRequests();
    },
    /**
     * send requests
     */
    sendRequests() {
      if (!this.validated.length) {
        this.$toasted.error("You must pick one request at least");
        return;
      }
      httpCall
        .post("admin/v1/validation/customers", {
          _method: "PUT",
          state: this.requestState,
          ids: JSON.stringify(this.validated)
        })
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.requests = [];
            this.toggleCheckBoxes(false);
            this.validated = [];
            this.requestState = null;
          });
        }).finally(() => {
          this.getAllRequests();
        });
    },
    /**
     * clear rejected requests
     */
    clearRejectedRequests() {
      let request = {_method: 'DELETE'};

      httpCall.post('admin/v1/validation/customers/clear-rejected', request)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.getAllRequests();
        })
      })
    }
  }
};
</script>

<style></style>
