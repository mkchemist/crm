<template>
  <div class=" p-2">
    <div class="p-2 border rounded">
      <div class="p-2 text-right">
        <button class="btn btn-sm btn-primary" @click="addProduct" type="button">
          <span class="fa fa-plus-circle"></span>
          <span>Add Product</span>
        </button>
      </div>
      <div class="p-2">
        <div
          class="row mx-auto p-2 border my-1 rounded"
          v-for="(d_product, dpi) in dProducts"
          :key="`d_product_${dpi}`"
        >
          <div class="col-lg">
            <label for="">Product</label>
            <ValidationProvider
              name="Product"
              rules="required"
              v-slot="{ errors }"
            >
              <span class="text-danger small" v-if="errors[0]">* required</span>
              <select
                class="form-control form-control-sm"
                v-model="d_product.name"
                @change="updateRequestCommentDescription"
                :disabled="!editMode"
              >
                <option :value="null"></option>
                <option
                  v-for="(product, i) in products"
                  :key="`product_${i}`"
                  :value="product.name"
                  >{{ product.name }}</option
                >
              </select>
            </ValidationProvider>
          </div>
          <div class="col-lg">
            <label for="">Quantity</label>
            <ValidationProvider
              name="Quantity"
              rules="required"
              v-slot="{ errors }"
            >
              <span class="text-danger small" v-if="errors[0]">* required</span>
              <input
                type="number"
                min="1"
                class="form-control form-control-sm"
                v-model="d_product.q"
                @change="updateRequestCommentDescription"
                :disabled="!editMode"
              />
            </ValidationProvider>
          </div>
          <div
            class="col-lg-auto d-flex flex-column align-content-center justify-content-center"
            @click="removeProducts(dpi)"
          >
            <button class="btn btn-sm btn-danger" type="button">
              <span class="fa fa-trash"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    request: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    products() {
      return this.$store.getters["UserModule/userProducts"];
    }
  },
  data: () => ({
    dProducts: [
      {
        name: null,
        q: 1
      }
    ]
  }),
  methods: {
    addProduct() {
      this.dProducts.push({
        name: null,
        q: 1
      });
    },
    removeProducts(i) {
      if (this.dProducts.length === 1) {
        this.$swal({
          title: "Warning",
          text: "you must keep one product at least",
          icon: "warning",
          titleTextColor: "red"
        });
        return;
      }
      this.dProducts.splice(i, 1);
    },
    updateRequestCommentDescription() {
      let desc = "";
      this.request.others = JSON.stringify(this.dProducts);
      this.dProducts.map(p => {
        desc += `[ ${p.q} from ${p.name} ]`;
      });
      this.request.comment.desc = desc;
    }
  }
};
</script>

<style></style>
