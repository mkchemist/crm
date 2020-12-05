<template>
  <div class="px-0 pb-5 shadow border">
    <p class="alert alert-success">
      <span class="fa fa-check-circle"></span>
      <span class="font-weight-bold">Pharmacy Validation</span>
    </p>
    <div class="p-2">
      <div v-if="requests.length" id="validation-data">
        <div class="p-2 text-right">
          <button
            class="btn btn-sm btn-primary"
            :disable="!validated.length"
            @click="approveRequests"
          >
            <span class="fa fa-check-circle"></span>
            <span>approve</span>
            <span class="badge badge-light">{{ validated.length }}</span>
          </button>
          <button
            class="btn btn-sm btn-secondary"
            :disable="!validated.length"
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
            <td><input type="checkbox" @click="selectRequest(item.id)" /></td>
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
import NoDataToShow from "../../../components/NoDataToShow.vue";
import TableComponent from "../../../components/TableComponent";
import { checkerSelect } from "../../../helpers/helpers";
import { httpCall } from "../../../helpers/http-service";
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
        title: "Pharmacy",
        name: "name"
      },
      {
        title: "type",
        name: 'type'
      },
      {
        title: 'Address',
        name: "address"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: 'District',
        name: 'district'
      },
      {
        title: 'Territory',
        name: 'territory'
      },
      {
        title: 'Region',
        name: 'region'
      }
    ]
  }),
  methods: {
    /**
     * get all requests
     */
    getRequests() {
      this.fetched = false;
      this.requests = [];
      httpCall
        .get("admin/v1/validation/pharmacies")
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.requests = data.data;
            this.fetched = true;
          });
        })
        .catch(err => {
          this.$toasted.error("Something went wrong", {
            icon: "sad"
          });
          console.log(err);
        });
    },
    /**
     * select requrest
     *
     * @param {int} id [requrest id]
     */
    selectRequest(id) {
      this.validated = checkerSelect(this.validated, id, event);
    },
    /**
     * select all requests
     *
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
     * toggle checkboxes
     *
     * @param {bool} check
     */
    toggleCheckboxes(check) {
      let inputs = document.querySelectorAll(
        '#validation-data input[type="checkbox"]'
      );
      inputs.forEach(input => (input.checked = check));
    },
    /**
     * approve requests
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
        this.$toasted.show("You must pick one request at least");
        return;
      }
      let request = {
        state: this.requestState,
        ids: JSON.stringify(this.validated),
        _method: "PUT"
      };
      httpCall
        .post("admin/v1/validation/pharmacies", request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.validated = [];
            this.requestState = null;
            this.getRequests();
          });
        })
        .catch(err => {
          console.log(err);
          this.$toasted.error(
            "Something went wrong when validate this requests",
            {
              icon: "sad"
            }
          );
        });
    }
  }
};
</script>

<style></style>
