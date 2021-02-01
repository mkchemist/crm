<template>
  <div>
    <div class="row mx-auto">
      <!-- left side -->
      <div class="col-lg-3">
        <user-filter-box
          :users="reps"
          :data="reports"
          :onFilter="onFilter"
          :onReset="onReset"
        />
      </div>
      <!-- right side -->
      <div class="col-lg-9 px-0 shadow pb-5">
        <!-- title -->
        <p class="alert alert-success">
          <span class="fa fa-chart-bar"></span>
          <span class="font-weight-bold">Market Feedback Analysis</span>
        </p>
        <!-- Main section -->
        <div class="p-2">
          <div class="p-2"></div>
          <div v-if="reports.length">
            <div v-if="Object.keys(pivot).length">
              <!-- Export button -->
              <button
                class="btn btn-sm btn-success my-2"
                @click="exportToExcel"
              >
                <span class="fa fa-download"></span>
                <span>Export</span>
              </button>
              <!-- Data Table -->
              <table
                class="table table-sm small table-bordered"
                id="data-table"
              >
                <thead class="bg-success text-light">
                  <tr>
                    <th>Product</th>
                    <th>Global Product Share</th>
                    <th>Rep</th>
                    <th>Rep product Share</th>
                    <th>Competitor</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody
                  v-for="(product, i) in Object.keys(pivot)"
                  :key="`product_${product}_${i}`"
                >
                  <tr>
                    <td :rowspan="pivot[product].totalCellLength">
                      {{ product }}
                    </td>
                    <td :rowspan="pivot[product].totalCellLength">
                      {{
                        (
                          pivot[product].totalProductShare /
                          pivot[product].totalMarketShare
                        ).toFixed(2)
                      }}
                    </td>
                  </tr>
                  <template
                    v-for="(rep, ri) in Object.keys(pivot[product].users)"
                  >
                    <tr :key="`rep_${rep},_prod_${product}_${i}_${ri}`">
                      <td
                        :rowspan="
                          Object.keys(pivot[product].users[rep].competitors)
                            .length + 1
                        "
                      >
                        {{ rep }}
                      </td>
                      <td
                        :rowspan="
                          Object.keys(pivot[product].users[rep].competitors)
                            .length + 1
                        "
                      >
                        {{
                          (
                            pivot[product].users[rep].share /
                            pivot[product].totalMarketShare
                          ).toFixed(2)
                        }}
                      </td>
                    </tr>
                    <tr
                      v-for="(comp, ci) in Object.keys(
                        pivot[product].users[rep].competitors
                      )"
                      :key="
                        `product_${product}_rep_${rep}_competitor_${comp}_${ci}`
                      "
                    >
                      <td>{{ comp }}</td>
                      <td>
                        {{
                          (
                            pivot[product].users[rep].competitors[comp].share /
                            pivot[product].users[rep].totalMarketShare
                          ).toFixed(2)
                        }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <!-- Data Chart -->
              <div class="my-2 p-2 row mx-auto" v-if="chartData.length">
                <div v-for="(product, i) in chartData" :key="`_product_${i}`">
                  <chart-view
                    :chartData="product.data"
                    :labels="product.labels"
                    :id="`chart_product_${i}`"
                    class="col-12"
                  />
                </div>
              </div>
            </div>
            <div
              v-else
              class="d-flex flex-column justify-content-center align-items-center"
            >
              <div class="spinner-border"></div>
              <p class="text-muted">Starting data Analysis</p>
            </div>
          </div>
          <div v-else-if="fetched">
            <no-data-to-show />
          </div>
          <loader-component v-else></loader-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartView from "../../../components/ChartView.vue";
import UserFilterBox from "../../../components/UserFilterBox.vue";
import { CHART_COLOR_LIST } from "../../../helpers/constants";
import { ExportToExcel, filterData } from "../../../helpers/helpers";
import { asyncDataFlow } from "../../../helpers/http-service";

export default {
  components: { UserFilterBox, ChartView },
  mounted() {},
  computed: {
    reports() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$store.getters.pharmacyReports;
    },
    fetched() {
      return this.$store.getters.isReportsFetched;
    },
    reps() {
      return this.$store.getters.managerReps;
    },
    pivot() {
      let analysis = {};
      try {
        this.reports.map(report => {
          let _productKey = report.product;
          let _userKey = report.user;
          /* create product container */
          analysis = this._createProductContainer(
            analysis,
            _productKey,
            _userKey
          );

          let _productContainer = analysis[_productKey];
          let _userContainer = _productContainer.users[_userKey];
          /* collect product data */
          this._collectProductShare(_userContainer, report, _productContainer);
          /* calculate total product share */
          _productContainer.totalMarketShare += this._convertProductRateToInteger(
            report.rate
          );
          _productContainer.totalProductShare += this._convertProductRateToInteger(
            report.rate
          );
          _productContainer.totalMarketShare += this._convertProductRateToInteger(
            report.competitor1_rate
          );
          if (report.competitor2) {
            _productContainer.totalMarketShare += this._convertProductRateToInteger(
              report.competitor2_rate
            );
          }
          if (report.competitor3) {
            _productContainer.totalMarketShare += this._convertProductRateToInteger(
              report.competitor3_rate
            );
          }
        });
      } catch (e) {
        console.log(e);
      }
      return analysis;
    },
    chartData() {
      let chartData = [];
      let reps = this.reps;
      if (!Object.keys(this.pivot).length) {
        return chartData;
      }
      try {
        for (let product in this.pivot) {
          let _users = this.pivot[product].users;
          let __product = {
            product,
            labels: [],
            data: [
              {
                label: product,
                data: [],
                backgroundColor: [],
                borderColor: []
              }
            ]
          };
          reps.map((rep, i) => {
            __product.labels.push(rep.name);
            if (_users[rep.name]) {
              let marketShare = (
                _users[rep.name].share / this.pivot[product].totalProductShare
              ).toFixed(2);
              __product.data[0].data.push(marketShare);
              __product.data[0].backgroundColor.push(CHART_COLOR_LIST[i]);
              __product.data[0].borderColor.push(CHART_COLOR_LIST[i]);
            } else {
              __product.data[0].data.push(0);
              __product.data[0].backgroundColor.push(CHART_COLOR_LIST[i]);
              __product.data[0].borderColor.push(CHART_COLOR_LIST[i]);
            }
          });
          chartData.push(__product);
        }
      } catch (err) {
        console.log(err);
      }
      return chartData;
    }
  },
  data: () => ({
    shouldRenderFilter: false,
    filteredList: []
  }),
  methods: {
    /**
     * create product container
     *
     * create pivot data of product -> users
     *
     * @param {Object} container
     * @param {String} product
     * @param {String} user
     * @return {Object}
     */
    _createProductContainer(container, product, user) {
      if (!container[product]) {
        container[product] = {
          users: {},
          totalMarketShare: 0,
          totalCellLength: 1,
          totalProductShare: 0
        };
      }
      container[product] = this._createUserContainer(container[product], user);
      return container;
    },
    /**
     * create user container
     *
     * @param {Object} container
     * @param {String} user
     * @return {Object}
     */
    _createUserContainer(container, user) {
      if (!container.users[user]) {
        container.users[user] = {
          share: 0,
          totalMarketShare: 0,
          competitors: {}
        };
        container.totalCellLength += 1;
      }
      return container;
    },
    /**
     * convert rate to number
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
     * collect product share
     *
     * @param {Object} container
     * @param {Object} report
     * @return {void}
     */
    _collectProductShare(container, report, origin) {
      container.share += this._convertProductRateToInteger(report.rate);
      container.totalMarketShare += this._convertProductRateToInteger(
        report.rate
      );
      this._registerProductCompetitor(
        container,
        report.competitor1,
        report.competitor1_rate,
        origin
      );
      this._registerProductCompetitor(
        container,
        report.competitor2,
        report.competitor2_rate,
        origin
      );
      this._registerProductCompetitor(
        container,
        report.competitor3,
        report.competitor3_rate,
        origin
      );
    },
    /**
     * add product competitor if not exists
     * and calculate its share
     *
     * @param {Object} container
     * @param {String} competitor
     * @param {String} value
     * @param {Object} origin
     * @return {Object}
     */
    _registerProductCompetitor(container, competitor, value, origin) {
      if (!competitor) {
        return;
      }
      if (!container.competitors[competitor]) {
        container.competitors[competitor] = {
          share: 0,
          name: competitor
        };
        origin.totalCellLength += 1;
      }
      container.competitors[
        competitor
      ].share += this._convertProductRateToInteger(value);
      container.totalMarketShare += this._convertProductRateToInteger(value);
      return container;
    },
    /** Export to Excel */
    exportToExcel() {
      let origin = document.getElementById("data-table");
      let target = origin.cloneNode();
      target.innerHTML = origin.innerHTML;
      ExportToExcel(target, `${this.$store.getters.user.name}_market_share`);
    },
    /**
     * Filter data
     *
     * @param {Array} data
     */
    onFilter(data) {
      this.shouldRenderFilter = true;
      this.filteredList = [];

      asyncDataFlow(data, data => (this.filteredList = data));
    },
    /** Reset data */
    onReset() {
      this.filteredList = [];
      asyncDataFlow([], data => (this.shouldRenderFilter = false));
    }
  }
};
</script>

<style></style>
