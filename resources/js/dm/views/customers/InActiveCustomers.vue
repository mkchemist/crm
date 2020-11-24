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
          :actionCell="1"
        >
          <template v-slot:head:before>
            <th></th>
          </template>
          <template v-slot:body:before="{ item }">
            <td>
              <router-link :to="`/customers/view/${item.id}`">
                <span><i class="fa fa-eye"></i></span>
              </router-link>
            </td>
          </template>
          <template v-slot:head>
            <th>Diff</th>
            <th>State</th>
            <th>Address</th>
          </template>
          <template v-slot:body="{ item }">
            <td>{{ item.plans - item.reports }}</td>
            <td :class="customerState(item).style">
              {{ customerState(item).state }}
            </td>
            <td>{{ item.address }}</td>
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
    TableComponent
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
  }),
   methods: {
    customerState(item) {
      let diff = item.plans - item.reports;
      if(diff > 0) {
        return {
          state: 'Missed',
          style: 'bg-danger text-light p-1'
        }
      } else if(diff < 0) {
        return {
          state : 'Over',
          style: 'bg-primary text-light p-1'
        }
      } else if(diff === 0 && item.plans ===0) {
        return {
          state: 'Not targeted',
          style : 'bg-dark text-light p-1',
        }
        return 'Not targeted';
      } else {
        return {
          state : 'Accomplished',
          style: 'bg-success text-light p-1'
        }
      }
    }
  }
};
</script>

<style></style>
