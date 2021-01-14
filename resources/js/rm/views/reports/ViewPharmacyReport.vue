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
            <table-component
              :data="reports"
              :heads="heads"
              :headClass="`bg-success text-light`"
              :unselectable="true"
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
import TableComponent from "../../../components/TableComponent.vue";
import UserFilterBox from "../../../components/UserFilterBox.vue";
import { ProductWithRate } from "../../../helpers/constants";
export default {
  components: { UserFilterBox, DateFilterBox, NoDataToShow, TableComponent },
  mounted() {
    this.$store.dispatch("getAllPharmacyReports");
  },
  computed: {
    reports() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$store.getters.allPharmacyReports;
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
    }
  },
  data: () => ({
    shouldRenderFilter: false,
    filteredList: [],
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
