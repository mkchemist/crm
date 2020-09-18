<template>
  <div>
    <div class="px-0">
      <p class="alert alert-success">
        <span><i class="fa fa-list"></i></span>
        <span class="font-weight-bold">Active Customer List</span>
      </p>
      <div class="p-2 text-right">
        <router-link to="/customers/new" class="btn btn-sm btn-success">
          <span><i class="fa fa-plus-circle"></i></span>
          <span>New</span>
        </router-link>
      </div>
      <div class="p-2">
        <table-component
          :heads = "heads"
          :data = "activeCustomers"
          headClass="bg-success text-light"
          v-if="activeCustomers.length"
          :with-favorite="true"
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
          <p class="text-center lead">No data found</p>
        </div>
        <loader-component v-else/>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import {CUSTOMERS_TABLE_HEADS} from "../../helpers/constants"
export default {
  computed: {
    activeCustomers() {
      return this.$store.getters.active;
    },
    fetched() {
      return this.$store.getters.fetched;
    }
  },
  data: () => ({
    heads: CUSTOMERS_TABLE_HEADS
  }),
  components: {
    TableComponent
  }
};
</script>

<style></style>
