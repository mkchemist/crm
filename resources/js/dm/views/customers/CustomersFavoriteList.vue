<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-star"></i></span>
        <span class="font-weight-bold">Customers Favorite List</span>
      </p>
      <div class="my-3 p-3">
        <table-component
          :heads="heads"
          :data="list"
          :with-unlink="true"
          headClass="bg-success text-light"
          v-if="list.length"
          :on-unlink="getList"
        />
        <div v-else-if="isFetched">
          <p class="text-center text-dark">No data to show</p>
        </div>
        <div v-else>
          <loader-component></loader-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import { DM_CUSTOMERS_HEADS } from "../../../helpers/constants";
import { httpCall } from "../../../helpers/http-service";
export default {
  components: {
    TableComponent
  },
  data: () => ({
    heads: DM_CUSTOMERS_HEADS,
    list: [],
    isFetched: false
  }),
  created() {
    this.getList();
  },
  methods: {
    getList() {
      httpCall.get("customers-favorite-list").then(({ data }) => {
      data.message = "Favorite list loaded";
      this.handleResponse(data, data => {
        this.isFetched = true;
        this.list = data.data;
      });
    });
    }
  }
};
</script>

<style></style>
