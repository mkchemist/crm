<template>
  <div class="row mx-auto">
    <!-- left side -->
    <div class="col-lg-3 border rounded p-2">
      <div class="border rounded p-2">
        <div class="form-group">
          <label for="district" class="text-muted small"
            >District Manager</label
          >
          <select
            name="district"
            id="district"
            class="form-control form-control-sm"
            v-model="district"
          >
            <option :value="null">All</option>
            <option :value="dm" v-for="dm in districtManagers" :key="dm.id">{{
              dm.name
            }}</option>
          </select>
        </div>
      </div>
      <button class="btn btn-sm btn-block btn-primary mt-2 " @click="fetchData">
        <span class="fa fa-check-circle"></span>
        <span>GO</span>
      </button>
      <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
        <span class="fa fa-chevron-circle-left"></span>
        <span>back</span>
      </router-link>
    </div>
    <!-- right side -->
    <div class="col-lg-9 px-0 shadow rounded">
      <p class="alert alert-success">
        <span class="fa fa-book-reader"></span>
        <span class="font-weight-bold">View Coach Reports</span>
      </p>
      <!-- district manager selection -->
      <div class="p-2">
        <user-filter-box
          :users="reps"
          :data="data"
          :onFilter="onFilter"
          :onReset="onReset"
          :userField="`rep_id`"
        />
        <date-filter-box
          :data="reports"
          :onFilter="onFilter"
          :onReset="onReset"
          :dateField="`date`"
        />
      </div>
      <div class="p-2">
        <div class="p-2" v-if="reports.length">
          <table-component
            :data="reports"
            :heads="heads"
            :unselectable="true"
            :headClass="`bg-success text-light`"
            :orderBy="`Date|Customer`"
          >
          <template v-slot:head:before>
            <th>Action</th>
          </template>
          <template v-slot:body:before="{item}">
            <td>
              <router-link :to="`/reports/read/coach-report/${item.id}`" class="btn btn-sm btn-primary">
                <span class="fa fa-eye"></span>
              </router-link>
            </td>
          </template>
          </table-component>
        </div>
        <div v-else-if="!loadingStarted" class="py-5 text-center text-primary">
          <p>Click Go to start downloading reports</p>
          <span class="fa fa-download fa-4x"></span>
        </div>
        <div v-else-if="fetched">
          <no-data-to-show />
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import DateFilterBox from "../../../components/DateFilterBox.vue";
import NoDataToShow from "../../../components/NoDataToShow.vue";
import TableComponent from "../../../components/TableComponent.vue";
import UserFilterBox from "../../../components/UserFilterBox.vue";
import { sortBy } from "../../../helpers/helpers";
import { httpCall } from "../../../helpers/http-service";
export default {
  components: { UserFilterBox, TableComponent, NoDataToShow, DateFilterBox },
  mounted() {},
  computed: {
    districtManagers() {
      return this.$store.getters.allDm;
    },
    reps() {
      let reps = this.$store.getters.allReps;
      if (this.district) {
        reps = reps.filter(rep => {
          let districtReps = JSON.parse(this.district.user_relations).reps;
          return districtReps.includes(rep.id);
        });
      }
      return sortBy(reps, "name");
    },
    reports() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.data;
    }
  },
  data: () => ({
    district: null,
    data: [],
    fetched: false,
    loadingStarted: false,
    shouldRenderFilter: false,
    filteredList: [],
    heads: [
      {
        title: "Coach",
        name: "coach"
      },
      {
        title: "Rep",
        name: "rep"
      },
      {
        title: "Date",
        name: "date"
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
        title: "Parameter",
        name: "parameter"
      },
      {
        title: "Frequency",
        name: "frequency"
      },
      {
        title: "Submitted",
        name: "submitted"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "Area",
        name: "area"
      },
      {
        title: "District",
        name: "district"
      }
    ]
  }),
  methods: {
    fetchData() {
      let query = this.createFetchQuery();
      this.data = [];
      this.fetched = false;
      this.loadingStarted = true;
      this.filteredList = [];
      this.shouldRenderFilter = false;
      httpCall
        .get("rm/v1/reports/coach-reports", query)
        .then(({ data }) => {
          this.data = data.data;
          this.fetched = true;
        })
        .catch(err => console.log(err));
    },
    createFetchQuery() {
      let user = null,
        start = null,
        end = null;
      if (this.district) {
        user = this.district.id;
      }
      return {
        user
      };
    },
    onFilter(data) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      let asyncDataFlow = () => Promise.resolve(data);
      asyncDataFlow().then(data => (this.filteredList = data));
    },
    onReset() {
      this.filteredList = [];
      let asyncDataFlow = () => Promise.resolve(this.data);
      asyncDataFlow().then(data => (this.filteredList = data));
    }
  }
};
</script>

<style></style>
