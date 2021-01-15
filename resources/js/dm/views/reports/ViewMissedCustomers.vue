<template>
  <div class="p-2">
    <div class="row mx-auto">
      <div class="col-lg-3">
        <user-filter-box
          :users="reps"
          :data="data"
          :onFilter="onFilter"
          :onReset="onReset"
        />
        <router-link to="/reports" class="btn btn-sm btn-dark btn-block my-2">
        <span class="fa fa-chevron-circle-left"></span>
        <span>back</span>
      </router-link>
      </div>
      <div class="col-lg-9 px-0 shadow rounded pb-5">
        <p class="alert alert-success">
          <span class="fa fa-book-reader"></span>
          <span class="font-weight-bold">View missed customers</span>
        </p>
        <div class="p-2">
          <!-- date control -->
          <div class="form-inline border p-2 rounded">
            <label for="">Start</label>
            <input
              type="date"
              class="form-control form-control-sm mx-2 col-lg"
              v-model="startDate"
              :max="today"
            />
            <label for="">End</label>
            <input
              type="date"
              class="form-control form-control-sm mx-2 col-lg"
              v-model="endDate"
              :max="today"
            />
            <button
              class="btn btn-sm btn-success"
              :disabled="!startDate && !endDate"
              @click="fetchData"
            >
              <span class="fa fa-check-circle"></span>
              <span>Go</span>
            </button>
          </div>
          <!-- end of date control -->
          <!-- data view -->
          <div class="my-2">
            <div v-if="reports.length">
              <table-component
                :data="reports"
                :heads="heads"
                :unselectable="true"
                :headClass="`bg-dark text-light`"
              >
                <template v-slot:head>
                  <th>Status</th>
                  <th>Brick</th>
                  <th>Area</th>
                </template>
                <template v-slot:body="{ item }">
                  <td>
                    <span v-html="getCustomerStatus(item)"></span>
                  </td>
                  <td>{{ item.brick }}</td>
                  <td>{{ item.area }}</td>
                </template>
              </table-component>
            </div>
            <div v-else-if="fetched">
              <no-data-to-show :title="`No missed doctors`" />
            </div>
            <loader-component v-else></loader-component>
          </div>
          <!-- end of data view -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoDataToShow from "../../../components/NoDataToShow.vue";
import TableComponent from "../../../components/TableComponent.vue";
import UserFilterBox from "../../../components/UserFilterBox.vue";
import { httpCall } from "../../../helpers/http-service";
export default {
  mounted() {
    this.fetchData();
  },
  components: {
    UserFilterBox,
    NoDataToShow,
    TableComponent
  },
  computed: {
    reps() {
      return this.$store.getters.allReps;
    },
    reports() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.data;
    }
  },
  data: () => ({
    data: [],
    fetched: false,
    shouldRenderFilter: false,
    filteredList: [],
    startDate: null,
    endDate: null,
    today: new Date().format(),
    heads: [
      {
        title: "Rep",
        name: "rep"
      },
      {
        title: "Customer",
        name: "customerName"
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
        title: "Count Of plans",
        name: "countOfPlans"
      },
      {
        title: "Count of Visits",
        name: "countOfVisits"
      },
      {
        title: "Difference",
        name: "difference"
      }
    ]
  }),
  methods: {
    generateFetchQuery() {
      let query = {

      }
    },
    fetchData() {
      this.data = [];
      this.fetched = false;
      this.shouldRenderFilter = false;
      this.filteredList = [];
      httpCall
        .get("dm/v1/reports/missed-customers", {from_date :this.startDate, to_date: this.endDate})
        .then(({ data }) => {
          this.data = data.data;
          this.fetched = true;
        })
        .catch(err => console.log(err));
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
    },
    getCustomerStatus(item) {
      let flag, style;
      if (item.difference > 0 && item.difference === item.countOfPlans) {
        flag = "Uncovered";
        style = "bg-danger text-light";
      } else if (item.difference > 0 && item.difference !== item.countOfPlans) {
        flag = "Missed";
        style = "bg-warning text-dark";
      } else if (item.difference === 0) {
        flag = "Accomplished";
        style = "bg-success text-light";
      } else {
        flag = "Over";
        style = "bg-primary text-light";
      }
      return `<span class="${style} p-1">${flag}</span>`;
    }
  }
};
</script>

<style></style>
