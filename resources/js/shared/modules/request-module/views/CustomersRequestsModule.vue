<template>
  <div class="px-0">
    <div class="px-0 shadow pb-5" style="min-height:600px">
      <p class="alert alert-success">
        <span class="fa fa-address-card"></span>
        <span class="font-weight-bold">Customers Requests</span>
      </p>
      <!-- router view -->
      <div class="px-0">
        <div class="row mx-auto">
          <div class="col-lg-3 px-0">
            <sidebar-component :links="renderViews" />
            <div class="p-2">
              <router-link to="/reports" class="btn btn-sm btn-dark btn-block">
                <span class="fa fa-chevron-circle-left"></span>
                <span>back</span>
              </router-link>
            </div>
          </div>
          <div class="col-lg-9">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from "../../../../components/SidebarComponent.vue";

export default {
  mounted() {
    Promise.all([
      this.$store.dispatch("PriceListModule/fetchProductPriceList"),
      this.$store.dispatch("UserModule/startRelatedUserRequest"),
      this.$store.dispatch("LocationsModule/startBricksFetchRequest"),
      this.$store.dispatch("RequestModule/fetchRequestTypes"),
      this.$store.dispatch("UserModule/startUserProductsRequest"),
      this.$store.dispatch("RequestModule/fetchCustomerRequests")
    ]);
  },
  components: { SidebarComponent },

  computed: {
    user() {
      return this.$store.getters["UserModule/user"];
    },
    renderViews() {
      let views = [
        {
          title: "Home",
          icon: "fa-home",
          link: "/customers-requests"
        },
        {
          title: "Add Request",
          icon: "fa-plus-circle",
          link: "/customers-requests/add"
        },
        {
          title: "Requests List",
          icon: "fa-book",
          link: "/customers-requests/list"
        },
        {
          title: "Analysis",
          icon: "fa-flask",
          link: "/customers-requests/analysis"
        }
      ];
      if (!["admin", "accountant".includes(this.user.role)]) {
        view.push({
          title: "Shared with me",
          icon: "fa-share",
          link: "/customers-requests/shared/list"
        });
      }

      if (["admin", "accountant"].includes(this.user.role)) {
        views.push(
          {
            title: "Cost Center",
            icon: "fa-flask",
            link: "/customers-requests/cost-center"
          },
          {
            title: "Events",
            icon: "fa-calendar-alt",
            link: "/customers-requests/events"
          }
        );
      }

      return views;
    }
  },
  methods: {}
};
</script>

<style></style>
