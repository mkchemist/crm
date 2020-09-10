<template>
  <div>
    <div class="px-0">
      <p class="alert alert-success">
        <span><i class="fa fa-list"></i></span>
        <span>Active Customer List</span>
      </p>
      <div class="p-2 text-right">
        <router-link to="/customers/new" class="btn btn-sm btn-success">
          <span><i class="fa fa-plus-circle"></i></span>
          <span>New</span>
        </router-link>
      </div>
      <div class="p-2">
        <customers-table
          :data="activeCustomers"
          v-if="activeCustomers.length"
          :withFavorite="true"
        />
        <div v-else-if="fetched">
          <p class="text-center lead">No data found</p>
        </div>
        <div
          v-else
          class="text-center d-flex justify-content-center align-items-center"
        >
          <vue-loaders
            name="ball-pulse-rise"
            color="seagreen"
            scale="1"
          ></vue-loaders>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomersTable from "../../components/CustomersTable";
export default {
  computed: {
    activeCustomers() {
      return this.$store.getters.active;
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
