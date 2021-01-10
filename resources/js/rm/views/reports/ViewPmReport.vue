<template>
  <div class="row mx-auto p-2 pb-5">
    <div class="col-lg-3 p-2 border rounded">
      <user-filter-box :users="reps" :data="$store.getters.allPmReports" :onFilter="onFilter" :onReset="onReset" />
      <date-filter-box :data="reports" :onFilter="onFilter" :onReset="onReset" :dateField="`date`" />
      <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
        <span class="fa fa-chevron-circle-left"></span>
        <span>back</span>
      </router-link>
    </div>
    <div class="col-lg-9 px-0 shadow rounded">
      <p class="alert alert-success">
        <span class="fa fa-book-reader"></span>
        <span class="font-weight-bold">View PM Reports</span>
      </p>
      <div class="p-2">
        <div class="p-2 text-right">
        </div>
        <div v-if="reports.length">
          <table-component
            :heads="heads"
            :data="reports"
            :unselectable="true"
            :headClass="`bg-success text-light`"
          >
            <template v-slot:head:before>
              <th>Business Unit Manager</th>
              <th>Area Manager</th>
              <th>District Manager</th>
            </template>
            <template v-slot:body:before="{ item }">
              <td>{{ $store.state.UserModule.user.name }}</td>
              <td>{{ getRepAreaManager(item.user_id) }}</td>
              <td>{{ getRepManager(item.user_id) }}</td>
            </template>
          </table-component>
        </div>
        <div v-else-if="isReportsFetched">
          <no-data-to-show />
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import DateFilterBox from '../../../components/DateFilterBox.vue';
import NoDataToShow from "../../../components/NoDataToShow.vue";
import TableComponent from "../../../components/TableComponent.vue";
import UserFilterBox from '../../../components/UserFilterBox.vue';
import { ProductWithLader } from '../../../helpers/constants';
export default {
  components: {
    NoDataToShow,
    TableComponent,
    UserFilterBox ,
    DateFilterBox
  },
  mounted() {
   this.$store.dispatch("getAllPmReports");
  },
  computed: {
    reports() {
      if (this.shouldFilter) {
        return this.filteredReports;
      }
      return this.$store.getters.allPmReports;
    },
    isReportsFetched() {
      return this.$store.getters.isReportsFetched;
    },
    dm() {
      return this.$store.getters.allDm;
    },
    areaManagers() {
      return this.$store.getters.allAreaManagers;
    },
    reps() {
      return this.$store.getters.allReps
    }
  },
  data: () => ({
    filteredReports: [],
    shouldFilter: false,
    heads: [
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
        title: 'Plans',
        name: 'plans'
      },
      {
        title: 'Visits',
        name: 'reports'
      },
      {
        title: 'Diff',
        name: 'diff'
      },
      {
        title: 'Coach 1',
        name: 'coach1'
      },
      {
        title: 'Coach 2',
        name: 'coach2'
      },
      ...ProductWithLader,
      {
        title: 'Brick',
        name: 'birck'
      },
      {
        title: 'Area',
        name: 'area'
      },
      {
        title: 'District',
        name: 'district'
      },
      {
        title: 'Territory',
        name: 'territory'
      }
    ]
  }),
  methods: {
    getRepManager(id) {
      let manager = "-----------";
      this.dm.map(item => {
        let reps = JSON.parse(item.user_relations).reps;
        if (reps.includes(id)) {
          manager = item.name;
        }
      });
      return manager;
    },
    getRepAreaManager(id) {
      let manager = "-----------";
      this.areaManagers.map(item => {
        let reps = JSON.parse(item.user_relations).reps;
        if (reps.includes(id)) {
          manager = item.name;
        }
      });
      return manager;
    },
    onFilter(data) {
      console.log(data)
      this.shouldFilter = true;
      this.filteredReports = [];
      let async = () => Promise.resolve(data);
      async().then(data => this.filteredReports =data);
    },
    onReset() {
      let async = () => Promise.resolve(this.$store.getters.allPmReports);
      this.shouldFilter = true;
      this.filteredReports = [];
      async().then(data => this.filteredReports = data);
    }
  }
};
</script>

<style></style>
