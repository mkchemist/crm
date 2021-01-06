<template>
  <div class="p2">
    <div class="p-2">
      <div class="row mx-auto">
        <div class="col-lg-3 p-2 border rounded">
          <user-filter-box
            :users="reps"
            :data="$store.getters.allAmReports"
            :onFilter="onFilter"
            :onReset="onReset"
          />
          <date-filter-box
            :data="reports"
            :onFilter="onFilter"
            :onReset="onReset"
            :dateField="`date`"
          />
          <router-link to="/reports" class="btn btn-sm btn-dark btn-block">
            <span class="fa fa-chevron-circle-left"></span>
            <span>back</span>
          </router-link>
        </div>
        <div class="col-lg-9 px-0 shadow">
          <p class="alert alert-success">
            <span class="fa fa-book-reader"></span>
            <span class="font-weight-bold">View AM reports</span>
          </p>
          <div class="p-2" v-if="reports.length">
            <table-component :data="reports" :heads="heads" :unselectable="true" :headClass="`bg-success text-light`">
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
  </div>
</template>

<script>
import DateFilterBox from "../../../components/DateFilterBox.vue";
import NoDataToShow from "../../../components/NoDataToShow.vue";
import TableComponent from "../../../components/TableComponent.vue";
import UserFilterBox from "../../../components/UserFilterBox.vue";
import { ProductWithLader } from '../../../helpers/constants';
import { sortBy } from "../../../helpers/helpers";
export default {
  components: { NoDataToShow, TableComponent, UserFilterBox, DateFilterBox },
  mounted() {
    this.$store.dispatch("getAllAmReports");
  },
  computed: {
    reports() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$store.getters.allAmReports;
    },
    isReportsFetched() {
      return this.$store.getters.isAmReportsFetched;
    },
    dm() {
      return this.$store.getters.allDm;
    },
    areaManagers() {
      return this.$store.getters.allAreaManagers;
    },
    reps() {
      return sortBy(this.$store.getters.allReps, "name");
    },
    createHeads() {
      let heads = this.heads;
      let maxProductCount = 0;
      this.reports.map(report => {
        if(report.products.length >= maxProductCount) {
          maxProductCount = report.products.length
        }
      });
      return maxProductCount;
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
        title: "Workplace",
        name: "workplace"
      },
      {
        title: "Customer",
        name: "customer"
      },
      {
        title: "Specialty",
        name: "specialty"
      },
      ...ProductWithLader,
      {
        title: "Comment",
        name: "comment"
      },
      {
        title: "Feedback",
        name: "feedback"
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
      console.log(data)
      this.shouldRenderFilter = true;
      this.filteredList = [];
      let async = () => Promise.resolve(data);
      async().then(data => (this.filteredList = data));
    },
    onReset() {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      let async = () => Promise.resolve(this.$store.getters.allAmReports);

      async().then(data => this.filteredList = data);
    }
  }
};
</script>

<style></style>
