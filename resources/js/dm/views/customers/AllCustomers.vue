<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-user-md"></i></span>
        <span class="font-weight-bold">All customers</span>
      </p>
      <div class="p-2">
        <div class="text-right">
          <button
            class="btn btn-primary btn-sm"
            @click="$store.dispatch('customersGetAll', true)"
          >
            <span><i class="fa fa-redo"></i></span>
            <span>refresh list</span>
          </button>
        </div>
        <div v-if="activeCustomers.length">
          <table-component
            :heads="heads"
            :data="activeCustomers"
            headClass="bg-success text-light"
            :with-favorite="true"
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
        </div>
        <div v-else-if="isFetched">
          <p class="text-center font-weight-bold text-dark">No data to show</p>
        </div>
        <div v-else class="text-center">
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
  computed: {
    activeCustomers() {
      return this.$store.getters.allCustomers;
    },
    isFetched() {
      return this.$store.getters.isCustomersFetched;
    }
  },
  components: {
    TableComponent
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
