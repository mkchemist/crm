<template>
  <div :class="`alert alert-${type}`">
    <span :class="`fa ${icon}`"></span>
    <span class="font-weight-bold">{{ title }}</span>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: () => 'success'
    },
    icon: {
      type: String,
      default: () => 'fa-book'
    },
    title: {
      type: String,
      default: () => 'Page'
    }
  }
}
</script>

<style>

</style>
