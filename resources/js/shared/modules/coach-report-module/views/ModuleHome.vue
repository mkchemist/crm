<template>
  <div class="my-2">
    <div
      :class="user.role !== 'admin' ? `row mx-auto` : ''"
      style="min-height:600px"
    >
      <div class="col-lg p-2">
        <coach-report-overview />
      </div>
      <div class="col-lg p-2">
        <sidebar-component :links="links" />
        <div class="my-2 p-2">
          <router-link to="/reports" class="btn btn-sm btn-dark btn-block">
            <span class="fa fa-chevron-circle-left"></span>
            <span>back</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from "../../../../components/SidebarComponent.vue";
import CoachReportOverview from "./CoachReportOverview.vue";
export default {
  components: {
    SidebarComponent,
    CoachReportOverview
  },
  computed: {
    links() {

      let links = [];
      if (this.$store.state.CoachReportModule.moduleUser.role !== "rep") {
        links.push({
          title: "Add Coach Report",
          icon: "fa-plus",
          link: "/coach/add"
        });
      }
      links = [
        ...links,
        {
          title: "Coach Report List",
          icon: "fa-list",
          link: "/coach/list"
        },
        {
          title: "Coach Follow up",
          icon: "fa-chart-line",
          link: "/coach/follow-up"
        },
        {
          title: "Coach analysis",
          icon: "fa-flask",
          link: "/coach/analysis"
        },
        {
          title: "Table View",
          icon: "fa-table",
          link: "/coach/table"
        }
      ];
      return links;
    },
    user() {
      return this.$store.state.CoachReportModule.moduleUser;
    }
  },
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>
