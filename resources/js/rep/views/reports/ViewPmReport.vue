<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-book-open"></i></span>
        <span>View PM Reports</span>
      </p>
      <div class="p-2 text-right">
        <router-link to="/reports" class="btn btn-sm btn-dark">
          <span><i class="fa fa-chevron-circle-left"></i></span>
          <span>back</span>
        </router-link>
        <router-link to="/reports/add/pm" class="btn btn-sm btn-success">
          <span><i class="fa fa-plus-circle"></i></span>
          <span>new report</span>
        </router-link>
      </div>
      <div class="p-2">
        <div class="border rounded p-2">
          <table-component
            :data="visits"
            :heads="reportHeaders"
            v-if="visits.length"
            head-class="bg-success text-light"
          >
            <template v-slot:head:before>
              <th>Actions</th>
            </template>
            <template v-slot:body:before="{ item }">
              <td>
                <router-link
                  :to="`/reports/edit/pm/${item.id}`"
                  class="btn btn-sm btn-warning"
                >
                  <span><i class="fa fa-edit"></i></span>
                </router-link>

                <button
                  class="btn btn-sm btn-danger"
                  @click="removeReport(item.id)"
                >
                  <span><i class="fa fa-trash"></i></span>
                </button>
              </td>
            </template>
            <template v-slot:head>
              <th>General Feedback</th>
            </template>
            <template v-slot:body="{ item }">
              <td>{{ item.general_feedback }}</td>
            </template>
          </table-component>
          <div
            v-else-if="$store.getters.fetchedReports"
            class="text-center"
            style="min-height:100px"
          >
            <p class="lead font-weight-bold text-danger">No pm reports found</p>
            <router-link to="/reports/add/pm" class="btn btn-sm btn-primary">
              <span><i class="fa fa-plus-circle"></i></span>
              <span>Add new Report</span>
            </router-link>
          </div>
          <div
            v-else
            class="d-flex justify-content-center align-items-center"
            style="height:300px"
          >
            <div class="spinner-border"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import { httpCall } from "../../../helpers/http-service";
export default {
  mounted() {
    this.$store.dispatch("reportGetAll");
  },
  computed: {
    visits() {
      return this.$store.getters.pmVisits;
    },
    reportHeaders() {
      let products = [];
      let noOfProductsInReport = 0;
      if (this.visits) {
        this.visits.map(visit => {
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
          name: `products.${i}.name`
        });
        headers.push({
          title: `Product ${i + 1} action`,
          name: `products.${i}.action`
        });
        headers.push({
          title: `Product ${i + 1} Lader of adaption`,
          name: `products.${i}.lader`
        });
        headers.push({
          title: `Product ${i + 1} competitor`,
          name: `products.${i}.competitor`
        });
      }
      return headers;
    }
  },
  components: {
    TableComponent
  },
  data: () => ({
    headers: [
      {
        title: "ID",
        name: "id"
      },
      {
        title: "Date",
        name: "date"
      },
      {
        title: "Visit Type",
        name: "visit_type",
        style: "text-uppercase font-weight-bold"
      },
      {
        title: "Name",
        name: "customer_name"
      },
      {
        title: "Specialty",
        name: "customer.specialty"
      },
      {
        title: "Param",
        name: "customer.params.0.current",
        fallback: "NN"
      },
      {
        title: "Address",
        name: "customer.address"
      },
      {
        title: "Brick",
        name: "customer.brick"
      },
      {
        title: "Coach 1",
        name: "dual_with_name"
      },
      {
        title: 'Coach2',
        name: 'coach2_name'
      },
      {
        title: "Comment",
        name: "comment"
      }
    ]
  }),
  methods: {
    removeReport(id) {
      httpCall
        .post("rep/v1/reports/pm/" + id, {
          _method: "DELETE"
        })
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("reportGetAll", true);
          });
        });
    }
  }
};
</script>

<style></style>
