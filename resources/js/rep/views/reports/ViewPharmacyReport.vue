<template>
  <div class="row mx-auto pb-5">
    <div class="col-lg-3">
      <date-filter-box :data="$store.getters.pharmacyVisits" :onFilter="onFilter" :onReset="onReset" :dateField="`date`" />
    </div>
    <div class="col-lg-9 px-0 shadow pb-5">
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
          :heads="headers"
          order-by="Date,asc|Name,asc"
          head-class="bg-success text-light"
        >
          <template v-slot:head:before>
            <th>Action</th>
          </template>
          <template v-slot:body:before="{ item }">
            <td>
              <router-link
                :to="`/reports/edit/pharmacy/${item.id}`"
                class="btn btn-sm btn-warning"
              >
                <span><i class="fa fa-edit"></i></span>
              </router-link>
              <button
                type="button"
                class="btn btn-sm btn-danger"
                @click="selectReport(item.id)"
              >
                <span><i class="fa fa-times"></i></span>
              </button>
            </td>
          </template>
        </table-component>
      </div>
      <div
        v-else-if="$store.getters.fetchedReports"
        class="text-center"
        style="min-height:100px"
      >
        <no-data-to-show />
        <router-link to="/reports/add/pharmacy" class="btn btn-sm btn-primary">
          <span><i class="fa fa-plus-circle"></i></span>
          <span>add pharmacy report</span>
        </router-link>
      </div>
      <loader-component v-else></loader-component>
    </div>
    <modal-fade
      id="delete_modal_fade"
      :show="showDeleteModal"
      @onClose="closeDeleteModal"
    >
      <template v-slot:body>
        <p class="text-center">
          <span><i class="fa fa-exclamation-triangle text-danger"></i></span>
          <span class="text-muted"
            >Are you sure, you want to delete this report</span
          >
        </p>
        <hr />
        <div class="my-1 text-center">
          <button
            type="button"
            class="btn btn-sm btn-secondary"
            @click="closeDeleteModal"
          >
            <span><i class="fa fa-chevron-circle-left"></i></span>
            <span>Cancel</span>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-danger"
            @click="deleteReport"
          >
            <span><i class="fa fa-times-circle"></i></span>
            <span>Delete</span>
          </button>
        </div>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import ModalFade from "../../../components/ModalFade";
import { httpCall } from "../../../helpers/http-service";
import { ProductWithRate } from '../../../helpers/constants';
import NoDataToShow from '../../../components/NoDataToShow.vue';
import DateFilterBox from '../../../components/DateFilterBox.vue';
export default {
  mounted() {
    this.$store.dispatch("pharmacyReportGetAll");
  },
  computed: {
    pharmacies() {
      if(this.shouldRenderFilter) {
        return this.filteredList
      }
      return this.$store.getters.pharmacyVisits;
    },

  },
  data: () => ({
    headers: [
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
      ...ProductWithRate,
      {
        title: 'Feedback',
        name: 'general_feedback'
      },
      {
        title: "Address",
        name: "pharmacy.address"
      },
      {
        title: "Brick",
        name: "pharmacy.brick"
      },
      {
        title: "Area",
        name: "pharmacy.area"
      }
    ],
    selectedReport: null,
    showDeleteModal: false,
    shouldRenderFilter: false,
    filteredList: []
  }),
  components: {
    TableComponent,
    ModalFade,
    NoDataToShow,
    DateFilterBox,
  },
  methods: {

    openDeleteModal() {
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectedReport = null;
    },
    selectReport(id) {
      this.selectedReport = id;
      this.showDeleteModal = true;
    },
    deleteReport() {
      let id = this.selectedReport;
      httpCall
        .post("rep/v1/reports/pharmacy/" + id, { _method: "DELETE" })
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("pharmacyReportGetAll", true);
            this.showDeleteModal = false;
            this.selectedReport = null;
          });
        });
    },
    onFilter(data) {
      this.shouldRenderFilter = true;
      this.filteredList = [];
      let async = ()=>Promise.resolve(data);
      async().then(data => this.filteredList= data);
    },
    onReset() {
      this.filteredList = [];
      let async = ()=>Promise.resolve(this.$store.getters.pharmacyVisits);
      async().then(data => this.filteredList= data);
    }
  }
};
</script>

<style></style>
