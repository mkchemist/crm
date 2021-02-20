<template>
  <div>
    <div class="p-2">
      <select name="" id="" v-model="chartType" @change="changeType">
        <option value="bar">Bar</option>
        <option value="line">Line</option>
        <option value="pie">Pie</option>
        <option value="doughnut">Doughnut</option>
      </select>
    </div>
    <div>
      <canvas :id="id ? id : 'chart_view'" class="w-100 col-12"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/dist/Chart.bundle";
//import ChartDataLabels from "chartjs-plugin-datalabels";
//Chart.plugins.register(ChartDataLabels)
export default {
  props: {
    id: {
      type: String
    },

    chartData: {
      type: Array,
      required: true
    },
    labels: {
      type: Array,
      required: true
    }
  },
  mounted() {
    let id = "chart_view";
    if (this.id) {
      id = this.id;
    }
    let type = this.chartType;
    this.generateChartOptions(type, this.labels, this.chartData);
    let ctx = document.getElementById(id);
    this.chartInstance = new Chart(ctx, this.chart);
  },
  data: () => ({
    chartInstance: null,
    chart: null,
    chartType: "bar"
  }),
  methods: {
    generateChartOptions(type, labels, data) {

      this.chart = {
        type,
        data: {
          labels: labels,
          datasets: data
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          /* plugins: {
            datalabels: {
              color: "#36A2EB"
            }
          } */
        }
      };
    },
    changeType() {
      this.chartInstance.config.type = this.chartType;
      this.chartInstance.update();
    }
  }
};
</script>

<style></style>
