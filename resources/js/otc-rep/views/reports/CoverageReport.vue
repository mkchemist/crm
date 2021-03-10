<template>
  <div class="px-0 shadow">
    <page-title-component :title="`Coverage analysis report`" :icon="`fa-chart-line`" />
    <div class="p-2">
      <div v-if="reports.data.length" class="row mx-auto">
        <div class="col-lg">
          <data-table-component :data="reports.data" :cols="cols" :buttons="buttons"/>
        </div>
        <div class="col-lg">
          <chart-view :labels="reports.chartData.labels" :chartData="reports.chartData.data" />
        </div>
      </div>
      <div v-else-if="fetched">
        <no-data-to-show />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import ChartView from '../../../components/ChartView.vue'
import DataTableComponent from '../../../components/DataTableComponent.vue'
import NoDataToShow from '../../../components/NoDataToShow.vue'
import PageTitleComponent from '../../../components/PageTitleComponent.vue'
import { CHART_COLOR_LIST } from '../../../helpers/constants'
import { httpCall } from '../../../helpers/http-service'
export default {
  components: { PageTitleComponent, DataTableComponent,
    NoDataToShow,
    ChartView },
  mounted() {
    httpCall.get("otc-rep/v1/reports/pharmacy/analysis/coverage")
    .then(({data}) => {
      this.handleResponse(data, data => {
        this.data = data.data
        this.fetched = true;
      })
    }).catch(err => console.log(err))
  },
  data:()=>({
    data: [],
    fetched: false,
    cols: [
      {
        title: "Rep",
        name: "rep"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "Coverage",
        name:"coverage"
      },
      {
        title: "%",
        name: "coverage_percent"
      }
    ]
  }),
  computed:{
    reports() {
      let reports = this.data;
      let totalCoverage = 0;
      let chartData = {
        labels: [],
        data: [
          {
            fill:false,
            label: "Coverage Percent",
            data: [],
            backgroundColor: CHART_COLOR_LIST,
            borderColor: CHART_COLOR_LIST
          }
        ]
      }
      reports.map(report => {
        totalCoverage += report.coverage;
      });
      reports.forEach(report => {
        chartData.labels.push(report.brick);
        report['coverage_percent'] = ((report.coverage/totalCoverage)*100).toFixed(1);
        chartData.data[0].data.push(((report.coverage/totalCoverage)*100).toFixed(1));
      });
      return {
        data: reports,
        chartData
      };
    },
    buttons() {
      return [
        {
          text: '<i class="fa fa-chevron-circle-left"></i> back',
          action: () => this.$router.push("/reports")
        }
      ]
    }
  }
}
</script>

<style>

</style>
