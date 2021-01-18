<template>
  <div>
    <div class="px-0 shadow rounded">
      <p class="alert alert-success">
        <span><i class="fa fa-star"></i></span>
        <span class="font-weight-bold">Favorite list</span>
      </p>
      <div class="p-2">
        <div class="p-2 text-right">
          <button class="btn btn-sm btn-secondary" type="button" :disabled="!customers.length" @click="clearAllFavoriteList">
            <span class="fa fa-redo-alt"></span>
            <span>clear all</span>
          </button>
        </div>
        <div v-if="customers.length" class="p-2">
          <table-component
            :heads="heads"
            :data="customers"
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
        </div>
        <div v-else-if="fetched">
          <no-data-to-show />
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
import NoDataToShow from "../../../components/NoDataToShow";

export default {
  mounted() {
    this.getFavoriteList();
  },
  data: () => ({
    customers: [],
    fetched: false,
    heads: CUSTOMERS_TABLE_HEADS
  }),
  components: {
    TableComponent,
    NoDataToShow
  },
  methods: {
    /**
     * get all favorite list
     *
     */
    getFavoriteList() {
      httpCall.get("customers-favorite-list").then(({ data }) => {
        this.handleResponse(data, (data) => {
         this.fetched = true;
         this.customers = data.data;
        });
      });
    },
    /**
     * clear all favorite list
     *
     */
    clearAllFavoriteList() {
      httpCall.post('customers-favorite-list/clear')
      .then(({data}) => {
        this.handleResponse(data ,data => {
          this.getFavoriteList();
        });
      }).catch(err => {
        console.log(err);
        this.$toasted.error('Something went wrong')
      })
    }
  }
};
</script>

<style></style>
