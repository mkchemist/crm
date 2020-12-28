<template>
  <div class="px-0">
    <div class="p-2 row mx-auto">
      <div class="col-lg">
        <side-bar :links="add_links" />
      </div>
      <div class="col-lg">
        <side-bar :links="view_links" />
      </div>
    </div>
    <div class="p-2 row mx-auto my-2">
      <div class="col-lg">
        <side-bar :links="others_links" />
      </div>
      <div class="col-lg">
        <side-bar :links="analysis_links" />
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '../../../components/SidebarComponent';
export default {
  components: {
    SideBar
  },
  data: () => ({
    add_links: [
      {
        link : '/reports/add/coach',
        icon: 'fa-plus-circle',
        title: 'Add coach report'
      },
      {
        link: '/reports/add/pm',
        icon: 'fa-plus-circle',
        title: 'Add PM Visit'
      },
      {
        link: '/reports/add/am',
        icon : 'fa-plus-circle',
        title: 'Add AM visit'
      },
      {
        link: '/reports/add/pharmacy',
        icon: 'fa-plus-circle',
        title: 'Add Pharmacy visit'
      },
      {
        link: '/reports/add/activity-report?type=field-activity',
        icon: 'fa-plus-circle',
        title: 'Add Field Activity report'
      },
      {
        link: '/reports/add/activity-report?type=non-field-activity',
        icon: 'fa-plus-circle',
        title: 'Add Non-Field Activity report'
      },
    ],
    view_links: [
      {
        link: '/reports/view/coach-report',
        icon: 'fa-book-open',
        title: 'View Coach reports'
      },
      {
        link: '/reports/view/pm',
        icon: 'fa-book-open',
        title: 'View PM reports'
      },
      {
        link: '/reports/view/am',
        icon: 'fa-book-open',
        title: 'View AM reports'
      },
      {
        link: '/reports/view/pharmacy',
        icon: 'fa-book-open',
        title: 'View Pharmacy report'
      },
      {
        link: '/reports/view/plans',
        icon: 'fa-book-open',
        title: 'View Plans reports'
      },
      {
        link: '/reports/view/am-plans',
        icon: 'fa-book-open',
        title: 'View AM Plans reports'
      }
    ],
    analysis_links: [
      {
        link: '/reports/analysis/pm',
        icon: 'fa-chart-bar',
        title: 'PM analysis report '
      },
      {
        link: '/reports/analysis/plans',
        icon: 'fa-chart-pie',
        title: 'Plan analysis report'
      }
    ],
    others_links: [
      {
        link: '/reports/activity-report?type=field-activity',
        icon: 'fa-book-reader',
        title: 'Field Activity report'
      },
      {
        link: '/reports/activity-report?type=non-field-activity',
        icon: 'fa-book-reader',
        title: 'Non-Field Activity report'
      },
      {
        link: '/reports/requests',
        icon: 'fa-dollar-sign',
        title: 'Requests report'
      }
    ]
  })
}
</script>

<style>

</style>
