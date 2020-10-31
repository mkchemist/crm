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
            :heads="headers"
            v-if="visits.length"
            head-class="bg-success text-light"
          >
            <template v-slot:head>
              <th class="text-center">Products</th>
              <th>General Feedback</th>
              <th>Actions</th>
            </template>
            <template v-slot:body="{ item }">
              <td>
                <ul class="nav">
                  <li
                    v-for="(product, i) in item.products"
                    :key="i"
                    class="nav-item"
                  >
                    <span
                      >Product :
                      <span class="font-weight-bold">{{
                        product.name
                      }}</span></span
                    >
                    |
                    <span
                      >Lader :<span class="font-weight-bold">{{
                        product.lader
                      }}</span></span
                    >
                    |
                    <span
                      >Action :<span class="font-weight-bold">{{
                        product.action
                      }}</span></span
                    >
                    |
                    <span
                      >Competitor :
                      <span class="font-weight-bold">{{
                        product.competitor
                      }}</span></span
                    >
                  </li>
                </ul>
              </td>
              <td>{{ item.general_feedback }}</td>
              <td>
                <router-link
                  :to="`/reports/edit/pm/${item.id}`"
                  class="btn btn-sm btn-warning"
                >
                  <span><i class="fa fa-edit"></i></span>
                </router-link>
              </td>
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
export default {
  created() {
    this.$store.dispatch("reportGetAll");
  },
  computed: {
    visits() {
      return this.$store.getters.pmVisits;
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
        fallback: 'NN'
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
        title: "Date",
        name: "date"
      },
      {
        title: "Coach",
        name: "dual_with"
      },
      {
        title: "Comment",
        name: "comment"
      }
    ]
  })
};
</script>

<style></style>
