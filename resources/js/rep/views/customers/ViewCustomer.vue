<template>
  <div>
    <div class="px-0 shadow pb-3 rounded">
      <p class="alert alert-success">
        <span class="font-weight-bold">
          View Customer {{ customer ?customer.name : null }} card
        </span>
      </p>
      <div class="p-2">
        <!-- ctrl buttons section  -->
        <div v-if="customer">
          <div class="text-right p-2 m-1">
            <span class="lead">Go to :</span>
            <select v-if="customers.length" class="mr-3" @change="navigateToCustomer" v-model="$route.params.id">
              <option v-for="item in customers" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
            <span v-else class="mr-3">
              <i class="fa fa-circle-notch fa-spin text-muted"></i>
            </span>
            <router-link to="/customers" class="btn btn-sm btn-dark">
              <span><i class="fa fa-chevron-circle-left"></i></span>
              <span>back</span>
            </router-link>
            <router-link :to="`/customers/edit/${customer.id}`" class="btn btn-sm btn-warning">
              <span><i class="fa fa-edit"></i></span>
              <span>edit</span>
            </router-link>
          </div>
          <!--  Customer info section --->
          <div class="border m-1 p-2 rounded">
            <p class="lead">Customer info.</p>
            <hr>
            <div class="row mx-auto">
              <div class="col-lg">
                <p class="mb-0 small">Name: <b class="text-primary">{{ customer.name }}</b></p>
                <p class="mb-0 small">Specialty: <b class="text-primary">{{ customer.specialty }}</b></p>
                <p class="mb-0 small">Title: <b class="text-primary">{{ customer.title }}</b></p>
                <p class="mb-0 small">Parameter: <b class="text-primary">{{ customer.parameter}}</b></p>
                <p class="mb-0 small">Frequency: <b class="text-primary">{{ customer.current_freq}}</b></p>
                <p class="mb-0 small">Plans: <b class="text-primary">{{ customer.plans}}</b></p>
              </div>
              <div class="col-lg">
                <p class="mb-0 small">Address: <b class="text-primary">{{ customer.address ? customer.address : "Null" }}</b></p>
                <p class="mb-0 small">Brick: <b class="text-primary">{{ customer.brick}}</b></p>
                <p class="mb-0 small">Area: <b class="text-primary">{{ customer.area}}</b></p>
                <p class="mb-0 small">Phone: <b class="text-primary">{{ customer.phone ? customer.phone :"Null"}}</b></p>
              </div>
            </div>
          </div>

          <!-- customer planned visits -->
          <div class="px-0 border my-2">
            <p class="alert alert-success">
              <span><i class="fa fa-calendar-alt"></i></span>
              <span class="font-weight-bold">Planned visits</span>
            </p>
            <div class="p-2" v-if="plans.length > 0">
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
                    <td>{{ plan.state }}</td>
                    <td>{{ plan.dual_with }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="text-center p-2" v-else>
              <p class="lead text-muted">No planned visits</p>
              <router-link to="/planner/add-pm" class="btn btn-sm btn-primary">
                <span><i class="fa fa-plus-circle"></i></span>
                <span>Add new plan</span>
              </router-link>
            </div>
          </div>
          <!-- end of customer planned visits -->
        </div>

        <LoaderComponent v-else />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * //TODO add customer reports module
 * //TODO add other reps plans for the customer
 * //TODO add other reps reports for the customer
 * //TODO add report button
 */
import { httpCall } from '../../../helpers/http-service';
export default {
  created() {
    this.getCustomer();
  },
  methods: {
    /**
     * get customer data from api
     */
    getCustomer() {
      let id = this.$route.params.id;
      httpCall.get('rep/v1/customers/'+id)
      .then(({data}) => {
        console.log(data)
        this.handleResponse(data, (data) => {
          this.customer = data.data.customers;
          this.plans = data.data.plans;
          this.reports = data.data.reports;
        })
      });
    },
    navigateToCustomer() {
      let id = event.target.value;
      if(id === this.$route.params.id) {
        return ;
      }
      this.$router.replace(`/customers/view/${id}`);
      this.getCustomer();
    }
  },
  data: () => ({
    customer: null,
    plans: [],
  }),
  computed: {
    customers() {
      return this.$store.getters.all;
    }
  }
}
</script>

<style>

</style>
