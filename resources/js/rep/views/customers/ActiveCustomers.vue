<template>
  <div>
    <div class="px-0">
      <customer-filter
        :data="customers"
        v-if="showFilter"
        :onClose="closeFilterModal"
        :onFilter="onFilter"
        :onReset="onReset"
      />
      <p class="alert alert-success">
        <span><i class="fa fa-list"></i></span>
        <span class="font-weight-bold">Active Customer List</span>
      </p>
      <div class="p-2 text-right">
        <router-link to="/customers/new" class="btn btn-sm btn-success">
          <span><i class="fa fa-plus-circle"></i></span>
          <span>New</span>
        </router-link>
        <button class="btn btn-sm btn-primary" @click="$store.dispatch('customerGetAll', true)">
          <span><i class="fa fa-redo"></i></span>
          <span>refresh list</span>
        </button>
        <button class="btn btn-sm btn-secondary" type="button" @click="showFilterModal">
          <span><i class="fa fa-filter"></i></span>
          <span>Filter</span>
        </button>
      </div>
      <div class="p-2">
        <table-component
          :heads = "heads"
          :data = "customers"
          headClass="bg-success text-light"
          v-if="customers.length"
          :with-favorite="true"
        >
          <template v-slot:head>
            <th>Missed</th>
            <th>Status</th>
            <th>Address</th>
            <th>Brick</th>
            <th>Area</th>
            <th>Actions</th>
          </template>
          <template v-slot:body="{ item }">
            <td>
              {{ item.plans - item.reports }}
            </td>
            <td class="font-weight-bold">
              <span v-if="item.plans - item.reports  > 0" class="bg-danger p-1 text-light">Missed</span>
              <span v-else-if="item.plans !== 0 && item.plans - item.reports  === 0" class="bg-success p-1 text-light">Accomplished</span>
              <span v-else-if="item.plans - item.reports  < 0" class="bg-primary p-1 text-light">Over</span>
              <span v-else-if="item.plans === 0 && item.plans - item.reports   === 0" class="bg-dark p-1 text-light">Not targeted</span>
            </td>
            <td>
              {{ item.address }}
            </td>
             <td>
              {{ item.brick }}
            </td>
             <td>
              {{ item.area }}
            </td>
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
import {CUSTOMERS_TABLE_HEADS} from "../../../helpers/constants";
import CustomerFilter from '../../components/CustomerFilter';
export default {
  computed: {
    customers() {
      return this.$store.getters.active;
    },
    fetched() {
      return this.$store.getters.fetched;
    }
  },
  data: () => ({
    heads: CUSTOMERS_TABLE_HEADS,
    showFilter: false
  }),
  components: {
    TableComponent,
    CustomerFilter
  },
  methods: {
    closeFilterModal() {
      this.showFilter = false;
    },
    showFilterModal() {
      this.showFilter = true;
    },
    onFilter(data) {
      this.$store.commit('filterCustomers', {name: 'activeCustomers', data});
      this.showFilter = false;
    },
    onReset() {
      let data = this.$store.getters.all.filter(c => !['NN','XX'].includes(c.parameter));
      this.$store.commit('filterCustomers', {name: 'activeCustomers', data});
      this.showFilter = false;
    }
  }
};
</script>

<style></style>
