<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-book-open"></i></span>
      <span class="font-weight-bold">View All Plans</span>
    </p>
    <div class="p-2">
      <div class="row mx-auto">
        <div class="col-lg-3">
          <data-filter
            :data="$store.state.PlannerModule.repPlans"
            :onReset="onReset"
            :onUpdate="onUpdate"
            :keys="{
              rep: 'user_id',
              date: 'start'
            }"
          />
          <div class="p-2 my-2 border rounded">
            <router-link to="/planner" class="btn btn-sm btn-block btn-primary">
              <span><i class="fa fa-book-reader"></i></span>
              <span>view planner</span>
            </router-link>
            <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
          </div>
        </div>
        <div class="col-lg-9 shadow p-2">
          <div class="p-2" v-if="repPlans.length">
            <table-component
              :heads="heads"
              :data="repPlans"
              :unselectable="true"
              head-class="bg-success text-light"
              order-by="Date,asc"
            ></table-component>
          </div>
          <div class="" v-else-if="fetched">
            <p class="font-weight-bold text-center">no data to show</p>
          </div>
          <loader-component v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import DataFilter from '../../components/DataFilter';
export default {
  created() {
    this.$store.dispatch("getPlans").then(() => {
      this.repPlans = this.$store.state.PlannerModule.repPlans;
    });
  },
  components: {
    TableComponent,
    DataFilter
  },
  computed: {
    fetched() {
      return this.$store.getters.isPlanFetched;
    }
  },
  data: () => ({
    repPlans: [],
    heads: [
      {
        title: "Rep",
        name: "user_name",
        style: 'font-weight-bold'
      },
      {
        title: 'Date',
        name: 'start',
        style: 'font-weight-bold'
      },
      {
        title: "Area",
        name: "area"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "Customer",
        name: "title",
        style: 'font-weight-bold'
      },
      {
        title: "Specialty",
        name: "specialty",
        style: 'font-weight-bold'
      },
      {
        title: "Parameter",
        name: "param",
        style: 'font-weight-bold'
      },
      {
        title: "Freq.",
        name: "freq"
      },
      {
        title: "Plans",
        name: "plans_count"
      },
      {
        title: "Address",
        name: "address"
      }
    ]
  }),
  methods: {
    onUpdate(resolve) {
      this.repPlans = [];
      resolve.then(data => this.repPlans = data);
    },
    onReset() {
      this.replans = [];
      let reset = () => new Promise((res, err) => {
        res(this.$store.state.PlannerModule.repPlans);
      });
      reset().then(data => this.repPlans = data);
    }
  }
};
</script>

<style></style>
