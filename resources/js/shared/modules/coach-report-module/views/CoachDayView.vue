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
export default {
  components: {
    DataTableComponent

  },
  computed: {
    reports() {
     return this.$attrs.data;
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
        name: 'coach_name'
      },
      {
        title: 'Rep',
        name: 'rep_name'
      },
      {
        title: 'Line',
        name: (row) => {
          return JSON.parse(row.line).join(" | ")
        }
      },
      {
        title: 'Total Visits',
        name: 'visits'
      },
      {
        title: 'Submitted',
        name: (row) => {
          return "False"
        }
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
