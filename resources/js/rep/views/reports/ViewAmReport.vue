<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-book-open"></i></span>
        <span class="font-weight-bold">View AM visits Report</span>
      </p>
      <div class="p-2 text-right">
        <router-link to="/reports" class="btn btn-sm btn-dark">
          <span><i class="fa fa-chevron-circle-left"></i></span>
          <span>back</span>
        </router-link>
        <router-link to="/reports/add/am" class="btn btn-sm btn-success">
          <span><i class="fa fa-plus-circle"></i></span>
          <span>new</span>
        </router-link>
      </div>
      <div class="p-2">
        <table-component
          :data="visits"
          :heads="headers"
          v-if="visits.length"
          head-class="bg-success text-light"
          order-by="Date,asc|Customer Name,asc"
        >
          <template v-slot:head>
            <th>Products</th>
            <th>Comment</th>
            <th>Geneal Feedback</th>
            <th>Action</th>
          </template>
          <template v-slot:body="{ item }">
            <td>
              <ul class="nav">
                <li
                  class="nav-item col-12"
                  v-for="(p, i) in item.products"
                  :key="i"
                >
                  <span
                    >Product :
                    <span class="font-weight-bold">{{ p.name }}</span></span
                  >
                  |
                  <span
                    >Lader :
                    <span class="font-weight-bold">{{ p.lader }}</span></span
                  >
                  |
                  <span
                    >Action :
                    <span class="font-weight-bold">{{ p.action }}</span></span
                  >
                  |
                  <span
                    >Competitor :
                    <span class="font-weight-bold">{{
                      p.competitor
                    }}</span></span
                  >
                </li>
              </ul>
            </td>
            <td>{{ item.comment }}</td>
            <td>{{ item.general_feedback }}</td>
            <td>
              <router-link :to="`/reports/edit/am/${item.id}`" class="btn btn-sm btn-warning">
                <span><i class="fa fa-edit"></i></span>
              </router-link>
            </td>
          </template>
        </table-component>
        <div v-else class="d-flex justify-content-center align-items-center">
          <vue-loaders name="ball-scale" scale="2" color="grey" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
export default {
  created() {
    this.$store.dispatch("amGetAll");
  },
  computed: {
    visits() {
      return this.$store.getters.amVisits;
    }
  },
  components: {
    TableComponent
  },
  data: () => ({
    headers: [
      {
        title: "Date",
        name: "date"
      },
      {
        title: "Customer Name",
        name: "customer.name"
      },
      {
        title: "Specialty",
        name: "customer.specialty"
      },
      {
        title: "Workplace",
        name: "workplace.name"
      },
      {
        title: "Address",
        name: "workplace.address"
      },
      {
        title: "Brick",
        name: "workplace.brick"
      }
    ]
  })
};
</script>

<style></style>
