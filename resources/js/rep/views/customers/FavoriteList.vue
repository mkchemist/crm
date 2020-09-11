<template>
  <div>
    <div class="px-0">
      <p class="alert alert-success">
        <span><i class="fa fa-star"></i></span>
        <span>Favorite list</span>
      </p>
      <div>
        <customers-table
          :data="customers"
          v-if="customers.length > 0"
          :withUnlink="true"
          :on-unlink="getFavoriteList"
        />
        <div v-else-if="fetched">
          <p class="lead text-center">No data to show</p>
        </div>
        <loader-component v-else/>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../helpers/http-service";
import CustomersTable from "../../components/CustomersTable";
export default {
  created() {
    this.getFavoriteList();
  },
  data: () => ({
    customers: [],
    fetched: false
  }),
  components: {
    CustomersTable
  },
  methods: {
    getFavoriteList() {
      httpCall.get("rep/v1/customers-favorite-list").then(({ data }) => {
        if (data.code === 203) {
          this.fetched = true;
          return;
        }
        this.customers = data.data;
      });
    }
  }
};
</script>

<style></style>
