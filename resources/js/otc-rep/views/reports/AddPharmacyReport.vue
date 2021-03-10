<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">Add new Pharmacy Report</span>
    </p>
    <div class="p-2">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveReport)">
          <!-- Date and Pharmacy -->
          <div class="row mx-auto">
            <!-- date -->
            <div class="col-lg  mx-1 rounded form-group border p-2">
              <label for="date" class="text-muted">Date</label>
              <ValidationProvider
                name="date"
                rules="required"
                v-slot="{ errors }"
              >
                <span class="text-danger small" v-if="errors[0]"
                  >you must select date</span
                >
                <input
                  type="date"
                  name="date"
                  id="date"
                  v-model="visit.date"
                  :class="
                    `form-control form-control-sm ${
                      errors[0] ? 'border border-danger' : ''
                    }`
                  "
                  :max="new Date().format()"
                  :min="$store.getters.reportIntervalMin"
                />
              </ValidationProvider>
            </div>
            <!-- end of date -->
            <!-- pharmacy -->
            <div class="col-lg  mx-1 rounded form-group border p-2">
              <div class="row mx-auto align-items-center">
                <div class="col-lg">
                  <label for="pharmacy" class="text-muted">Pharmacy</label>
                  <ValidationProvider
                    name="pharmacy"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <span v-if="errors[0]" class="text-danger small"
                      >you must select pharmacy</span
                    >
                    <select
                      name="pharmacy"
                      id="pharmacy"
                      v-model="visit.pharmacy"
                      :class="
                        `form-control form-control-sm ${
                          errors[0] ? 'border border-danger' : ''
                        }`
                      "
                      :disabled="!isFetched||preset"
                    >
                      <template v-if="!preset">
                        <option :value="null">Select Pharmacy</option>
                        <option
                          :value="pharmacy.id"
                          v-for="pharmacy in pharmacies"
                          :key="pharmacy.id"
                          >{{ pharmacy.name }}</option
                        >
                      </template>
                      <option :value="visit.pharmacy">{{ presetPharmacyName }}</option>
                    </select>
                  </ValidationProvider>
                </div>
                <div class="col-lg-auto" v-if="!preset">
                  <div class="btn-group">
                    <button
                      class="btn btn-sm btn-primary"
                      type="button"
                      @click="openFilterBox"

                    >
                      <span class="fa fa-filter"></span>
                      <span>Filter</span>
                    </button>
                    <button
                      class="btn btn-sm btn-primary"
                      type="button"
                      @click="openSearchBox"
                      :disabled="!pharmacies.length"
                    >
                      <span class="fa fa-search"></span>
                    </button>
                    <data-filter-box
                      :show="showFilterBox"
                      :queryOnly="false"
                      :onClose="closeFilterBox"
                      :onReset="onReset"
                      :onFilter="onFilter"
                      :queryKeys="filterQueryKeys"
                      :data="pharmacies"
                      :sortBy="`name`"
                    />
                    <modal-fade
                      :show="search.show"
                      @onClose="closeSearchBox"
                      :headerStyle="`bg-primary text-light`"
                      :id="search.id"
                    >
                      <template v-slot:header>
                        <span>Search Pharmacies</span>
                      </template>
                      <template v-slot:body>
                        <div class="form-inline">
                          <input
                            type="text"
                            v-model="search.keyword"
                            class="form-control form-control-sm col mx-2"
                            placeholder="Enter pharmacy name"
                            @keyup.enter="searchPharmacies"
                          />
                          <a
                            href=""
                            class="text-decoration-none"
                            @click.prevent="searchPharmacies"
                          >
                            <span class="fa fa-search"></span>
                          </a>
                        </div>
                        <div class="small my-2">
                          <span>Total found : {{ search.result.length }}</span>
                        </div>
                        <div
                          v-if="search.result.length"
                          style="max-height:200px;overflow:auto"
                        >
                          <table
                            class="table table-sm small table-responsive table-striped"
                          >
                            <thead>
                              <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Brick</th>
                                <th>Area</th>
                                <th>District</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="p in search.result" :key="`search_result_${p.id}`">
                                <th>
                                  <button
                                    class="btn btn-primary btn-sm"
                                    type="button"
                                    @click="selectPharmacy(p.id)"
                                  >
                                    <span class="fa fa-handshake"></span>
                                  </button>
                                </th>
                                <td>{{ p.name }}</td>
                                <td>{{ p.address }}</td>
                                <td>{{ p.brick }}</td>
                                <td>{{ p.area }}</td>
                                <td>{{ p.district }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div v-else class="p-1">
                          <p class="text-muted small">
                            Enter keyword to search pharmacies
                          </p>
                        </div>
                        <div class="form-group text-right">
                          <button
                            class="btn btn-sm btn-dark"
                            @click="closeSearchBox"
                            type="button"
                          >
                            <span class="fa fa-chevron-circle-left"></span>
                            <span>Cancel</span>
                          </button>
                        </div>
                      </template>
                    </modal-fade>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- end of date and pharmacy -->
          <!-- Visit products -->
          <div class="form-group border p-2">
            <otc-visit-products
              :data="visit.products"
              :pharmacyProducts="true"
            />
          </div>
          <!-- end of visit products -->
          <div class="form-group p-2">
            <label for="feedback" class="text-muted">Feedback</label>
            <ValidationProvider
              name="Feedback"
              rules="required"
              v-slot="{ errors }"
            >
              <span class="text-danger small">{{ errors[0] }}</span>
              <textarea
                name="feedback"
                id="feedback"
                cols="30"
                rows="5"
                :class="
                  `form-control form-control-sm ${
                    errors[0] ? 'border border-danger' : ''
                  }`
                "
                v-model="visit.general_feedback"
                placeholder="write general feedback"
              ></textarea>
            </ValidationProvider>
          </div>
          <hr />
          <!-- controller -->
          <div class="form-group text-right">
            <router-link to="/reports" class="btn btn-sm btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
            <button class="btn btn-sm btn-secondary" type="reset">
              <span class="fa fa-redo"></span>
              <span>Reset</span>
            </button>
            <button class="btn btn-sm btn-success" type="submit">
              <span class="fa fa-save"></span>
              <span>Save</span>
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import DataFilterBox from "../../../components/DataFilterBox.vue";
import ModalFade from "../../../components/ModalFade.vue";
import { asyncDataFlow, httpCall } from "../../../helpers/http-service";
import OtcVisitProducts from "../../components/OtcVisitProducts.vue";
export default {
  components: { DataFilterBox, OtcVisitProducts, ModalFade },
  mounted() {
    if(this.$route.params.id) {
      this.presetPharmacyVisit(this.$route.params.id);
    } else {
      this.$store.dispatch("fetchPharmacies");
    }
  },
  computed: {
    pharmacies() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$store.getters.allPharmacies;
    },
    isFetched() {
      return this.$store.getters.isPharmaciesFetched;
    }
  },
  data: () => ({
    showFilterBox: false,
    shouldRenderFilter: false,
    filteredList: [],
    filterQueryKeys: [
      {
        title : "Area",
        name: "area"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "Favorite",
        name: "isFavorite"
      }
    ],
    visit: {
      pharmacy: null,
      date: new Date().format(),
      products: [],
      general_feedback: null,
      type: "regular"
    },
    search: {
      show: false,
      result: [],
      id: "search_modal",
      keyword: null
    },
    preset: false,
    presetPharmacyName: null
  }),
  methods: {
    presetPharmacyVisit(id) {
      this.visit.pharmacy = parseInt(id);
      this.presetPharmacyName = this.$route.query.name;
      this.preset = true;
    },
    /* save report */
    saveReport() {
      if (!this.visit.products.length) {
        this.$toasted.error("You must add one product at least", {
          icon: "fa-exclamation"
        });
        return;
      }
      let request = Object.assign({}, this.visit);
      request.products = JSON.stringify(request.products);
      httpCall
        .post("otc-rep/v1/reports/pharmacy", request)
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("fetchPharmacyReports", { force: true });
            this.$router.push("/reports/view/pharmacy");
          });
        })
        .catch(err => console.log(err));
    },
    /**
     * filter pharmacy list
     *
     * @param {Object} query [filter query result]
     * @param {Array} data [filtered list]
     */
    onFilter(query, data) {
      console.log(query)
      this.shouldRenderFilter = true;
      this.filteredList = [];
      asyncDataFlow(data, data => (this.filteredList = data));
    },
    /* reset filter */
    onReset() {
      this.filteredList = [];
      asyncDataFlow([], data => {
        this.filteredList = [];
        this.shouldRenderFilter = false;
      });
    },
    /* open filter */
    openFilterBox() {
      this.showFilterBox = true;
    },
    /* close filter */
    closeFilterBox() {
      this.showFilterBox = false;
    },
    /* open Search */
    openSearchBox() {
      this.search.show = true;
    },
    /* close Search */
    closeSearchBox() {
      this.search.show = false;
    },
    searchPharmacies(e) {
      if(!this.search.keyword) {
        return;
      }
      this.search.result = this.pharmacies.filter(p =>
        p.name.toLowerCase().includes(this.search.keyword.toLowerCase())
      );
    },
    selectPharmacy(id) {
      this.visit.pharmacy = id;
      this.closeSearchBox();
    }
  }
};
</script>

<style></style>
