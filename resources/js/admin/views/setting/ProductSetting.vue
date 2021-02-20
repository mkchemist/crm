<template>
  <div class="px-0 shadow rounded pb-5">
    <page-title-component
      :title="`Product Setting`"
      :icon="`fa-gift`"
      :type="`success`"
    />
    <div class="p-2">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(saveProductPrice)">
          <div class="p-2">
            <h4>Product Factory Price Setting</h4>
            <p class="text-muted">
              this page is for set product factory price to be used in customer
              requests calculations to evaluate any request ROI and will be used
              in other calculations
            </p>
          </div>
          <div class="row mx-auto" v-if="Object.keys(products)">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Factory Price</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(product, i) in Object.keys(products)"
                  :key="`product_${i}`"
                >
                  <td class="text-primary font-weight-bold">{{ product }}</td>
                  <td>
                    <input
                      type=""
                      v-model.number="productPrice[product]"
                      class="form-control form-control-sm"
                      min="1"
                      step="0.001"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- <div
              class="form-group border p-2 col-lg-6"
              v-for="(product, i) in Object.keys(products)"
              :key="`product_${i}`"
            >
              <p class="border-bottom lead">{{ product }}</p>
              <label for="" class="text-muted font-weight-bold">Price</label>
              <input
                type="number"
                v-model.number="productPrice[product]"
                class="form-control form-control-sm"
                min="1"
              />
            </div> -->
          </div>
          <loader-component v-else></loader-component>
          <hr />
          <div class="form-group text-right">
            <router-link to="/setting" class="btn btn-sm btn-dark">
              <span class="fa fa-chevron-circle-left"></span>
              <span>back</span>
            </router-link>
            <button class="btn btn-sm btn-primary">
              <span class="fa fa-save"></span>
              <span>save</span>
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import PageTitleComponent from "../../../components/PageTitleComponent.vue";
import { httpCall } from "../../../helpers/http-service";
export default {
  components: { PageTitleComponent },
  mounted() {
    this.$store.dispatch("getAllLines").finally(() => {
      this.fetchProductsPrice();
    });
  },
  computed: {
    products() {
      return this.$store.getters.products;
    }
  },
  data: () => ({
    productPrice: {}
  }),
  methods: {
    saveProductPrice() {
      let request = {
        data: JSON.stringify(this.productPrice)
      };

      return httpCall
        .post("admin/v1/setting/products/price", request)
        .then(({ data }) => {
          if (data.code === 200) {
            this.$swal({
              title: "Success",
              icon: "success",
              text: data.message,
              toast: true
            });
          } else {
            this.$swal({
              title: "Oops, Error",
              toast: true,
              text: "something went wrong",
              icon: "error"
            });
          }
        })
        .catch(err => console.log(err));
    },
    fetchProductsPrice() {
      return httpCall
        .get("admin/v1/setting/products/price")
        .then(({ data }) => {
          if (!Object.keys(data.data).length) {
            this.productPrice = this.products;
          } else {
            this.productPrice = data.data;
          }
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style></style>
