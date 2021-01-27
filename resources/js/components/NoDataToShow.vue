<template>
  <div class="text-center">
    <p>
      <span :class="`fa ${icon} fa-4x ${iconColor}`"></span>
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
    }
  }
}
</script>

<style>

</style>
