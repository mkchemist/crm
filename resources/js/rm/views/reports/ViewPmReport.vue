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

          <data-table-component :data="reports" :cols="heads" />
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
import DataTableComponent from "../../../components/DataTableComponent.vue";
import UserFilterBox from '../../../components/UserFilterBox.vue';
import { ProductWithLader } from '../../../helpers/constants';
export default {
  components: {
    NoDataToShow,
    DataTableComponent,
    UserFilterBox ,
    DateFilterBox
  },
  mounted() {
   this.$store.dispatch("getAllPmReports");
  },
  computed: {
    reportData(){
      let reports = this.$store.getters.allPmReports;
      reports.forEach(report => {
        report['BU'] = this.getRepRegionalManagerName(report.user_id);
        report['AM'] = this.getRepAreaManager(report.user_id);
        report['DM'] = this.getRepManager(report.user_id);
      });
      return reports;
    },
    reports() {
      if (this.shouldFilter) {
        return this.filteredReports;
      }
      return this.reportData;
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
    },
    bu() {
      return this.$store.getters.regionalManager;
    }
  },
  data: () => ({
    filteredReports: [],
    shouldFilter: false,
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
        title: 'Comment',
        name: 'comment'
      },
      {
        title: 'Feedback',
        name: "feedback"
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
      if(this.$store.state.UserModule.user.role === 'am') {
        return this.$store.state.UserModule.user.name;
      }
      let manager = "-----------";
      this.areaManagers.map(item => {
        let reps = JSON.parse(item.user_relations).reps;
        if (reps.includes(id)) {
          manager = item.name;
        }
      });
      return manager;
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
    onFilter(data) {
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
