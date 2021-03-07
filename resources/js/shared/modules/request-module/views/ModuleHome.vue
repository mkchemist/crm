<template>
  <div class="p-2 shadow rounded info-container">
    <div class="p-2">
      <div v-if="products.length">
        <div class="row mx-auto justify-content-between state-view-container">
          <div v-for="(product,i) in products" :key="`product_${i}`" class=" mx-2 state-view" :style="`border-left:5px solid ${product.color}`">
            <span class="flag" :style="`background-color:${product.color}`">{{ product.Item[0] }}</span>
            <p class="mb-0 state-text">
              <span class="font-weight-bold" :style="`color:${product.color}`">{{ product.Item }}</span>
            </p>
            <p class="mb-0 state-text">
              <span class="font-weight-bold" :style="`color:${product.color}`">{{ product.total_cost }} L.E</span>
            </p>
          </div>
        </div>
      </div>
      <div v-else-if="isFetched" class="pt-5">
        <no-data-to-show :icon="`fa-folder-open fa-8x`" title="No Requests found" :bold="true" :iconColor="`text-primary`" />
      </div>
      <loader-component v-else></loader-component>
    </div>
  </div>
</template>

<script>
import NoDataToShow from '../../../../components/NoDataToShow.vue';
import { CHART_COLOR_LIST } from '../../../../helpers/constants';
import { httpCall } from '../../../../helpers/http-service'
export default {
  components: { NoDataToShow },
  mounted() {
    this.fetchRequestsPerProduct();
  },
  data: () => ({
    products: [],
    isFetched: false,
  }),
  methods: {
    fetchRequestsPerProduct() {
      this.products = [];
      this.isFetched = false;
      return httpCall.get("v1/requests/search/product")
      .then(({data}) => {
        data.data.forEach((item,i) => {
          item['color'] = CHART_COLOR_LIST[i];
        })
        this.products = data.data;
        this.isFetched = true;
      }).catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss">

</style>
