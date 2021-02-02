<template>
  <div class="px-0 shadow rounded">
      <p class="alert alert-success">
        <span class="fa fa-calendar-day"></span>
        <span class="font-weight-bold">Coach Reports Summery</span>
      </p>
      <div class="p-2">
        <data-table-component :cols="cols"  :data="reports" />
      </div>
  </div>
</template>

<script>
import DataTableComponent from '../../../../components/DataTableComponent.vue';
import { filterData } from '../../../../helpers/helpers';
export default {
  components: {
    DataTableComponent

  },
  computed: {
    reports() {
      let reports = this.$attrs.data;
      let data = [];
      for(let day in reports) {
        for(let coach in reports[day]) {

          for(let rep in reports[day][coach]) {
            let row = {};
            row['date'] = day;
            row['coach'] = coach;
            row['rep'] = rep;
            row ['visits'] = reports[day][coach][rep].length
            row['line'] = JSON.parse(reports[day][coach][rep][0].rep.line).join(" | ");
            data.push(row);
          }
        }
      }
     return data;
    }
  },
  data:() => ({
    cols: [
      {
        title: 'Date',
        name: 'date'
      },
      {
        title: 'Coach',
        name: 'coach'
      },
      {
        title: 'Rep',
        name: 'rep'
      },
      {
        title: 'Line',
        name: 'line'
      },
      {
        title: 'Total Visits',
        name: 'visits'
      }
    ]
  }),
  methods: {
    _createDayObject() {
      return {
        date: null,
        coach: null,
        rep: null,
        visits: [],
        customers: new Set()
      }
    },
    flatteningObject(data, container) {

    }
  }
}
</script>

<style>

</style>
