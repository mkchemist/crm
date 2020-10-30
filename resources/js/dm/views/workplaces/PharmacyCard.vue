<template>
  <div class="px-0 shadow">
    <p class="alert alert-success">
      <span><i class="fa fa-store-alt"></i></span>
      <span class="font-weight-bold">Pharmacy {{ pharmacy ? pharmacy.name : null }} Card</span>
    </p>
  </div>
</template>

<script>
export default {
  created(){

  },
  data: () => ({
    pharmacy: null
  }),
}
</script>

<style>

</style>
