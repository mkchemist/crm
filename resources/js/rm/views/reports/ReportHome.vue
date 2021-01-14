<template>
  <div class="p-2">
    <div class="row mx-auto">
      <div class="col-lg">
        <sidebar-component :links="addLinks" />
      </div>
      <div class="col-lg">
        <sidebar-component :links="viewLinks" />
      </div>
    </div>
    <div class="row mx-auto my-3">
      <div class="col-lg">
        <sidebar-component :links="otherLinks" />
      </div>
      <div class="col-lg">
        <sidebar-component :links="analysisLinks" />
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '../../../components/SidebarComponent.vue';
export default {
  components: {
    SidebarComponent,
  },
  data: () => ({
    addLinks: [
      {
        title: 'Add Field Activity',
        icon: 'fa-plus-circle',
        link: '/reports/add/activity-report?type=field-activity'
      },
      {
        title: 'Add Non Field Activity',
        icon: 'fa-plus-circle',
        link: '/reports/add/activity-report?type=non-field-activity'
      },
      {
        title: 'Create new Request',
        icon: 'fa-plus-circle',
        link: '/reports/add/request'
      },
    ],
     viewLinks: [
      {
        title: 'View Coach reports',
        icon: 'fa-book-reader',
        link: '/reports/view/coach-report'
      },
      {
        title: 'View PM reports',
        icon: 'fa-book-reader',
        link: '/reports/view/pm'
      },
      {
        title: 'View AM reports',
        icon: 'fa-book-reader',
        link: '/reports/view/am'
      },
      {
        title: 'View Pharmacy reports',
        icon: 'fa-book-reader',
        link: '/reports/view/pharmacy'
      },
      {
        title: 'View Plan reports',
        icon: 'fa-book-reader',
        link: '/reports/view/plan'
      },
      {
        title: 'View Missed customer',
        icon: 'fa-book-reader',
        link: '/reports/view/missed-customers'
      }
    ],
     analysisLinks: [
      {
        title: 'View PM analysis report',
        icon: 'fa-chart-line',
        link: '/reports/analysis/pm'
      },
      {
        title: 'View AM analysis report',
        icon: 'fa-chart-line',
        link: '/reports/analysis/am'
      },
      {
        title: 'View Plan analysis report',
        icon: 'fa-chart-line',
        link: '/reports/analysis/plan'
      },
    ],
     otherLinks: [
      {
        title: 'View Filed Activity report',
        icon: 'fa-book-reader',
        link: '/reports/activity?type=field-activity'
      },
      {
        title: 'View Filed Activity report',
        icon: 'fa-book-reader',
        link: '/reports/activity?type=non-field-activity'
      },
      {
        title: 'View Request report',
        icon: 'fa-chart-line',
        link: '/reports/requests'
      },
    ]
  })
};
</script>

<style></style>

SidebarComponent
