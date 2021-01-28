<template>
  <div class="row mx-auto">
    <div class="col-lg-3">
      <sidebar-component :links="views" />
      <router-link to="/pharmacies" class="my-2 btn btn-sm btn-block btn-dark">
        <span class="fa fa-chevron-circle-left"></span>
        <span>back</span>
      </router-link>
    </div>
    <div class="col-lg-9 pb-5">
      <div v-if="data">
        <router-view :data="data" class="pb-5" />
      </div>
      <div v-else-if="fetched">
        <div class="jumbotron text-center text-muted">
          <span class="fa fa-exclamation-circle fa-2x text-danger"></span>
          <p class="h1">Something went wrong</p>
          <p class="text-danger">{{ error }}</p>
        </div>
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import SidebarComponent from "../../../components/SidebarComponent.vue";
import { httpCall } from "../../../helpers/http-service";
export default {
  mounted() {
    this.fetchPharmacyData();
  },
  components: { SidebarComponent },
  computed: {
    views() {
      let id = this.$route.params.id;
      return [
        {
          title: "Info.",
          icon: "fa-info",
          link: `/pharmacies/view/${id}`
        },
        {
          title: "Reports",
          icon: "fa-book-reader",
          link: `/pharmacies/view/${id}/reports`
        },
        {
          title: "Health days",
          icon: "fa-cogs",
          link: `/pharmacies/view/${id}/health-day`
        }
      ];
    }
  },
  data: () => ({
    data: null,
    fetched: false,
    error: null
  }),
  methods: {
    fetchPharmacyData() {
      let id = this.$route.params.id;

      return httpCall
        .get("otc-manager/v1/pharmacies/" + id)
        .then(({ data }) => {
          if (data.code !== 200) {
            this.error = data.message;
            this.fetched = true;
          } else {
            this.data = data.data;
          }
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style></style>
