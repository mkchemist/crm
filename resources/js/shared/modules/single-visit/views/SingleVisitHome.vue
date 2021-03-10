<template>
  <div class="px-0 shadow rounded pb-5">
    <page-title-component :title="`Single Visits`" :icon="`fa-handshake`" />
    <div class="p-2">
     <!--  <div class="row mx-auto">
        <div class="col-lg-3">
          <sidebar-component :links="views"></sidebar-component>
          <div class="btn-group btn-block">
            <router-link to="/single-visit/pm/add" class="btn btn-sm btn-primary  my-2">
              <span class="fa fa-plus-circle"></span>
              <span>PM</span>
            </router-link>
            <router-link to="/single-visit/pharmacy/add" class="btn btn-sm btn-primary  my-2">
              <span class="fa fa-plus-circle"></span>
              <span>Pharmacy</span>
            </router-link>
          </div>
          <router-link to="/reports" class="btn btn-sm btn-dark btn-block">
            <span class="fa fa-chevron-circle-left"></span>
            <span>back</span>
          </router-link>
        </div>
        <div class="col-lg-9">
          <router-view />
        </div>
      </div> -->
      <div>
        <ul class="nav nav-tabs">
          <li v-for="(view,i) in views" :key="`view_page_${i}`" class="bg-light border rounded">
            <router-link :to="view.link" class="nav-link small" active-class="active-page" :exact="true">
              <span :class="`fa ${view.icon}`"></span>
              <span>{{ view.title }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      <div class="border">
          <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import PageTitleComponent from '../../../../components/PageTitleComponent.vue';
import SidebarComponent from "../../../../components/SidebarComponent.vue";
export default {
  components: {
    SidebarComponent,
    PageTitleComponent
  },
  data: () => ({
    views: [
      {
        title: "New PM visit",
        icon: "fa-plus",
        link: "/single-visit/pm/add"
      },
      {
        title: "New Pharmacy visit",
        icon: "fa-plus",
        link: "/single-visit/pharmacy/add"
      },
      {
        title: "PM visits",
        icon: "fa-book-reader",
        link: "/single-visit/"
      },
      {
        title: "Pharmacy visits",
        icon: "fa-book-reader",
        link: "/single-visit/pharmacy/list"
      }
    ]
  })
};
</script>

<style lang="scss" scoped>
  .active-page {
    background-color: #2196f3;
    color: white;
  }
</style>
