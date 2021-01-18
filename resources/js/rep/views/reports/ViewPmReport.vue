<template>
  <div>
    <div class="row mx-auto">
      <div class="col-lg-3">
        <cycle-selection :onSelect="selectCycle" :onReset="resetCycle"/>
        <date-filter-box :data="$store.getters.pmVisits" :onFilter="onFilter" :onReset="onReset" :dateField="`date`" />
      </div>
      <div class="col-lg-9">
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
                      @click="selectReportForDelete(item)"
                    >
                      <span><i class="fa fa-trash"></i></span>
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
                <router-link
                  to="/reports/add/pm"
                  class="btn btn-sm btn-primary"
                >
                  <span><i class="fa fa-plus-circle"></i></span>
                  <span>Add new Report</span>
                </router-link>
              </div>
              <loader-component v-else></loader-component>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-fade :show="showDeleteModal" @onClose="closeDeleteModal" :headerStyle="`bg-danger text-light`">
      <template v-slot:header v-if="selectedReport" >
        <span>Delete Visit</span>
      </template>
      <template v-slot:body v-if="selectedReport">
        <p>Are you sure , to delete <span class="text-danger font-weight-bold"> {{ selectedReport.customer_name }} </span> visit</p>
        <hr>
        <div class="text-center">
          <button class="btn btn-sm btn-danger" @click="removeReport(selectedReport.id)">
            <span class="fa fa-trash"></span>
            <span>Delete</span>
          </button>
          <button class="btn btn-sm btn-secondary" @click="closeDeleteModal">
            <span class="fa fa-chevron-circle-left"></span>
            <span>Cancel</span>
          </button>
        </div>
      </template>
    </modal-fade>
  </div>
</template>

<script>
import CycleSelection from '../../../components/CycleSelection.vue';
import DateFilterBox from '../../../components/DateFilterBox.vue';
import ModalFade from '../../../components/ModalFade.vue';
import NoDataToShow from '../../../components/NoDataToShow.vue';
import TableComponent from "../../../components/TableComponent";
import { ProductWithLader } from "../../../helpers/constants";
import { httpCall } from "../../../helpers/http-service";
export default {
  mounted() {
    this.$store.dispatch("reportGetAll");
  },
  computed: {
    visits() {
      if(this.shouldRenderFilter) {
        return this.filteredList;
      }
      return this.$store.getters.pmVisits;
    },
    activeCycle() {
      return this.$store.getters.activeCycle
    }
  },
  components: {
    TableComponent,
    DateFilterBox,
    NoDataToShow,
    ModalFade,
    CycleSelection
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
      ...ProductWithLader,
      {
        title: "Coach 1",
        name: "dual_with_name"
      },
      {
        title: "Coach2",
        name: "coach2_name"
      },
      {
        title: "Comment",
        name: "comment"
      },
      {
        title: "Feedback",
        name: "general_feedback"
      },
      {
        title: "Address",
        name: "customer.address"
      },
      {
        title: "Brick",
        name: "customer.brick"
      }
    ],
    shouldRenderFilter: false,
    filteredList: [],
    showDeleteModal: false,
    selectedReport: null
  }),
  methods: {
    /**
     * select report for delete
     *
     * @param {object} report
     */
    selectReportForDelete(report) {
      this.selectedReport = report;
      this.openDeleteModal();
    },
    openDeleteModal() {
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
    },
    removeReport(id) {
      httpCall
        .post("rep/v1/reports/pm/" + id, {
          _method: "DELETE"
        })
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("reportGetAll", true);
            this.closeDeleteModal();
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
      let async = ()=>Promise.resolve(this.$store.getters.pmVisits);
      async().then(data => this.filteredList= data);
    },
    selectCycle() {
       this.$store.dispatch("reportGetAll", {
         force: true,
         start: this.activeCycle.start,
         end: this.activeCycle.end
       })
    },
    resetCycle() {
      this.$store.commit('resetActiveCycle');
      this.$store.dispatch('reportGetAll');
    }
  }
};
</script>

<style></style>
