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
          <data-filter :data="$store.getters.allRepPmReports" :onUpdate="onUpdate" :onReset="onReset" :keys="{rep: 'user_id', date: 'visit_date'}"/>
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
              :heads="heads"
              :data="reports"
              :unselectable="true"
              head-class="bg-success text-light"
            >
              <template v-slot:head>
                <th>Products</th>
              </template>
              <template v-slot:body="{ item }">
                <td>
                  <ul
                    class="nav"
                    v-for="(product, i) in JSON.parse(item.products)"
                    :key="`product_${i}`"
                  >
                    <li
                      v-for="(val, key) in product"
                      :key="`product_${i}_${key}`"
                      class="col-12"
                    >
                      <span>{{ key }}</span> :
                      <span class="font-weight-bold text-primary">{{
                        val
                      }}</span>
                    </li>
                  </ul>
                </td>
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
import DataFilter from '../../components/DataFilter';
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
    }
  },
  data: () => ({
    heads: [
      {
        title: "Date",
        name: "visit_date"
      },
      {
        title: "Rep",
        name: "user.name",
        style: "font-weight-bold"
      },
      {
        title: "Coach",
        name: "coach.name",
        fallback: "-----"
      },
      {
        title: "Customer",
        name: "customer.name",
        style: "font-weight-bold"
      },
      {
        title: "Specialty",
        name: "customer.specialty",
        style: "font-weight-bold"
      },
      {
        title: "Params",
        name: "customer.params.0.current",
        fallback: "NN",
        style: "font-weight-bold"
      },
      {
        title: "Adress",
        name: "customer.address"
      },
      {
        title: "Brick",
        name: "customer.brick"
      },
      {
        title: "Area",
        name: "customer.area"
      },
      {
        title: "Comment",
        name: "comment",
        fallback: "--------"
      },
      {
        title: "Feedback",
        name: "general_feedback",
        fallback: "--------"
      }
    ]
  }),
  methods: {
    onUpdate(res) {
      this.$store.commit('setRepPmReports', []);
      res.then(data => {
        this.$store.commit('setRepPmReports', data);
      })
    },
    onReset() {
      this.$store.commit('resetRepPmReports')
    }
  }
};
</script>

<style></style>
