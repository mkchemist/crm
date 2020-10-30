<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-lock"></i></span>
        <span class="font-weight-bold">Inactive Customers list</span>
      </p>
      <div class="my-2 p-2">
        <table-component
          v-if="customers.length"
          :heads="heads"
          :data="customers"
          headClass="bg-success text-light"
          :with-favorite="true"
          order-by="Area,asc"
          :actionCell='1'
        >
          <template v-slot:head:before>
            <th></th>
          </template>
          <template v-slot:body:before="{item}">
            <td>
              <router-link :to="`/customers/view/${item.id}`">
                <span><i class="fa fa-eye"></i></span>
              </router-link>
            </td>
          </template>
        </table-component>
        <div v-else-if="isCustomersFetched">
          <p class="text-center text-dark font-weight-bold">No data to show</p>
        </div>
        <div v-else>
          <loader-component />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import { DM_CUSTOMERS_HEADS } from "../../../helpers/constants";
export default {
  components: {
    TableComponent,
  },
  computed: {
    customers() {
      return this.$store.getters.inactiveCustomers;
    },
    isCustomersFetched() {
      return this.$store.getters.isCustomersFetched;
    }
  },
  data: () => ({
    heads: DM_CUSTOMERS_HEADS
  })
}
</script>

<style>

</style>
