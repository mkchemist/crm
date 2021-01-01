<template>
  <div class="px-0 shadow pb-5 my-2">
    <p class="alert alert-success">
      <span class="fa fa-check-circle"></span>
      <span class="font-weight-bold">Parameters Validation Requests</span>
    </p>
    <div class="p-2 pb-5">
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
          headClass="bg-success text-light"
          :orderBy="`Customer,asc|Area,asc`"
          :unselectable="true"
        >
          <template v-slot:head:before>
            <th>
              <input type="checkbox" @click="selectAll">
            </th>
          </template>
          <template v-slot:body:before="{item}">
            <td>
              <input type="checkbox" @click="selectRequest(item.id)">
            </td>
          </template>
        </table-component>
      </div>
      <div v-else-if="fetched">
        <no-data-to-show title="No waiting response" />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import NoDataToShow from "../../../components/NoDataToShow.vue";
import TableComponent from "../../../components/TableComponent.vue";
import { checkerSelect } from "../../../helpers/helpers";
import { httpCall } from "../../../helpers/http-service";
export default {
  mounted() {
    this.getAllRequests();
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
  components: {
    TableComponent,
    NoDataToShow
  },
  methods: {
    /**
     * get all requests
     *
     */
    getAllRequests() {
      this.requests = [];
      this.fetched = false;
      httpCall.get("admin/v1/validation/parameters").then(({ data }) => {
        this.handleResponse(data, data => {
          this.requests = data.data;
          this.fetched = true;
        });
      });
    },
    /**
     * select the given request
     *
     * @param {int} id [request id]
     */
    selectRequest(id) {
      this.validated = checkerSelect(this.validated, id, event);
    },
    selectAll() {
      this.validated = [];
      if(event.target.checked) {
        this.toggleCheckBox(true);
        this.validated = this.requests.map(request => request.id);
      } else {
        this.toggleCheckBox(false);
        this.validated = [];
      }
    },
    /**
     * toggle checkbox to mark at as checked
     * or not checked
     *
     * @param {boolean} check
     */
    toggleCheckBox(check){
      let inputs = document.querySelectorAll('#validation-data input[type="checkbox"]');
      inputs.forEach(input => input.checked = check);
    },
    /**
     * approve requests
     *
     */
    approveRequests() {
      this.requestState="approved";
      this.sendRequests();
    },
    /**
     * reject requests
     */
    rejectRequests() {
      this.requestState="rejected";
      this.sendRequests();
    },
    /**
     * send requests
     */
    sendRequests() {
      if(!this.validated.length) {
        this.$toasted.error('You must pick one request at least', {
          icon : 'exclamation'
        })
        return;
      }
      let request = {
        ids: JSON.stringify(this.validated),
        state: this.requestState,
        _method: 'PUT'
      }
      httpCall.post('admin/v1/validation/parameters', request)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.requests = [];
          this.getAllRequests();
          this.validated = [];
          this.requestState = null;
        })
      }).catch(err => {
        this.$toasted.show(err.message, {
          icon: 'sad'
        });
        console.log(err);
      })
    }
  }
};
</script>

<style></style>
