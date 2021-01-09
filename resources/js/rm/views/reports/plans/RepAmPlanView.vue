<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-primary">
      <span class="fa fa-book-reader"></span>
      <span class="font-weight-bold">AM Plan view</span>
    </p>
    <div class="p-2">
      <!-- District Manager selection control -->
      <div class="p-2">
        <div class="form-inline">
          <label for="" class="text-muted">District Manager: </label>
          <select
            name="district"
            id="district"
            class="form-control form-control-sm col-lg mx-2"
            v-model="district"
          >
            <option :value="null">All</option>
            <option v-for="dm in dms" :key="dm.id" :value="dm.id">{{
              dm.name
            }}</option>
          </select>
          <button class="btn btn-sm btn-primary" @click="fetchReports">
            <span class="fa fa-check-circle"></span>
            <span>ok</span>
          </button>
        </div>
      </div>
      <!-- End of District Manager Selection Control -->
      <!-- Plan view Section -->
      <div class="p-2">
        <div class="p-2 row mx-auto border rounded">
          <div class="col-lg py-2">
            <user-filter-box
              :users="reps"
              :data="data"
              :onFilter="onFilter"
              :onReset="onReset"
              :userField="`user_id`"
            />
          </div>
          <div class="col-lg">
            <date-filter-box
              :data="reports"
              :onFilter="onFilter"
              :onReset="onReset"
              :dateField="`start`"
            />
          </div>
        </div>
        <div v-if="reports.length" class="my-2 border rounded">
          <table-component
            :data="reports"
            :heads="heads"
            :headClass="`bg-success text-light`"
            :unselectable="true"
          >
            <template v-slot:head:before>
              <th>District Manager</th>
            </template>
            <template v-slot:body:before="{item}">
              <td>{{ getManagerName(item.user_id) }}</td>
            </template>
          </table-component>
        </div>
        <div v-else-if="!loadingStart">
          <div class="py-5 text-center">
            <p class="lead">Select District Manager to load plans</p>
            <span class="fa fa-download fa-4x text-primary"></span>
          </div>
        </div>
        <div v-else-if="isFetched">
          <no-data-to-show :title="`No Plans found`" />
        </div>
        <loader-component v-else></loader-component>
      </div>
      <!-- End of Plan view section -->
    </div>
  </div>
</template>

<script>
import DateFilterBox from "../../../../components/DateFilterBox.vue";
import NoDataToShow from "../../../../components/NoDataToShow.vue";
import TableComponent from "../../../../components/TableComponent.vue";
import UserFilterBox from "../../../../components/UserFilterBox.vue";
import { sortBy } from '../../../../helpers/helpers';
import { httpCall } from "../../../../helpers/http-service";
export default {
  components: { TableComponent, NoDataToShow, UserFilterBox, DateFilterBox },
  computed: {
    /** get all district managers */
    dms() {
      return sortBy(this.$store.getters.allDm, 'name');
    },
    reps() {
      if(this.district) {
        return sortBy(this.$store.getters.allReps.filter(rep => {
          let dm = JSON.parse(rep.user_relations).dm;
          if(dm.includes(this.district)) {
            return true;
          } else {
            return false;
          }
        }),'name')
      }

      return sortBy(this.$store.getters.allReps, 'name');
    },
    /** reports data */
    reports() {
      if (this.shouldRenderFilter) {
        return this.FilteredList;
      }
      return this.data;
    }
  },
  data: () => ({
    district: null,
    data: [],
    isFetched: false,
    loadingStart: false,
    shouldRenderFilter: false,
    FilteredList: [],
    heads: [
      {
        title: "Rep",
        name: "rep"
      },
      {
        title: "Date",
        name: "start"
      },
      {
        title: "Workplace",
        name: "workplace"
      },
      {
        title: 'Type',
        name: 'type'
      },
      {
        title: 'Address',
        name: 'address'
      },
      {
        title: 'Brick',
        name: 'brick'
      },
      {
        title: 'Area',
        name:'area'
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
    /**
     * fetch reports
     *
     */
    fetchReports() {
      this.data = [];
      this.isFetched = false;
      this.loadingStart = true;
      this.shouldRenderFilter = false;
      this.FilteredList = [];
      httpCall
        .get("rm/v1/planner/am", { userID: this.district })
        .then(({ data }) => {
          this.data = data.data;
          this.isFetched = true;
        })
        .catch(err => console.log(err));
    },
    /**
     * filter data
     *
     * @param {array} data
     */
    onFilter(data) {
      this.FilteredList = [];
      this.shouldRenderFilter = true;
      let async = () => Promise.resolve(data);
      async().then(data => (this.FilteredList = data));
    },
    /**
     * reset filter
     *
     */
    onReset() {
      this.FilteredList = [];
      this.shouldRenderFilter = true;
      let async = () => Promise.resolve(this.data);
      async().then(data => (this.FilteredList = data));
    },
    /**
     * get rep manager name
     *
     * @param {int} id
     * @return {string}
     */
    getManagerName(id) {
      let manager ="------";
      this.dms.map(user => {
        let reps = JSON.parse(user.user_relations).reps;
        if(reps.includes(id)) {
          manager = user.name
        }
      });
      return manager;
    }
  }
};
</script>

<style>

</style>
