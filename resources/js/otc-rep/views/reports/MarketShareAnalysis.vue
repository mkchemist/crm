<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-chart-bar"></span>
      <span class="font-weight-bold">Market Feedback</span>
    </p>
    <div class="p-2">
      <div v-if="Object.keys(analysis)">
        <table class="table table-sm small table-bordered table-striped">
          <thead>
            <tr>
              <th>Product</th>
              <th>Share</th>
              <th>Competitor</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody
            v-for="(product, pi) in Object.keys(analysis)"
            :key="`product_${product}_${pi}`"
          >
            <tr>
              <td :rowspan="4">{{ product }}</td>
              <td :rowspan="4">
                {{
                  (
                    (analysis[product].share / analysis[product].totalMarketShare) * 100
                  ).toFixed(2)
                }}%
              </td>
            </tr>
            <tr
              v-for="(competitor, i) in Object.keys(
                analysis[product].competitors
              )"
              :key="`product_${product}_${pi}_competitor_${i}`"
            >
              <td>{{ competitor }}</td>
              <td>
                {{
                  (
                   ( analysis[product].competitors[competitor].share /
                    analysis[product].totalMarketShare) * 100
                  ).toFixed(2)
                }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="p-2 my-2 row mx-auto justify-content-center" v-if="Object.keys(analysis).length">
      <chart-view
        :chartData="product.data"
        :labels="product.labels"
        v-for="(product, i) in chartData"
        :key="`chart_${i}`"
        type="bar"
        :id="`chart_${i}`"
        class="col-lg min-50"
      />
    </div>
  </div>
</template>

<script>
import ChartView from "../../../components/ChartView.vue";
import { CHART_COLOR_LIST } from "../../../helpers/constants";
import { filterData } from "../../../helpers/helpers";
export default {
  components: { ChartView },
  mounted() {
    this.$store.dispatch("fetchPharmacyReports");
  },
  computed: {
    reports() {
      return this.$store.getters.pharmacyReports;
    },
    /**
     * generate analysis data
     *
     *
     */
    analysis() {
      let reports = this.reports;
      let analysis = {};
      try {
        let products = filterData(reports, "product");
        for (let product in products) {
          analysis[product] = {
            competitors: {},
            share: 0,
            totalMarketShare: 0
          };
          let container = products[product];
          container.map(item => {
            analysis[product].share += this._convertProductRateToInteger(
              item.rate
            );
            analysis[
              product
            ].totalMarketShare += this._convertProductRateToInteger(item.rate);
            this._createProductCompetitors(
              analysis[product],
              item.competitor1,
              item.competitor1_rate
            );
            this._createProductCompetitors(
              analysis[product],
              item.competitor2,
              item.competitor2_rate
            );
            this._createProductCompetitors(
              analysis[product],
              item.competitor3,
              item.competitor3_rate
            );
          });
        }
      } catch (e) {
        console.log(e);
      }
      return analysis;
    },
    chartData() {
      let $data = [];
      try {
        Object.keys(this.analysis).forEach(product => {
          let container = this.analysis[product],
            labels = [product],
            data = [this.calculateSharePercentage(container.share, container)];
          let chart = {};

          Object.keys(container.competitors).forEach(competitor => {
            labels.push(competitor);
            data.push(
              this.calculateSharePercentage(
                container.competitors[competitor].share,
                container
              )
            );
          });

          $data.push({
            labels,
            data: [
              {
                data,
                backgroundColor: CHART_COLOR_LIST.slice(0, data.length),
                label: `${product.toUpperCase()} Market Share`,
                borderColor: CHART_COLOR_LIST.slice(0, data.length),
                borderWidth:2,
                fill: false
              }
            ]
          });
        });
        return $data;
      } catch (e) {
        console.log(e);
        return $data;
      }
    }
  },
  data: () => ({
    chart_type: "bar"
  }),
  methods: {
    /**
     * convert the given rate to number
     *
     *
     * @param {String} rate
     * @return {Number}
     */
    _convertProductRateToInteger(rate) {
      let share;
      switch (rate) {
        case "high":
          share = 0.75;
          break;
        case "medium":
          share = 0.5;
          break;
        case "low":
          share = 0.25;
          break;
        default:
          share = 0;
      }
      return share;
    },
    /**
     * add product to competitor container
     *
     * @param {Object} product
     * @param {String} competitor
     * @return {Object}
     */
    _createProductCompetitors(product, competitor, value) {
      if (!competitor) {
        return;
      }
      let competitors = product.competitors;
      if (!competitors[competitor]) {
        competitors[competitor] = {
          name: "",
          share: 0
        };
      }
      this._addCompetitorShare(product, competitor, value);
      return competitors;
    },
    _addCompetitorShare(product, competitor, value) {
      if (product.competitors[competitor]) {
        product.competitors[
          competitor
        ].share += this._convertProductRateToInteger(value);
        product.totalMarketShare += this._convertProductRateToInteger(value);
      }
    },
    calculateSharePercentage(item, product) {
      return item / product.totalMarketShare;
    }
  }
};
</script>

<style lang="scss">

  .min-50{
    min-width: 50%;
  }
</style>
