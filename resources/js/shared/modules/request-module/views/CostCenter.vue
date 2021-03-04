<template>
  <div class="px-0 shadow rounded pb-5">
    <page-title-component title="Cost Center Analysis" icon="fa-flask" />
    <div class="p-2">
      <div class="p-2" v-if="requests.length">
        <div class="p-2">
          <button class="btn btn-sm btn-success" @click="exportToExcel">
            <span class="fa fa-file-excel"></span>
            <span>Export To Excel</span>
          </button>
          <table class="table table-sm small table-responsive table-striped table-bordered my-2" id="cost_analysis">
            <thead>
              <tr>
                <th>Business Unit</th>
                <th>Total no. of Requests</th>
                <th>Total Requests Cost</th>
                <th>Total Request Benefits</th>
                <th>%</th>
                <th>Total Requests users</th>
                <th>Total Requests months</th>
                <th>Requests per month</th>
                <th>Request Average Cost</th>
                <th>Request Average benefit</th>
                <th>Global Cost</th>
                <th>Global Benefit</th>
                <th>Global Cost share</th>
                <th>Global Benefit Share</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data,bu) in requestCostCenter.res.users" :key="`user_${bu}`">
                <td>{{ bu }}</td>
                <td>{{ data.total_requests }}</td>
                <td>{{ data.total_cost }}</td>
                <td>{{ data.total_benefits }}</td>
                <td>{{ ((data.total_cost/data.total_benefits)*100).toFixed(1) }} %</td>
                <td>{{ data.members.size }}</td>
                <td>{{ data.months.size }}</td>
                <td>{{ data.total_requests/data.months.size }}</td>
                <td>{{ (data.total_cost/data.total_requests.toFixed(1)) }}</td>
                <td>{{ (data.total_benefits/data.total_requests).toFixed(1) }}</td>
                <td>{{ requestCostCenter.res.totalCost }}</td>
                <td>{{ requestCostCenter.res.totalBenefits }}</td>
                <td>{{ ((data.total_cost/requestCostCenter.res.totalCost)*100).toFixed(1) }} %</td>
                <td>{{ ((data.total_benefits/requestCostCenter.res.totalBenefits)*100).toFixed(1) }} %</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="my-2">
          <button class="btn btn-sm btn-primary" @click="toggleCostChart">
            <span class="fa fa-chart-bar"></span>
            <span v-if="showCostChart">Draw Cost chart</span>
            <span v-else>Hide Cost chart</span>
          </button>
          <div v-if="showCostChart">
            <chart-view :chartData="requestCostCenter.charts.data" :labels="requestCostCenter.charts.labels" />
          </div>
        </div>
      </div>
      <loader-component v-else/>
    </div>
  </div>
</template>

<script>
import ChartView from '../../../../components/ChartView.vue';
import LoaderComponent from '../../../../components/LoaderComponent.vue';
import PageTitleComponent from '../../../../components/PageTitleComponent.vue'
import { CHART_COLOR_LIST } from '../../../../helpers/constants';
import { ExportToExcel } from '../../../../helpers/helpers';
import { httpCall } from '../../../../helpers/http-service';
export default {
  components: { PageTitleComponent, ChartView, LoaderComponent },
  mounted() {
    this.$store.dispatch('RequestModule/fetchCustomerRequests');
    this.fetchPriceList();
  },
  beforeRouteEnter(to, from ,next){
    let user = JSON.parse(document.querySelector('#user').value);
    if(['admin', 'accountant'].includes(user.role)) {
      next();
    } else {
      next("/customers-requests/list")
    }
  },
  computed: {
    requests() {
      let requests =  this.$store.getters["RequestModule/requests"];
      requests.forEach(request => {
        request['cost'] = request.cost/request.quantity;
        request['total_cost'] = request.cost;
        request['line'] = request.user.line.join(" | ");
        request['bu'] = this.getBUName(request);
        request['am'] = this.getAMName(request);
      })
      return requests;
    },
    user() {
      return this.$store.getters["UserModule/user"];
    },
    users() {
      let users = [];
      let relatedUsers = this.$store.getters["UserModule/relations"];
      try {
        for (let key in relatedUsers) {
          users = [...users, ...relatedUsers[key]];
        }
        return users;
      } catch (e) {
        console.log(e);
        return users;
      }
    },
    requestCostCenter() {
      let requests = this.requests;
      let res = {
        users: {},
        totalCost: 0,
        totalBenefits: 0,
      };
      let charts = {
        timeline: {
          labels: [],
          data: [{
            data:[]
          }]
        }
      }
      try {
        if(requests.length) {
          requests.map(request => {
            res.users = this.calculateUserCost(request,request.bu, res.users, res);
          })
          charts = this.getChartData(res)
        }
      }catch(e) {
        console.log(e)
        return {res, charts};
      }
      return {res, charts};
    }
  },
  data: () => ({
    priceList: {},
    showCostChart: false
  }),
  methods: {
    fetchPriceList() {
      return httpCall.get("v1/price-list")
      .then(({data}) => {
        this.priceList = data.data;
      }).catch(err => console.log(err))
    },
    getBUName(row) {
      let users = this.users.filter(user => user.role === "rm");
      let name = "----------";
     if(row.user.role === "rm") {
        return row.user.name;
      } else {

        users.map(user => {
          let rel = JSON.parse(user.user_relations);
          if(rel[row.user.role].includes(row.user.id)) {
            name =user.name;
          }
        })
        return name;
      }
    },
    getAMName(row) {
      let users = this.users.filter(user => user.role === "am");
      let name = "----------";
      if(["am", "rm"].includes(row.user.role)) {
        return row.user.name;
      } else {
        users.map(user => {
          let rel = JSON.parse(user.user_relations);
          if(rel[row.user.role].includes(row.user.id)) {
            name =user.name;
          }
        })
        return name;
      }
    },
    calculateUserCost(container, user, res, total) {
      if(!res[user]) {
        res[user] = {
          total_cost: 0,
          total_requests: 0,
          total_benefits: 0,
          members: new Set(),
          months: new Set()
        }
      }
      res[user].total_cost += container.total_cost;
      res[user].total_requests += 1;
      res[user].members.add(container.user.name)
      let month = new Date(container.apply_date).getMonth() +1;
      res[user].months.add(month);
      res[user].total_benefits += this.priceList[container.product] * container.total_rx
      if(Object.keys(this.priceList)) {
        let benefit = this.priceList[container.product] * container.total_rx
        total.totalBenefits += benefit;
      }
      total.totalCost += container.cost;
      return res;
    },
    getChartData(data) {
      let d = {
        labels: ['Cost', 'Benefits'],
        data: []
      }
      for(let user in data.users) {
        let _user = data.users[user];
        let _data = [];
        _data.push(_user.total_cost, _user.total_benefits);
        d.data.push({
          label: `#${user}`,
          data: _data,
          backgroundColor: CHART_COLOR_LIST,
          borderColor: CHART_COLOR_LIST,
          fill: false
        });
      }
      return d;
    },
    toggleCostChart() {
      this.showCostChart = !this.showCostChart;
    },
    exportToExcel() {
      let name = `Cost analysis ${new Date().toISOString().split("T")[0]}`;
      ExportToExcel('#cost_analysis', name);
    }
  }
}
</script>

<style>

</style>
