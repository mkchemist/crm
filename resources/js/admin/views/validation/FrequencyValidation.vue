<template>
  <div class="px-0 shadow pb-5">
    <p class="alert alert-success">
      <span class="fa fa-check-circle"></span>
      <span class="font-weight-bold">Frequency Validation Requests</span>
    </p>
    <div class="p-2 pb-5 my-1">
      <div v-if="requests.length" id="validation-data">
        <div class="p-2 text-right">
          <button
            class="btn btn-sm btn-primary"
            :disabled="!validated.length"
            @click="approveRequests"
          >
            <span class="fa fa-check-circle"></span>
            <span>approve</span>
            <span class="badge badge-light">{{ validated.length }}</span>
          </button>

          <button
            class="btn btn-sm btn-secondary"
            :disabled="!validated.length"
            @click="rejectRequests"
          >
            <span class="fa fa-times-circle"></span>
            <span>rejected</span>
            <span class="badge badge-light">{{ validated.length }}</span>
          </button>
        </div>

        <table-component
          :data="requests"
          :heads="heads"
          head-class="bg-success text-light"
          :unselectable="true"
        >
          <template v-slot:head:before>
            <th>
              <input type="checkbox" @click="selectAll" />
            </th>
          </template>
          <template v-slot:body:before="{ item }">
            <td>
              <input type="checkbox" @click="selectRequest(item.id)" />
            </td>
          </template>
        </table-component>
      </div>
      <div v-else-if="fetched">
        <no-data-to-show :title="`No waiting requests`" />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import NoDataToShow from "../../../components/NoDataToShow";
import { httpCall } from "../../../helpers/http-service";
import { checkerSelect } from "../../../helpers/helpers";
export default {
  mounted() {
    this.getRequests();
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
        title: "From",
        name: "from"
      },
      {
        title: "To",
        name: "to"
      },
      {
        title: "Locked",
        name: "locked"
      },
      {
        title: "Address",
        name: "address"
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
     * get all requests
     *
     */
    getRequests() {
      this.requests = [];
      this.fetched = false;
      httpCall
        .get("admin/v1/validation/frequency")
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.requests = data.data;
            this.fetched = true;
          });
        })
        .catch(err => {
          console.log(err);
          this.$toasted.error("Something went wrong", {
            icon: "sad",
            duration: ""
          });
        });
    },
    /**
     * select request
     *
     * @param {int} id [request id]
     */
    selectRequest(id) {
      this.validated = checkerSelect(this.validated, id, event);
    },
    /**
     * select all requests
     */
    selectAll() {
      this.validated = [];
      if (event.target.checked) {
        this.validated = this.requests.map(request => request.id);
        this.toggleCheckboxes(true);
      } else {
        this.validated = [];
        this.toggleCheckboxes(false);
      }
    },
    /**
     * toggle all checkboxes
     *
     * @param {boolean} check [whether to check or uncheck]
     */
    toggleCheckboxes(check) {
      let inputs = document.querySelectorAll(
        '#validation-data input[type="checkbox"]'
      );
      inputs.forEach(input => (input.checked = check));
    },
    /**
     * approve requests
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
        this.$toasted.error("You must pick one request at least", {
          icon: "exclamation"
        });
        return;
      }
      let request = {
        _method: "PUT",
        ids: JSON.stringify(this.validated),
        state: this.requestState
      };
      httpCall
        .post("admin/v1/validation/frequency", request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.validated = [];
            this.requestState = null;
            this.getRequests();
          })
        }).catch(err => {
          console.log(err);
          this.$toasted.error('Something went wrong', {
            icon: 'exclamation',
            duration: ''
          });
        });
    }
  }
};
</script>

<style></style>
