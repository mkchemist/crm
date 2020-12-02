<template>
  <div>
    <modal-fade
      :show="show_filter_modal"
      @onClose="closeFilterModal"
      :centered="true"
    >
      <template v-slot:header>
        <span>Filter Pharmacies</span>
      </template>
      <template v-slot:body>
        <div class="form-group">
          <label for="brick" class="text-muted small">Brick</label>
          <select name="brick" id="brick" v-model="filter.brick" class="form-control form-control-sm">
            <option value="">all</option>
            <option
              v-for="(item, i) in Object.keys(pharmacyFilterItems)"
              :key="`brick_${i}`"
              :value="item"
              >{{ item }} ({{ pharmacyFilterItems[item].length }}) </option
            >
          </select>
        </div>
        <hr>
        <div class="p-2 text-right">
          <button class="btn btn-sm btn-primary" @click="handleFilterSubmit">
            <span><i class="fa fa-check-circle"></i></span>
            <span>ok</span>
          </button>
        </div>
      </template>
    </modal-fade>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-plus-circle"></i></span>
        <span class="font-weight-bold">New Pharmacy report</span>
      </p>
      <div class="p-2">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(saveReport)">
            <!-- Date and Pharamcy section -->
            <div class="row mx-auto p-2 rounded border">
              <div class="col-lg">
                <label for="date" class="text-muted">Date</label>
                <ValidationProvider
                  name="date"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span v-if="errors[0]" class="text-danger small"
                    >You must pick a date</span
                  >
                  <input
                    type="date"
                    name="date"
                    v-model="visit.date"
                    class="form-control form-control-sm"
                  />
                </ValidationProvider>
              </div>

              <div class="col-lg">
                <label for="pharamcy_id" class="text-muted">Pharmacy ({{ pharmacies.length }})</label>
                <ValidationProvider
                  name="pharmacy_id"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <span v-if="errors[0]" class="text-danger small"
                    >must select a pharmacy</span
                  >
                  <div v-if="pharmacy">
                    <input
                      type="text"
                      class="form-control form-control-sm"
                      disabled
                      :value="pharmacy.name"
                    />
                    <input
                      type="hidden"
                      name="pharmacy_id"
                      v-model="visit.pharamcy_id"
                    />
                  </div>
                  <select
                    name="pharmacy_id"
                    v-model="visit.pharmacy_id"
                    :class="
                      `form-control form-control-sm ${
                        errors[0] ? 'border-danger' : ''
                      }`
                    "
                    v-else
                  >
                    <option value="">Select Pharmacy</option>
                    <option
                      v-for="pharmacy in pharmacies"
                      :key="pharmacy.id"
                      :value="pharmacy.id"
                      >{{ pharmacy.name }}</option
                    >
                  </select>
                </ValidationProvider>
                <div class="text-right my-2" v-if="!is_single_pharmacy">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="selectPharmacy"
                  >
                    <span><i class="fa fa-check-circle"></i></span>
                    <span>view</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    :disabled="!pharmacies.length"
                    @click="showFilterModal"
                  >
                    <span><i class="fa fa-filter"></i></span>
                    <span>filter</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    @click="resetPharmacy"
                  >
                    <span><i class="fa fa-redo"></i></span>
                    <span>reset</span>
                  </button>
                </div>
              </div>
            </div>
            <!-- end of Date and Pharmacy -->
            <!-- selected pharmacy info -->
            <div
              class="p-2 rounded border row mx-auto my-2"
              v-if="selected_pharmacy || pharmacy"
            >
              <div class="col-lg">
                <p class="mb-0 small">
                  Name
                  <span class="font-weight-bold text-primary">{{
                    selected_pharmacy.name
                  }}</span>
                </p>
                <p class="mb-0 small">
                  Type
                  <span class="font-weight-bold text-primary">{{
                    selected_pharmacy.type
                  }}</span>
                </p>
                <p class="mb-0 small">
                  Key Person
                  <span class="font-weight-bold text-primary">{{
                    selected_pharmacy.key_person
                  }}</span>
                </p>
              </div>
              <div class="col-lg">
                <p class="mb-0 small">
                  Address
                  <span class="font-weight-bold text-primary">{{
                    selected_pharmacy.address
                  }}</span>
                </p>
                <p class="mb-0 small">
                  Brick
                  <span class="font-weight-bold text-primary">{{
                    selected_pharmacy.brick
                  }}</span>
                </p>
              </div>
            </div>
            <!-- end selected pharmacy info -->
            <!-- products -->
            <div class="p-2 rounded border my-2">
              <visit-products
                :data="visit.products"
                :pharmacy-products="true"
              />
            </div>
            <!-- end of products -->
            <div class="p-2 rounded border my-2">
              <label for="general_feedback" class="text-muted"
                >General Feedback</label
              >
              <ValidationProvider
                name="general_feedback"
                rules="required"
                v-slot="{ errors }"
              >
                <span v-if="errors[0]" class="text-danger small"
                  >you must write a short notes feedback</span
                >
                <textarea
                  name="general_feedback"
                  v-model="visit.general_feedback"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border-danger' : ''
                    }`
                  "
                  rows="3"
                  placeholder="Write a feedback that can be a reference for you to review later"
                ></textarea>
              </ValidationProvider>
            </div>
            <hr />
            <div class="form-group text-right">
              <router-link to="/reports" class="btn btn-sm btn-dark">
                <span><i class="fa fa-chevron-circle-left"></i></span>
                <span>back</span>
              </router-link>
              <button class="btn btn-sm btn-success">
                <span><i class="fa fa-save"></i></span>
                <span>save</span>
              </button>
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import VisitProducts from "../../components/VisitProducts";
import { httpCall } from "../../../helpers/http-service";
import ModalFade from "../../../components/ModalFade";
import { filterData } from "../../../helpers/helpers";
export default {
  components: {
    VisitProducts,
    ModalFade
  },
  created() {
    this.$store.dispatch("pharmacyGetAll");
    if (this.$route.params.id) {
      this.is_single_pharmacy = true;
      this.visit.pharmacy_id = this.$route.params.id;
    }
  },
  data: () => ({
    visit: {
      date: new Date().format("YYYY-MM-DD"),
      pharmacy_id: null,
      products: [],
      general_feedback: ""
    },
    is_single_pharmacy: false,
    selected_pharmacy: null,
    show_filter_modal: false,
    filter: {
      brick: "",
      isActive: false,
      data: []
    }
  }),
  methods: {
    saveReport() {
      if (!this.visit.products.length) {
        this.$toasted.error("you must at least pick one product", {
          icon: "exclamation"
        });
        return;
      }
      let data = {};
      Object.assign(data, this.visit);
      data.products = JSON.stringify(data.products);
      httpCall.post("rep/v1/reports/pharmacy", data).then(({ data }) => {
        data.message = "visit added successfully";
        this.handleResponse(data, data => {
          this.$router.replace("/reports/view/pharmacy");
          this.$store.dispatch("pharmacyReportGetAll", true);
        });
      });
    },
    selectPharmacy() {
      if (!this.visit.pharmacy_id) {
        this.$toasted.show("must select pharmacy first", {
          type: "error",
          icon: "exclamation"
        });
        return;
      }
      this.selected_pharmacy = this.pharmacies.filter(
        pharmacy => pharmacy.id === this.visit.pharmacy_id
      )[0];
    },
    resetPharmacy() {
      this.visit.pharmacy_id = null;
      this.selected_pharmacy = null;
      this.filter.isActive = false;
      this.filter.data = [];
    },
    showFilterModal() {
      this.show_filter_modal = true;
    },
    closeFilterModal() {
      this.show_filter_modal = false;
    },
    handleFilterSubmit() {
      this.filter.isActive = true;
      this.filterItems().then(d => {
        this.filter.data = d;
        this.show_filter_modal = false;
      });
    },
    filterItems() {
      return new Promise((resolve, reject) => {
        try {
          let data = this.$store.getters.pharmacies;
          if(this.filter.brick !== '') {
            data = data.filter(p => p.brick === this.filter.brick);
          }
          resolve(data);
        } catch(e) {
          reject(e);
        }
      })
    }
  },
  computed: {
    pharmacies() {
      if(this.filter.isActive) {
        return this.filter.data;
      }
      return this.$store.getters.pharmacies;
    },
    pharmacy() {
      if (this.is_single_pharmacy) {
        let id = this.$route.params.id;
        let pharmacy = this.pharmacies.filter(
          pharmacy => pharmacy.id === parseInt(id)
        )[0];
        this.selected_pharmacy = pharmacy;
        return pharmacy;
      }
      return null;
    },
    pharmacyFilterItems() {
      let pharmacies = this.$store.getters.pharmacies;
      let data = filterData(pharmacies, "brick");
      return data;
    }
  }
};
</script>

<style></style>
