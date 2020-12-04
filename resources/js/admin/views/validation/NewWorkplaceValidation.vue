<template>
  <div class="p-0 shadow rounded">
    <p class="alert alert-success">
      <span><i class="fa fa-check-circle"></i></span>
      <span class="font-weight-bold">New workplace Validation</span>
    </p>
    <div class="p-2">
      <div v-if="requests.length" id="validation-data">
        <div class="p-2 text-right">
          <button
            class="btn btn-primary btn-sm"
            :disabled="!validated.length"
            @click="approveRequests"
          >
            <span class="fa fa-check-circle"></span>
            <span>approve</span>
            <span class="badge badge-light">{{ validated.length }}</span>
          </button>
          <button
            class="btn btn-secondary btn-sm"
            :disabled="!validated.length"
            @click="rejectRequests"
          >
            <span class="fa fa-times-circle"></span>
            <span>reject</span>
            <span class="badge badge-light">{{ validated.length }}</span>
          </button>
        </div>
        <table-component
          :data="requests"
          :heads="heads"
          head-class="bg-success text-light"
        >
          <template v-slot:head:before>
            <th><input type="checkbox" @click="selectAll" /></th>
          </template>
          <template v-slot:body:before="{ item }">
            <th><input type="checkbox" @click="selectRequest(item.id)" /></th>
          </template>
        </table-component>
      </div>
      <div v-else-if="fetched">
        <no-data-to-show title="No waiting requests" />
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
        title: "Area",
        name: "area"
      },
      {
        title: "Workplace",
        name: "name"
      },
      {
        title: "Type",
        name: "type"
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
      },
      {
        title: "Request Date",
        name: "created_at"
      }
    ]
  }),
  methods: {
    getRequests() {
      this.requests = [];
      this.fetched = false;
      httpCall
        .get("admin/v1/validation/workplaces/new")
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.requests = data.data;
            this.fetched = true;
          });
        })
        .catch(err => {
          console.log(err);
          this.$toasted.error(err.message, {
            icon: "exclamation"
          });
        });
    },
    selectRequest(id) {
      this.validated = checkerSelect(this.validated, id, event);
    },
    selectAll() {
      if (event.target.checked) {
        this.validated = [];
        this.toggleCheckboxes(true);
        this.validated = this.requests.map(request => request.id);
      } else {
        this.toggleCheckboxes(false);
        this.validated = [];
      }
    },
    toggleCheckboxes(check) {
      let inputs = document.querySelectorAll(
        '#validation-data input[type="checkbox"]'
      );
      inputs.forEach(input => (input.checked = check));
    },
    approveRequests() {
      this.requestState = "approved";
      console.log(this.requestState)
      this.sendRequests();
    },
    rejectRequests() {
      this.requestState = "rejected";
      console.log(this.requestState)

      this.sendRequests();
    },
    sendRequests() {
      let request = {
        _method: 'PUT',
        ids: JSON.stringify(this.validated),
        state: this.requestState
      }
      console.log(request, this.requestState);
      httpCall
        .post("admin/v1/validation/workplaces/new", request)
        .then(({ data }) => {
          console.log(data);
          this.handleResponse(data, data => {
            this.validated = [];
            this.requests = [];
            this.requestState = null;
            this.getRequests();
          });
        })
        .catch(err => {
          this.$toasted.error(err.message);
          console.log(err);
        });
    }
  }
};
</script>

<style></style>
