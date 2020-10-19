<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-star"></i></span>
        <span class="font-weight-bold">Favorite list</span>
      </p>
      <div class="p-2">
        <table-component
          :heads="heads"
          :data="customers"
          v-if="customers.length"
          headClass="bg-success text-light"
          :with-unlink="true"
          :on-unlink = "getFavoriteList"
        >
          <template v-slot:head>
            <th>Actions</th>
          </template>
          <template v-slot:body="{ item }">
            <td>
              <router-link :to="`/customers/view/${item.id}`" class="btn btn-sm btn-info">
                <span><i class="fa fa-eye"></i></span>
              </router-link>
              <router-link :to="`/customers/edit/${item.id}`" class="btn btn-sm btn-warning">
                <span><i class="fa fa-edit"></i></span>
              </router-link>
            </td>
          </template>
        </table-component>
        <div v-else-if="fetched">
          <p class="lead text-center">No data to show</p>
        </div>
        <loader-component v-else/>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
import TableComponent from "../../../components/TableComponent";
import { CUSTOMERS_TABLE_HEADS } from '../../../helpers/constants';
export default {
  created() {
    this.getFavoriteList();
  },
  data: () => ({
    customers: [],
    fetched: false,
    heads: CUSTOMERS_TABLE_HEADS
  }),
  components: {
    TableComponent
  },
  methods: {
    getFavoriteList() {
      httpCall.get("customers-favorite-list").then(({ data }) => {
        this.handleResponse(data, (data) => {
         this.fetched = true;
         this.customers = data.data;
        });
      });
    }
  }
};
</script>

<style></style>
