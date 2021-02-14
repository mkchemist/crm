<template>
  <div class="px-0 shadow rounded pb-5">
    <page-title-component :title="`Request Analysis`" :icon="`fa-flask`" />

    <div class="p-2">
      <div class="p-2">
        <select name="" id="" class="" v-model="type">
          <option value="type">Analysis by request Type</option>
          <option value="product">Analysis by Product</option>
        </select>
        <button class="btn btn-sm btn-primary" @click="getData">start analysis</button>
        <span>choose item and then press ok to view analysis</span>
      </div>
      <div class="my-2 p-2">
        <div v-if="data.length">
          <data-table-component :cols="cols" :data="analysisData.res" />
          <chart-view :labels="analysisData.chart.labels" :chartData="analysisData.chart.data" />
        </div>
        <div v-else>
          <div class="d-flex flex-column align-items-center justify-content-center" style="min-height:300px">
            <span class="fa fa-flask fa-4x text-primary"></span>
            <span>Start analysis</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartView from '../../../../components/ChartView.vue';
import DataTableComponent from '../../../../components/DataTableComponent.vue';
import PageTitleComponent from "../../../../components/PageTitleComponent.vue";
import { CHART_COLOR_LIST } from '../../../../helpers/constants';
import { httpCall } from '../../../../helpers/http-service';

export default {
  components: { PageTitleComponent, DataTableComponent, ChartView },
  computed: {
    analysisData() {
      let data = this.data;
      let res = [];
      let chart = {
        labels: [],
        data: [
          {
            label: `Analysis by Request ${this.type}`,
            data: [],
            backgroundColor: CHART_COLOR_LIST,
            fill: false
          }
        ]
      }
      let totalCost = 0;
      data.map(item => {
        let x = {};
        x['Item'] = item.Item;
        x['cost'] = item.total_cost,
        totalCost += parseInt(item.total_cost)
        chart.labels.push(item.Item);
        res.push(x);
      })

      res.forEach(i => {
        i['share'] = (((i.cost)/totalCost) * 100).toFixed(1);
        chart.data[0].data.push(i.share);
      });

      return {
        res,
        chart,
        totalCost
      }
    }
  },
  data: () => ({
    type: "type",
    data: [],
    cols: [
      {
        title: "Item",
        name: "Item"
      },
      {
        title: "Total Item Cost",
        name: row => `${row.cost} EGP`
      },
      {
        title: "%",
        name: row => `${row.share} %`
      }
    ]
  }),
  methods: {
    getData() {
      this.data= [];
      httpCall
        .get("v1/requests/search/"+this.type)
        .then(({ data }) => {
          this.data = data.data;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style></style>
