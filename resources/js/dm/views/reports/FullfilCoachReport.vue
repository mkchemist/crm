<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-plus-circle"></i></span>
      <span class="font-weight-bold"
        >Finish Coach report
        <span class="font-italic">{{
          visit ? visit.customer_name : ""
        }}</span></span
      >
    </p>
    <div class="p-2">
      <div class="p-2 text-right">
        <button @click="$router.back()" class="btn btn-sm btn-dark">
          <span class="fa fa-chevron-circle-left"></span>
          <span>back</span>
        </button>
        <button class="btn btn-sm btn-success" @click="saveCoachReport">
          <span><i class="fa fa-save"></i></span>
          <span>save</span>
        </button>
      </div>
      <!-- Customer Info -->
      <div class="border p-2">
        <p class="font-weight-bold text-primary mb-0">Customer Info.</p>
        <hr />
        <div class="p-2 row mx-auto" v-if="visit">
          <div class="col-lg small">
            <p class="mb-0">
              Customer :
              <span class="text-primary">{{ visit.customer_name }}</span>
            </p>
            <p class="mb-0">
              Specialty :
              <span class="text-primary">{{ visit.customer_specialty }}</span>
            </p>
            <p class="mb-0">
              Specialty :
              <span class="text-primary">{{ visit.customer_params }}</span>
            </p>
          </div>
          <div class="col-lg small">
            <p class="mb-0">
              Date : <span class="text-primary">{{ visit.date }}</span>
            </p>
            <p class="mb-0">
              Rep : <span class="text-primary">{{ visit.rep }}</span>
            </p>
            <p class="mb-0">
              Address : <span class="text-primary">{{ visit.address }}</span>
            </p>
            <p class="mb-0">
              Brick : <span class="text-primary">{{ visit.brick }}</span>
            </p>
            <p class="mb-0">
              Area : <span class="text-primary">{{ visit.area }}</span>
            </p>
          </div>
        </div>
        <div v-else-if="isFetched">
          <p class="text-center text-danger font-weight-bold">{{ error }}</p>
        </div>
        <loader-component v-else></loader-component>
      </div>
      <!-- coach report -->
      <div class="my-2">
        <table class="table table-sm small table-bordered">
          <thead>
            <tr class="bg-success text-light">
              <th>Item</th>
              <th>Mark</th>
            </tr>
          </thead>
          <tbody v-for="(row, key) in coach_report" :key="`main_${key}`">
            <tr>
              <td colspan="2" class="font-weight-bold bg-secondary text-light">{{ key }}</td>
            </tr>
            <tr
              v-for="(r, i) in row"
              :key="`main_${key}_${i}`"
              class="text-muted"
            >
              <td>{{ i }}</td>
              <td>
                <select
                  name=""
                  id=""
                  v-model="coach_report[key][i]"
                  class="coach-select"
                >
                  <option value="">N</option>
                  <option value="S">S</option>
                  <option value="U">U</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { COACH_REPORT } from "../../../helpers/constants";
import { Api, httpCall, Token } from "../../../helpers/http-service";

export default {
  data: () => ({
    visit: null,
    isFetched: false,
    error: null,
    coach_report: COACH_REPORT
  }),
  created() {
    this.getReport();
  },
  methods: {
    getReport() {
      this.isFetched = false;
      let id = this.$route.params.id;
      httpCall.get("dm/v1/reports/coach/" + id).then(({ data }) => {
        this.isFetched = true;
        if(data.data.report) {
          this.coach_report = JSON.parse(data.data.report)
        }
        this.handleResponse(
          data,
          data => {
            this.visit = data.data;
          },
          data => {
            this.error = data.data;
          }
        );
      });
    },
    saveCoachReport() {
      let id = this.$route.params.id;
      let data = {
        report: JSON.stringify(this.coach_report),
        _method: "PUT"
      };
      httpCall.post(`dm/v1/reports/coach/${id}`, data).then(({ data }) => {
        data.message = data.data;
        this.handleResponse(data, data => {
          this.$router.back();
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
tr,
td,
th {
  white-space: pre-wrap;
}
.coach-select {
  border: 1px solid #1113;
  background-color: initial;
  width: 100%;
  &:focus {
    outline-color: #38c172;
  }
}
</style>
