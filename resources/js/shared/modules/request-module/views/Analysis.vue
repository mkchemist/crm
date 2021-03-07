<template>
  <div class="px-0 shadow rounded pb-5">
    <page-title-component :title="`Request Analysis`" :icon="`fa-flask`" />

    <div class="p-2">
      <div class="p-2">
        <select name="" id="" class="" v-model="type">
          <option value="type">Analysis by request Type</option>
          <option value="product">Analysis by Product</option>
          <option value="brick">Analysis by brick</option>
          <option value="area">Analysis by area</option>
          <option value="district">Analysis by district</option>
          <option value="territory">Analysis by territory</option>
          <option value="rm" v-if="['admin', 'accountant'].includes(user.role)">Analysis by Business Unit</option>
          <option value="am" v-if="['admin', 'accountant'].includes(user.role)">Analysis by Area Manager</option>
          <option value="recommendation" v-if="['admin', 'accountant'].includes(user.role)">Analysis by Recommendation</option>
        </select>
        <button class="btn btn-sm btn-primary" @click="getData">Start Analysis</button>
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
import { asyncDataFlow, httpCall } from '../../../../helpers/http-service';

export default {
  components: { PageTitleComponent, DataTableComponent, ChartView },
  computed: {
    analysisData() {
      let data = this.data;
      let res = [];
      let backgroundColor;
      if(this.type === "recommendation") {
        backgroundColor = ["#4caf50", "#ffc107", "#f44336"]
      } else {
        backgroundColor = CHART_COLOR_LIST;
      }
      let chart = {
        labels: [],
        data: [
          {
            label: `Analysis by Request ${this.type}`,
            data: [],
            backgroundColor,
            fill: false,
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
    },
    user() {
      return this.$store.getters['UserModule/user'];
    },
    canShowUsersAnalysis() {
      return ['admin', 'accountant'].includes(this.user.role)
    },
    requests() {
      return this.$store.getters['RequestModule/requests'];
    },
    isRequestsFetched() {
      return this.$store.getters['RequestModule/fetched'];
    },
    priceList() {
      return this.$store.getters['PriceListModule/priceList']
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
        name: row => `${(row.cost/1000).toFixed(1)}K`
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
      let join = null
      if(['area','brick','district', 'territory'].includes(this.type)) {
          join = "customer";
      } else if(['dm','am','rm'].includes(this.type)) {
        join="user"
      }else if(this.type === "recommendation") {
        asyncDataFlow(this.generateRecommendationReports(),data => this.data = data);
        /* this.data = this.generateRecommendationReports(); */
        return ;
      }
      httpCall
        .get("v1/requests/search/"+this.type, {join})
        .then(({ data }) => {
          this.data = data.data;
        })
        .catch(err => console.log(err));
    },
    detectRequestRecommendationState(ratio) {
      let state = "";
      if(ratio >= 10) {
        state = "Recommended";
      } else if(10 < ratio <= 20 ) {
        state ="Risky"
      }else {
        state = "Should be "
      }

      return state;
    },
    generateRecommendationReports() {
      let requests = this.requests;
      let risky = {Item: "Risky", total_cost: 0};
      let recommended = {Item:"Recommended", total_cost : 0};
      let shouldBeAvoided = {Item:"Should be avoided", total_cost: 0};
      requests.map(req => {
        let tb = req.total_rx * req.rx_months * this.priceList[req.product];
        let ratio = ((req.cost *req.quantity) / tb) * 100;
        if(ratio >= 10) {
          recommended.total_cost += req.cost * req.quantity;
        } else if(10 < ratio <= 20 ) {
          risky.total_cost += req.cost * req.quantity;
        }else {
          shouldBeAvoided.total_cost += req.cost * req.quantity;
        }
      });

      return [recommended, risky, shouldBeAvoided];
    }
  }
};
</script>

<style></style>
