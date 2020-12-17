<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-store-alt"></i></span>
      <span class="font-weight-bold"
        >Pharmacy {{ pharmacy ? pharmacy.name : null }} Card</span
      >
    </p>
    <div class="p-2">
      <div class="p-2 text-right">
        <router-link to="/workplaces/pharmacies" class="btn btn-sm btn-dark">
          <span class="fa fa-chevron-circle-left"></span>
          <span>back</span>
        </router-link>
      </div>
      <div class="p-2" v-if="pharmacy">
        <div class="my-2 p-2 border rounded">
          <h4 class="text-muted">Pharmacy Info</h4>
          <div class="row mx-auto">
            <div class="col-lg">
              <p class="mb-0 small">
                <span>Name :</span
                ><span class="text-primary font-weight-bolder">{{
                  pharmacy.name
                }}</span>
              </p>
              <p class="mb-0 small">
                <span>Key Person :</span
                ><span class="text-primary font-weight-bolder">{{
                  pharmacy.key_person
                }}</span>
              </p>
              <p class="mb-0 small">
                <span>Name :</span
                ><span class="text-primary font-weight-bolder">{{
                  pharmacy.name
                }}</span>
              </p>
              <p class="mb-0 small">
                <span>Type :</span
                ><span class="text-primary font-weight-bolder">{{
                  pharmacy.type
                }}</span>
              </p>
            </div>
            <div class="col-lg">
              <p class="mb-0 small">
                <span>Address :</span
                ><span class="text-primary font-weight-bolder">{{
                  pharmacy.address
                }}</span>
              </p>
              <p class="mb-0 small">
                <span>Brick :</span
                ><span class="text-primary font-weight-bolder">{{
                  pharmacy.brick
                }}</span>
              </p>
              <p class="mb-0 small">
                <span>Area :</span
                ><span class="text-primary font-weight-bolder">{{
                  pharmacy.area
                }}</span>
              </p>
              <p class="mb-0 small">
                <span>District :</span
                ><span class="text-primary font-weight-bolder">{{
                  pharmacy.district
                }}</span>
              </p>
              <p class="mb-0 small">
                <span>Territory :</span
                ><span class="text-primary font-weight-bolder">{{
                  pharmacy.territory
                }}</span>
              </p>
              <p class="mb-0 small">
                <span>Region :</span
                ><span class="text-primary font-weight-bolder">{{
                  pharmacy.region
                }}</span>
              </p>
            </div>
          </div>
        </div>
        <div class="my-2 p-2 border rounded">
          <h4>Pharmacy Reports</h4>
          <div v-if="pharmacy.report.length">
            <table-component
              :data="pharmacy.report"
              :heads="reportHeaders"
            >
              <template v-slot:head>
                <th>Date</th>
              </template>
              <template v-slot:body="{item}">
                <td>{{ item.visit_date }}</td>
              </template>
            </table-component>
          </div>
          <div v-else>
            <no-data-to-show title="No reports found"/>
          </div>
        </div>
      </div>
      <div v-else-if="isFetched">
        <no-data-to-show title="something went error" />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
import NoDataToShow from "../../../components/NoDataToShow";
import TableComponent from "../../../components/TableComponent"
export default {
  mounted() {
    this.getPharmacy();
  },
  components: {
    NoDataToShow,
    TableComponent
  },
  computed: {
    reportHeaders() {
      let products = [];
      let noOfProductsInReport = 0;
      if (this.pharmacy.report) {
        this.pharmacy.report.map(visit => {
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
          title: `Product ${i + 1} rate`,
          name: `products.${i}.rate`
        });
        headers.push({
          title: `Product ${i + 1} competitor`,
          name: `products.${i}.competitor`
        });
        headers.push({
          title: `Product ${i + 1} Competitor rate`,
          name: `products.${i}.competitor_rate`
        });
      }
      headers.push({
        title: 'Feedback',
        name: 'general_feedback'
      })
      return headers;
    }
  },
  data: () => ({
    pharmacy: null,
    isFetched: false,
    headers: [
      {
        title: 'Rep',
        name: 'user.name'
      },
      {
        title: 'Date',
        name: 'visit_date'
      }
    ]
  }),
  methods: {
    /**
     * get pharmacy
     */
    getPharmacy() {
      let id = this.$route.params.id;
      this.isFetched = false;
      httpCall
        .get("dm/v1/pharmacies/" + id)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.pharmacy = data.data;
            this.pharmacy.report.map((item, i) => {
              this.pharmacy.report[i].products = JSON.parse(this.pharmacy.report[i].products);
            });
            this.isFetched = true;
          });
        })
        .catch(err => {
          console.log(err);
          this.$toasted.error("Something went error");
        });
    }
  }
};
</script>

<style></style>
