<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span class="fa fa-user-md"></span>
      <span class="font-weight-bold">All customers</span>
    </p>
    <div class="p-2">
      <div class="form-inline">
        <select
          name="territory"
          id="territory"
          v-model="territory"
          class="form-control form-control-sm col-10 mr-2"
          :disabled="!territories.length"
        >
          <option :value="null">All</option>
          <option :value="terr.name" v-for="(terr, i) in territories" :key="`terr_${i}`">{{ terr.name }}</option>
        </select>
        <button
          class="btn btn-sm btn-primary col-lg btn-block"
          @click="loadList"
          :disabled="!territories.length"
        >
          <span>Load list</span>
        </button>
      </div>
      <div class="p-2" v-if="isFetched">
        <div v-if="customers.length">
          <!-- <table-component :data="customers" :heads="heads" :headClass="`bg-success text-light`"></table-component> -->
          <data-table-component :data="customers" :cols="heads" />
        </div>
        <div v-else>
          <no-data-to-show />
        </div>
      </div>
      <div v-else-if="!startLoading" class="my-3">
        <p class="text-center lead">
          Press load to start loading list
        </p>
      </div>
      <div v-else class="text-center my-3 text-success">
        <div class="spinner-border" style="width:90px;height:90px"></div>
        <div>
          <span>
            loading {{ currentLoadingPage }} / {{ totalLoadingPages }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataTableComponent from "../../../components/DataTableComponent.vue";
import NoDataToShow from "../../../components/NoDataToShow.vue";
import TableComponent from "../../../components/TableComponent.vue";
import { sortBy } from '../../../helpers/helpers';
export default {
  components: {
    TableComponent,
    NoDataToShow,
    DataTableComponent
  },
  mounted() {
    this.$store.dispatch('getAllLocations');
  },
  computed: {
    customers() {
      return this.$store.getters.allCustomers;
    },
    currentLoadingPage() {
      return this.$store.getters.currentLoadingPage;
    },
    totalLoadingPages() {
      return this.$store.getters.totalLoadingPages;
    },
    isFetched() {
      return this.$store.getters.isCustomersFetched;
    },
    startLoading() {
      return this.$store.getters.customersStartLoading;
    },
    territories() {
      return sortBy(this.$store.getters.allTerritories, 'name');
    }
  },
  data: () => ({
    territory: null,
    heads: [
      {
        title: 'ID',
        name: 'id'
      },
      {
        title: "Name",
        name: "name"
      },
      {
        title: "Specialty",
        name: "specialty"
      },
      {
        title: "Title",
        name: "title"
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
      },
      {
        title: "Region",
        name: "region"
      }
    ]
  }),
  methods: {
    loadList() {
      this.$store.dispatch("fetchCustomers", {
        territory: this.territory,
        reset: true
      });
    }
  }
};
</script>

<style></style>
