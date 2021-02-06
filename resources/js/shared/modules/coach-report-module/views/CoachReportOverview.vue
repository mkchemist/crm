<template>
  <div>
    <p class="text-center h2 font-weight-light">Overview</p>
    <div class="p-2 my-2">
      <div v-if="reports.length > 0">
        <chart-view :labels="chartData.labels" :chart-data="chartData.data" />
      </div>
      <div v-else-if="fetched">
        <no-data-to-show />
      </div>
      <div v-else-if="!started" class="py-5 text-center">
        <p class="text-primary lead">Click start to load all reports</p>
        <button class="btn btn-sm btn-primary" @click="getReports">
          <span class="fa fa-file-download"></span>
          <span>Start</span>
        </button>
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import ChartView from "../../../../components/ChartView.vue";
import NoDataToShow from "../../../../components/NoDataToShow.vue";
import { CHART_COLOR_LIST } from '../../../../helpers/constants';
import { filterData } from "../../../../helpers/helpers";
export default {
  components: {
    NoDataToShow,
    ChartView
  },
  computed: {
    reports() {
      return this.$store.getters.coachModuleDayListReports;
    },
    fetched() {
      return this.$store.getters.isCoachReportModuleDayListReportsFetched;
    },
    started() {
      return this.$store.getters.isCoachReportModuleLoadingStarted;
    },
    chartData() {
      // wait until reports fetched
      if (!this.reports.length) {
        return {};
      }
      // collecting dates
      let labels = new Set();
      this.reports.map(r => labels.add(r.date));
      let data = [];

      //  create coach report collection
      let coachReportCollection = filterData(this.reports, "coach_name");
      try {
        // looping through coach report collection
        for (let coach in coachReportCollection) {
          let coachCollection = coachReportCollection[coach];
          coachCollection = filterData(coachCollection, "date");
          // chart item
          let coachChartContainer = {
            label: coach,
            data: [],
            fill: false,
            borderColor: CHART_COLOR_LIST,
            backgroundColor: CHART_COLOR_LIST
          };
          // duplicate index
          let di = {};
          // looping through dates;
          labels.forEach(l => {
            /**
             * check if coach have visit in this date
             *
             * if have visit it will collect all visits and push it to
             * data
             * else it will push 0 to data
             *
             */
            if (coachCollection[l]) {
              if (di[l]) {
                let index = di[l];
                coachChartContainer.data[index] += coachCollection[l][0].visits;
              } else {
                let index = coachChartContainer.data.push(
                  coachCollection[l][0].visits
                );
                di[l] = index;
              }
            } else {
              let index = coachChartContainer.data.push(0);
              di[l] = index;
            }
          });
          data.push(coachChartContainer);
        }
      } catch (e) {
        console.log(e);
      }

      return {
        labels : Array.from(labels),
        data
      };
    }
  },
  methods: {
    getReports() {
      return this.$store.dispatch("fetchCoachReportsModuleReports", {
        force: true
      });
    }
  }
};
</script>

<style></style>
