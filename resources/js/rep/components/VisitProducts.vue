<template>
  <div>
    <div class="text-right">
      <button
        class="btn btn-sm btn-primary"
        type="button"
        @click="addNewProduct"
      >
        <span><i class="fa fa-plus-circle"></i></span>
        <span>add product</span>
      </button>
    </div>
    <div class="row mx-auto" v-for="(product, i) in data" :key="i">

      <div class="col-lg">
        <label for="name" class="text-muted small">Name</label>
        <select
          name="name"
          class="form-control form-control-sm"
          v-model="product.name"
        >
          <option v-for="(item, i) in rep_products" :key="i" :value="item.name">{{
            item.name
          }}</option>
        </select>
      </div>
      <div class="col-lg" v-if="pharmacyProducts">
        <label for="rate" class="text-muted small">Rate</label>
        <select
          name="rate"
          class="form-control form-control-sm"
          v-model="product.rate"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
          <option value="Very Low">Very Low</option>
        </select>
      </div>
      <div class="col-lg" v-else>
        <label for="lader" class="text-muted small">Lader of Adaption</label>
        <select
          name="lader"
          class="form-control form-control-sm"
          v-model="product.lader"
        >
          <option v-for="(item, i) in lader" :key="i" :value="item">{{
            item
          }}</option>
        </select>
      </div>

      <div class="col-lg" v-if="!pharmacyProducts">
        <label for="action" class="text-muted small">Action</label>
        <select
          name="action"
          class="form-control form-control-sm"
          v-model="product.action"
        >
          <option v-for="(item, i) in visitActions" :key="i" :value="item">{{
            item
          }}</option>
        </select>
      </div>

      <div class="col-lg">
        <label for="competitor" class="text-muted small">Competitor</label>
        <!-- <input
          type="text"
          name="competitor"
          class="form-control form-control-sm"
          v-model="product.competitor"
        /> -->
        <select name="competitor" id="competitor" class="form-control form-control-sm" v-model="product.competitor">
          <option v-for="(val, key) in getProductCompetitors(product, i)" :key="`product_${i}_competitor_${key}`" :value="val">{{ val }}</option>
        </select>
      </div>
      <div class="col-lg" v-if="pharmacyProducts">
        <label for="competitor_rate" class="text-muted small">Competitor Rate</label>
        <select
          type="text"
          name="competitor_rate"
          class="form-control form-control-sm"
          v-model="product.competitor_rate"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
          <option value="Very Low">Very Low</option>
        </select>
      </div>
      <div class="col-lg-auto d-flex justify-content-center align-items-center">
        <button class="btn btn-sm btn-danger" @click="removeProduct(i)">
          <span><i class="fa fa-times"></i></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../helpers/http-service';
export default {
  mounted() {
    this.getRepProducts();
  },
  props: ["data", 'pharmacyProducts'],
  computed: {
    products() {
      return this.$store.getters.products;
    },
    lader() {
      return this.$store.getters.lader;
    },
    visitActions() {
      return this.$store.getters.visitActions;
    },

  },
  data: () => ({
    rep_products : []
  }),
  methods: {
    addNewProduct() {
      let product = {};
      product.name= "";
      product.competitor = "";
      if(this.pharmacyProducts) {
        product.rate = "";
        product.competitor_rate = ""
      };
      this.data.push(product)
    },
    removeProduct(i) {
      this.data.splice(i, 1);
    },
    getRepProducts() {
      return httpCall.get('rep/v1/rep-line')
      .then(({data}) => {
        this.handleResponse(data ,data => {
          this.rep_products = data.data;
        });
      }).catch(err => console.log(err));
    },
  getProductCompetitors(product,i) {
      let competitors = [];
      this.rep_products.map(product => {
        if(product.name ===this.data[i].name) {
          competitors = Array.from(product.competitors);
        }
      })
      return competitors;
    }
  },
};
</script>

<style></style>
