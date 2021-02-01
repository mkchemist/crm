<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-user-md"></span>
      <span class="font-weight-bold">View Customer Card {{ customer ? `of ${customer.name}` : '' }}</span>
    </p>
    <div class="p-2">
      <ul class="nav nav-tabs">
        <li class="nav-item border" v-for="(item, i) in views" :key="`view_router_${i}`">
          <router-link :to="item.link" class="nav-link" active-class="active-link" exact>{{ item.title }}</router-link>
        </li>
      </ul>
      <div class="border">
        <div v-if="customer" class="p-2">
          <router-view :data="customer" />
        </div>
        <div v-else-if="fetched">
          <no-data-to-show />
        </div>
        <loader-component :text="`Loading Customer Data`" v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import NoDataToShow from '../../../components/NoDataToShow.vue';
import { httpCall } from '../../../helpers/http-service';
export default {
  mounted() {
    this.fetchCustomer();
  },
  components: {
    NoDataToShow

  },
  computed: {
    views() {
      let id = this.id();
      return [
        {
          title: 'Info.',
          link: `/customers/view/${id}`
        },
        {
          title: 'Planner',
          link: `/customers/view/${id}/planner`
        },
        {
          title: 'Reports',
          link: `/customers/view/${id}/reports`
        },
      ]
    }
  },
  data: () => ({
    customer: null,
    fetched: false
  }),
  methods: {
    /* get current customer ID */
    id() {
      return this.$route.params.id;
    },
    /** fetch customer data */
    fetchCustomer() {
      let id = this.id();
      this.customer = null;
      this.fetched = false;
      return httpCall.get('rm/v1/customers/'+id)
      .then(({data}) => {
        console.log(data);
        this.handleResponse(data, data => {
          this.customer = data.data;
          this.fetched = true;
        })
      }).catch(err => console.log(err))
    }
  }
}
</script>

<style>

</style>
