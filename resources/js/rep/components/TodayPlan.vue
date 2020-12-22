<template>
  <div>
    <div class="px-0 border">
      <p class="alert alert-info mb-0 text-center p-1">
        <span>Today Plan</span>
      </p>
      <div class="row mx-auto align-items-center justify-content-around my-1 p-2">
        <input type="date" class="form-control form-control-sm col" v-model="today">
      </div>
      <hr class="my-1">
      <div>
        <div v-if="plannedCustomers.length">
          <ul class="nav">
            <li class="nav-item col-12 border-bottom clearfix" v-for="(customer,i) in plannedCustomers" :key="customer.id+''+i">
              <span>
                <i v-if="!['AM','submitted AM'].includes(customer.class)" class="fa fa-user-md text-success"></i>
                <i v-else class="fa fa-hospital text-primary"></i>
              </span>
              <span class="text-muted small">{{ customer.title }}</span>
              <router-link :to="`/reports/add/pm/${customer.customer_id}`" v-if="!['AM','submitted AM'].includes(customer.class)" class="float-right">
                <span><i class="fa fa-hands-helping text-success"></i></span>
              </router-link>
              <router-link :to="`/reports/add/am/${customer.workplace_id}`" v-if="['AM','submitted AM'].includes(customer.class)" class="float-right">
                <span><i class="fa fa-hands-helping text-primary"></i></span>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-else-if="fetched" class="text-center p-3">
          <p class="text-muted small">No plans found</p>
          <router-link to="/planner" class="btn btn-sm btn-primary">
            <span><i class="fa fa-plus-circle"></i></span>
            <span>plan</span>
          </router-link>
        </div>
        <loader-component v-else></loader-component>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created(){
    this.$store.dispatch('getWorkplacePlanner')
    .then(() => {
      this.$store.dispatch('getPlanner');
    })
  },
  data: () => ({
    isLoading: false,
    isFetched : false,
    today: new Date().format('YYYY-MM-DD')
  }),
  computed: {
    plannedCustomers() {
      let all = this.$store.getters.allPlans;
      let dayPlans = [];
      dayPlans = all.filter(day => day.start === this.today);
      if(all.length) {
        this.isFetched = true;
      }
      return dayPlans;
    },
    fetched() {
      return this.$store.getters.isPlansFetched;
    },

  },
  methods: {
    loadPlans() {
      this.isLoading = true;
      this.$store.dispatch('getPlanner').then(() => {
        this.$store.dispatch('getWorkplacePlanner')
      }).finally(() => {
        this.isLoading = false;
      })
    }
  }
}
</script>

<style>

</style>
