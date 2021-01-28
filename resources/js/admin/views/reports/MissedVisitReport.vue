<template>
  <div class="row mx-auto">
    <div class="col-lg-3 border p-2 rounded">
      <user-filter-box
        :users="reps"
        :data="reports"
        :onFilter="onFilter"
        :onReset="onReset"
        :userField="`user_id`"
      />
      <date-filter-box
        :data="reportsData"
        :onFilter="onFilter"
        :onReset="onReset"
        :dateField="'Date'"
      />
      <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
        <span class="fa fa-chevron-circle-left"></span>
        <span>back</span>
      </router-link>
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
        <div v-if="reportsData.length">
          <data-table-component
            :cols="heads"
            :data="reportsData"
            :tableHeadClass="`bg-success text-light`"
            :notSearchCols="[]"
          >
          </data-table-component>
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
        <div v-else-if="isReportsFetched">
          <no-data-to-show :title="`No Missed Doctors`"/>
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import DateFilterBox from "../../../components/DateFilterBox.vue";
import NoDataToShow from '../../../components/NoDataToShow.vue';
import DataTableComponent from "../../../components/DataTableComponent.vue";
import UserFilterBox from "../../../components/UserFilterBox.vue";
import { sortBy } from "../../../helpers/helpers";
import { httpCall } from "../../../helpers/http-service";
export default {
  components: {
    UserFilterBox,
    DateFilterBox,
    DataTableComponent,
    NoDataToShow
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
    },
    reps() {
      if(!this.manager) {
        return this.$store.getters.reps;
      }
      return this.$store.getters.reps.filter(rep => this.manager.relations.reps.includes(rep.id))
    },
    reportsData() {
      if(!this.shouldRenderFilter) {
        return this.reports;
      }
      return this.filteredList;
    }
  },
  data: () => ({
    reports: [],
    isReportsFetched: false,
    isLoaded: false,
    manager: null,
    heads: [
      {
        title: 'Business Unit',
        name: 'regional_manager'
      },
      {
        title: 'Area Manager',
        name: 'area_manager'
      },
      {
        title: 'District Manager',
        name: 'district_manager'
      },
      {
        title: "Rep",
        name: "Rep",
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
        name: 'state'
      },
      {
        title: 'Brick',
        name: 'Brick'
      },
      {
        title: 'Area',
        name: 'Area'
      },
      {
        title: 'District',
        name: 'District'
      },
      {
        title: 'Territory',
        name: 'Territory'
      }
    ],
    filteredList: [],
    shouldRenderFilter: false
  }),
  methods: {
    getReports() {
      let user = this.manager ? this.manager.id : null;
      let query = { user };
      this.isLoaded = true;
      this.reports = [];
      this.isReportsFetched = false;
      this.shouldRenderFilter =false;
      httpCall
        .get("admin/v1/reports/missed", query)
        .then(({ data }) => {
          data.data.forEach(item => {
            item['regional_manager'] = this.getRegionalManagerName(item.user_id)
            item['area_manager'] = this.getAreaManagerName(item.user_id)
            item['district_manager'] = this.getDistrictManagerName(item.user_id)
            item['state'] = this.getCustomerStatus(item);
          });
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
    onFilter(data) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      let async = () => Promise.resolve(data);
      async().then(data => this.filteredList = data);
    },
    onReset() {
      this.filteredList = [];
      let async = () => Promise.resolve(this.reports);
      async().then(data => this.filteredList = data);
    },
    getCustomerStatus(item) {
      let {countOfPlans,countOfVisits,diff} = item;
      let flag,style;
      if(diff > 0 && diff === countOfPlans) {
        flag = "Uncovered";
        style = "bg-danger text-light"
      } else if(diff > 0 && diff !== countOfPlans) {
        flag = "Missed";
        style = "bg-warning text-dark"
      } else if(diff === 0) {
        flag = "Accomplished";
        style = "bg-success text-light"
      } else {
        flag = "Over";
        style = "bg-primary text-light"
      }

      return `<span class="${style} p-1">${flag}</span>`
    }
  }
};
</script>

<style></style>
