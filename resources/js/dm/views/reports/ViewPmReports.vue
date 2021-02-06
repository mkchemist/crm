<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-book-open"></i></span>
      <span class="font-weight-bold">View All PM reports</span>
    </p>
    <div class="p-2">
      <div class="row mx-auto">
        <!-- filter section -->
        <div class="col-lg-3">
          <data-filter
            :data="$store.getters.allRepPmReports"
            :onUpdate="onUpdate"
            :onReset="onReset"
            :keys="{ rep: 'user_id', date: 'date' }"
          />
          <div class="my-2">
            <router-link
              to="/reports/view/coach-report"
              class="btn btn-sm btn-block btn-primary"
            >
              <span><i class="fa fa-book-open"></i></span>
              <span>View Coach reports</span>
            </router-link>
            <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
              <span><i class="fa fa-chevron-circle-left"></i></span>
              <span>back</span>
            </router-link>
          </div>
        </div>
        <!-- data section -->
        <div class="col-lg-9 my-lg-0 my-2 shadow p-2 pb-5">
          <div v-if="reports.length">
            <table-component
              :heads="headers"
              :data="reports"
              :unselectable="true"
              head-class="bg-success text-light"
            >
              <template v-slot:head:before>
                <th>Action</th>
              </template>
              <template v-slot:body:before="{ item }">
                <td>
                  <router-link
                    :to="`/reports/edit/pm/${item.id}`"
                    class="btn btn-sm btn-warning"
                    v-if="item.user_id === $store.getters.user.id"
                  >
                    <span class="fa fa-edit"></span>
                  </router-link>
                  <button class="btn btn-sm btn-danger" v-if="item.user_id === $store.getters.user.id" @click="removeVisit(item.id)">
                    <span class="fa fa-trash"></span>
                  </button>
                </td>
              </template>
              <template v-slot:head>
                <th>Plans</th>
                <th>Visits</th>
                <th>Diff</th>
                <th>State</th>
                <th>Comment</th>
                <th>Feedback</th>
                <th>Address</th>
                <th>Brick</th>
                <th>Area</th>
              </template>
              <template v-slot:body="{ item }">
                <td>{{ item.plans }}</td>
                <td>{{ item.reports }}</td>
                <td>{{ item.plans - item.reports }}</td>
                <td>
                  <span :class="customerState(item).style">{{
                    customerState(item).state
                  }}</span>
                </td>
                <td>{{ item.comment }}</td>
                <td>{{ item.feedback }}</td>
                <td>{{ item.address }}</td>
                <td>{{ item.brick }}</td>
                <td>{{ item.area }}</td>
              </template>
            </table-component>
          </div>

          <div v-else-if="fetched">
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
import { ProductWithLader, ProductWithRate } from "../../../helpers/constants";
import { sortBy } from "../../../helpers/helpers";
import { httpCall } from '../../../helpers/http-service';
import DataFilter from "../../components/DataFilter";
export default {
  mounted() {
    this.$store.dispatch("getAllRepPmReports");
  },
  components: {
    TableComponent,
    DataFilter
  },
  computed: {
    reports() {
      return this.$store.getters.repPmReports;
    },
    fetched() {
      return this.$store.getters.isRepPmReportsFetched;
    }
  },
  data: () => ({
    headers: [
      {
        title: "Date",
        name: "date"
      },
      {
        title: "Rep",
        name: "user_name",
        style: "font-weight-bold"
      },
      {
        title: "Coach 1",
        name: "coach",
        fallback: "-----"
      },
      {
        title: "Coach 2",
        name: "coach2",
        fallback: "-------"
      },
      {
        title: "Customer",
        name: "customer",
        style: "font-weight-bold"
      },
      {
        title: "Specialty",
        name: "specialty",
        style: "font-weight-bold"
      },
      {
        title: "Params",
        name: "param",
        fallback: "NN",
        style: "font-weight-bold"
      },
      ...ProductWithLader
    ]
  }),
  methods: {
    onUpdate(res) {
      this.$store.commit("setRepPmReports", []);
      res.then(data => {
        this.$store.commit("setRepPmReports", data);
      });
    },
    onReset() {
      this.$store.commit("resetRepPmReports");
    },
    customerState(item) {
      let diff = item.plans - item.reports;
      if (diff > 0) {
        return {
          state: "Missed",
          style: "bg-danger text-light p-1"
        };
      } else if (diff < 0) {
        return {
          state: "Over",
          style: "bg-primary text-light p-1"
        };
      } else if (diff === 0 && item.plans === 0) {
        return {
          state: "Not targeted",
          style: "bg-dark text-light p-1"
        };
        return "Not targeted";
      } else {
        return {
          state: "Accomplished",
          style: "bg-success text-light p-1"
        };
      }
    },
    removeVisit(id){
      this.$swal({
        title: "Are you sure ?",
        text: "you want to delete this visit",
        icon: "warning",
        showCancelButton: true
      }).then(res => {
        if(res.isConfirmed) {
          return httpCall.post("dm/v1/reports/pm/"+id, {_method: "DELETE"})
          .then(({data}) => {
            this.handleResponse(data, data => {
              this.$store.dispatch("getAllRepPmReports",{force: true})
              this.$swal({
                title: "Deleted",
                icon: "success"
              })
            });
          }).catch(err => console.log(err))
        }
      })
    }
  }
};
</script>

<style></style>
