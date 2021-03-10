<template>
  <div>
    <div class="px-0 shadow pb-5">
      <page-title-component title="Order Analysis" icon="fa-chart-pie" />

      <div class="p-2">
        <div class="" v-if="data.length">
          <!-- Charts -->
           <div class="p-2">
              <button class="btn btn-sm btn-secondary" @click="fetchAnalysis">
                <span class="fa fa-redo"></span>
                <span>Refresh list</span>
              </button>
              <router-link to="/reports" class="btn btn-sm btn-dark">
                <span class="fa fa-chevron-circle-left"></span>
                <span>Back</span>
              </router-link>
            </div>
            <div class="row mx-auto">
              <!-- Distributor Chart -->
              <div class="p-2 border rounded m-2 col-lg">
                <p class="font-weight-bold">Distributor Share</p>
                <chart-view :chartData="DistributorChart.data" :labels="DistributorChart.labels" />
              </div>

              <!-- Product Chart -->
              <div class="p-2 border rounded m-2 col-lg">
                <p class="font-weight-bold">Product Share</p>
                <chart-view :chartData="ProductChart.data" :labels="ProductChart.labels" :id="`product_share`" />
              </div>

              <!-- Monthly Chart -->
              <div class="p-2 border rounded m-2 col-lg">
                <p class="font-weight-bold">Monthly Growth</p>
                <chart-view :chartData="MonthlyGrowth.data" :labels="MonthlyGrowth.labels" :id="`monthly_growth`" />
              </div>
            </div>
            <!-- Table -->
            <div class="p-2">
              <data-table-component
                :data="data"
                :cols="cols"
                :buttons="buttons"
              />
            </div>
          </div>
          <div v-else-if="isFetched">
            <no-data-to-show />
          </div>
          <loader-component v-else></loader-component>
        </div>
      </div>
      <data-filter-box
        :show="showFilterBox"
        :data="data"
        :onClose="closeFilterBox"
        :onFilter="onFilter"
        :onReset="onReset"
        :queryKeys="cols"
        :queryOnly="false"
      />
    </div>
</template>

<script>
import ChartView from "../../../components/ChartView.vue";
import DataFilterBox from "../../../components/DataFilterBox.vue";
import DataTableComponent from "../../../components/DataTableComponent.vue";
import NoDataToShow from "../../../components/NoDataToShow.vue";
import PageTitleComponent from "../../../components/PageTitleComponent.vue";
import { CHART_COLOR_LIST } from "../../../helpers/constants";
import { filterData } from "../../../helpers/helpers";
import { asyncDataFlow, httpCall } from "../../../helpers/http-service";
export default {
  components: {
    PageTitleComponent,
    DataTableComponent,
    NoDataToShow,
    DataFilterBox,
    ChartView
  },
  mounted() {
    this.fetchAnalysis();
  },
  computed: {
    data() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.report;
    },
    DistributorChart() {
      return this.generateChart("Distributor","Distributor share %")
    },
    ProductChart() {
      return this.generateChart("Product","Product share %")
    },
    MonthlyGrowth() {
      return this.generateChart("Month","Monthly Growth")
    },
    buttons() {
      return [
        {
          text: `<i class="fa fa-filter"></i>`,
          action: () => this.openFilterBox()
        }
      ];
    }
  },
  data: () => ({
    report: [],
    isFetched: false,
    cols: [
      {
        title: "Rep",
        name: "Rep"
      },
      {
        title: "Month",
        name: "Month"
      },
      {
        title: "Product",
        name: "Product"
      },
      {
        title: "Distributor",
        name: "Distributor"
      },
      {
        title: "Quantity",
        name: "TotalOrder"
      }
    ],
    showFilterBox: false,
    filteredList: [],
    shouldRenderFilter: false
  }),
  methods: {
    fetchAnalysis() {
      return httpCall
        .get("otc-rep/v1/reports/pharmacy/analysis/order")
        .then(({ data }) => {
          this.report = data.data;
          this.isFetched = true;
        })
        .catch(err => console.log(err));
    },
    openFilterBox() {
      this.showFilterBox = true;
    },
    closeFilterBox() {
      this.showFilterBox = false;
    },
    onFilter(q, d) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(d, d => {
        this.filteredList = d;
      });
    },
    onReset() {
      this.filteredList = [];
      asyncDataFlow([], () => {
        this.shouldRenderFilter = false;
      });
    },
    generateChart(item, label) {
      let data = this.data;
      data = filterData(data, item);
      let chart = {
        labels: [],
        data: [
          {
            label,
            backgroundColor: CHART_COLOR_LIST,
            borderColors: CHART_COLOR_LIST,
            fill: false,
            data: []
          }
        ]
      };

      for (let d in data) {
        chart.labels.push(d);
        let totalShare = 0;
        data[d].map(i => {
          totalShare += parseInt(i.TotalOrder);
        });
        chart.data[0].data.push(totalShare);
      }
      return chart;
    }
  }
};
</script>

<style></style>
