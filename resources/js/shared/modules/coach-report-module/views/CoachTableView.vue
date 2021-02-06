<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span class="fa fa-calendar-day"></span>
      <span class="font-weight-bold">Coach Reports Day Summery</span>
    </p>
    <div class="row mx-auto p-2">
      <!-- Filter boxes -->
      <div class="col-lg-3 shadow rounded">
        <cycle-selection :onSelect="selectCycle" :onReset="resetCycle" />

        <!-- District Filter -->
        <div class="my-2 shadow rounded p-2" v-if="coaches.length">
          <div class="form-group">
            <label for="" class="text-muted">Coach</label>
            <select
              name="district"
              id="district"
              v-model="coach"
              class="form-control form-control-sm"
            >
              <option :value="null">All</option>
              <option v-for="dm in coaches" :key="dm.id" :value="dm.id">{{
                dm.name
              }}</option>
            </select>
          </div>
          <div class="form-group text-right">
            <button
              type="button"
              class="btn btn-sm btn-primary"
              @click="selectCoach"
            >
              <span class="fa fa-check-circle"></span>
              <span>select</span>
            </button>
          </div>
        </div>
        <!-- Date filter box -->
        <date-filter-box
          :data="reports"
          :onFilter="onFilter"
          :onReset="onReset"
          :dateField="`date`"
          class="shadow"
        />
        <div class="p-2">
          <router-link to="/coach" class="btn btn-sm btn-dark btn-block">
            <span class="fa fa-chevron-circle-left"></span>
            <span>back</span>
          </router-link>
        </div>
      </div>
      <!-- End of filter boxes -->
      <div class="col-lg-9">
        <div v-if="reports.length">
          <div class="p-2">
            <data-table-component :cols="cols" :data="reports" />
          </div>
        </div>
        <div v-else-if="!loadingStarted">
          <div class="jumbotron text-center bg-white">
            <span class="fa fa-check-circle fa-6x text-success"></span>
            <p class="text-success lead my-2">
              Select District Manager to start loading
            </p>
            <p class="text-muted">
              Select <b>Coach</b> and then press <b>select</b> to view all coach
              report, you can select <b>All</b> to view all coaches reports
            </p>
          </div>
        </div>
        <div v-else-if="fetched">
          <no-data-to-show />
        </div>
        <loader-component
          v-else
          :size="`lg`"
          spinnerStyle="text-primary"
          textStyle="text-primary font-weight-bold"
          text="loading coach reports ..."
        ></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import CycleSelection from "../../../../components/CycleSelection.vue";
import DataTableComponent from "../../../../components/DataTableComponent.vue";
import DateFilterBox from "../../../../components/DateFilterBox.vue";
import NoDataToShow from "../../../../components/NoDataToShow.vue";
import { sortBy } from "../../../../helpers/helpers";
import { asyncDataFlow, httpCall } from "../../../../helpers/http-service";
export default {
  components: {
    DataTableComponent,
    NoDataToShow,
    DateFilterBox,
    CycleSelection
  },
  computed: {
    reps() {
      return this.$store.getters.coachModuleReps;
    },
    coaches() {
      return sortBy(this.$store.getters.coachModuleCoaches, "name");
    },
    reports() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.data;
    },
    fetched() {
      return this.is_fetched;
    },
    loadingStarted() {
      return this.started;
    },
    activeCycle() {
      return this.$store.getters.activeCycle;
    }
  },
  data: () => ({
    data: [],
    is_fetched: false,
    coach: null,
    started: false,
    cols: [
      {
        title: "Date",
        name: "date"
      },
      {
        title: "Coach",
        name: "coach_name"
      },
      {
        title: "Rep",
        name: "rep_name"
      },
      {
        title: "Line",
        name: row => {
          return JSON.parse(row.line).join(" | ");
        }
      },
      {
        title: "Customer",
        name: "customer_name"
      },
      {
        title: "Specialty",
        name: "customer_specialty"
      },
      {
        title: "Parameter",
        name: "customer_parameter"
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
      },
      {
        title: "Coach Submit",
        name: row => {
          return row.coach_submit !== 0 ? "True" : "False";
        }
      },
      {
        title: "Day Submit",
        name: row => {
          return row.day_submit !== 0 ? "True" : "False";
        }
      }
    ],
    shouldRenderFilter: false,
    filteredList: []
  }),
  methods: {
    onFilter(data) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(data, data => {
        this.filteredList = data;
      });
    },
    onReset() {
      this.filteredList = [];

      asyncDataFlow([], data => {
        this.filteredList = [];
        this.shouldRenderFilter = false;
      });
    },
    selectCoach(query = {}) {
      this.started = true;
      this.is_fetched = false;
      this.data = [];
      this.query = { ...query, coach: this.coach };
      this.loadingStarted;
      return httpCall
        .get("v1/coach-reports/view/table", query)
        .then(({ data }) => {
          this.data = data.data;
          this.is_fetched = true;
        })
        .catch(err => console.log(err));
    },
    selectCycle() {
      let active = this.activeCycle;
      this.selectCoach({
        start: active.start,
        end: active.end
      });
    },
    resetCycle() {
      this.$store.commit("resetActiveCycle");
      let active = this.activeCycle;
      this.selectCoach({
        start: active.start,
        end: active.end
      });
    }
  }
};
</script>

<style></style>
