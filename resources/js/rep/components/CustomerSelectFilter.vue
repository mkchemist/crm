<template>
  <div class="col-12">
    <div class="text-right">
      <button class="btn btn-sm btn-primary" @click="showFilter = true" type="button">
        <span><i class="fa fa-filter"></i></span>
        <span>filter</span>
      </button>
    </div>
    <modal-fade :show="showFilter" header-style="bg-success text-light" @onClose="closeFilterModal">
      <template v-slot:header>
        <span>Filter Customers</span>
      </template>
      <template v-slot:body>
        <div class="px-2 small text-muted">
          total customers : {{ customers.length }}
        </div>
        <hr class="mb-0">
        <div class="row mx-auto">
          <div class="form-group col">
            <label for="" class="small text-muted">Brick</label>
            <select name="" id="" class="form-control form-control-sm" v-model="filter.brick">
              <option value="">all</option>
              <option v-for="(item, i) in filterItems.bricks" :key="i" :value="i"
                >{{ i }}
                <span class="badge badge-primary"
                  >({{ item.length }})</span
                ></option
              >
            </select>
          </div>

          <div class="form-group col">
            <label for="" class="small text-muted">Specialty</label>
            <select name="" id="" class="form-control form-control-sm" v-model="filter.specialty">
              <option value="">all</option>
              <option v-for="(item, i) in filterItems.specialty" :key="i" :value="i"
                >{{ i }}
                <span class="badge badge-primary"
                  >({{ item.length }})</span
                ></option
              >
            </select>
          </div>
        </div>

        <div class="row mx-auto">

          <div class="form-group col">
            <label for="" class="small text-muted">Parameter</label>
            <select name="" id="" class="form-control form-control-sm" v-model="filter.param">
              <option value="">all</option>
              <option v-for="(item, i) in filterItems.param" :key="i" :value="i"
                >{{ i }}
                <span class="badge badge-primary"
                  >({{ item.length }})</span
                ></option
              >
            </select>
          </div>

          <div class="form-group col">
            <label for="" class="small text-muted">Frequency</label>
            <select name="" id="" class="form-control form-control-sm" v-model="filter.freq">
              <option value="">all</option>
              <option v-for="(item, i) in filterItems.freq" :key="i" :value="i"
                >{{ i }}
                <span class="badge badge-primary"
                  >({{ item.length }})</span
                ></option
              >
            </select>
          </div>
        </div>


        <div class="form-group my-2 d-flex">
          <div class="col">
            <input type="checkbox" v-model="withInactive">
            <span class="small">Inactive customers</span>
          </div>
          <div class="col">
            <input type="checkbox" v-model="onlyFavoriteList" @change="handleFavoriteList">
            <span class="small">Favorite list</span>
          </div>
          <div class="text-right col">
           <button class="btn btn-sm btn-primary" @click="reset" type="button">
            <span><i class="fa fa-redo"></i></span>
            <span>reset</span>
          </button>
          <button class="btn btn-sm btn-success" @click="updateCustomers" type="button">
            <span><i class="fa fa-check-circle"></i></span>
            <span>ok</span>
          </button>
          </div>
        </div>

      </template>
    </modal-fade>
  </div>
</template>

<script>
import ModalFade from "../../components/ModalFade";
import { filterData } from "../../helpers/helpers";
import { httpCall } from '../../helpers/http-service';
export default {
  components: {
    ModalFade
  },
  data: () => ({
    showFilter: false,
    withInactive: false,
    onlyFavoriteList: false,
    favoriteList: [],
    isFavoriteListFetched: false,
    filter: {
      brick: '',
      specialty: '',
      param: '',
      freq: '',
    },
  }),
  props: ["data"],
  computed: {
    filterItems() {
      let data = this.customers;
      let filter = {};
      filter.bricks = filterData(data, "brick");
      filter.specialty = filterData(data, "specialty");
      filter.param = filterData(data, "parameter");
      filter.freq = filterData(data, "current_freq");
      return filter;
    },
    customers() {
      if(this.withInactive) {
        return this.$store.getters.all;
      }
      if(this.onlyFavoriteList && this.isFavoriteListFetched) {
        return this.favoriteList;
      }
      return this.data;
    }
  },
  methods: {
    updateCustomers() {
        let customers = this.filterCustomers();
        this.$store.commit('setCustomerFilter', customers);
        this.showFilter = false;
    },
    filterCustomers() {
      let customers = this.customers;
      let {brick, specialty, param, freq} = this.filter;
      if(brick !==''){
        customers = customers.filter(customer => customer.brick === brick);
      }
      if(specialty !== '') {
        customers = customers.filter(customer => customer.specialty === specialty)
      }
      if(param !== '') {
        customers = customers.filter(customer => customer.parameter === param)
      }
      if(freq !== '') {
        customers = customers.filter(customer => customer.current_freq === parseInt(freq));
      }
      return customers

    },
    closeFilterModal(){
      this.showFilter = false;
    },
    reset(){
      this.$store.commit('setCustomerFilter', this.data);
      this.showFilter = false;
    },
    getFavoriteList(force) {
      if(!this.favoriteList.length || force) {
        this.isFavoriteListFetched = false;
        httpCall.get('customers-favorite-list')
        .then(({data}) => {
          this.favoriteList = data.data;
          this.isFavoriteListFetched = true;
        });
      }
    },
    handleFavoriteList() {
      let checked = event.target.checked;
      if(checked) {
        this.getFavoriteList();
        this.onlyFavoriteList = true;
      } else {
        this.onlyFavoriteList = false;
      }
    }
  }
};
</script>

<style></style>
