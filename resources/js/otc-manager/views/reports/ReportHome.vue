<template>
  <div>
    <div class="row mx-auto">
      <div class="col-lg">
        <sidebar-component :links="views.analysis" />
      </div>
      <div class="col-lg">
        <sidebar-component :links="views.read" />
      </div>
    </div>
    <div class="row mx-auto my-2">
      <div class="col-lg">

      </div>
      <div class="col-lg">
        <sidebar-component :links="views.activity"/>
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
    views: {
      read: [
        {
          title: 'View Pharmacy Reports',
          icon: 'fa-book-reader',
          link: '/reports/view/pharmacy'
        },
        {
          title: 'View Health Day reports',
          icon: 'fa-book-reader',
          link: '/reports/view/health-day'
        },
        {
          title: 'View Plan Report',
          icon: 'fa-book-reader',
          link: '/reports/view/plan'
        },
        {
          title: 'View Orders',
          icon: 'fa-book-reader',
          link: '/reports/view/orders'
        }
      ],
      analysis: [
        {
          title:'View Market Feedback',
          icon: 'fa-chart-line',
          link: '/reports/market-feedback'
        },
        {
          title:'Coverage',
          icon: 'fa-chart-pie',
          link: '/reports/coverage'
        },
      ],
      activity: [
        {
          title: "View Field Activity Reports",
          icon: 'fa-book-open',
          link: '/reports/activity?type=field'
        },
        {
          title: "View Non-Field Activity Reports",
          icon: 'fa-book-open',
          link: '/reports/activity?type=non-field'
        },
      ]
    }
  })
}
</script>

<style>

</style>
