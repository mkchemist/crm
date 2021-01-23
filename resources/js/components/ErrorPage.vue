<template>
  <div class="col-lg-4 d-flex flex-column justify-content-center align-items-center mx-auto" style="min-height:500px">
    <p class="display-4 text-secondary">Oops!</p>
    <img :src="base_url+'images/404-Error.png'" alt="" class="img-fluid w-100">
  </div>
</template>

<script>
let base_url = document.getElementById('APP_BASE_URI').value.replace('api/','');
export default {
  data: () => ({
    base_url
  })
}
</script>

<style>

</style>
