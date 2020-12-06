<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-book-open"></i></span>
      <span class="font-weight-bold">View All Assigned Coach Reports</span>
    </p>
    <div class="row mx-auto pb-5 px-2">
      <!-- filter section -->
      <div class="col-lg-3">
        <data-filter
          :data="$store.getters.allCoachReports"
          :onUpdate="updateReportsView"
          :onReset="resetReportsView"
          :keys="{ rep: 'rep_id', date: 'date' }"
        ></data-filter>
        <div class="p-2 border rounded">
          <router-link
            to="/reports/view/pm"
            class="btn btn-block btn-primary btn-sm"
          >
            <span><i class="fa fa-book-open"></i></span>
            <span>View PM reports</span>
          </router-link>
          <router-link to="/reports" class="btn btn-block btn-dark btn-sm">
            <span><i class="fa fa-chevron-circle-left"></i></span>
            <span>back</span>
          </router-link>
        </div>
      </div>
      <!-- table section -->
      <div class="col-lg-9 shadow pb-5">
        <div class="my-2 p-2">
          <router-link to="/reports/add/coach" class="btn btn-sm btn-primary">
            <span class="fa fa-plus-circle"></span>
            <span>create</span>
          </router-link>
          <button
            class="btn btn-sm btn-success"
            :disabled="!selected.length"
            @click="submit"
          >
            <span>Submit</span>
            <span
              class="mx-1 bg-light text-success px-1 rounded-circle"
              v-if="selected.length"
              >{{ selected.length }}</span
            >
          </button>
          <button
            class="btn btn-sm btn-secondary"
            :disabled="!selected.length"
            @click="reject"
          >
            <span>Reject</span>
            <span
              class="mx-1 bg-light text-dark px-1 rounded-circle"
              v-if="selected.length"
              >{{ selected.length }}</span
            >
          </button>
        </div>

        <div class="" v-if="reports.length" id="coach-reports-tbl">
          <table-component
            :heads="heads"
            :data="reports"
            headClass="bg-success text-light"
            orderBy="Specialty|Address"
            :unselectable="true"
          >
            <template v-slot:head:before>
              <th><input type="checkbox" @click="selectAll" /></th>
              <th>Actions</th>
              <th>Submitted</th>
            </template>
            <template v-slot:body:before="{ item }">
              <td>
                <input
                  type="checkbox"
                  :disabled="item.coach_submit === 1"
                  @click="selectReport(item.id)"
                  :data-index="item.id"
                />
              </td>
              <td>
                <router-link
                  :to="`/reports/add/coach-report/${item.id}`"
                  class="badge badge-primary custom-btn"
                >
                  <span><i class="fa fa-check"></i></span>
                  <span v-if="item.coach_submit === 0">Finish</span>
                  <span v-else>View</span>
                </router-link>
              </td>
              <td>
                <span v-if="item.coach_submit === 1"
                  ><i class="fa fa-check text-success"></i
                ></span>
                <span v-else><i class="fa fa-times text-danger"></i></span>
              </td>
            </template>
          </table-component>
        </div>
        <div v-else-if="fetched">
          <p class="text-center">No data to show</p>
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
import TableComponent from "../../../components/TableComponent";
import { httpCall } from "../../../helpers/http-service";
import { sortBy } from "../../../helpers/helpers";
import DataFilter from "../../components/DataFilter";
export default {
  created() {
    this.$store.dispatch("getAllCoachReports");
  },
  components: {
    TableComponent,
    DataFilter
  },
  computed: {
    reports() {
      return this.$store.getters.repCoachReports;
    },
    fetched() {
      return this.$store.getters.isCoachReportsFetched;
    },

  },
  data: () => ({
    heads: [
      {
        title: "Date",
        name: "date"
      },
      {
        title: "Rep",
        name: "rep",
        style: "font-weight-bold"
      },
      {
        title: "Customer",
        name: "customer_name",
        style: "font-weight-bold"
      },
      {
        title: "Specialty",
        name: "customer_specialty"
      },
      {
        title: "Parameters",
        name: "customer_params",
        style: "font-weight-bold"
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
    ],
    selected: [],
  }),
  methods: {
    /**
     * select all reports that
     * isn't submitted
     *
     */
    selectAll() {
      let checked = event.target.checked;
      let inputs = document.querySelectorAll(
        '#coach-reports-tbl input[type="checkbox"]'
      );
      inputs.forEach(input => {
        if (checked) {
          if (!input.disabled) {
            input.checked = true;
            if (
              input.dataset.index &&
              !this.selected.includes(input.dataset.index)
            ) {
              this.selected.push(input.dataset.index);
            }
          }
        } else {
          input.checked = false;
          this.selected = [];
        }
      });
    },
    /**
     * select single report
     *
     * @param {int} id
     */
    selectReport(id) {
      let checked = event.target.checked;
      if (checked && !this.selected.includes(id)) {
        let report = this.reports.filter(report => report.id === id);
        if(report.coach_submit === 1) {
          return;
        }
        this.selected.push(id);
      } else if (!checked && this.selected.includes(id)) {
        let index = this.selected.indexOf(id);
        this.selected.splice(index, 1);
      }
    },
    submit() {
      httpCall
        .post("dm/v1/reports/coach/submit", {
          ids: JSON.stringify(this.selected),
          state: "approved"
        })
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("getAllCoachReports", true);
            this.uncheckAll();
          });
        });
    },
    reject() {
      httpCall
        .post("dm/v1/reports/coach/submit", {
          ids: JSON.stringify(this.selected),
          state: "rejected"
        })
        .then(({ data }) => {
          this.handleResponse(data, data => {
            this.$store.dispatch("getAllCoachReports", true);
            this.uncheckAll();
          });
        });
    },
    uncheckAll() {
      let inputs = document.querySelectorAll(
        '#coach-reports-tbl input[type="checkbox"]'
      );
      inputs.forEach(input => (input.checked = false));
    },
    updateReportsView(res){
      this.$store.commit('setCoachReports',[]);
      res.then(data => {
        this.$store.commit('setCoachReports', data);
      })
    },
    resetReportsView() {
      this.$store.commit('resetCoachReports');
    }
  }
};
</script>

<style></style>
