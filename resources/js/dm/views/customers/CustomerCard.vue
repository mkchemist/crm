<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-user-md"></i></span>
        <span class="font-weight-bold"
          >View customer {{ customer ? customer.name : null }}</span
        >
      </p>
      <div class="p-2">
        <div class="p-2">
          <button class="btn btn-sm btn-dark" @click="$router.back()">
            <span><i class="fa fa-chevron-circle-left"></i></span>
            <span>Back</span>
          </button>
        </div>
        <!-- customer info. -->
        <div class="border p-2 rounded">
          <p class="lead text-muted">Customer Info.</p>
          <div class="row mx-auto" v-if="customer">
            <div class="col-lg">
              <p class="mb-0 small">
                Title :
                <span class="font-weight-bold text-primary">{{
                  customer.title
                }}</span>
              </p>
              <p class="mb-0 small">
                Name :
                <span class="font-weight-bold text-primary">{{
                  customer.name
                }}</span>
              </p>
              <p class="mb-0 small">
                Specialty :
                <span class="font-weight-bold text-primary">{{
                  customer.specialty
                }}</span>
              </p>
              <p class="mb-0 small">
                Workplace :
                <span class="font-weight-bold text-primary">{{
                  customer.workplace
                }}</span>
              </p>
              <p class="mb-0 small">
                Parameter :
                <span class="font-weight-bold text-primary">{{
                  customer.parameter
                }}</span>
              </p>
              <p class="mb-0 small">
                Frequency :
                <span class="font-weight-bold text-primary">{{
                  customer.current_freq
                }}</span>
              </p>
            </div>
            <div class="col-lg">
              <p class="mb-0 small">
                Address :
                <span class="font-weight-bold text-primary">{{
                  customer.address
                }}</span>
              </p>
              <p class="mb-0 small">
                Brick :
                <span class="font-weight-bold text-primary">{{
                  customer.brick
                }}</span>
              </p>
              <p class="mb-0 small">
                Area :
                <span class="font-weight-bold text-primary">{{
                  customer.area
                }}</span>
              </p>
              <p class="mb-0 small">
                No. of Planned visits :
                <span class="font-weight-bold text-primary">{{
                  customer.plans
                }}</span>
              </p>
              <p class="mb-0 small">
                No. of acutal visits :
                <span class="font-weight-bold text-primary">{{
                  customer.reports
                }}</span>
              </p>
            </div>
          </div>
          <div v-else>
            <loader-component></loader-component>
          </div>
        </div>
        <!-- customer planned visits -->
        <div class="px-0 border my-2">
          <p class="alert alert-success">
            <span><i class="fa fa-calendar-alt"></i></span>
            <span class="font-weight-bold">Planned visits</span>
          </p>
          <div class="p-2" v-if="plans.length">
            <table class="table table-sm small table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>State</th>
                  <th>Dual</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="plan in plans" :key="plan.id">
                  <td>{{ plan.plan_date }}</td>
                  <td>
                    {{ plan.submitted === 1 ? "Submitted" : "Requested" }}
                  </td>
                  <td>{{ plan.dual_with ? plan.dual_with : "-----" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="text-center p-2" v-else>
            <p class="lead text-muted">No planned visits</p>
          </div>
        </div>
        <!-- end of customer planned visits -->
        <!-- Customer Report -->
        <div class="px-0 shadow my-2">
          <p class="alert alert-success">
            <span><i class="fa fa-hands-helping"></i></span>
            <span class="font-weight-bold">Reports</span>
          </p>
          <div class="p-2">
            <table
              v-if="reports.length"
              class="table table-sm small table-responsive"
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Products</th>
                  <th>Comment</th>
                  <th>Coach</th>
                  <th>General Feedback</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in reports" :key="report.id">
                  <td>{{ report.visit_date }}</td>
                  <td>
                    <ul
                      v-for="(product, i) in report.products"
                      :key="i"
                      class="nav"
                    >
                      <li
                        class="nav-item col-12"
                        v-for="(val, key) in product"
                        :key="key"
                      >
                        {{ key }} :
                        <span class="font-weight-bold text-primary">{{
                          val
                        }}</span>
                      </li>
                    </ul>
                  </td>
                  <td>{{ report.comment ? report.comment : 'No comment' }}</td>
                  <td>{{ report.dual_with ? report.coach.name : 'Single' }}</td>
                  <td>{{ report.general_feedback ? report.general_feedback : 'No feedback' }}</td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              <p class="text-muted lead text-center">No visits</p>
            </div>
          </div>
        </div>
        <!-- end of customer report -->
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from "../../../helpers/http-service";
export default {
  created() {
    this.getCustomer();
  },
  methods: {
    getCustomer() {
      let id = this.$route.params.id;
      httpCall.get(`dm/v1/customers/${id}`).then(({ data }) => {
        this.customer = data.data.customer;
        this.plans = data.data.plans;
        data.data.reports.map(report => {
          report.products = JSON.parse(report.products);
        });
        this.reports = data.data.reports;
      });
    }
  },
  data: () => ({
    customer: null,
    plans: [],
    reports: []
  })
};
</script>

<style></style>
