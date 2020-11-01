<template>
  <div>
      <div class="p-3">
        <div class="row mx-auto p-3">
          <div class="col-lg">
            <list-component :links="addLinks" />
          </div>
          <div class="col-lg">
            <list-component :links="reportLinks" />
          </div>
        </div>
        <hr>
        <div class="row mx-auto p-3">
          <div class="col-lg">
          </div>
          <div class="col-lg">
            <list-component :links="analysisLinks" />
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import ListComponent from "../../../components/SidebarComponent";
export default {
  components: {
    ListComponent
  },
  data: () => ({
    addLinks : [
      {
        title: 'Add new PM visit',
        link: '/reports/add/pm',
        icon : 'fa-plus-circle'
      },
      {
        title: 'Add new AM visit',
        link: '/reports/add/am',
        icon: 'fa-plus-circle'
      },
      {
        title: 'Add new Pharmacy visit',
        link: '/reports/add/pharmacy',
        icon: 'fa-plus-circle'
      }
    ],
    reportLinks: [
      {
        title: 'View PM report',
        link: '/reports/view/pm',
        icon: 'fa-book-open'
      },{
        title: 'View AM report',
        link: '/reports/view/am',
        icon: 'fa-book-open'
      },{
        title: 'View pharmacy report',
        link: '/reports/view/pharmacy',
        icon: 'fa-book-open'
      },
      {
        title: 'View plans report',
        link: '/reports/view/plans',
        icon: 'fa-book-open'
      }
    ],
    analysisLinks: [
      {
        title: 'View PM analysis report',
        link: '/reports/analysis/pm',
        icon: 'fa-chart-line'
      },{
        title: 'View plan analysis report',
        link: '/reports/analysis/plan',
        icon: 'fa-chart-area'
      },{
        title: 'Time investment',
        link: '/reports/view/pharmacy',
        icon: 'fa-chart-pie'
      }
    ]
  })
}
</script>

<style>

</style>
