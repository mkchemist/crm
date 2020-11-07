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
        link: '/reports/add/coach-report',
        icon : 'fa-plus-circle',
        title: 'Add Coach report'
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
      }
    ],
    view_links: [
      {
        link: '/reports/view/coach-report',
        icon: 'fa-book-open',
        title: 'View Coach reports'
      },
      {
        link: '/reports/view/am',
        icon: 'fa-book-open',
        title: 'View PM reports'
      },
      {
        link: '/reports/view/pm',
        icon: 'fa-book-open',
        title: 'View AM reports'
      },
      {
        link: '/reports/view/pharmacy',
        icon: 'fa-book-open',
        title: 'View PM reports'
      },
      {
        link: '/reports/view/plans',
        icon: 'fa-book-open',
        title: 'View Plans reports'
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
    ]
  })
}
</script>

<style>

</style>
