<template>
  <div class="d-flex justify-content-center align-items-center flex-column" style="min-height:100px">
    <div class="spinner-border text-success"></div>
    <p class="my-2 small text-muted">{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: () => 'loading data ...'
    },
  }
}
</script>

<style>

</style>
