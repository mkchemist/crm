<template>
  <div class="p-2">

    <div class="row mx-auto">
      <div class="col-lg-6">
        <sidebar-component :links="addLinks" />
      </div>
      <div class="col-lg-6">
        <sidebar-component :links="viewLinks" />
      </div>
    </div>

    <div class="row mx-auto">
      <div class="col-lg-6">

      </div>
      <div class="col-lg-6">
        <sidebar-component :links="performanceLinks" />
      </div>
    </div>

  </div>
</template>

<script>
import SidebarComponent from '../../../components/SidebarComponent.vue'
export default {
  components: {
    SidebarComponent

  },
  data: () => ({
    viewLinks: [
      {
        title: 'View Pharmacy Report',
        icon: 'fa-book-reader',
        link: '/reports/view/pharmacy'
      },
      {
        title: 'View Health day Report',
        icon: 'fa-book-reader',
        link: '/reports/view/health-day'
      },
      {
        title: 'View plan Report',
        icon: 'fa-book-reader',
        link: '/reports/view/plan'
      },
      {
        title: 'View Orders',
        icon: 'fa-book-reader',
        link: '/reports/view/orders'
      },
      {
        title: "View Field Activity Report",
        icon: "fa-book",
        link: "/reports/activity-report?type=field-activity"
      },
      {
        title: "View Non Field Activity Report",
        icon: "fa-book",
        link: "/reports/activity-report?type=non-field-activity"
      },
      {
        title: "Coverage Report",
        icon: "fa-book",
        link: "/reports/coverage"
      }
    ],
    addLinks: [
      {
        title: 'Add Pharmacy report',
        icon: 'fa-plus-circle',
        link: '/reports/add/pharmacy'
      },
      {
        title: 'Add health day report',
        icon: 'fa-plus-circle',
        link: '/reports/add/health-day'
      },
      {
        title: "Add Field Activity Report",
        icon: 'fa-plus-circle',
        link: '/reports/add/activity?type=field-activity'
      },
      {
        title: "Add Non Field Activity Report",
        icon: "fa-plus-circle",
        link : "/reports/add/activity?type=non-field-activity"
      }
    ],
    performanceLinks: [
      {
        title: 'Market Feedback',
        icon: 'fa-chart-line',
        link: '/reports/analysis/market'
      },

    ]
  })
}
</script>

<style>

</style>
