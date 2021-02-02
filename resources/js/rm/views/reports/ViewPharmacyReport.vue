<template>
  <div class="p-2">
    <div class="row mx-auto">
      <div class="col-lg-3 rounded border p-2">
        <user-filter-box
          :users="reps"
          :data="$store.getters.allPharmacyReports"
          :onFilter="onFilter"
          :onReset="onReset"
        />
        <date-filter-box
          :data="reports"
          :onFilter="onFilter"
          :onReset="onReset"
          :dateField="`date`"
        />
        <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
          <span class="fa fa-chevron-circle-left"></span>
          <span>back</span>
        </router-link>
      </div>
      <div class="col-lg-9 px-0 shadow rounded">
        <p class="alert alert-success">
          <span class="fa fa-book-reader"></span>
          <span class="font-weight-bold">View Pharmacy Reports</span>
        </p>
        <div class="p-2">
          <div class="p-2" v-if="reports.length">
            <data-table-component
              :data="reports"
              :cols="heads"
            >
            </data-table-component>
          </div>
          <div class="p-2" v-else-if="isReportsFetched">
            <no-data-to-show :title="`No Reports found`" />
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
import { ProductWithRate } from "../../../helpers/constants";
export default {
  components: { UserFilterBox, DateFilterBox, NoDataToShow, DataTableComponent },
  mounted() {
    this.$store.dispatch("getAllPharmacyReports");
  },
  computed: {
    reportData(){
      let reports = this.$store.getters.allPharmacyReports;
      reports.forEach(report => {
        report['BU'] = this.getRepRegionalManagerName(report.user_id);
        report['AM'] = this.getRepAreaManager(report.user_id);
        report['DM'] = this.getRepManager(report.user_id);
      });
      return reports;
    },
    reports() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.reportData;
    },
    isReportsFetched() {
      return this.$store.getters.isPharmacyReportsFetched;
    },
    reps() {
      return this.$store.getters.allReps;
    },
    dm() {
      return this.$store.getters.allDm;
    },
    areaManagers() {
      return this.$store.getters.allAreaManagers;
    },
    bu() {
      return this.$store.getters.regionalManager;
    }
  },
  data: () => ({
    shouldRenderFilter: false,
    filteredList: [],
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
        title: "Pharmacy",
        name: "pharmacy"
      },
      {
        title: "Type",
        name: "type"
      },
      {
        title: "Key Person",
        name: "key_person"
      },
      ...ProductWithRate,
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
      console.log(data);
      this.shouldRenderFilter = true;
      this.filteredList = [];
      let async = () => Promise.resolve(data);
      async().then(data => (this.filteredList = data));
    },
    onReset() {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      let async = () => Promise.resolve(this.$store.getters.allPharmacyReports);

      async().then(data => (this.filteredList = data));
    }
  }
};
</script>

<style></style>
