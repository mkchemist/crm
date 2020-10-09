<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-book-open"></i></span>
        <span class="font-weight-bold">View Pharmacy Reports</span>
      </p>
      <div class="p-2 my-2 text-right">
        <router-link to="/reports" class="btn btn-sm btn-dark">
          <span><i class="fa fa-chevron-circle-left"></i></span>
          <span>back</span>
        </router-link>
        <router-link to="/reports/add/pharmacy" class="btn btn-sm btn-success">
          <span><i class="fa fa-plus-circle"></i></span>
          <span>new</span>
        </router-link>
      </div>
      <div class="p-2 my-2" v-if="pharmacies.length">
        <table-component
          :data="pharmacies"
          :heads="heads"
          order-by="Date,asc|Name,asc"
          head-class="bg-success text-light"
        >
          <template v-slot:head>
            <th>Products</th>
            <th>Feedback</th>
            <th>Action</th>
          </template>
          <template v-slot:body="{ item }">
            <td>
              <ul class="nav">
                <li class="nav-item col-12" v-for="(product,i) in item.products" :key="i">
                  <span>Name: <span class="font-weight-bold">{{ product.name }}</span></span> |
                  <span>Rate: <span class="font-weight-bold">{{ product.rate }}</span></span> |
                  <span>Competitor: <span class="font-weight-bold">{{ product.competitor }}</span></span> |
                  <span>Competitor Rate: <span class="font-weight-bold">{{ product.competitor_rate }}</span></span>
                </li>
              </ul>
            </td>
            <td>{{ item.general_feedback }}</td>
            <td>
              <router-link :to="`/reports/edit/pharmacy/${item.id}`" class="btn btn-sm btn-warning"><span><i class="fa fa-edit"></i></span></router-link>
            </td>
          </template>
        </table-component>
      </div>
      <div
        class="p-2 my-2 d-flex justify-content-center align-items-center"
        style="height:300px"
        v-else
      >
        <div class="spinner-border"></div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
export default {
  created() {
    this.$store.dispatch("pharmacyReportGetAll");
  },
  computed: {
    pharmacies() {
      return this.$store.getters.pharmacyVisits;
    }
  },
  data: () => ({
    heads: [
      {
        title: "Date",
        name: "date"
      },
      {
        title: "Name",
        name: "pharmacy.name"
      },
      {
        title: "Type",
        name: "pharmacy.type"
      },
      {
        title: "Key Person",
        name: "pharmacy.key_person"
      },
      {
        title: "Address",
        name: "pharmacy.address"
      },
      {
        title: "Brick",
        name: "pharmacy.brick"
      }
    ]
  }),
  components: {
    TableComponent
  }
};
</script>

<style></style>
