<template>
  <div>
    <div class="px-0">
      <p class="alert alert-info">
        <span><i class="fa fa-filter"></i></span>
        <span>Filters</span>
      </p>
      <div class="p-2">
        <div v-if="allCustomers.length">
          <div class="border rounded p-2" style="max-height:100px;overflow:auto">
            <p class="text-muted">Bricks</p>
            <div class="form-group my-0 border-bottom" v-for="(item, i) in bricks" :key="i">
              <input type="checkbox" :name="item" :id="`item-${item}`" :value="item" checked @click="updateBricks">
              <label :for="`item-${item}`" class="text-muted small">{{ item }}</label>
            </div>
          </div>
          <div class="border rounded p-2" style="max-height:100px;overflow:auto">
            <p class="text-muted">Parameters</p>
            <div class="form-group my-0 border-bottom" v-for="(item, i) in params" :key="i">
              <input type="checkbox" :name="item" :id="`item-${item}`" :value="item" checked @click="updateParameter">
              <label :for="`item-${item}`" class="text-muted small">{{ item }}</label>
            </div>
          </div>
          <div class="border rounded p-2" style="max-height:100px;overflow:auto">
            <p class="text-muted">Specialties</p>
            <div class="form-group my-0 border-bottom" v-for="(item, i) in specialties" :key="i">
              <input type="checkbox" :name="item" :id="`item-${item}`" :value="item" checked @click="updateSpecialty">
              <label :for="`item-${item}`" class="text-muted small">{{ item }}</label>
            </div>
          </div>
        </div>
        <div v-else class="text-center">
          <vue-loaders name="ball-scale" scale="2" color="grey"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () =>({
    filter: {}
  }),
  computed:{
    allCustomers() {
      return this.$store.getters.all;
    },
    bricks() {
      return this.getFilterItem('brick')
    },
    params(){
      return this.getFilterItem('parameter')
    },
    specialties() {
      return this.getFilterItem('specialty')
    }
  },
  methods: {
    getFilterItem(item) {
      let customers = this.$store.state.Customer.all;
      let data = [];
      this.filter[item] = [];
      customers.forEach((customer) => {
        if(!data.includes(customer[item])) {
          data.push(customer[item])
          this.filter[item].push(customer[item]);
        }
      });
      return data;
    },
    filterCustomers(e, item) {
      let filter = this.filter;
       if(e.target.checked) {
        if(!filter[item].includes(e.target.value)) {
          filter[item].push(e.target.value);
        }
      } else {
        let i = filter[item].indexOf(e.target.value);

        filter[item].splice(i,1);
      }
      this.filter =filter;
      this.$store.commit('filterCustomers', filter);
    },
    updateBricks(e) {
      this.filterCustomers(e, 'brick');
    },
    updateSpecialty(e) {
      this.filterCustomers(e, 'specialty');
    },
    updateParameter(e) {
      this.filterCustomers(e, 'parameter');
    }
  }
}
</script>

<style>

</style>
