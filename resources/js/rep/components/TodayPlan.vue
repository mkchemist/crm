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
            <li class="nav-item col-12 border-bottom clearfix" v-for="customer in plannedCustomers" :key="customer.id">
              <span>
                <i v-if="customer.class=== 'PM'" class="fa fa-user-md text-success"></i>
                <i v-else class="fa fa-hospital text-primary"></i>
              </span>
              <span class="text-muted small">{{ customer.name }}</span>
              <button class="btn float-right btn-sm">
                <span><i class="fa fa-hands-helping text-success"></i></span>
              </button>
            </li>
          </ul>
        </div>
        <div v-else-if="isLoading" style="height:150px" class="d-flex align-items-center justify-content-center flex-column">
          <loader-component></loader-component>
        </div>
        <div v-else-if="isFetched && plannedCustomers.length === 0" style="height:150px" class="d-flex align-items-center justify-content-center flex-column">
          <span class="text-muted small">No plans in {{ today }}</span>
        </div>
        <div v-else class="d-flex align-items-center justify-content-center flex-column" style="height:150px">
          <span class="small text-muted">It seem that plans is not loaded yet</span>
          <button class="btn btn-sm btn-primary" @click="loadPlans">
            <span><i class="fa fa-download"></i></span>
            <span>load</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
    }
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
