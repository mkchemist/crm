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
                    analysis[product].share / analysis[product].totalMarketShare
                  ).toFixed(1)
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
                    analysis[product].competitors[competitor].share /
                    analysis[product].totalMarketShare
                  ).toFixed(1)
                }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="p-2 my-2" v-if="Object.keys(analysis).length">

      <div class="container">
        <div class="form-group">
          <select name="" id="" v-model="chart_type">
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
        </div>
      <chart-view
        :chartData="dataChart.data"
        :labels="dataChart.labels"
        :type="dataChart.type"
      />
      </div>
    </div>
  </div>
</template>

<script>
import ChartView from "../../../components/ChartView.vue";
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
        reports.map(report => {
          let product = report.product;
          if (!analysis[product]) {
            analysis[product] = {
              competitors: {},
              share: 0,
              stock: 0,
              order: 0,
              totalMarketShare: 0
            };
          }
          analysis[product].share += this._convertProductRateToInteger(
            report.rate
          );
          analysis[
            product
          ].totalMarketShare += this._convertProductRateToInteger(report.rate);
          analysis[product].competitors = this._createProductCompetitors(
            analysis[product],
            report.competitor1
          );
          analysis[product].competitors = this._createProductCompetitors(
            analysis[product],
            report.competitor2
          );
          analysis[product].competitors = this._createProductCompetitors(
            analysis[product],
            report.competitor3
          );
          analysis[product].competitors[
            report.competitor1
          ].share += this._convertProductRateToInteger(report.competitor1_rate);
          analysis[product].competitors[
            report.competitor2
          ].share += this._convertProductRateToInteger(report.competitor2_rate);
          analysis[product].competitors[
            report.competitor3
          ].share += this._convertProductRateToInteger(report.competitor3_rate);
          analysis[
            product
          ].totalMarketShare += this._convertProductRateToInteger(
            report.competitor1_rate
          );
          analysis[
            product
          ].totalMarketShare += this._convertProductRateToInteger(
            report.competitor2_rate
          );
          analysis[
            product
          ].totalMarketShare += this._convertProductRateToInteger(
            report.competitor3_rate
          );

          /*  analysis[product].competitors[report.competitor2].share += this._convertProductRateToInteger(report.competitor2_rate); */
        });
      } catch (e) {
        console.log(e);
      }
      return analysis;
    },
    dataChart() {
      let color = {
        Syno : 'orange',
        'C-retard' : 'green',
        'C-vit' : 'lightgreen',
        'Rosha' : 'royalblue',
        'V-drop' : 'aquamarine',
        'D-Cal' : 'brown'
      };
      let labels = ['Share'];
      let data = [];
      let analysis = this.analysis;
      for(let i in analysis) {
        let _d = {};
        _d['label'] = i;
        _d['data'] = [(analysis[i].share/analysis[i].totalMarketShare)]
        _d['borderColor'] = color[i];
        _d['backgroundColor'] = color[i];
        _d['borderWidth'] = 2;
          data.push(_d)
        for(let x in analysis[i].competitors) {
          if(x !== "null") {
            let _x = {};
            _x['label'] = x;
            _x['data'] = [(analysis[i].competitors[x].share/analysis[i].totalMarketShare)]
            _x['borderColor'] = color[x];
            _x['backgroundColor'] = color[x];
          _x['borderWidth'] = 2;
            data.push(_x)
          }
        }
      }
      return {
        labels,
        data,
        type: 'bar'
      };
    }
  },
  data: () => ({
    chart_type: 'bar'
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
    _createProductCompetitors(product, competitor) {
      let competitors = product.competitors;
      if (!competitors[competitor]) {
        competitors[competitor] = {
          name: "",
          share: 0
        };
      }
      return competitors;
    }
  }
};
</script>

<style></style>
