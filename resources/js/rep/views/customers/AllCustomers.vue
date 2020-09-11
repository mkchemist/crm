<template>
  <div>
    <div class="px-0">
      <p class="alert alert-success">
        <span><i class="fa fa-list"></i></span>
        <span>All Customer List</span>
      </p>
      <div class="p-2 text-right">
        <router-link to="/customers/new" class="btn btn-sm btn-success">
          <span><i class="fa fa-plus-circle"></i></span>
          <span>New</span>
        </router-link>
      </div>
      <div class="p-2">
        <customers-table
          :data="allCustomers"
          v-if="allCustomers.length"
          :withFavorite="true"
        />
        <div v-else-if="fetched">
          <p class="text-center lead">No data found</p>
        </div>
        <loader-component v-else />
      </div>
    </div>
  </div>
</template>

<script>
import CustomersTable from "../../components/CustomersTable";

export default {
  computed: {
    allCustomers() {
      return this.$store.getters.all;
    },
    fetched() {
      return this.$store.getters.fetched;
    }
  },
  data: () => ({}),
  components: {
    CustomersTable
  }
};
</script>

<style></style>
