<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-book-open"></i></span>
      <span class="font-weight-bold">View All hospital reports</span>
    </p>
    <div class="p-2">
      <div class="row mx-auto">
        <div class="col-lg-3">
          <cycle-selection :onSelect="onSelectCycle" :onReset="onResetCycle" />

          <data-filter
            :data="$store.getters.allHospitalReports"
            :onUpdate="onUpdate"
            :onReset="onReset"
            :keys="{ rep: 'user_id', date: 'date' }"
          />
          <div class="my-2 p-2 border rounded">
            <router-link to="/reports" class="btn btn-sm btn-block btn-dark">
              <span><i class="fa fa-chevron-circle-left"></i></span>
              <span>back</span>
            </router-link>
          </div>
        </div>

        <div class="col-lg-9 shadow p-2">
          <div class="p-3">
            <button class="btn btn-success btn-sm" @click="refreshLists">
              <span><i class="fa fa-redo"></i></span>
              <span>refresh list</span>
            </button>
          </div>
          <div class="p-2" v-if="reports.length">
            <table-component
              :heads="headers"
              :data="reports"
              :unselectable="true"
              head-class="bg-success text-light"
              sort-by="Date,asc|Hospital,asc"
            >
            </table-component>
          </div>
          <div v-else-if="fetched">
            <no-data-to-show />
          </div>
          <loader-component v-else></loader-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CycleSelection from "../../../components/CycleSelection.vue";
import NoDataToShow from "../../../components/NoDataToShow.vue";
import TableComponent from "../../../components/TableComponent";
import { ProductWithLader } from "../../../helpers/constants";
import DataFilter from "../../components/DataFilter";
export default {
  components: {
    TableComponent,
    DataFilter,
    CycleSelection,
    NoDataToShow
  },
  created() {
    this.$store.dispatch("getAllHospitalReports");
  },
  data: () => ({
    headers: [
      {
        title: "Rep",
        name: "user_name"
      },
      {
        title: "Date",
        name: "date"
      },
      {
        title: "Hospital",
        name: "hospital_name"
      },
      {
        title: "Type",
        name: "hospital_type"
      },
      {
        title: "Doctor",
        name: "customer_name"
      },
      {
        title: "Specialty",
        name: "customer_specialty"
      },
      ...ProductWithLader,
      {
        title: "Comment",
        name: "comment",
        fallback: "--------"
      },
      {
        title: "Feedback",
        name: "feedback"
      },
      {
        title: "Address",
        name: "address"
      },
      {
        title: "Brick",
        name: "brick"
      },
      {
        title: "Area",
        name: "area"
      }
    ]
  }),
  computed: {
    reports() {
      return this.$store.getters.allRepHospitalReports;
    },
    fetched() {
      return this.$store.getters.isHospitalReportsFetched;
    },
    activeCycle() {
      return this.$store.getters.activeCycle;
    }
  },
  methods: {
    onUpdate(resolve) {
      this.$store.commit("setRepHospitalsReports", []);
      resolve.then(data => this.$store.commit("setRepHospitalsReports", data));
    },
    onReset() {
      let reset = () => {
        return new Promise((resolve, reject) => {
          resolve(this.$store.getters.allHospitalReports);
        });
      };
      this.$store.commit("setRepHospitalsReports", []);
      reset().then(data => this.$store.commit("setRepHospitalsReports", data));
    },
    refreshLists() {
      this.$store.dispatch("getAllHospitalReports", true).then(() => {
        this.onReset();
      });
    },
    onSelectCycle() {
      this.$store.dispatch("getAllHospitalReports", {
        cycle: this.activeCycle
      });
    },
    onResetCycle() {
      this.$store.commit("resetActiveCycle");
      this.$store.dispatch("getAllHospitalReports", {
        cycle: this.activeCycle
      });
    }
  }
};
</script>

<style></style>
