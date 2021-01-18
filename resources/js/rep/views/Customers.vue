<template>
  <div>
    <div class="row mx-auto">
      <div class="col-lg-3">
        <sidebar-component :links="links" />
      </div>
      <!-- <customers-side-bar /> -->
      <div class="col-lg-9 p-2">
        <router-view class="page-fade"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from "../../components/SidebarComponent";
export default {
  components: {
    SidebarComponent
  },
  mounted() {
    this.$store.dispatch("customerGetAll");
  },
  data: () => ({
    links: [
      {
        title: "Add",
        link: "/customers/new",
        icon: "fa-plus-circle"
      },
      {
        title: "Active",
        link: "/customers",
        icon: "fa-unlock"
      },
      {
        title: "Inactive",
        link: "/customers/inactive",
        icon: "fa-lock"
      },
      {
        title: "All",
        link: "/customers/all",
        icon: "fa-user-md"
      },
      {
        title: "Favorite",
        link: "/customers/favorite",
        icon: "fa-star"
      },
      {
        title: 'Frequency',
        link: '/customers/frequency',
        icon: 'fa-wave-square'
      }
    ]
  })
};
</script>

<style></style>
