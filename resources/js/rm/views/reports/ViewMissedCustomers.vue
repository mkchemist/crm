<template>
  <div class="p-2">
    <div class="row mx-auto">
      <!-- left side -->
      <div class="col-lg-3 border rounded">
        <div class="p-2">
          <!-- District Manager Selection -->
          <div class="form-group my-1">
            <label for="" class="text-muted small">District</label>
            <select
              name="district"
              id="district"
              class="form-control form-control-sm"
              v-model="selectedDistrict"
              @change="handleDistrictManagerChange"
            >
              <option :value="null">All</option>
              <option v-for="dm in districtManagers" :key="dm.id" :value="dm">{{
                dm.name
              }}</option>
            </select>
          </div>

          <!-- rep Selection -->
          <div class="form-group my-1">
            <label for="" class="text-muted small">Rep</label>
            <select
              name="rep"
              id="rep"
              class="form-control form-control-sm"
              v-model="selectedRep"
            >
              <option :value="null">All</option>
              <option v-for="rep in reps" :key="rep.id" :value="rep">{{
                rep.name
              }}</option>
            </select>
          </div>

          <!-- date selection -->
          <div class="form-group my-1">
            <label for="" class="text-muted small">From</label>
            <input
              type="date"
              name="date_from"
              id="date_from"
              class="form-control form-control-sm"
              v-model="startDate"
            />
          </div>
          <div class="form-group my-1">
            <label for="" class="text-muted small">To</label>
            <input
              type="date"
              name="date_to"
              id="date_to"
              class="form-control form-control-sm"
              v-model="endDate"
            />
          </div>

          <hr />

          <div class="form-group">
            <button
              class="btn btn-sm btn-block btn-primary"
              @click="fetchData"
              type="button"
            >
              <span class="fa fa-check-circle"></span>
              <span>Go</span>
            </button>
            <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
          </div>
        </div>
      </div>
      <!-- right side -->
      <div class="col-lg-9 shadow rounded px-0">
        <p class="alert alert-success">
          <span class="fa fa-book-reader"></span>
          <span class="font-weight-bold">View Missed Customers</span>
        </p>
        <div class="p-2">
          <div class="p-2 row mx-auto">
            <div class="col-lg">
              <user-filter-box
                :data="reports"
                :users="reps"
                :onFilter="onFilter"
                :onReset="onReset"
              />
            </div>
            <div class="col-lg">
              <div class="border small rounded p-2">
                <div class="form-group">
                  <label for="" class="">Status</label>
                  <select
                    name="view_status"
                    id="view_status"
                    class="form-control form-control-sm"
                    v-model="view_status"
                  >
                    <option value="all">All</option>
                    <option
                      :value="val"
                      v-for="(val, key) in status"
                      :key="`status_${key}`"
                      >{{ val }}</option
                    >
                  </select>
                </div>
                <div class="form-group text-right">
                  <button class="btn btn-sm btn-primary" @click="filterStatus">
                    <span class="fa fa-check-circle"></span>
                    <span>ok</span>
                  </button>
                  <button class="btn btn-sm btn-secondary" @click="resetStatus">
                    <span class="fa fa-reset"></span>
                    <span>reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="reports.length" class="p-2 border rounded">

            <data-table-component :data="reports" :cols="heads" />
          </div>
          <div
            v-else-if="!loadingStarted"
            class="py-5 text-center text-primary"
          >
            <p>Choose district manager and click Go</p>
            <span class="fa fa-download fa-4x"></span>
          </div>
          <div v-else-if="fetched">
            <no-data-to-show :title="`No missed customers`" />
          </div>
          <loader-component v-else></loader-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoDataToShow from "../../../components/NoDataToShow.vue";
import DataTableComponent from "../../../components/DataTableComponent.vue";
import UserFilterBox from "../../../components/UserFilterBox.vue";
import { sortBy } from "../../../helpers/helpers";
import { asyncDataFlow, httpCall } from "../../../helpers/http-service";
export default {
  mounted() {},
  components: { NoDataToShow, DataTableComponent, UserFilterBox },
  computed: {
    /* All reps */
    reps() {
      let data;
      if (this.selectedDistrict) {
        let reps = JSON.parse(this.selectedDistrict.user_relations).reps;
        data = this.$store.getters.allReps.filter(rep => reps.includes(rep.id));
      } else {
        data = this.$store.getters.allReps;
      }
      return sortBy(data, "name");
    },
    /* all district managers */
    districtManagers() {
      return sortBy(this.$store.getters.allDm, "name");
    },
    /* all area managers */
    areaManagers() {
      return this.$store.getters.allAreaManagers;
    },
    /* reports */
    reports() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.data;
    },
    bu() {
      return this.$store.getters.regionalManager;
    }
  },
  data: () => ({
    data: [],
    fetched: false,
    loadingStarted: false,
    shouldRenderFilter: false,
    filteredList: [],
    selectedDistrict: null,
    selectedRep: null,
    startDate: null,
    endDate: null,
    status: new Set(),
    view_status: "all",
    heads: [
      {
        title: "Business Unit",
        name: "BU"
      },
      {
        title: "Area Manager",
        name: "AM"
      },
      {
        title : "District Manager",
        name: "DM"
      },
      {
        title: "Rep",
        name: "rep_name"
      },
      {
        title: "Customer",
        name: "customer_name"
      },
      {
        title: "Specialty",
        name: "specialty"
      },
      {
        title: "Parameter",
        name: "parameter",
        fallback: "NN"
      },
      {
        title: "Frequency",
        name: "frequency",
        fallback: 0
      },
      {
        title: "Count Of plans",
        name: "count_of_plans"
      },
      {
        title: "Count Of Visits",
        name: "count_of_visits"
      },
      {
        title: "Difference",
        name: "difference"
      },
      {
        title: 'Status',
        name: 'status'
      },
      {
        title: 'Brick',
        name: 'brick'
      },
      {
        title: 'Area',
        name: 'area'
      },
      {
        title: 'District',
        name: 'district'
      }
    ]
  }),
  methods: {
    /**
     * fetching data from api
     *
     */
    fetchData() {
      let scheme = this.generateQueryScheme();
      this.shouldRenderFilter = false;
      this.filteredList = [];
      this.loadingStarted = true;
      this.data = [];
      this.fetched = false;
      httpCall
        .get("rm/v1/reports/missed-customers", scheme)
        .then(({ data }) => {
          data.data.forEach(item => {
            let { flag, style } = this.calculateStatus(item);
            item["status"] = flag;
            item["style"] = style;
            item["BU"] = this.getRepRegionalManagerName(item.user_id);
            item["AM"] = this.getAreaManager(item.user_id);
            item["DM"] = this.getDistrictManager(item.user_id);
            this.status.add(item["status"]);
          });
          this.data = data.data;
          this.fetched = true;
        })
        .catch(err => console.log(err));
    },
    /**
     * generate query scheme
     *
     * @return {mixed}
     */
    generateQueryScheme() {
      let users;
      if (!this.selectedDistrict) {
        users = null;
      } else if (this.selectedDistrict && !this.selectedRep) {
        users = JSON.parse(this.selectedDistrict.user_relations).reps;
      } else if (this.selectedDistrict && this.selectedRep) {
        users = [this.selectedRep.id];
      }
      return {
        users: JSON.stringify(users),
        start: this.startDate,
        end: this.endDate
      };
    },
    /**
     * reset selected rep when district manager changed
     */
    handleDistrictManagerChange() {
      this.selectedRep = null;
    },
    /**
     * get district manager of the given
     * rep id
     *
     * @param {int} id [rep id]
     * @return {string}
     */
    getDistrictManager(id) {
      let managerName = "--------";
      this.districtManagers.map(manager => {
        let reps = JSON.parse(manager.user_relations).reps;

        if (reps.includes(id)) {
          managerName = manager.name;
        }
      });
      return managerName;
    },
    /**
     * get area manager of the given rep
     *
     * @param {int} id [rep id]
     * @return {string}
     */
    getAreaManager(id) {
       if(this.$store.state.UserModule.user.role === 'am') {
        return this.$store.state.UserModule.user.name;
      }
      let managerName = "--------";
      this.areaManagers.map(manager => {
        let reps = JSON.parse(manager.user_relations).reps;

        if (reps.includes(id)) {
          managerName = manager.name;
        }
      });
      return managerName;
    },
     getRepRegionalManagerName(id) {
      if(this.$store.state.UserModule.user.role === 'rm') {
        return this.$store.state.UserModule.user.name;
      }
      let manager = "-----------";
      this.bu.map(item => {
        let reps = JSON.parse(item.user_relations).reps;
        if (reps.includes(id)) {
          manager = item.name;
        }
      });
      return manager;
    },
    /**
     * handle data filter
     *
     * @param {array} data [filtered data]
     */
    onFilter(data) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      this.view_status = "all";

      asyncDataFlow(data, data => (this.filteredList = data));
      /*  let asyncDataFlow = () => Promise.resolve(data);
      asyncDataFlow().then(data => (this.filteredList = data)); */
    },
    /**
     * handle reset
     */
    onReset() {
      this.filteredList = [];
      /* let asyncDataFlow = () => Promise.resolve(this.data);
      asyncDataFlow().then(data => (this.filteredList = data)); */
      asyncDataFlow(this.data, data => (this.filteredList = data));
    },
    calculateStatus(item) {
      let flag, style;
      if (item.difference > 0 && item.difference === item.count_of_plans) {
        flag = "Uncovered";
        style = "bg-danger text-light";
      } else if (
        item.difference > 0 &&
        item.difference !== item.count_of_plans
      ) {
        flag = "Missed";
        style = "bg-warning text-dark";
      } else if (item.difference === 0) {
        flag = "Accomplished";
        style = "bg-success text-light";
      } else {
        flag = "Over";
        style = "bg-primary text-light";
      }
      return {
        flag,
        style
      };
    },
    filterStatus() {
      let data;
      if (this.view_status === "all") {
        data = this.data;
      } else {
        data = this.data.filter(report => report.status === this.view_status);
      }
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(data, data => (this.filteredList = data));
    },
    resetStatus() {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      this.view_status = "all";
      asyncDataFlow(this.data, data => (this.filteredList = data));
    }
  }
};
</script>

<style></style>
