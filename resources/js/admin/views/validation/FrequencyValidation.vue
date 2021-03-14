<template>
  <div class="px-0 shadow pb-5">
    <p class="alert alert-success">
      <span class="fa fa-check-circle"></span>
      <span class="font-weight-bold">Frequency Validation Requests</span>
    </p>
    <div class="p-2 pb-5 my-1">
      <div v-if="list.length" id="validation-data">
        <div class="p-2 text-right">
          <button
            class="btn btn-sm skin-btn"
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
          :data="list"
          :heads="heads"
          head-class="skin-table"
          :unselectable="true"
          :buttons="buttons"
        >
          <template v-slot:head:before>
            <th>
              <input type="checkbox" @click="selectAll" />
            </th>
          </template>
          <template v-slot:body:before="{ item }">
            <td>
              <input
                type="checkbox"
                @click="selectRequest(item.id)"
                :checked="validated.includes(item.id)"
              />
            </td>
          </template>
        </table-component>
      </div>
      <div v-else-if="fetched">
        <no-data-to-show :title="`No waiting requests`" />
      </div>
      <loader-component v-else></loader-component>
    </div>
    <data-filter-box
      :show="showFilterBox"
      :onClose="closeFilterBox"
      :queryKeys="queryKeys"
      :queryOnly="false"
      :onFilter="onFilterRequests"
      :onReset="onResetRequests"
      :data="list"
    />
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import DataFilterBox from "../../../components/DataFilterBox.vue";
import NoDataToShow from "../../../components/NoDataToShow";
import { asyncDataFlow, httpCall } from "../../../helpers/http-service";
import { checkerSelect } from "../../../helpers/helpers";
export default {
  mounted() {
    this.getRequests();
  },
  components: {
    TableComponent,
    NoDataToShow,
    DataFilterBox
  },
  computed: {
    list() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.requests;
    },
    dms() {
      return this.$store.getters.dms;
    },
    rms() {
      return this.$store.getters.rms;
    },
    ams() {
      return this.$store.getters.ams;
    },
    buttons() {
      return [
        {
          text: `<i class="fa fa-filter"></i> Filter`,
          action: () => this.openFilterBox()
        }
      ];
    }
  },
  data: () => ({
    requests: [],
    fetched: false,
    validated: [],
    requestState: null,
    heads: [
      {
        title: "Customer",
        name: "customer"
      },
      {
        title: "Area",
        name: "area"
      },
      {
        title: "Businees Unit",
        name: "bu"
      },
      {
        title: "Area Manager",
        name: "am"
      },
      {
        title: "Supervisor",
        name: "dm"
      },
      {
        title: "Rep",
        name: "user"
      },
      {
        title: "Line",
        name: "line"
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
    ],
    queryKeys: [
      {
        title: "Businees Unit",
        name: "bu"
      },
      {
        title: "Area Manager",
        name: "am"
      },
      {
        title: "Supervisor",
        name: "dm"
      },
      {
        title: "Rep",
        name: "user"
      },
      {
        title: "Line",
        name: "line"
      },
      {
        title: "Area",
        name: "area"
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
      }
    ],
    showFilterBox: false,
    shouldRenderFilter: false,
    filteredList: []
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
            data.data.forEach(item => {
              item["bu"] = this.getRepRegionalManager(item.user_id);
              item["am"] = this.getRepAreaManager(item.user_id);
              item["dm"] = this.getRepManager(item.user_id);
              item["state"] =
                item.state === false && item.approval === true
                  ? "rejected"
                  : "Requested";
              item["line"] = item.line.join(" | ");
            });
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
        this.validated = this.list.map(request => request.id);
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
          });
        })
        .catch(err => {
          console.log(err);
          this.$toasted.error("Something went wrong", {
            icon: "exclamation",
            duration: ""
          });
        });
    },
    getRepManager(id) {
      let manager = "-------";
      this.dms.map(user => {
        let reps = user.relations.reps;
        if (reps.includes(id)) {
          manager = user.name;
        }
      });
      return manager;
    },
    getRepAreaManager(id) {
      let manager = "-------";
      this.ams.map(user => {
        let reps = user.relations.reps;
        if (reps.includes(id)) {
          manager = user.name;
        }
      });
      return manager;
    },
    getRepRegionalManager(id) {
      let manager = "-------";
      this.rms.map(user => {
        let reps = user.relations.reps;
        if (reps.includes(id)) {
          manager = user.name;
        }
      });
      return manager;
    },
    onFilterRequests(q, d) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(d, d => {
        this.filteredList = d;
      });
    },
    onResetRequests() {
      this.filteredList = [];
      asyncDataFlow([], d => {
        this.filteredList = d;
        this.shouldRenderFilter = false;
      });
    },
    openFilterBox() {
      this.showFilterBox = true;
    },
    closeFilterBox() {
      this.showFilterBox = false;
    }
  }
};
</script>

<style></style>
