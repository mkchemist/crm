<template>
  <div>
    <div class="px-0 border">
      <p class="alert alert-info mb-0 text-center p-1">
        <span>Today Plan</span>
      </p>
      <div class="row mx-auto align-items-center justify-content-around my-1">
        <button class="btn btn-sm col-auto">
          <span><i class="fa fa-chevron-circle-left text-success"></i></span>
        </button>
        <input type="date" class="form-control form-control-sm col" :value="today">
        <button class="btn  btn-sm col-auto">
          <span><i class="fa fa-chevron-circle-right text-success"></i></span>
        </button>
      </div>
      <hr class="my-1">
      <div>
        <div v-if="plannedCustomers.length">
          <ul class="nav">
            <li class="nav-item col-12 border-bottom clearfix" v-for="customer in plannedCustomers" :key="customer.id">
              <span class="text-muted small">{{ customer.customer.name }}</span>
              <button class="btn float-right btn-sm">
                <span><i class="fa fa-hands-helping text-success"></i></span>
              </button>
            </li>
          </ul>
        </div>
        <div v-else-if="isLoading" style="height:150px" class="d-flex align-items-center justify-content-center flex-column">
          <vue-loaders name="ball-scale" scale="1" color="grey"></vue-loaders>
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
    isFetched : false
  }),
  computed: {
    today() {
      return new Date().format('YYYY-MM-DD')
    },
    plannedCustomers() {
      let all = this.allPlans;
      let dayPlans = [];
      all.forEach((day) => {
        if(day.start === this.today) {
          dayPlans.push(day);
        }
      })
      if(all.length) {
        this.isFetched = true;
      }
      return dayPlans;
    },
    allPlans() {
      let am = this.$store.getters.amPlans;
      let pm = this.$store.getters.plans;
      let all = [...am, ...pm];
      return all;
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
