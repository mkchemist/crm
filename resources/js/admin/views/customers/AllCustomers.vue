<template>
  <div class="px-0 shadow rounded">
    <p class="alert alert-success">
      <span class="fa fa-user-md"></span>
      <span class="font-weight-bold">All customers</span>
    </p>
    <div class="p-2">
      <div class="form-inline">
        <select name="territory" id="territory" v-model="territory" class="form-control form-control-sm col-10 mr-2">
          <option :value="null">Select Territory</option>
          <option value="DELTA">DELTA</option>
          <option value="Cairo">Cairo</option>
          <option value="CANAL">CANAL</option>
          <option value="Upper Egypt">Upper Egypt</option>
          <option value="Alexandria">Alexandria</option>
        </select>
        <button class="btn btn-sm btn-primary col-lg btn-block" @click="loadList" :disabled="!territory">
          <span>Load list</span>
        </button>
      </div>
      <div class="p-2" v-if="isFetched">
        <div v-if="customers.length">
          <table-component :data="customers" :heads="heads" :headClass="`bg-success text-light`"></table-component>
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
          <span> loading {{ currentLoadingPage }} / {{ totalLoadingPages }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoDataToShow from '../../../components/NoDataToShow.vue';
import TableComponent from '../../../components/TableComponent.vue';
export default {
  components: {
    TableComponent,
     NoDataToShow
  },
 mounted() {

  },
  computed: {
    customers() {
      return this.$store.getters.allCustomers;
    },
    currentLoadingPage() {
     return this.$store.getters.currentLoadingPage
    },
    totalLoadingPages() {
      return this.$store.getters.totalLoadingPages;
    },
    isFetched() {
     return this.$store.getters.isCustomersFetched
    },
    startLoading() {
      return this.$store.getters.customersStartLoading
    }
  },
  data: () => ({
    territory: null,
    heads: [
      {
        title: 'Name',
        name: 'name'
      },
      {
        title: "Specialty",
        name: 'specialty'
      },
      {
        title: 'Title',
        name: 'title'
      },
      {
        title:'Brick',
        name: 'brick'
      },
      {
        title: 'Area',
        name: 'area'
      },
      {
        title: 'District',
        name: 'district'
      },
      {
        title: 'Territory',
        name: 'territory'
      },
      {
        title: 'Region',
        name: 'region'
      }
    ]
  }),
  methods: {
    loadList() {
       this.$store.dispatch('fetchCustomers', {territory: this.territory, reset: true})
    }
  }
}
</script>

<style>

</style>
