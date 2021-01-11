<template>
  <div class="row mx-auto">
    <div class="col-lg-3">
      <date-filter-box :data="reports" :onFilter="onFilter" :onReset="onReset" :dateField="`date`" />
    </div>
    <div class="col-lg-9 px-0 shadow rounded">
      <p class="alert alert-success">
        <span><i class="fa fa-book-reader"></i></span>
        <span class="font-weight-bold">View coaching reports</span>
      </p>
      <div class="p-2">
        <div v-if="reportsData.length">
          <table-component
            :data="reportsData"
            :heads="heads"
            :unselectable="true"
            head-class="bg-success text-light"
          >
            <template v-slot:head:before>
              <th>Action</th>
            </template>
            <template v-slot:body:before="{item}">
              <td>
                <router-link :to="`/reports/view/coaching-report/${item.id}`" class="btn btn-sm btn-primary">
                  <span>view</span>
                </router-link>
              </td>
            </template>
          </table-component>
        </div>
        <div v-else-if="fetched">
          <no-data-to-show />
        </div>
        <loader-component v-else/>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../../helpers/http-service'
import TableComponent from "../../../components/TableComponent";
import NoDataToShow from "../../../components/NoDataToShow";
import DateFilterBox from '../../../components/DateFilterBox.vue';

export default {
  mounted() {
    this.getAllCoachingReports();
  },
  components: {
    TableComponent,
    NoDataToShow,
    DateFilterBox,
  },
  computed: {
    reportsData() {
      if(this.shouldRenderFilter) {
        return this.filteredList
      }
      return this.reports;
    }
  },
  data: () => ({
    reports: [],
    fetched: false,
    shouldRenderFilter: false,
    filteredList: [],
    heads: [
      {
        title: 'Date',
        name: 'date'
      },
      {
        title: 'Customer',
        name: 'customer'
      },
      {
        title: 'Coach',
        name: 'coach'
      },
      {
        title: 'Specialty',
        name: 'specialty'
      },
      {
        title: 'Address',
        name: 'address'
      },
      {
        title: 'Brick',
        name: 'brick'
      }
    ]
  }),
  methods: {
    getAllCoachingReports() {
      this.reports = [];
      this.fetched = false;
      httpCall.get('rep/v1/reports/coaching')
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.reports = data.data;
          this.fetched = true
        })
      })
    },
    onFilter(data) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      let async = ()=>Promise.resolve(data);
      async().then(data => this.filteredList= data);
    },
    onReset() {
      this.filteredList = [];
      let async = ()=>Promise.resolve(this.reports);
      async().then(data => this.filteredList= data);
    }
  }
}
</script>

<style>

</style>
