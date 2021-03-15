<template>
  <div class="px-0 pb-5 shadow border">
    <p class="alert alert-success">
      <span class="fa fa-check-circle"></span>
      <span class="font-weight-bold">Pharmacy Validation</span>
    </p>
    <div class="p-2">
      <div class="form-group text-right" v-if="shouldRenderFilter&&!list.length">
        <button class="btn btn-sm skin-btn" @click="resetRequests" type="button">
          <span class="fa fa-redo"></span>
          <span>reset filter</span>
        </button>
      </div>
      <div v-if="list.length" id="validation-data">
        <div class="p-2 text-right">
          <button
            class="btn btn-sm skin-btn"
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
            <td><input type="checkbox" @click="selectRequest(item.id)" /></td>
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
      :onFilter="filterRequests"
      :onReset="resetRequests"
      :queryKeys="queryKeys"
      :queryOnly="false"
      :data="list"
    />
  </div>
</template>

<script>
import DataFilterBox from '../../../components/DataFilterBox.vue';
import NoDataToShow from "../../../components/NoDataToShow.vue";
import TableComponent from "../../../components/TableComponent";
import { checkerSelect } from "../../../helpers/helpers";
import { asyncDataFlow, httpCall } from "../../../helpers/http-service";
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
        return this.filteredList;
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
        title: "Pharmacy",
        name: "name"
      },
      {
        title: "Area",
        name: "area"
      },
      {
        title: "Rep",
        name: "rep"
      },
      {
        title: "Line",
        name: "line"
      },
      {
        title: "State",
        name: "state"
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
    ],
    queryKeys: [

      {
        title: "Rep",
        name: "rep"
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
        title: "State",
        name: "state"
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

    ],
    showFilterBox: false,
    shouldRenderFilter: false,
    filteredList: []
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
            data.data.forEach(item => {
              if(item.added_by) {
                item['line'] = JSON.parse(item.added_by.line).join(" | ");
                item['rep'] = item.added_by.name;
              } else {
                item['line'] = "not set";
                item['rep'] = "not set";
              }
            })
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
        this.validated = this.list.map(request => request.id);
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
    },
    openFilterBox() {
      this.showFilterBox = true;
    },
    closeFilterBox() {
      this.showFilterBox = false;
    },
    filterRequests(q, data) {
      this.filteredList = [];
        this.shouldRenderFilter = true;
      asyncDataFlow(data, data => {
        this.filteredList = data;
      });
    },
    resetRequests() {
      this.filteredList = [];
      asyncDataFlow([], () => {
        this.shouldRenderFilter = false;
      })
    }
  }
};
</script>

<style></style>
