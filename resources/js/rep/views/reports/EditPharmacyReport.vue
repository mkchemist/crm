<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-edit"></i></span>
        <span class="font-weight-bold"
          >Edit Pharmacy Report {{ visit ? visit.pharmacy.name : null }}</span
        >
      </p>
      <div class="p-2 my-2">
        <ValidationObserver v-slot="{ handleSubmit }" v-if="visit">
          <form @submit.prevent="handleSubmit(updateReport)">
            <!-- visit info -->
            <div class="row mx-auto border p-2 rounded">
              <div class="col-lg">
                <label for="date" class="text-muted">Date</label>
                <ValidationProvider name="date" rules="required" v-slot="{errors}">
                  <span v-if="errors[0]" class="text-danger small">you must pick a date</span>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    v-model="visit.date"
                    :class="`form-control form-control-sm ${errors[0] ? 'border-danger' : ''}`"
                  />
                </ValidationProvider>
              </div>
              <div class="col-lg">
                <label for="pharmacy_id" class="text-muted">Pharmacy</label>
                <input
                  type="text"
                  name="pharmacy_id"
                  id="pharmacy_id"
                  v-model="visit.pharmacy.name"
                  class="form-control form-control-sm"
                  readonly
                />
              </div>
            </div>
            <!-- end of visit info -->
            <!-- pharmacy info -->
            <div class="row mx-auto p-2 my-2 border rounded">
              <div class="col-lg">
                <p class="mb-0 small">
                  Name:
                  <span class="font-weight-bold text-primary">{{
                    visit.pharmacy.name
                  }}</span>
                </p>
                <p class="mb-0 small">
                  Key person:
                  <span class="font-weight-bold text-primary">{{
                    visit.pharmacy.key_person
                  }}</span>
                </p>
                <p class="mb-0 small">
                  Name:
                  <span class="font-weight-bold text-primary">{{
                    visit.pharmacy.type
                  }}</span>
                </p>
              </div>
              <div class="col-lg">
                <p class="mb-0 small">
                  Address:
                  <span class="font-weight-bold text-primary">{{
                    visit.pharmacy.address
                  }}</span>
                </p>
                <p class="mb-0 small">
                  Name:
                  <span class="font-weight-bold text-primary">{{
                    visit.pharmacy.brick
                  }}</span>
                </p>
              </div>
            </div>
            <!-- end of pharmacy info -->
            <!-- products section -->
            <div class="p-2 my-2 border rounded">
              <visit-products :data="visit.products" :pharmacyProducts="true" />
            </div>
            <!-- end of products section -->
            <!-- feedback section -->
            <div class="p-2 my-2 border rounded">
              <div class="form-group">
                <label for="general_feedback" class="text-muted"
                  >Feedback</label
                >
                <ValidationProvider name="general_feedback" rules="required" v-slot="{errors }">
                  <span v-if="errors[0]" class="text-danger small">you must write a short notes feedback</span>
                  <textarea
                    name="general_feedback"
                    id="general_feedback"
                    :class="`form-control form-control-sm ${errors[0] ? 'border-danger': ''}`"
                    rows="3"
                    v-model="visit.general_feedback"
                  ></textarea>
                </ValidationProvider>
              </div>
            </div>
            <!-- end of feedback section -->
            <hr>
            <!-- visit control -->
            <div class="form-group text-right p-2">
              <router-link to="/reports" class="btn btn-sm btn-dark">
                <span><i class="fa fa-chevron-circle-left"></i></span>
                <span>back</span>
              </router-link>
              <button class="btn btn-sm btn-success">
                <span><i class="fa fa-save"></i></span>
                <span>save</span>
              </button>
            </div>
            <!-- end of visit control -->
          </form>
        </ValidationObserver>
        <div
          class="d-flex justify-content-center align-items-center"
          v-else
          style="height:300px"
        >
          <div class="spinner-border"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../helpers/http-service";
import VisitProducts from "../../components/VisitProducts";
export default {
  created() {
    this.getPharmacy();
  },
  methods: {
    /**
     * get pharmacy id
     *
     * @return {int}
     */
    getPharmacyId() {
      return this.$route.params.id;
    },
    /**
     * get pharmacy report
     *
     *
     * @return {void}
     */
    getPharmacy() {
      let id = this.getPharmacyId();
      httpCall.get("rep/v1/reports/pharmacy/" + id).then(({ data }) => {
        data.message = "Pharmacy report loaded";
        this.handleResponse(data, data => {
          this.visit = data.data;
        });
      });
    },
    /**
     * update pharmacy report
     *
     * @return {void}
     */
    updateReport() {
      let id = this.getPharmacyId();
      if(!this.visit.products.length) {
        this.$toasted.error('you must add one product at least', {
          icon: 'exclamation'
        });
        return;
      }
      let data = {_method: 'PUT'};
      Object.assign(data, this.visit);
      data.products = JSON.stringify(data.products);
      httpCall.post('rep/v1/reports/pharmacy/'+id, data)
      .then(({data}) => {
        data.message = data.data;
        this.handleResponse(data, data => {
          this.$router.replace('/reports/view/pharmacy');
          this.$store.dispatch('pharmacyReportGetAll', true);
        })
      })
    }
  },
  data: () => ({
    visit: null
  }),
  components: {
    VisitProducts
  }
};
</script>

<style></style>
