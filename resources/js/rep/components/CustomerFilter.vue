<template>
  <div class="shadow custom-modal-window">
    <p class="alert alert-info">
      <span><i class="fa fa-filter"></i></span>
      <span class="font-weight-bold">Filter Customers</span>
    </p>
    <div class="p-2">
      <div class="row mx-auto my-1">
        <div class="col-lg">
          <label for="" class="text-muted small">Brick</label>
          <select
            name="brick"
            id=""
            class="form-control form-control-sm"
            v-model="filter.brick"
          >
            <option value="">All</option>
            <option
              v-for="(item, index) in filterItems.brick"
              :key="`filter_birck_${index}`"
              :value="index"
            >
              {{ index }} ({{ item.length }})
            </option>
          </select>
        </div>
        <div class="col-lg">
          <label for="" class="text-muted small">Specialty</label>
          <select
            name="specialty"
            id=""
            class="form-control form-control-sm"
            v-model="filter.specialty"
          >
            <option value="">All</option>
            <option
              v-for="(item, index) in filterItems.specialty"
              :key="`filter_specialty_${index}`"
              :value="index"
            >
              {{ index }} ({{ item.length }})
            </option>
          </select>
        </div>
      </div>

      <div class="row mx-auto my-1">
        <div class="col-lg">
          <label for="" class="text-muted small">Parameter</label>
          <select
            name="parameter"
            id=""
            class="form-control form-control-sm"
            v-model="filter.param"
          >
            <option value="">All</option>
            <option
              v-for="(item, index) in filterItems.parameter"
              :key="`filter_param_${index}`"
              :value="index"
            >
              {{ index }} ({{ item.length }})
            </option>
          </select>
        </div>
        <div class="col-lg">
          <label for="" class="text-muted small">Frequency</label>
          <select
            name="freq"
            id=""
            class="form-control form-control-sm"
            v-model="filter.freq"
          >
            <option value="">All</option>
            <option
              v-for="(item, index) in filterItems.current_freq"
              :key="`filter_freq_${index}`"
              :value="index"
            >
              {{ index }} ({{ item.length }})
            </option>
          </select>
        </div>
      </div>

      <div class="row mx-auto my-1">
        <div class="col-lg-6">
          <label for="" class="text-muted small">Number of plans</label>
          <select
            name="plans"
            id=""
            class="form-control form-control-sm"
            v-model="filter.plan"
          >
            <option value="">All</option>
            <option
              v-for="(item, index) in filterItems.plans"
              :key="`filter_plan_${index}`"
              :value="index"
            >
              {{ index }} ({{ item.length }})
            </option>
          </select>
        </div>
        <div class="col-lg-6">
          <label for="" class="text-muted small">Number of Reports</label>
          <select
            name="reports"
            id=""
            class="form-control form-control-sm"
            v-model="filter.report"
          >
            <option value="">All</option>
            <option
              v-for="(item, index) in filterItems.reports"
              :key="`filter_report_${index}`"
              :value="index"
            >
              {{ index }} ({{ item.length }})
            </option>
          </select>
        </div>
      </div>

      <hr />
      <div class="form-group text-right">
        <button class="btn btn-dark btn-sm" @click="closeModal" type="button">
          <span><i class="fa fa-times"></i></span>
          <span>close</span>
        </button>
        <button class="btn btn-sm btn-secondary" type="button" @click="onReset">
          <span><i class="fa fa-redo"></i></span>
          <span>reset</span>
        </button>
        <button
          class="btn btn-sm btn-primary"
          type="button"
          @click="filterCustomers"
        >
          <span><i class="fa fa-check-circle"></i></span>
          <span>ok</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { filterData } from "../../helpers/helpers";
export default {
  props: ["data", "onClose", "onFilter", "onReset"],
  computed: {
    customers() {
      return this.data;
    },
    filterItems() {
      return this.getFilterItems(this.data);
    }
  },
  data: () => ({
    filter: {
      brick: "",
      specialty: "",
      freq: "",
      param: "",
      plan: "",
      report: ""
    },
    mustReset: false
  }),
  methods: {
    filterCustomers() {
      let res = this.customers;
      let { brick, specialty, freq, param, plan, report } = this.filter;
      if (brick !== "") {
        res = res.filter(c => c.brick === brick);
      }
      if (specialty !== "") {
        res = res.filter(c => c.specialty === specialty);
      }
      if (param !== "") {
        res = res.filter(c => c.parameter === param);
      }
      if (freq !== "") {
        res = res.filter(c => c.current_freq === parseInt(freq));
      }
      if (plan !== "") {
        console.log(plan)
        res = res.filter(c => c.plans === parseInt(plan));
      }
      if (report !== "") {
        res = res.filter(c => c.reports === parseInt(report));
      }
      this.onFilter(res);
    },
    getFilterItems(data) {
      let res = {};
      res = filterData(data, [
        "brick",
        "current_freq",
        "specialty",
        "plans",
        "parameter",
        "reports"
      ]);
      return res;
    },
    closeModal() {
      this.onClose();
    }
  }
};
</script>

<style></style>
