<template>
  <div>
    <div>
      <div class="text-center">
        <knob-control
          :max="max"
          v-model="val"
          :stroke-width="8"
          :animation="{
            animated: true,
            animateValue: true,
            animationDuration: '5000',
            animationFunction: 'linear'
          }"
          :step-size="1"
          :readonly="true"
          primary-color="#38c172"
          text-color="#38c172"
        />
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import KnobControl from "vue-knob-control";
export default {
  components: {
    KnobControl
  },
  props: ['val', 'max']
};
</script>

<style></style>
