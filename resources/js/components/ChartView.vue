<template>
  <div>
    <canvas :id="id"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/dist/Chart.bundle";
export default {
  props: {
    id: {
      type: String,
    },
    type: {
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
    return;
    if(!this.id) {
      this.id = "chart_view";
    }

    this.generateChartOptions(this.type, this.labels, this.chartData);
    let ctx = document.getElementById(this.id);
    let chart = new Chart(ctx, this.chart);
  },
  data:() => ({
    chart: null
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
                ticks : {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      }
    }
  }
}
</script>

<style>

</style>
