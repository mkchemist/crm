<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-book"></span>
      <span class="font-weight-bold">Requests List</span>
    </p>
    <div class="my-2 p-2">
     <!--  <request-list-tabs /> -->
      <div>
        <list-view />
      </div>
    </div>
  </div>
</template>

<script>
import RequestListTabs from '../components/RequestListTabs.vue'
import ListView from './requests/ListView.vue';
export default {
  components: { RequestListTabs, ListView },
  mounted() {
    this.$store.dispatch('RequestModule/fetchCustomerRequests');
  }
}
</script>

<style>

</style>
