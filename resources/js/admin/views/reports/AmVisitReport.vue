<template>
  <div class="row mx-auto">
    <div class="col-lg-3 border rounded">
      <user-filter-box
        :users="reps"
        :data="data"
        :onFilter="onFilter"
        :onReset="onReset"
      />
      <date-filter-box
        :data="reports"
        :onFilter="onFilter"
        :onReset="onReset"
        :dateField="`visit_date`"
      />
      <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
        <span class="fa fa-chevron-circle-left"></span>
        <span>back</span>
      </router-link>
    </div>
    <div class="col-lg-9 px-0 shadow">
      <p class="alert alert-success">
        <span class="fa fa-book-reader"></span>
        <span class="font-weight-bold">View AM reports</span>
      </p>
      <div class="p-2">
        <!-- Regional manager dropdown -->
        <div class="form-inline">
          <label for="" class="text-muted">Business Unit :</label>
          <select
            name="rm"
            id="rms"
            v-model="manager"
            class="form-control form-control-sm col-lg mx-2"
            :disabled="!rms.length"
          >
            <option :value="null">All</option>
            <option v-for="rm in rms" :key="rm.id" :value="rm">{{
              rm.name
            }}</option>
          </select>
          <button class="btn btn-sm btn-primary" @click="getReports">
            <span class="fa fa-check-circle"></span>
            <span>ok</span>
          </button>
        </div>

        <!-- data view -->
        <div class="p-2">
          <div v-if="reports.length">
            <data-table-component
              :cols="heads"
              :data="reports"
              :selectable="false"
            >

            </data-table-component>
          </div>
          <div v-else-if="!loadingStarted">
            <div
              style="height:300px"
              class="d-flex flex-column align-items-center justify-content-center"
            >
              <p class="lead text-primary">
                Select Business unit manager to view PM visits
              </p>
              <span class="fa fa-download fa-4x text-primary"></span>
            </div>
          </div>
          <div v-else-if="isDataFetched">
            <no-data-to-show />
          </div>
          <loader-component v-else></loader-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateFilterBox from "../../../components/DateFilterBox.vue";
import NoDataToShow from "../../../components/NoDataToShow.vue";
import DataTableComponent from "../../../components/DataTableComponent.vue";
import UserFilterBox from "../../../components/UserFilterBox.vue";
import { ProductWithLader } from "../../../helpers/constants";
import { sortBy } from "../../../helpers/helpers";
import { httpCall } from "../../../helpers/http-service";
export default {
  components: { NoDataToShow, DataTableComponent, UserFilterBox, DateFilterBox },
  mounted() {},
  computed: {
    rms() {
      return sortBy(this.$store.getters.rms, "name");
    },
    ams() {
      return this.$store.getters.ams;
    },
    reps() {
      if (this.manager) {
        return sortBy(
          this.$store.getters.reps.filter(rep =>
            this.manager.relations.reps.includes(rep.id)
          ),
          "name"
        );
      }
      return sortBy(this.$store.getters.reps, "name");
    },
    dms() {
      return this.$store.getters.dms;
    },
    reports() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.data;
    },
    heads() {
      return [
        {
          title: "Business Unit",
          name: row => this.getRm(row.user_id)
        },
        {
          title: "Area Manager",
          name: row => this.getAm(row.user_id)
        },
        {
          title: "District Manager",
          name: row => this.getDm(row.user_id)
        },
      {
        title: "Rep",
        name: "rep"
      },
      {
        title: "Date",
        name: "visit_date"
      },
      {
        title: "Workplace",
        name: "workplace"
      },
      {
        title: "Workplace Type",
        name: "type"
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
        title: 'Comment',
        name: 'comment'
      },
      {
        title: 'Feedback',
        name: 'feedback'
      },
      ...ProductWithLader,
      {
        title: "Address",
        name: "address"
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
      },
      {
        title: "Territory",
        name: "territory"
      }
    ]
    }
  },
  data: () => ({
    manager: null,
    data: [],
    isDataFetched: false,
    loadingStarted: false,
    shouldRenderFilter: false,
    filteredList: [],
  }),
  methods: {
    getReports() {
      let user = this.manager ? this.manager.id : null;
      this.data = [];
      this.isDataFetched = false;
      this.shouldRenderFilter = false;
      this.loadingStarted = true;
      httpCall
        .get("admin/v1/reports/am", { user })
        .then(({ data }) => {
          this.data = data.data;
          this.isDataFetched = true;
        })
        .catch(err => console.log(err));
    },
    getRm(id) {
      if (this.manager) {
        return this.manager.name;
      }
      let manager = "-------";
      this.rms.map(user => {
        let reps = user.relations.reps;
        if (reps && reps.includes(id)) {
          manager = user.name;
        }
      });
      return manager;
    },
    getAm(id) {
      let manager = "-------";
      this.ams.map(user => {
        let reps = user.relations.reps;
        if (reps && reps.includes(id)) {
          manager = user.name;
        }
      });
      return manager;
    },
    getDm(id) {
      let manager = "-------";
      this.dms.map(user => {
        let reps = user.relations.reps;
        if (reps && reps.includes(id)) {
          manager = user.name;
        }
      });
      return manager;
    },
    onFilter(data) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      let async = () => Promise.resolve(data);
      async().then(data => (this.filteredList = data));
    },
    onReset() {
      this.filteredList = [];
      let async = () => Promise.resolve(this.data);
      async().then(data => (this.filteredList = data));
    }
  }
};
</script>

<style></style>
