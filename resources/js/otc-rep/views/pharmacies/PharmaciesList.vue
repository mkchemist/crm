<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-list"></span>
      <span class="font-weight-bold">Pharmacies list</span>
    </p>
    <!-- pharmacy control -->
    <div class="p-2">
      <button type="button" class="btn btn-sm btn-primary" @click="openFilterModal">
        <span class="fa fa-filter"></span>
        <span>Filter</span>
      </button>
      <router-link to="/pharmacies/new" class="btn btn-sm btn-success" exact>
        <span class="fa fa-plus-circle"></span>
        <span>New Pharmacy</span>
      </router-link>
      <data-filter-box
        :data="pharmacies"
        :queryKeys="['area', 'brick']"
        :show="showFilterModal"
        :onClose="closeFilterModal"
        :onFilter="onFilter"
        :onReset="onReset"
        :queryOnly="false"
      />
    </div>
    <!-- data view -->
    <div class="p-2">
      <div v-if="pharmacies.length">
        <table-component
          :data="pharmacies"
          :heads="heads"
          :unselectable="true"
          :headClass="`bg-success text-light`"
          orderBy="Pharmacy"
        >
          <template v-slot:head:before>
            <th>Actions</th>
          </template>
          <template v-slot:body:before="{item}">
            <td>
              <router-link :to="`/pharmacies/view/${item.id}`" class="btn btn-sm btn-primary" >
                <span class="fa fa-book-reader"></span>
              </router-link>
              <router-link :to="{path :`/pharmacies/edit/${item.id}`, query: {pid: '1'}}" class="btn btn-sm btn-warning" exact>
                <span class="fa fa-edit"></span>
              </router-link>
            </td>
          </template>
        </table-component>
      </div>
      <div v-else-if="isPharmaciesFetched">
        <no-data-to-show />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import DataFilterBox from "../../../components/DataFilterBox";
import { asyncDataFlow } from '../../../helpers/http-service';

export default {
  components: {
    DataFilterBox
  },
  computed: {
    pharmacies() {
      if(this.shouldRenderFilter) {
        return this.filteredList
      }
      return this.$store.getters.allPharmacies;
    },
    isPharmaciesFetched() {
      return this.$store.getters.isPharmaciesFetched;
    }
  },
  data: () => ({
    heads: [
      {
        title: "Pharmacy",
        name: "name"
      },
      {
        title: "Type",
        name: "type"
      },
      {
        title: "Key Person",
        name: "key_person"
      },
      {
        title: "Visits",
        name: 'reports'
      },
      {
        title: "Address",
        name: "address"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "Area",
        name: "area"
      },
      {
        title: "District",
        name: "district"
      },
      {
        title: "Territory",
        name: "territory"
      }
    ],
    showFilterModal: false,
    shouldRenderFilter: false,
    filteredList: []
  }),
  methods: {
    openFilterModal() {
      this.showFilterModal = true;
    },
    closeFilterModal() {
      this.showFilterModal = false;
    },
    onFilter(query, data) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(data, data => {
        this.filteredList = data;
      })
    },
    onReset() {
      this.filteredList = [];
      asyncDataFlow(new Array, d => {
        this.shouldRenderFilter=false;
      })
    }
  }
};
</script>

<style></style>
