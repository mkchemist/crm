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
              :heads="reportHeaders"
              :data="reports"
              :unselectable="true"
              head-class="bg-success text-light"
            >
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
                <td>{{ item.plans-item.reports }}</td>
                <td>
                  <span :class="customerState(item).style">{{ customerState(item).state }}</span>
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
import { sortBy } from "../../../helpers/helpers";
import DataFilter from "../../components/DataFilter";
export default {
  created() {
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
    },
    reportHeaders() {
      let products = [];
      let noOfProductsInReport = 0;
      if (this.reports) {
        this.reports.map(visit => {
          let visitProducts = visit.products;
          let count = visitProducts.length;
          if (count > noOfProductsInReport) {
            noOfProductsInReport = count;
          }
        });
      }
      let headers = [...this.headers];
      for (let i = 0; i < noOfProductsInReport; i++) {
        headers.push({
          title: `Product ${i + 1}`,
          name: `products.${i}.name`,
          fallback: '-------------'
        });
        headers.push({
          title: `Product ${i + 1} action`,
          name: `products.${i}.action`,
          fallback: '-------------'
        });
        headers.push({
          title: `Product ${i + 1} Lader of adaption`,
          name: `products.${i}.lader`,
          fallback: '-------------'
        });
        headers.push({
          title: `Product ${i + 1} competitor`,
          name: `products.${i}.competitor`,
          fallback: '-------------'
        });
      }
      return headers;
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
        title: 'Coach 2',
        name: 'coach2',
        fallback: '-------'
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
      }
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
