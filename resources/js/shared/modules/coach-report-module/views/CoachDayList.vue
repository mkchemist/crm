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
            <data-table-component
              :cols="cols"
              :data="reports"
              :buttons="buttons"
            />
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
import { asyncDataFlow } from "../../../../helpers/http-service";
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
      return this.$store.getters.coachModuleDayListReports;
    },
    fetched() {
      return this.$store.getters.isCoachReportModuleDayListReportsFetched;
    },
    loadingStarted() {
      return this.$store.getters.isCoachReportModuleLoadingStarted;
    },
    activeCycle() {
      return this.$store.getters.activeCycle;
    },
    buttons() {
      return [
        {
          text: '<span class="fa fa-print mx-1"></span> Print',
          extend: "print"
        },
        {
          text: '<span class="fa fa-redo mx-1"></span> Refresh',
          action: (e, dt) => {
            this.$store.dispatch("fetchCoachReportsModuleReports", {
              force: true
            });
          }
        },
        {
          text: '<span class="fa fa-chevron-circle-left mx-1"></span> back',
          action: (e, dt) => this.$router.push("/coach")
        },
        {
          text: '<span class="fa fa-book-reader mx-1"></span> View',
          action: (e, dt) => {
            let row = dt.rows({ selected: true }).data()[0];
            if (!row) {
              this.$toasted.info("You must pick a day first");
              return;
            }
            this.$router.push(
              `/coach/view?date=${row.date}&coach=${row.coach_id}&rep=${row.rep_id}`
            );
          }
        }
      ];
    },
    cols() {
      let user = this.$store.state.CoachReportModule.moduleUser;
      let cols = [
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
          title: "Business Unit",
          name: "Business_Unit"
        },
        {
          title: "Area Manager",
          name: "Area_Manager"
        },
        {
          title: "Line",
          name: row => {
            return JSON.parse(row.line).join(" | ");
          }
        },
        {
          title: "Total Visits",
          name: "visits"
        },
        {
          title: "Submitted",
          name: row => {
            return new Boolean(row.submitted) ? "True" : "False";
          }
        },
        {
          title: "Pre Call",
          name: "summery.performance_summery.pre_call"
        },
        {
          title: "Opening",
          name: "summery.performance_summery.opening"
        },
        {
          title: "Initial Probe",
          name: "summery.performance_summery.initial_probe"
        },
        {
          title: "Promotional Message",
          name: "summery.performance_summery.promotional_message"
        },
        {
          title: "Close",
          name: "summery.performance_summery.close"
        },
        {
          title: "Post Call Analysis",
          name: "summery.performance_summery.post_call_analysis"
        },
        {
          title: "Resource Optimization",
          name: "summery.performance_summery.resource_optimization"
        }
      ];
      if (user.role !== "rep") {
        cols = [
          ...cols,
          {
            title: "Action by FSR",
            name: "summery.action_plan.action_by_fsr"
          },
          {
            title: "Action by FLM",
            name: "summery.action_plan.action_by_flm"
          },
          {
            title: "Action by Others",
            name: "summery.action_plan.action_by_others"
          },
          {
            title: "Next visit target of Selling skills",
            name: "summery.next_visit_target.selling_skills"
          },
          {
            title: "Next visit target of Product Knowledge ",
            name: "summery.next_visit_target.product_knowledge"
          },
          {
            title: "Next visit target of Territory Management",
            name: "summery.next_visit_target.territory_management"
          }
        ];
      }
        return cols;
    }
  },
  data: () => ({
    coach: null,
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
    selectCoach() {
      this.$store.commit("setCoachModuleFetchingCoach", this.coach);
      this.$store.dispatch("fetchCoachReportsModuleReports", { force: true });
    },
    selectCycle() {
      this.$store.dispatch("fetchCoachReportsModuleReports", {
        force: true,
        withCycle: true,
        start: this.activeCycle.start,
        end: this.activeCycle.end
      });
    },
    resetCycle() {
      this.$store.commit("resetActiveCycle");
      this.$store.dispatch("fetchCoachReportsModuleReports", {
        force: true,
        withCycle: true,
        start: this.activeCycle.start,
        end: this.activeCycle.end
      });
    }
  }
};
</script>

<style></style>
