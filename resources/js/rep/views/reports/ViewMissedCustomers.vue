<template>
  <div class="row mx-auto pb-5">
    <div class="col-lg-3">
      <div class="border small rounded p-2">
        <div class="form-group">
          <label for="" class="">Status</label>
          <select name="view_status" id="view_status" class="form-control form-control-sm" v-model="view_status">
            <option value="all">All</option>
            <option :value="val" v-for="(val, key) in status" :key="`status_${key}`">{{ val }}</option>
          </select>
        </div>
        <div class="form-group text-right">
          <button class="btn btn-sm btn-primary" @click="filterStatus">
            <span class="fa fa-check-circle"></span>
            <span>ok</span>
          </button>
          <button class="btn btn-sm btn-secondary" @click="resetStatus">
            <span class="fa fa-reset"></span>
            <span>reset</span>
          </button>
        </div>
      </div>
      <date-filter-box  :data="data" :onFilter="onFilter" :onReset="onReset" :dateField="`Date`" />
    </div>
    <div class="col-lg-9 shadow rounded px-0 pb-5">
      <p class="alert alert-success">
        <span class="fa fa-book-reader"></span>
        <span class="font-weight-bold">View Missed Customers</span>
      </p>
      <div class="p-2">
        <div v-if="reports.length">
          <table-component :data="reports" :heads="heads" :unselectable="true" :headClass="`bg-dark text-light`">
            <template v-slot:head>
                  <th>Status</th>
                  <th>Adreess</th>
                  <th>Brick</th>
                  <th>Area</th>
                </template>
                <template v-slot:body="{ item }">
                  <td :class="item.style">
                    {{ item.status }}
                  </td>
                  <td>{{ item.Address }}</td>
                  <td>{{ item.Brick }}</td>
                  <td>{{ item.Area }}</td>
                </template>
            </table-component>
        </div>
        <div v-else-if="fetched">
          <no-data-to-show :title="`No missed doctors`" />
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import DateFilterBox from '../../../components/DateFilterBox.vue';
import NoDataToShow from '../../../components/NoDataToShow.vue';
import TableComponent from '../../../components/TableComponent.vue';
import { asyncDataFlow, httpCall } from '../../../helpers/http-service'
export default {
  mounted() {
    this.fetchData();
  },
  components: {
    TableComponent,
NoDataToShow,
    DateFilterBox
  },
  computed: {
    reports() {
      if(this.shouldRenderFilter) {
        return this.filteredList
      }
      return this.data;
    }
  },
  data: () => ({
    data: [],
    fetched:true,
    shouldRenderFilter: false,
    filteredList: [],
    status: new Set(),
    view_status: 'all',
    heads: [
      {
        title: 'Customer',
        name: 'Customer'
      },
      {
        title: 'Specialty',
        name: 'Specialty'
      },
      {
        title: 'Parameter',
        name: 'parameter'
      },
      {
        title: 'Plans',
        name: 'CountOfPlans'
      },
      {
        title: 'Visits',
        name: 'CountOfVisits'
      },
      {
        title: 'Difference',
        name:'difference'
      },
    ],
  }),
  methods: {
    fetchData() {
      this.data = [];
      this.fetched = false;
      httpCall.get('rep/v1/reports/missed-customers')
      .then(({data}) => {
        data.data.forEach(item => {
          let {flag, style} = this.calculateStatus(item)
          item['status'] = flag;
          item['style'] = style;
          this.status.add(item['status'])
        })
        this.data = data.data;
        this.fetched = true
      }).catch(err => console.log(err))
    },
    onFilter(data) {
      this.shouldRenderFilter =true;
      this.filteredList = [];
      let async = () => Promise.resolve(data);
      async().then(data => this.filteredList = data);
    },
    onReset() {
      this.filteredList = [];
      let async = () => Promise.resolve(this.data);
      async().then(data => this.filteredList = data);
    },
    calculateStatus(item) {
      let flag, style;
      if (item.difference > 0 && item.difference === item.CountOfPlans) {
        flag = "Uncovered";
        style = "bg-danger text-light";
      } else if (item.difference > 0 && item.difference !== item.CountOfPlans) {
        flag = "Missed";
        style = "bg-warning text-dark";
      } else if (item.difference === 0) {
        flag = "Accomplished";
        style = "bg-success text-light";
      } else {
        flag = "Over";
        style = "bg-primary text-light";
      }
      return {
        flag,
        style
      }
    },
    filterStatus(){
      let data;
      if(this.view_status === "all") {
        data = this.data;
      } else {
        data = this.data.filter(report => report.status === this.view_status);
      }
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(data, data => this.filteredList = data);
    },
    resetStatus() {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      this.view_status = "all"
      asyncDataFlow(this.data, data => this.filteredList = data);
    },
  }
}
</script>

<style>

</style>
