<template>
  <div class="p-2">
    <div class="row mx-auto">
      <div class="col-lg">
        <sidebar-component :links="another"/>
      </div>
      <div class="col-lg">
        <sidebar-component :links="viewLinks" />
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from '../../../components/SidebarComponent.vue'
export default {
  components: {SidebarComponent},
  data:() => ({
    viewLinks: [
      {
        title: 'PM reports',
        icon : 'fa-book-reader',
        link: '/reports/view/pm'
      },
      {
        title: 'AM reports',
        icon : 'fa-book-reader',
        link: '/reports/view/am'
      },
      {
        title: 'Pharmacy reports',
        icon : 'fa-book-reader',
        link: '/reports/view/pharmacy'
      },
      {
        title: 'Missed visits reports',
        icon : 'fa-book-reader',
        link: '/reports/view/missed'
      },
      {
        title: 'Coaching Reports',
        icon : 'fa-book-reader',
        link: '/coach'
      },
    ],
    another: [
      {
        title: "Customer Requests",
        icon: "fa-dollar-sign",
        link: "/customers-requests"
      }
    ]
  })
}
</script>

<style>

</style>
