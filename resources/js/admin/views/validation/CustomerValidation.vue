<template>
  <div class="my-2 px-0 shadow pb-5">
    <p class="alert alert-success">
      <span><i class="fa fa-check-circle"></i></span>
      <span class="font-weight-bold">Validate customers details</span>
    </p>
    <div class="p-2 pb-5">
      <div class="form-group text-right" v-if="!list.length && shouldRenderFilter">
        <button class="btn btn-sm skin-btn" @click="onResetRequests">
          <span class="fa fa-redo"></span>
          <span>Reset</span>
        </button>
      </div>
      <div v-if="list.length" id="validation-data">
        <div class="p-2 my-1 text-right">
          <button
            class="btn btn-sm btn-info"
            @click="getAllRequests"
          >
            <span class="fa fa-redo"></span>
            <span>refresh list</span>
          </button>
          <button
            class="btn btn-sm skin-btn"
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
          :data="list"
          :orderBy="`Customer,asc`"
          head-class="skin-table"
          :unselectable="true"
          :buttons="buttons"

        >
          <template v-slot:head:before>
            <th>
              <input type="checkbox" @click="selectAllRequests" />
            </th>

          </template>
          <template v-slot:body:before="{ item }">
            <td>
              <input
                type="checkbox"
                @click="selectRequest(item.id)"
                :disabled="item.state === false && item.approval === true"
                :checked="validated.includes(item.id)"
              />
            </td>

          </template>
        </table-component>
      </div>
      <div v-else-if="fetched" class="text-center">
        <no-data-to-show title="No waiting response"/>
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
import { asyncDataFlow, httpCall } from "../../../helpers/http-service";
import TableComponent from "../../../components/TableComponent";
import { checkerSelect } from "../../../helpers/helpers";
import NoDataToShow from "../../../components/NoDataToShow";
import DataFilterBox from '../../../components/DataFilterBox.vue';
export default {
  async mounted() {
    await this.getAllRequests();
  },
  components: {
    TableComponent,
    NoDataToShow,
    DataFilterBox
  },
  computed: {
    list() {
      if(this.shouldRenderFilter) {
        return this.filteredList
      }
      return this.requests;
    },
    dms() {
      return this.$store.getters.dms
    },
    rms() {
      return this.$store.getters.rms
    },
    ams(){
      return this.$store.getters.ams
    },
    buttons() {
      return [
        {
          text: `<i class="fa fa-filter"></i> Filter`,
          action: () => this.openFilterBox()
        }
      ]
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
        title : "State",
        name: "state"
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
        title: "To Address",
        name: "new_address"
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
            data.data.forEach(item => {
              item['bu'] = this.getRepRegionalManager(item.user_id);
              item['am'] = this.getRepAreaManager(item.user_id);
              item['dm'] = this.getRepManager(item.user_id);
              item['state'] = item.state === false && item.approval === true
                  ? "rejected"
                  : "Requested"
              item["line"] = item.line.join(" | ")
            })
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
        this.list.map(request => {
          if (request.approval === false && request.state === "Requested") {
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
    },
    getRepManager(id) {
      let manager ="-------";
      this.dms.map(user => {
        let reps =user.relations.reps;
        if(reps.includes(id)) {
          manager = user.name;
        }
      })
      return manager;
    },
    getRepAreaManager(id) {
      let manager ="-------";
      this.ams.map(user => {
        let reps =user.relations.reps;
        if(reps.includes(id)) {
          manager = user.name;
        }
      })
      return manager;
    },
    getRepRegionalManager(id) {
      let manager ="-------";
      this.rms.map(user => {
        let reps =user.relations.reps;
        if(reps.includes(id)) {
          manager = user.name;
        }
      })
      return manager;
    },
    onFilterRequests(q,d) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(d, d => {
        this.filteredList = d;
      })
    },
    onResetRequests() {
      this.filteredList = [];
      asyncDataFlow([], d => {
        this.filteredList = d;
        this.shouldRenderFilter = false;
      })
    },
    openFilterBox(){
      this.showFilterBox = true;
    },
    closeFilterBox(){
      this.showFilterBox = false;
    }
  }
};
</script>

<style></style>
