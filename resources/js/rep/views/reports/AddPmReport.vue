<template>
  <div>
    <div class="px-0 shadow">
      <p class="alert alert-success">
        <span><i class="fa fa-plus-circle"></i></span>
        <span class="font-weight-bold">new PM report</span>
      </p>
      <div class="p-2">
        <ValidationObserver v-slot="{handleSubmit}">
          <form @submit.prevent="handleSubmit(saveReport)">
            <!-- visit customer and date -->
            <div class="row mx-auto my-2 border rounded p-2">
              <div class="col-lg">
                <label for="customer" class="text-muted">Customer</label>
                <ValidationProvider name="customer" rules="required" v-slot="{ errors }" v-if="customers.length">
                  <span class="text-danger small">{{ errors[0] }}</span>
                  <div v-if="is_single_customer">
                    <input type="text" readonly disabled class="form-control form-control-sm" :value="customer.name">
                    <input type="hidden" readonly disabled class="form-control form-control-sm" name="customer" id="customer"  v-model="visit.customer">
                  </div>
                  <select name="customer" id="customer" v-model="visit.customer" class="form-control form-control-sm" v-else>
                    <option value="">Select customer</option>
                    <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.name }}</option>
                  </select>

                </ValidationProvider>
                <div class="text-center" v-else>
                  <div class="spinner-border text-success"></div>
                </div>
              </div>
              <div class="col-lg">
                <label for="date" class="text-muted">Date:</label>
                <ValidationProvider name="date" rules="required" v-slot="{errors}">
                  <span class="text-danger">{{ errors[0] }}</span>
                  <input type="date" name="date" id="date" class="form-control form-control-sm" v-model="visit.date">
                </ValidationProvider>
              </div>
            </div>
            <!-- end of customer and date -->
            <!-- visit coach -->
            <div class="row mx-auto my-2 border rounded p-2">
              <div class="col-lg">
                <input type="checkbox" v-model="visit.dual">
                <span class="small">Dual visit with</span>
              </div>
              <div class="col-lg" v-if="visit.dual">
                <ValidationProvider name="dual_with" rules="required" v-slot="{errors}">
                  <span class="text-danger small" v-if="errors[0]">you must select a coach</span>
                  <select name="dual_with" id="dual_with" class="form-control form-control-sm" v-model="visit.dual_with">
                    <option value="">Select coach</option>
                    <option :value="coach.id" v-for="coach in coaches" :key="coach.id">{{ coach.name }}</option>
                  </select>
                </ValidationProvider>
              </div>
            </div>
            <!-- end visit coach -->
            <!-- visit products -->
            <div class="form-group border rounded p-2">
              <visit-products
                :data="visit.products"
              />
            </div>
            <!-- end visit products -->
            <!-- visit comment and general feedback-->
            <div class="row mx-auto my-2 border rounded p-2">
              <div class="col-lg">
                <label for="comment" class="text-muted">Comment</label>
                <textarea name="comment" id="comment" rows="5" class="form-control form-control-sm" v-model="visit.comment" placeholder="write visit comment"></textarea>
              </div>
              <div class="col-lg">
                <label for="general_feedback" class="text-muted">General Feedback</label>
                <textarea name="general_feedback" id="general_feedback" rows="5" class="form-control form-control-sm" v-model="visit.general_feedback" placeholder="write visit general feedback"></textarea>
              </div>
            </div>
            <!-- end visit comment and feedback -->
            <hr>
            <!-- form control -->
            <div class="form-group text-right">
              <router-link to="/reports" class="btn btn-sm btn-dark">
                <span><i class="fa fa-chevron-circle-left"></i></span>
                <span class="font-weight-bold">back</span>
              </router-link>
              <button class="btn btn-sm btn-success">
                <span><i class="fa fa-save"></i></span>
                <span class="font-weight-bold">save</span>
              </button>
            </div>
            <!-- end of form control -->
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * //TODO add coach field
 *
 */
import { httpCall } from '../../../helpers/http-service';
import VisitProducts from "../../components/VisitProducts";
export default {
  created() {
    this.$store.dispatch('customerGetAll');
    this.$store.dispatch('getCoaches')
    if(this.$route.params.id) {
      this.is_single_customer = true;
    }
  },
  components: {
    VisitProducts
  },
  data: () =>({
    visit: {
      customer: '',
      date: new Date().format("YYYY-MM-DD"),
      dual:false,
      dual_with: '',
      comment: '',
      products: [],
      general_feedback: ''
    },
    is_single_customer: false
  }),
  methods: {
    /**
     * save report
     */
    saveReport(){
      let data = {};
      Object.assign(data, this.visit);
      data.products = JSON.stringify(data.products);
      httpCall.post('rep/v1/reports/pm', data)
      .then(({data}) => {
        data.message = 'visit added successfully';
        this.handleResponse(data,data => {
          this.$store.dispatch('customerGetAll', true);
          this.$store.dispatch('reportGetAll', true);
          if(this.is_single_customer) {
            this.$router.replace('/customers/view/'+this.$route.params.id);
          } else {

            this.$router.replace('/reports/view/pm')
          }
        });
      })
    }
  },
  computed: {
    customers() {
      return this.$store.getters.all;
    },
    customer() {
      let customers = this.customers;
      let id = parseInt(this.$route.params.id);
      this.visit.customer = id;
      return this.customers.filter(customer => customer.id === id)[0];
    },
    coaches() {
      return this.$store.getters.coaches;
    }
  }
}
</script>

<style>

</style>
