<template>
  <div class="p-0 shadow rounded">
    <p class="alert alert-success">
      <span><i class="fa fa-check-circle"></i></span>
      <span class="font-weight-bold">New workplace Validation</span>
    </p>
    <div class="p-2">
      <div v-if="list.length" id="validation-data">
        <div class="p-2 text-right">
          <button
            class="btn skin-btn btn-sm"
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
          :data="list"
          :heads="heads"
          head-class="skin-table"
          :unselectable="true"
          :buttons="buttons"
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
    <data-filter-box
      :show="showFilterBox"
      :onClose="closeFilterBox"
      :onFilter="onFilterRequests"
      :onReset="onResetList"
      :data="list"
      :queryKeys="queryKeys"
      :queryOnly="false"
    />
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import NoDataToShow from "../../../components/NoDataToShow";
import { asyncDataFlow, httpCall } from "../../../helpers/http-service";
import { checkerSelect } from "../../../helpers/helpers";
import DataFilterBox from '../../../components/DataFilterBox.vue';
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
      if(this.shouldRenderFilter) {
        return this.filteredList
      }
      return this.requests;
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
        title : "State",
        name: "state"
      },
      {
        title: "Workplace",
        name: "name"
      },
      {
        title: "Added By",
        name: "added_by.name"
      },
      {
        title : "Line",
        name: "added_by.line"
      },
      {
        title: "Area",
        name: "area"
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
    ],
     queryKeys: [
      {
        title : "State",
        name: "state"
      },

      {
        title: "Added By",
        name: "added_by.name"
      },
      {
        title : "Line",
        name: "added_by.line"
      },
      {
        title: "Area",
        name: "area"
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

    ],
    showFilterBox: false,
    shouldRenderFilter: false,
    filteredList: [],

  }),
  methods: {
    getRequests() {
      this.requests = [];
      this.fetched = false;
      httpCall
        .get("admin/v1/validation/workplaces")
        .then(({ data }) => {
          this.handleResponse(data, data => {
            data.data.forEach(item => {
              if(item.added_by) {
                item.added_by.line = JSON.parse(item.added_by.line).join(" | ")
              }
            })
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
        this.validated = this.list.map(request => request.id);
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
      this.sendRequests();
    },
    rejectRequests() {
      this.requestState = "rejected";

      this.sendRequests();
    },
    sendRequests() {
      if (!this.validated.length) {
        this.$toasted.show("You must pick one request at least");
        return;
      }
      let request = {
        _method: "PUT",
        ids: JSON.stringify(this.validated),
        state: this.requestState
      };
      console.log(request, this.requestState);
      httpCall
        .post("admin/v1/validation/workplaces", request)
        .then(({ data }) => {
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
    },
    openFilterBox(){
      this.showFilterBox = true;
    },
    closeFilterBox(){
      this.showFilterBox = false;
    },
    onFilterRequests(q,d) {
        this.filteredList = [];
        this.shouldRenderFilter = true;
      asyncDataFlow(d, d => {
        this.filteredList = d;
      });
    },
    onResetList(){
      this.filteredList = [];
      asyncDataFlow([], d => {
        this.filteredList = d;
        this.shouldRenderFilter = false;
      });
    }
  }
};
</script>

<style></style>
