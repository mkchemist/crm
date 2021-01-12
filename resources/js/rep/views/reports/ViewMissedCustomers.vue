<template>
  <div class="row mx-auto pb-5">
    <div class="col-lg-3">
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
                  <td>
                    <span v-html="getCustomerStatus(item)"></span>
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
import { httpCall } from '../../../helpers/http-service'
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
      }
    ]
  }),
  methods: {
    fetchData() {
      this.data = [];
      this.fetched = false;
      httpCall.get('rep/v1/reports/missed-customers')
      .then(({data}) => {
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
    getCustomerStatus(item) {
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
      return `<span class="${style} p-1">${flag}</span>`;
    }
  }
}
</script>

<style>

</style>
