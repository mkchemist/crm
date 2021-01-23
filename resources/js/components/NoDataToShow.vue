<template>
  <div class="text-center">
    <p>
      <span :class="`fa fa-check-circle fa-4x ${iconColor}`"></span>
    </p>
    <p :class="`${bold ? 'font-weight-bold': 'text-muted'}`">{{ title ? title : 'No data to show' }}</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: [
    'title',
    'bold'
  ],
  props: {
    title: {
      type: String
    },
    bold: {
      type: String
    },
    iconColor: {
      type: String,
      default: () => 'text-success'
    }
  }
}
</script>

<style>

</style>
