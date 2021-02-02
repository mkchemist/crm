<template>
  <div class="d-flex justify-content-center align-items-center flex-column" style="min-height:100px">
    <div :class="`spinner-border ${spinnerStyle}`" :style="spinnerSizeProperty"></div>
    <p :class="`my-2  ${textStyle}`">{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: () => 'loading data ...'
    },
    textStyle: {
      type: String,
      default: () => 'text-muted font-weight-bold'
    },
    size: {
      type: String,
      default: () => 'sm'
    },
    spinnerStyle: {
      type: String,
      default: () => 'text-success'
    }
  },
  computed: {
    spinnerSizeProperty() {
      let style = '';
      switch (this.size) {
        case 'xl':
          style='width:300px;height:300px'
          break;
        case 'lg':
          style = 'width:200px;height:200px'
          break;
        case 'md':
          style = 'width:100px;height:100px'
        default:
          break;
      }
      return style;
    }
  }
}
</script>

<style>

</style>
