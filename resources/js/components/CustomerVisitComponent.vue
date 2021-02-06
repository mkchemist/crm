<template>
  <div class="px-0 shadow rounded pb-5">
    <p class="alert alert-success">
      <span class="fa fa-plus-circle"></span>
      <span class="font-weight-bold">Add Coach Report</span>
    </p>
    <div class="p-2">
      <div class="row mx-auto">
        <div class="col-lg-3">
          <user-filter-box
            :users="users"
            :data="[]"
            :onFilter="onFilterUsers"
            :onReset="onResetUsers"
            :singleUser="true"
          />
          <!-- brick select -->
          <div class="p-2 my-2 border rounded">

            <div class="form-group">
              <label for="">Brick</label>
              <select
                name=""
                id=""
                v-model="brick"
                :disabled="!bricks.length"
                class="form-control form-control-sm"
              >
                <option
                  v-for="(brick,id) in bricks"
                  :key="id"
                  :value="brick.brick"
                  >{{ brick.brick }}</option
                >
              </select>
            </div>

            <div class="form-group">
              <button class="btn btn-sm btn-block btn-primary" @click="fetchCustomers">
                <span class="fa fa-check-circle"></span>
                <span>select</span>
              </button>
            </div>
          </div>
          <!-- end of brick select -->
          <!-- customer select -->
          <div class="p-2 my-2 border rounded">

            <div class="form-group">
              <label for="">Customer</label>
              <select
                name=""
                id=""
                v-model="customer"
                :disabled="!customers.length"
                class="form-control form-control-sm"
              >
                <option
                  v-for="customer in customers"
                  :key="customer.id"
                  :value="customer"
                  >{{ customer.name }} ({{ customer.specialty }})</option
                >
              </select>
            </div>

            <div class="form-group">
              <button class="btn btn-sm btn-block btn-primary" @click="viewReport">
                <span class="fa fa-check-circle"></span>
                <span>select</span>
              </button>
            </div>
          </div>
          <!-- end of customer select -->
          <div class="my-2 border rounded">
            <router-link :to="backUrl" class="btn btn-sm btn-block btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
          </div>
        </div>
        <div class="col-lg-9">
          <div v-if="showReport">
            <visit-component :customer="customer" :user="user" :rep="rep" :type="visitType" :backUrl="backUrl" :onSave="saveReport" />
          </div>
          <div v-else class="py-5 text-center shadow rounded">
            <div>
              <span class="fa fa-check-circle text-primary fa-4x"></span>
            </div>
            <div>
              <p class="lead text-muted pt-2" v-if="!rep">Select Rep</p>
              <p class="lead text-muted pt-2" v-else-if="!brick">Select Brick</p>
              <p class="lead text-muted pt-2" v-else-if="!customer">Select Customer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../helpers/http-service';
import VisitComponent from './VisitComponent.vue';
import UserFilterBox from './UserFilterBox.vue';

export default {
  props: {
    users: {
      type: Array,
      required: true
    },
    visitType: {
      type: String,
      default: () => 'single'
    },
    user: {
      type: Object,
      required: true
    },
    backUrl: {
      type: String,
      default: () => '/reports'
    },
    onSave: {
      type:Function
    }
  },
  components: {
    VisitComponent,
    UserFilterBox,
  },
  data: () => ({
    rep: null,
    brick: null,
    bricks: [],
    customers: [],
    customer: null,
    showReport: false
  }),
  methods: {
    fetchCustomers() {
      return httpCall.get('v1/user-customers/customers/'+this.brick)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.customers = data.data;
        })
      }).catch(err => console.log(err));
    },
    fetchLocations() {
      let id = this.rep.id;
      return httpCall
        .get("v1/user-customers/bricks/" + id)
        .then(({ data }) => {
          this.handleResponse(data ,data => {
            this.bricks = data.data;
          });
        })
        .catch(err => console.log(err));
    },
    viewReport(){
      this.showReport = true;
    },
    onFilterUsers(d, q, u) {
      this.rep = u;
      this.fetchLocations();
    },
    onResetUsers() {
      this.rep = null;
    },
    saveReport(data) {
      if(this.visitType === 'coaching') {
        this.saveCoachingVisit({
          coach: JSON.stringify(data.coach),
          rep_id: this.rep.id,
          coach_id: this.user.id,
          visit_date: data.date,
          customer_id: this.customer.id
        });
      }
      if(this.visitType === "single") {
        this.saveSingleVisit({
          customer_id: this.customer.id,
          products: JSON.stringify(data.products),
          date: data.date
        });
      }
    },
    saveCoachingVisit(data){
      return httpCall.post('v1/coach-reports',data)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.onSave()
        })
      }).catch(err => console.log(err))
    },
    saveSingleVisit(data) {
      return httpCall.post('v1/single-visit/customer', data)
      .then(({data}) => {
        this.handleResponse(data, data => {
          this.onSave();
        });
      })
    }
  }
};
</script>

<style></style>
