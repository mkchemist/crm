<template>
  <div class="row mx-auto pb-5">
    <div class="col-lg-3">
      <cycle-selection :onSelect="onSelect" :onReset="onResetCycle" />
      <date-filter-box :data="$store.getters.amVisits" :onFilter="onFilter" :onReset="onReset" :dateField="`date`" />
    </div>
    <div class="col-lg-9 px-0 shadow pb-5">
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
          <template v-slot:head:before>
            <th>Action</th>
          </template>
          <template v-slot:body:before="{ item }">
            <td>
              <router-link
                :to="`/reports/edit/am/${item.id}`"
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
        <div
          v-else-if="$store.getters.fetchedReports"
          class="text-center"
          style="min-height:100px"
        >
          <no-data-to-show />
          <router-link to="/reports/add/am" class="btn btn-sm btn-primary">
            <span><i class="fa fa-plus-circle"></i></span>
            <span>add new am report</span>
          </router-link>
        </div>
        <loader-component v-else></loader-component>
      </div>
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
import { ProductWithLader } from "../../../helpers/constants";
import DateFilterBox from '../../../components/DateFilterBox.vue';
import NoDataToShow from '../../../components/NoDataToShow.vue';
import CycleSelection from '../../../components/CycleSelection.vue';
export default {
  mounted() {
    this.$store.dispatch("amGetAll");
  },
  computed: {
    visits() {
      if(this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$store.getters.amVisits;
    },
    activeCycle() {
      return this.$store.getters.activeCycle
    }
  },
  components: {
    TableComponent,
    ModalFade,
    DateFilterBox,
    NoDataToShow,
    CycleSelection,
  },
  data: () => ({
    shouldRenderFilter: false,
    filteredList: [],
    headers: [
      {
        title: "Date",
        name: "date"
      },
      {
        title: "Workplace",
        name: "workplace.name"
      },
      {
        title: "Customer Name",
        name: "customer.name"
      },
      {
        title: "Specialty",
        name: "customer.specialty"
      },
      ...ProductWithLader,
      {
        title: 'Comment',
        name: 'comment'
      },
      {
        title: 'Feedback',
        name: 'general_feedback'
      },
      {
        title: "Address",
        name: "workplace.address"
      },
      {
        title: "Brick",
        name: "workplace.brick"
      }
    ],
    selectedReportId: null,
    showDeleteModal: false
  }),
  methods: {
    openDeleteModal() {
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectReportId = null;
    },
    selectReport(id) {
      this.selectedReportId = id;
      this.openDeleteModal();
    },
    deleteReport() {
      if (!this.selectedReportId) {
        this.$toasted.error("Select Report first", {
          icon: "exclamation"
        });
        return;
      }
      let id = this.selectedReportId;
      httpCall
        .post("rep/v1/reports/am/" + id, { _method: "DELETE" })
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("amGetAll", true);
            this.showDeleteModal = false;
            this.selectedReportId = null;
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
      let async = ()=>Promise.resolve(this.$store.getters.amVisits);
      async().then(data => this.filteredList= data);
    },
    onSelect() {
      this.$store.dispatch("amGetAll", {
        start: this.activeCycle.start,
        end: this.activeCycle.end
      });
    },
    onResetCycle() {
      this.$store.commit('resetActiveCycle');
      this.$store.dispatch("amGetAll", {
        start: this.activeCycle.start,
        end: this.activeCycle.end
      });
    }
  }
};
</script>

<style></style>
