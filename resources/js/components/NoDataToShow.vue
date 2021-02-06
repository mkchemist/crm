<template>
  <div class="text-center">
    <p>
      <span :class="`fa ${icon} fa-4x ${iconColor}`" v-if="!errorFlag"></span>
      <span class="fa fa-exclamation-triangle fa-4x text-danger" v-else></span>
    </p>
    <p :class="`${bold ? 'font-weight-bold': 'text-muted'}`">{{ title }}</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: () => 'Nothing to show'
    },
    bold: {
      type: String
    },
    iconColor: {
      type: String,
      default: () => 'text-success'
    },
    icon: {
      type: String,
      default: () => 'fa-check-circle'
    },
    errorFlag: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>

<style>

</style>
