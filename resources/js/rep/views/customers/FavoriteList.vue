<template>
  <div>
    <div class="px-0">
      <p class="alert alert-success">
        <span><i class="fa fa-star"></i></span>
        <span>Favorite list</span>
      </p>
      <div>

      </div>
    </div>
  </div>
</template>

<script>
import { httpCall } from '../../helpers/http-service'
export default {
  created(){
    httpCall.get('rep/v1/customers-favorite-list')
    .then(({data}) => {
      console.log(data)
    })
  },
  data: () => ({
    customers: [],
    fetched: false
  })
}
</script>

<style>

</style>
