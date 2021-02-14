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
            <template v-slot:head:before>
              <th>Actions</th>
            </template>
            <template v-slot:body:before="{item}">
              <td>
                <router-link :to="`/reports/edit/pharmacy/${item.id}`" class="btn btn-sm btn-warning" v-if="isOwner(item.user_id)">
                  <span class="fa fa-edit"></span>
                </router-link>
                <button class="btn btn-sm btn-danger" v-if="isOwner(item.user_id)" @click="removeReport(item)">
                  <span class="fa fa-trash"></span>
                </button>
              </td>
            </template>
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
import { httpCall } from '../../../helpers/http-service';
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
    user() {
      return this.$store.getters.user;
    }
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
    },
    isOwner(id) {
      return id === this.user.id
    },
    removeReport(item) {
      if(item.user_id !== this.user.id) {
        this.$swal({
          title: "Warning",
          text: "You cannot delete this visits",
          icon: "error"
        });
      }
      this.$swal({
        title: "Are you sure ?",
        text: "you want to delete this visit",
        icon: "warning",
        showCancelButton: true
      }).then(res => {
        if(res.isConfirmed) {
          return httpCall.post('dm/v1/reports/workplaces/delete/pharmacy/'+item.id, {_method:"DELETE"})
          .then(({data}) => {
            this.handleResponse(data, data => {
              this.$swal({
                title: "Deleted",
                icon: "success"
              });
              this.$store.dispatch('getAllPharmaciesReports', {force: true})
            });
          }).catch(err => console.log(err))
        }
      })
    }
  }
};
</script>

<style></style>
