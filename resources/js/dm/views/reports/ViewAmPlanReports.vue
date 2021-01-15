<template>
  <div class="p-2 row mx-auto">
    <div class="col-lg-3">
      <user-filter-box :users="reps" :data="data" :onFilter="onFilter" :onReset="onReset" />
      <date-filter-box :data="data" :onFilter="onFilter" :onReset="onReset" :dateField="`start`"/>
      <router-link to="/reports" class="btn btn-sm btn-dark btn-block my-2">
        <span class="fa fa-chevron-circle-left"></span>
        <span>back</span>
      </router-link>
    </div>
    <div class="col-lg-9">
      <div class="px-0 shadow rounded">
        <p class="alert alert-success">
          <span class="fa fa-book-reader"></span>
          <span class="font-weight-bold">View AM plans report</span>
        </p>
        <div class="p-2">
          <div v-if="data.length">
            <table-component :data="data" :heads="tableHeads" :headClass="`bg-success text-light`" :unselectable="true" :orderBy="`Rep`">

            </table-component>
          </div>
          <div v-else-if="isDataFetched">
            <no-data-to-show />
          </div>
          <loader-component v-else></loader-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateFilterBox from '../../../components/DateFilterBox.vue'
import NoDataToShow from '../../../components/NoDataToShow.vue';
import TableComponent from '../../../components/TableComponent.vue';
import UserFilterBox from '../../../components/UserFilterBox.vue'
import { httpCall } from '../../../helpers/http-service';
export default {
  mounted() {
    this.getPlans();
  },
  components: {
    DateFilterBox ,
    UserFilterBox,
    TableComponent,
    NoDataToShow,
  },
  computed: {
    reps() {
      return this.$store.getters.allReps;
    },

  },
  data: () =>({
    data: [],
    _rawData: [],
    isDataFetched: false,
    tableHeads: [
      {
        title: 'Rep',
        name: 'rep'
      },
      {
        title: 'Date',
        name: 'start'
      },
      {
        title: 'Workplace',
        name: 'workplace.name'
      },
      {
        title: 'Workplace type',
        name: 'workplace.type'
      },
      {
        title: 'Address',
        name: 'workplace.address'
      },
      {
        title: 'Brick',
        name: 'workplace.brick'
      },
      {
        title: 'Area',
        name: 'workplace.area'
      },

    ]
  }),
  methods: {
    getPlans(){
      this.data =[];
      this.isDataFetched =false;
      httpCall.get('dm/v1/workplace-planner')
      .then(({data}) => {
        this.data = data.data;
        this._rawData = data.data;
        this.isDataFetched = true;
      }).catch(err => console.log(err))
    },
    onFilter(data) {
      this.data =[];
      let async = () => Promise.resolve(data);
      async().then(data => this.data = data);
    },
    onReset() {
      this.data =[];
      let async = () => Promise.resolve(this._rawData);
      async().then(data => this.data = data);
    }
  }
}
</script>

<style>

</style>
