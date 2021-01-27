<template>
  <div>
    <div class="form-group text-right mb-0">
      <button
        class="btn btn-sm btn-primary"
        type="button"
        @click="addProduct"
        :disabled="productData.length >= maxProductCount"
      >
        <span class="fa fa-plus"></span>
        <span>Product</span>
      </button>
    </div>
    <div
      class="p-2 border border-dark rounded my-1"
      v-for="(product, _PI) in productData"
      :key="`product_${_PI}`"
    >
      <div class="p-2 row mx-auto">
        <!-- Product -->
        <div class="form-group col-lg">
          <label for="" class=" font-weight-bold text-primary"
            >Product {{ _PI + 1 }}</label
          >
          <ValidationProvider
            :name="`Product`"
            rules="required"
            v-slot="{ errors }"
          >
            <span v-if="errors[0]" class="text-danger small">{{
              `* required`
            }}</span>
            <select
              :name="`product_${_PI}_name`"
              :id="`product_${_PI}_name`"
              :class="
                `form-control form-control-sm ${
                  errors[0] ? 'border border-danger' : ''
                }`
              "
              v-model="productData[_PI].name"
            >
              <option :value="null"></option>
              <option
                :value="product.name"
                v-for="(product, _LPI) in products"
                :key="`product_${_PI}_line_product_${_LPI}`"
                >{{ product.name }}</option
              >
            </select>
          </ValidationProvider>
        </div>
        <!-- product lader of adaption -->
        <div class="form-group col-lg" v-if="pharmacyProducts !== true">
          <label for="" class="">Lader of adaption</label>
          <ValidationProvider
            :name="`Lader of adaption`"
            rules="required"
            v-slot="{ errors }"
          >
            <span v-if="errors[0]" class="text-danger small">{{
              `* required`
            }}</span>
            <select
              :name="`product_${_PI}_lader`"
              :id="`product_${_PI}_lader`"
              :class="
                `form-control form-control-sm ${
                  errors[0] ? 'border border-danger' : ''
                }`
              "
              v-model="productData[_PI].lader"
            >
              <option :value="null"></option>
              <option
                :value="lader"
                v-for="(lader, _LI) in laders"
                :key="`product_${_PI}_lader_${_LI}`"
                >{{ lader }}</option
              >
            </select>
          </ValidationProvider>
        </div>
        <!-- product actions -->
        <div class="form-group col-lg" v-if="pharmacyProducts !== true">
          <label for="" class="">Action</label>
          <ValidationProvider
            :name="`Action`"
            rules="required"
            v-slot="{ errors }"
          >
            <span v-if="errors[0]" class="text-danger small">{{
              `* required`
            }}</span>
            <select
              :name="`product_${_PI}_action`"
              :id="`product_${_PI}_action`"
              :class="
                `form-control form-control-sm ${
                  errors[0] ? 'border border-danger' : ''
                }`
              "
              v-model="productData[_PI].action"
            >
              <option :value="null"></option>
              <option
                :value="action"
                v-for="(action, _AI) in actions"
                :key="`product_${_PI}_action_${_AI}`"
                >{{ action }}</option
              >
            </select>
          </ValidationProvider>
        </div>

        <!-- product rate -->
        <div class="form-group col-lg">
          <label for="" class="">Rate</label>
          <ValidationProvider
            :name="`Rate`"
            rules="required"
            v-slot="{ errors }"
          >
            <span v-if="errors[0]" class="text-danger small">{{
              `* required`
            }}</span>
            <select
              :name="`product_${_PI}_rate`"
              :id="`product_${_PI}_rate`"
              :class="
                `form-control form-control-sm ${
                  errors[0] ? 'border border-danger' : ''
                }`
              "
              v-model="productData[_PI].rate"
            >
              <option :value="null"></option>
              <option value="high">high</option>
              <option value="medium">medium</option>
              <option value="low">low</option>
              <option value="weak">weak</option>
            </select>
          </ValidationProvider>
        </div>
        <div class="form-group col-lg" v-if="pharmacyProducts">
          <label for="" class="">Stock</label>
          <input
            type="number"
            class="form-control form-control-sm"
            v-model="productData[_PI].stock"
            :min="0"
          />
        </div>
        <div class="form-group col-lg" v-if="pharmacyProducts">
          <label for="" class="">Order</label>
          <input
            type="number"
            class="form-control form-control-sm"
            v-model="productData[_PI].order"
            :min="0"
          />
        </div>
        <div class="form-group col-lg" v-if="pharmacyProducts">
          <label for="" class="">Distributor</label>
          <select
            class="form-control form-control-sm"
            v-model="productData[_PI].dist"
            :required="productData[_PI].order > 0"
          >
            <option :value="null"></option>
            <option value="UCP">UCP</option>
            <option value="PHARMA">PHARMA</option>
            <option value="IBN SINA">IBN SINA</option>
            <option value="MULTI PHARM">MULTI PHARM</option>
            <option value="EMIC">EMIC</option>
            <option value="DIRECT">DIRECT</option>
          </select>
        </div>
        <div class="col-lg-auto">
          <button
            class="btn btn-sm btn-primary"
            @click="addCompetitor(_PI)"
            type="button"
            :disabled="productData[_PI].competitors.length >= maxCompetitorCount"
          >
            <span class="fa fa-plus"></span>
            <span>competitor</span>
          </button>
          <button
            class="btn btn-sm btn-danger"
            @click="deleteProduct(_PI)"
            type="button"
          >
            <span class="fa fa-trash"></span>
            <span>product</span>
          </button>
        </div>
      </div>
      <!-- product Competitors-->
      <div
        class="p-2 border row mx-auto rounded bg-light my-1 align-items-center"
        v-for="(competitor, _CI) in product.competitors"
        :key="`product_${_PI}_competitor_${_CI}`"
      >
        <div class="col-lg">
          <span class="text-danger font-weight-bold"
            >Competitor {{ _CI + 1 }}</span
          >
        </div>
        <!-- Competitor name -->
        <div class="col-lg">
          <label for="">name</label>
          <ValidationProvider
            :name="`Competitor Name`"
            rules="required"
            v-slot="{ errors }"
          >
            <span v-if="errors[0]" class="text-danger small">{{
              `* required`
            }}</span>
            <select
              :name="`competitor_${_CI}_name_product_${_PI}`"
              :class="
                `form-control form-control-sm ${
                  errors[0] ? 'border border-danger' : ''
                }`
              "
              v-model="productData[_PI].competitors[_CI].name"
            >
              <option :value="null"></option>
              <option
                :value="c"
                v-for="(c, i) in getProductCompetitors(productData[_PI].name)"
                :key="`product_${_PI}_competitor_${_CI}_name_${i}`"
                >{{ c }}</option
              >
            </select>
          </ValidationProvider>
        </div>
        <!-- Competitor rate -->
        <div class="col-lg">
          <label for="">Rate</label>
          <ValidationProvider
            :name="`Competitor Rate`"
            rules="required"
            v-slot="{ errors }"
          >
            <span v-if="errors[0]" class="text-danger small">{{
              `* required`
            }}</span>
            <select
              :name="`competitor_${_CI}_rate_product_${_PI}`"
              :class="
                `form-control form-control-sm ${
                  errors[0] ? 'border border-danger' : ''
                }`
              "
              v-model="productData[_PI].competitors[_CI].rate"
            >
              <option :value="null"></option>
              <option value="high">high</option>
              <option value="medium">medium</option>
              <option value="low">low</option>
              <option value="weak">weak</option>
            </select>
          </ValidationProvider>
        </div>
        <div class="col-lg">
          <label for="">Stock</label>
          <input
            type="number"
            name="stock"
            id="stock"
            v-model="productData[_PI].competitors[_CI].stock"
            class="form-control form-control-sm"
            :min="0"
          />
        </div>
        <!-- Competitor control -->
        <div class="col-lg-auto">
          <button
            class="btn btn-danger btn-sm"
            @click="deleteCompetitor(_PI, _CI)"
            type="button"
          >
            <span class="fa fa-trash"></span>
            <span>Competitor</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { lader_of_adaption, visit_actions } from "../../helpers/constants";
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    pharmacyProducts: {
      type: Boolean,
      default: () => false
    },
    maxProductCount :{
      type: Number,
      default: () => 4
    },
    maxCompetitorCount: {
      type: Number,
      default: () => 3
    }
  },
  computed: {
    laders() {
      return lader_of_adaption;
    },
    actions() {
      return visit_actions;
    },
    products() {
      let products = [];
      this.$store.getters.line.map(item => {
        products = [...item.products];
      });
      return products;
    },
    productData() {
      let data = this.data;
      data.map(item => {
        if (!item["competitors"]) {
          item["competitors"] = [
            {
              name: item.competitor,
              rate: item.competitor_rate || null
            }
          ];
        }
      });
      return data;
    }
  },
  methods: {
    /* add product */
    addProduct() {
      if (this.data.length >= this.maxProductCount) {
        return;
      }
      let productScheme = {
        name: null,
        lader: null,
        actions: null,
        rate: null,
        stock: 0,
        order: 0,
        dist: null,
        competitors: [
          {
            name: null,
            rate: null,
            stock: 0
          }
        ]
      };
      this.data.push(productScheme);
    },
    /**
     * Delete product
     *
     * @param {int} i [product index]
     */
    deleteProduct(_PI) {
      this.data.splice(_PI, 1);
    },
    /**
     * add competitor to the given product
     *
     * @param {int} i [product index]
     */
    addCompetitor(_PI) {
      if (this.data[_PI].competitors.length >= this.maxCompetitorCount) {
        return;
      }
      this.data[_PI].competitors.push({ name: null, rate: null });
    },
    /**
     * delete competitor of the given product
     *
     * @param {int} _PI [product index]
     * @param {int} _CI [competitor index]
     */
    deleteCompetitor(_PI, _CI) {
      this.data[_PI].competitors.splice(_CI, 1);
    },
    /**
     * get product competitors
     *
     * @param {String} competitor
     */
    getProductCompetitors(product) {
      let competitors = [];
      this.products.forEach(item => {
        if (item.name === product) {
          competitors = item.competitors;
        }
      });
      return competitors;
    }
  }
};
</script>

<style></style>
