<template>
  <div class="row mx-auto">
    <div class="col-lg-3 border p-2 rounded">
      <user-filter-box
        :users="[]"
        :data="[]"
        :onFilter="onFilter"
        :onReset="onReset"
        :userField="`user_id`"
      />
      <date-filter-box
        :data="[]"
        :onFilter="onFilter"
        :onReset="onReset"
        :dateField="'visit_date'"
      />
    </div>
    <div class="col-lg-9 px-0 shadow rounded pb-5 mb-5">
      <p class="alert alert-success">
        <span class="fa fa-book-reader"></span>
        <span class="font-weight-bold">Missed visits</span>
      </p>
      <div class="p-2">
        <div class="form-inline">
          <label for="" class="text-muted">Business unit :</label>
          <select
            name="rm"
            id="rm"
            class="form-control form-control-sm col mx-1"
            v-model="manager"
          >
            <option :value="null">All</option>
            <option
              v-for="manager in territoryManagers"
              :key="manager.id"
              :value="manager"
              >{{ manager.name }}</option
            >
          </select>
          <button class="btn btn-sm btn-primary mx-1" @click="getReports">
            <span class="fa fa-check-circle"></span>
            <span>ok</span>
          </button>
        </div>
      </div>
      <div class="p-2">
        <div v-if="reports.length">
          <table-component
            :heads="heads"
            :data="reports"
            :unselectable="true"
            :headClass="`bg-success text-light`"
          >
            <template v-slot:head:before>
              <th>Regional</th>
              <th>Area Manager</th>
              <th>District Manager</th>
            </template>
            <template v-slot:body:before="{item}">
              <th>{{ getRegionalManagerName(item.user_id) }}</th>
              <th>{{ getAreaManagerName(item.user_id) }}</th>
              <th>{{ getDistrictManagerName(item.user_id) }}</th>
            </template>
          </table-component>
        </div>
        <div v-else-if="!isLoaded">
          <div
            style="height:300px"
            class="d-flex flex-column align-items-center justify-content-center"
          >
            <p class="lead text-primary">
              Select Business unit manager to view missed visits
            </p>
            <span class="fa fa-download fa-4x text-primary"></span>
          </div>
        </div>
        <div v-else-if="isReportsFetched"></div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import DateFilterBox from "../../../components/DateFilterBox.vue";
import TableComponent from "../../../components/TableComponent.vue";
import UserFilterBox from "../../../components/UserFilterBox.vue";
import { sortBy } from "../../../helpers/helpers";
import { httpCall } from "../../../helpers/http-service";
export default {
  components: {
    UserFilterBox,
    DateFilterBox,
    TableComponent
  },
  mounted() {},
  computed: {
    territoryManagers() {
      return sortBy(this.$store.getters.rms, "name");
    },
    dms() {
      return this.$store.getters.dms;
    },
    ams() {
      return sortBy(this.$store.getters.ams, 'name');
    }
  },
  data: () => ({
    reports: [],
    isReportsFetched: false,
    isLoaded: false,
    manager: null,
    heads: [
      {
        title: "Rep",
        name: "Rep"
      },
      {
        title: "Date",
        name: "Date"
      },
      {
        title: "Customer",
        name: "Customer"
      },
      {
        title: "Specialty",
        name: "Specialty"
      },
      {
        title :'Frequency',
        name: 'Freq'
      },
      {
        title: 'Parameter',
        name: 'Parameter'
      },
      {
        title: 'Count Of Plans',
        name: 'countOfPlans'
      },
      {
        title: 'Count Of Visits',
        name: 'countOfVisits'
      },
      {
        title: 'Status',
        name: 'VisitDate',
        fallback: 'Missed'
      },
      {
        title: "Brick",
        name: "Brick"
      },
      {
        title: "Area",
        name: "Area"
      },
      {
        title: 'District',
        name:'District'
      },
      {
        title: 'Territory',
        name: 'Territory'
      }
    ]
  }),
  methods: {
    getReports() {
      /* if (!this.manager) {
        this.$toasted.show("Select Business unit first");
        return;
      } */
      let user = this.manager ? this.manager.id : null;
      let query = { user };
      this.isLoaded = true;
      this.reports = [];
      this.isReportsFetched = false;
      httpCall
        .get("admin/v1/reports/missed", query)
        .then(({ data }) => {
          this.reports = data.data;
          this.isReportsFetched = true;
        })
        .catch(err => console.log(err));
    },
    getRegionalManagerName(id) {
      if(this.manger) {
        return this.manager.name;
      }
      let manager = '---------';
      this.territoryManagers.map(user => {
        let reps =  user.relations.reps;
        if(reps.includes(id)) {
          manager = user.name;
        }
      });
      return manager;
    },
    getAreaManagerName(id){
      let manager = '---------';
      this.ams.map(user => {
        let reps =  user.relations.reps;
        if(reps.includes(id)) {
          manager = user.name;
        }
      });
      return manager;
    },
    getDistrictManagerName(id) {
      let manager = '---------';
      this.dms.map(user => {
        let reps =  user.relations.reps;
        if(reps.includes(id)) {
          manager = user.name;
        }
      });
      return manager;
    },
    onFilter() {},
    onReset() {}
  }
};
</script>

<style></style>
