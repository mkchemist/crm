<template>
  <div class="col-12 px-0">
    <div class="row mx-auto px-0">
      <div class="col-lg-4">
        <div class="form-group" v-if="!['share','view'].includes(mode)">
          <label for="product" class="font-weight-bold small">Product</label>
          <select
            name="product"
            id="product"
            v-model="selected"
            class="form-control form-control-sm"
            :disabled="!products.length"
          >
            <option :value="null">Select Product</option>
            <option
              v-for="(product, i) in products"
              :key="`product_${i}`"
              :value="product"
              >{{ product.name }}</option
            >
          </select>
          <button
            class="btn btn-sm btn-block btn-primary my-1"
            @click="addProduct"
            type="button"
            :disabled="!selected"
          >
            <span class="fa fa-check-circle"></span>
            <span>Ok</span>
          </button>
        </div>
        <div v-else>
          <p class="font-weight-bold text-muted small">Request Products</p>
        </div>
      </div>
      <div class="col-lg-8">
        <div style="max-height:200px;overflow:auto">
          <table
            class="table-sm small table"
            v-for="(product, i) in requestProducts"
            :key="`request_products_${i}`"
          >
            <thead>
              <tr>
                <th colspan="6">{{ product.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <label for="">Rx count</label>
                </td>
                <td>
                  <ValidationProvider
                    name="Product Rx"
                    rules="required"
                    v-slot="errors"
                  >
                    <input
                      type="number"
                      v-model.number="product.rx"
                      :class="
                        `form-control form-control-sm${
                          errors[0] ? 'border border-danger' : ''
                        }`
                      "
                      placeholder="Product Rx"
                      :disabled="['share','view'].includes(mode)"
                    />
                  </ValidationProvider>
                </td>
                <td>
                  <label for="">For</label>
                </td>
                <td>
                  <input
                    type="number"
                    v-model.number="product.rx_months"
                    :class="`form-control form-control-sm`"
                    :disabled="['share','view'].includes(mode)"
                  />
                </td>
                <td>
                  <label for="">Month</label>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-danger"
                    @click="removeProduct(i)"
                    v-if="!['share','view'].includes(mode)"
                  >
                    <span class="fa fa-times"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    requestProducts: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      default: () => 'edit',
      validator: v => ['share','view','edit'].includes(v)
    }
  },
  computed: {
    products() {
      let products = this.$store.getters["UserModule/userProducts"];
      return products.filter(p => !this.added.includes(p.name));
    }
  },
  data: () => ({
    added: [],
    selected: null
  }),
  methods: {
    addProduct() {
      this.requestProducts.push({
        name: this.selected.name,
        rx: 1,
        rx_months: 1
      });
      this.added.push(this.selected.name);
    },
    removeProduct(i) {
      let product = this.requestProducts[i];
      let index = this.added.indexOf(product.name);
      this.requestProducts.splice(i, 1);
      this.added.splice(index, 1);
    }
  }
};
</script>

<style></style>
