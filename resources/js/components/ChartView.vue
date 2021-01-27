<template>
  <div>
    <canvas :id="id? id : 'chart_view'"></canvas>
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
    let id = "chart_view";
    if(this.id) {
      id = this.id
    }
    let type = this.type || 'line';
    this.generateChartOptions(type, this.labels, this.chartData);
    let ctx = document.getElementById(id);
    console.log(this.chart)
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
