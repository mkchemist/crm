<template>
  <div>
    <h1>FavoriteList</h1>
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
  }
}
</script>

<style>

</style>
