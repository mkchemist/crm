<template>
  <div>
    <p class="alert alert-success">
      <span><i class="fa fa-plus-circle"></i></span>
      <span class="font-weight-bold">Add new plan</span>
    </p>
    <div class="p-2">
      <div class="row mx-auto">
        <div class="col-lg border rounded px-0">
          <p class="alert alert-info">Customers</p>
          <div class="p-2">
            <p
              v-if="selected_customers.length"
              class="bg-dark small text-light p-2"
            >
              Selected : {{ selected_customers.length }}
            </p>
            <div style="height:200px;overflow:auto" class="border rounded">
              <nav class="nav p-2" v-if="customers.length" id="customers_container">
                <li
                  class="nav-item col-12 small"
                  v-for="customer in customers"
                  :key="customer.id"
                >
                  <input
                    type="checkbox"
                    @click="addToSelected(customer.id)"
                  /><span class="ml-1">{{ customer.name }}</span>
                </li>
              </nav>
              <div
                v-else
                class="text-center d-flex align-items-center justify-content-center h-100"
              >
                <vue-loaders name="ball-scale" scale="2" color="grey" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg px-0 border rounded">
          <p class="alert alert-info">Date {{ $attrs.date }} plans</p>
          <div class="p-2">
            <p v-if="datePlan.length" class="p-2 bg-dark text-light small">
              total planned : {{ datePlan.length }}
            </p>
            <ul class="nav p-2">
              <li
                class="nav-item col-12 small"
                v-for="customer in datePlan"
                :key="customer.id"
              >
                <span>{{ customer.name }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-12 my-2 text-right">
          <router-link to="/planner" class="btn btn-dark btn-sm">
            <span><i class="fa fa-chevron-circle-left"></i></span>
            <span>back</span>
          </router-link>
          <button class="btn btn-sm btn-success" @click="addPlan">
            <span><i class="fa fa-plus-circle"></i></span>
            <span>add</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../helpers/http-service';
export default {
  data: () => ({
    selected_customers: [],
  }),
  created() {},
  beforeMount() {
    this.$store.dispatch("customerGetAll").then(() => {
      this.$store.dispatch("getPlanner");
    });
  },
  computed: {
    /**
     * get current date plans
     */
    datePlan() {
      let plans = this.$store.getters.plans;
      let datePlans = [];
      plans.forEach(plan => {
        if (plan.start === this.$attrs.date) {
          datePlans.push(plan.customer);
        }
      });

      return datePlans;
    },
    /**
     * get customers
     */
    customers() {
      return this.$store.getters.all;
    }
  },
  methods: {
    /**
     * add selected customer to selected customer container
     *
     * @param {int} id
     */
    addToSelected(id) {
      let checked = event.target.checked;
      if (checked) {
        this.customers.forEach(customer => {
          if (customer.id === id) {
            if (!this.selected_customers.includes(customer)) {
              this.selected_customers.push(customer);
            }
          }
        });
      } else {
        this.selected_customers.forEach((customer, i) => {
          if (customer.id === id) {
            this.selected_customers.splice(i, 1);
          }
        });
      }
    },
    getSelectedCustomersId(){
      let ids = [];
      this.selected_customers.map(customer => ids.push(customer.id))
      return ids;
    },
    addPlan() {
      let customersId = this.getSelectedCustomersId();
      if(!customersId.length) {
        this.$toasted.show('you must pick customer|s first', {
          icon: 'redo',
          duration:5000
        });
        return;
      }
      httpCall.post('rep/v1/planner',{customers:JSON.stringify(customersId),date:this.$attrs.date})
      .then(({data}) => {
        if(data.rejected.length === data.accepted) {
          data.rejected.forEach((item) => {
            this.$toasted.show(`customer ${item} already planned in this day`, {
              icon: 'exclamation'
            });
          });
        } else {
          data.rejected.forEach((item) => {
            this.$toasted.show(`customer ${item} already planned in this day`, {
              icon: 'exclamation'
            });
          });
          data.accepted.forEach((item) => {
            this.$toasted.show(`customer ${item} added successfully`, {
              type: 'success',
              icon: 'check'
            });
          })
        }
        this.selected_customers = [];
      }).finally(() => {
        this.$store.dispatch('getPlanner', true);
        document.querySelectorAll('#customers_container input[type="checkbox"]')
        .forEach((input) => {
          input.checked = false
        })
      });
    }
  }
};
</script>

<style></style>
