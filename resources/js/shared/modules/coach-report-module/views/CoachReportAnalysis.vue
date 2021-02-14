<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span class="fa fa-flask"></span>
      <span class="font-weight-bold">Coach Report Analysis</span>
    </p>
    <div class="p-2">
      <!-- page control start -->
      <div class="p-2 text-right">
        <template>
          <button class="btn btn-sm btn-primary" @click="openSelectModal">
            <span class="fa fa-check"></span>
            <span>Select</span>
          </button>
        </template>

        <button class="btn btn-sm btn-primary" @click="reportFetchRequest">
          <span class="fa fa-download"></span>
          <span>Start analysis</span>
        </button>
        <router-link to="/coach" class="btn btn-sm btn-dark">
          <span class="fa fa-chevron-circle-left"></span>
          <span>back</span>
        </router-link>
      </div>
      <!-- End of page control -->
      <!-- Analysis section -->
      <div class="p-2">
        <div v-if="reports.tableData.length">
          <div class="my-2 p-2">
            <data-table-component
              :data="reports.tableData"
              :cols="cols"
              :tableClass="`table table-sm small table-striped table-bordered`"
              :selectable="false"
            />
          </div>
          <div class="my-2 p-2">
            <chart-view :chartData="reports.data" :labels="reports.labels" />
          </div>
        </div>
        <div v-else-if="fetched">
          <no-data-to-show />
        </div>
        <div v-else-if="!started">
          <div class="py-5 text-center">
            <p class="lead text-primary">
              Click start to start loading data and analyzing
            </p>
          </div>
        </div>
        <loader-component v-else></loader-component>
      </div>
      <!-- End of analysis section -->
    </div>
    <modal-fade
      :show="showSelectModal"
      @onClose="closeSelectModal"
      :headerStyle="`bg-primary text-light`"
      :footer="true"
    >
      <template v-slot:header>
        <span>Select Rep</span>
      </template>
      <template v-slot:body>
        <div class="form-group">
          <select v-model="selected_rep" multiple class="form-control form-control-sm" style="min-height:250px">
            <option :value="null">All</option>
            <option v-for="rep in reps" :key="rep.id" :value="rep.id">{{
              rep.name
            }}</option>
          </select>
        </div>
      </template>
      <template v-slot:footer>
        <button class="btn btn-sm btn-primary" @click="selectRep">
          <span class="fa fa-check-circle"></span>
          <span>Select</span>
        </button>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import ChartView from "../../../../components/ChartView.vue";
import DataTableComponent from "../../../../components/DataTableComponent.vue";
import ModalFade from "../../../../components/ModalFade.vue";
import NoDataToShow from "../../../../components/NoDataToShow.vue";
import { CHART_COLOR_LIST, COACH_REPORT } from "../../../../helpers/constants";
import { filterData } from "../../../../helpers/helpers";
import { asyncDataFlow, httpCall } from "../../../../helpers/http-service";
export default {
  components: {
    NoDataToShow,
    ChartView,
    DataTableComponent,
    ModalFade
  },
  computed: {
    reps() {
      return this.$store.getters.coachModuleReps;
    },
    reportsData() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.data;
    },
    reports() {
      let analysis = {
        labels: Array.from(Object.keys(COACH_REPORT)),
        data: [],
        tableData: []
      };

      /**  rep reports clusters  */
      let reports = filterData(this.reportsData, "rep.name");
      try {
        /** looping through clusters */
        for (let rep in reports) {
          // initial evaluation points values
          let preCallPlanning = 0,
            opening = 0,
            initialProbe = 0,
            promotionalPlan = 0,
            handlingOfObjections = 0,
            close = 0,
            postCallAnalysis = 0;
          // rep chart item
          let item = {
            label: rep,
            data: [],
            backgroundColor: CHART_COLOR_LIST,
            borderColor: CHART_COLOR_LIST,
            fill: false
          };
          /** rep reports  */
          let _d = reports[rep];
          /** looping through rep reports */
          _d.map(r => {
            preCallPlanning += this.collectItemScore(
              r.data["Pre-call Planning"]
            );
            opening += this.collectItemScore(r.data["Opening"]);
            initialProbe += this.collectItemScore(r.data["Initial Probe"]);
            promotionalPlan += this.collectItemScore(
              r.data["Promotional Plan"]
            );
            handlingOfObjections += this.collectItemScore(
              r.data["Handling of Objections"]
            );
            close += this.collectItemScore(r.data["Close"]);
            postCallAnalysis += this.collectItemScore(
              r.data["Post Call Analysis"]
            );
          });
          /**
           * collecting points
           */
          item.data = [
            preCallPlanning / _d.length,
            opening / _d.length,
            initialProbe / _d.length,
            promotionalPlan / _d.length,
            handlingOfObjections / _d.length,
            close / _d.length,
            postCallAnalysis / _d.length
          ];
          analysis.tableData.push({
            rep,
            visits: _d.length,
            preCallPlanning,
            opening,
            initialProbe,
            promotionalPlan,
            handlingOfObjections,
            close,
            postCallAnalysis,
            overall: (
              (preCallPlanning +
                opening +
                initialProbe +
                promotionalPlan +
                handlingOfObjections +
                close +
                postCallAnalysis) /
              _d.length
            ).toFixed(1)
          });
          analysis.data.push(item);
        }
      } catch (e) {
        console.log(item);
      }
      return analysis;
    }
  },
  data: () => ({
    data: [],
    fetched: false,
    started: false,
    cols: [
      {
        title: "Rep",
        name: "rep"
      },
      {
        title: "Total Coaching Visits",
        name: "visits"
      },
      {
        title: "Pre-Call Planning",
        name: row => {
          return (row.preCallPlanning / row.visits).toFixed(1);
        }
      },
      {
        title: "% (30 point)",
        name: row => {
          let res = (row.preCallPlanning / row.visits).toFixed(1);
          return ((res / 30) * 100).toFixed(1) + "%";
        },
        style: "font-weight-bold"
      },
      {
        title: "Opening",
        name: row => {
          return (row.opening / row.visits).toFixed(1);
        }
      },
      {
        title: "% (30 point)",
        name: row => {
          let res = (row.opening / row.visits).toFixed(1);
          return ((res / 30) * 100).toFixed(1) + "%";
        },
        style: "font-weight-bold"
      },
      {
        title: "Initial Probe",
        name: row => {
          return (row.initialProbe / row.visits).toFixed(1);
        }
      },
      {
        title: "% (30 point)",
        name: row => {
          let res = (row.initialProbe / row.visits).toFixed(1);
          return ((res / 30) * 100).toFixed(1) + "%";
        },
        style: "font-weight-bold"
      },
      {
        title: "PromotionalPlan",
        name: row => {
          return (row.promotionalPlan / row.visits).toFixed(1);
        }
      },
      {
        title: "% (40 point)",
        name: row => {
          let res = (row.promotionalPlan / row.visits).toFixed(1);
          return ((res / 40) * 100).toFixed(1) + "%";
        },
        style: "font-weight-bold"
      },
      {
        title: "Handling Of Objections",
        name: row => {
          return (row.handlingOfObjections / row.visits).toFixed(1);
        }
      },
      {
        title: "% (30 point)",
        name: row => {
          let res = (row.handlingOfObjections / row.visits).toFixed(1);
          return ((res / 30) * 100).toFixed(1) + "%";
        },
        style: "font-weight-bold"
      },
      {
        title: "Close",
        name: row => {
          return (row.close / row.visits).toFixed(1) + "%";
        }
      },
      {
        title: "% (20 point)",
        name: row => {
          let res = (row.close / row.visits).toFixed(1);
          return ((res / 20) * 100).toFixed(1) + "%";
        },
        style: "font-weight-bold"
      },
      {
        title: "Post-Call Analysis",
        name: row => {
          return (row.postCallAnalysis / row.visits).toFixed(1) + "%";
        }
      },
      {
        title: "% (20 point)",
        name: row => {
          let res = (row.postCallAnalysis / row.visits).toFixed(1);
          return ((res / 20) * 100).toFixed(1) + "%";
        },
        style: "font-weight-bold"
      },
      {
        title: "Overall (200)",
        name: "overall",
        style: "font-weight-bold"
      }
    ],
    showSelectModal: false,
    selected_rep: [],
    shouldRenderFilter: false,
    filteredList: []
  }),
  methods: {
    reportFetchRequest() {
      this.started = true;
      return httpCall
        .get("v1/coach-reports/raw/reports")
        .then(({ data }) => {
          data.data.forEach(r => {
            try {
              r.data = JSON.parse(r.data);
            } catch (e) {
              r.data = COACH_REPORT;
            }
          });
          this.fetched = true;
          this.data = data.data;
        })
        .catch(err => console.log(err));
    },
    /**
     * convert evaluation points to number
     *
     * @param {String} state
     * @return {Number}
     */
    _convertStateToNumber(state) {
      let res;
      switch (state.toLowerCase()) {
        case "s":
          res = 10;
          break;
        case "u":
          res = 1;
          break;
        default:
          res = 0;
          break;
      }
      return res;
    },
    /**
     * collect evaluation Item score
     *
     * @param {Object} item
     * @return {Number}
     */
    collectItemScore(item) {
      let res = 0;
      for (let i in item) {
        res += this._convertStateToNumber(item[i]);
      }
      return res;
    },
    openSelectModal() {
      this.showSelectModal = true;
    },
    closeSelectModal() {
      this.showSelectModal = false;
    },
    selectRep() {
      let data = [];
      if (!this.selected_rep.length || this.selected_rep[0] === null) {
        data = this.data;
      } else {
        data = this.data.filter(r => this.selected_rep.includes(r.rep_id));
      }
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(data, data => {
        this.filteredList = data;
      });
    }
  }
};
</script>

<style></style>
