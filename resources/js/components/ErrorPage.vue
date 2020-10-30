<template>
  <div class="col-lg-4 d-flex flex-column justify-content-center align-items-center mx-auto" style="min-height:500px">
    <p class="display-4 text-secondary">Oops!</p>
    <img :src="base_url+'images/error404.png'" alt="" class="img-fluid w-100">
  </div>
</template>

<script>
let base_url = process.env.MIX_APP_API_URL.replace('api/','');
export default {
  data: () => ({
    base_url
  })
}
</script>

<style>

</style>
