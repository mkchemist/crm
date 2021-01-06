<template>
  <div class="px-0 shadow bg-white">
    <p class="alert alert-success">
      <span><i class="fa fa-book-reader"></i></span>
      <span class="font-weight-bold">View all pharmacies reports</span>
    </p>
    <div class="p-2 pb-5 bg-light">
      <div class="row mx-auto">
        <div class="col-lg-3">
          <data-filter
            :data="$store.getters.allPharmaciesReports"
            :keys="{ rep: 'user_id', date: 'date' }"
            :onUpdate="onUpdate"
            :onReset="onReset"
            class="bg-white"
          ></data-filter>

          <div class="my-2 p-2 border bg-white">
            <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
              <span><i class="fa fa-chevron-circle-left"></i></span>
              <span>back</span>
            </router-link>
          </div>
        </div>
        <div class="col-lg-9 shadow bg-white my-lg-0 my-2 p-2">
          <div class="p-2" v-if="reports.length">
            <table-component
              :heads="headers"
              :data="reports"
              :unselectable="true"
              sort-by="Date,asc|Pharmacy,asc"
              head-class="bg-success text-light"
            >
            </table-component>
          </div>
          <div
            class="p-2 d-flex align-items-center justify-content-center"
            v-else-if="fetched"
            style="min-height:300px"
          >
            <p class="text-center font-weight-bold">No data to show</p>
          </div>
          <loader-component v-else></loader-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import { ProductWithRate } from '../../../helpers/constants';
import DataFilter from "../../components/DataFilter";
export default {
  components: {
    TableComponent,
    DataFilter
  },
  mounted() {
    this.$store.dispatch("getAllPharmaciesReports");
  },
  computed: {
    reports() {
      return this.$store.getters.allRepPharmaciesReports;
    },
    fetched() {
      return this.$store.getters.isPharmaciesReportsFetched;
    },
  },
  data: () => ({
    headers: [
      {
        title: "Rep",
        name: "rep_name"
      },
      {
        title: "Date",
        name: "date"
      },
      {
        title: "Pharmacy",
        name: "pharmacy_name"
      },
      {
        title: "Type",
        name: "type"
      },
      ...ProductWithRate,
      {
        title: "Feedback",
        name: "feedback"
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
      }
    ]
  }),
  methods: {
    onUpdate(resolve) {
      this.$store.commit("setRepPharmaciesReports", []);
      resolve.then(data => this.$store.commit("setRepPharmaciesReports", data));
    },
    onReset() {
      let asyncReset = () =>
        new Promise((resolve, reject) => {
          resolve(this.$store.getters.allPharmaciesReports);
        });
      this.$store.commit("setRepPharmaciesReports", []);
      asyncReset().then(data =>
        this.$store.commit("setRepPharmaciesReports", data)
      );
    }
  }
};
</script>

<style></style>
