<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-list"></span>
      <span class="font-weight-bold">View Pharmacy {{ pharmacy ? pharmacy.name : '' }}</span>
    </p>
    <div class="p-2">
      <div class="p-2">
        <ul class="nav nav-tabs">
          <li class="nav-item mx-1 bg-light">
            <router-link :to="generatePageLink()" class="nav-link" active-class="activePage" exact>
              <span>Info.</span>
            </router-link>
          </li>
          <li class="nav-item mx-1 bg-light">
            <router-link :to="generatePageLink('report')" class="nav-link" active-class="activePage" exact>
              <span>Report</span>
            </router-link>
          </li>
          <li class="nav-item mx-1 bg-light">
            <router-link :to="generatePageLink('health-day')" class="nav-link" active-class="activePage" exact>
              <span>Health Day</span>
            </router-link>
          </li>
        </ul>
      </div>
      <div v-if="pharmacy">
        <router-view :pharmacy="pharmacy"></router-view>
      </div>
      <div v-else>
        <no-data-to-show />
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../../helpers/http-service';
export default {
  mounted() {
    this.fetchPharmacy();
  },
  data : () => ({
    pharmacy : null,
    fetched: false
  }),
  methods: {
    id() {
      return this.$route.params.id
    },
    fetchPharmacy() {
      let id = this.id();
      return httpCall.get("otc-rep/v1/pharmacies/"+id)
      .then(({data}) => {
        this.pharmacy = data.data;
        this.fetched = true;
      }).catch(err => console.log(err))
    },
    generatePageLink(url = "") {
      let id = this.$route.params.id;
      return `/pharmacies/view/${id}/${url}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .activePage {
    background-color: royalblue;
    color: white !important;
  }
</style>
