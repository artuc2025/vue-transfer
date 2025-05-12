<template>
  <v-range-slider
    v-model="model"
    :max="props.max"
    :min="props.min"
    :step="props.step"
    class="base-range-slider"
    hide-details
  />
</template>
<script setup lang="ts">
const model = defineModel<readonly (string | number)[] | undefined>();
const props = defineProps<{
  min: number;
  max: number;
  step: number;
}>();
</script>
<style lang="scss">
.base-range-slider {
  .v-slider-track__background {
    background-color: rgba(234, 234, 241, 1);
    border-radius: 6px;
  }
  .v-slider-track__fill {
    background-color: rgba(10, 100, 200, 1);
    border-radius: 6px;
  }
  .v-slider-thumb__surface {
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(178, 196, 217, 1);
    box-shadow: unset !important;
    &:before,
    &:after {
      content: none;
    }
  }
  .v-slider-thumb__ripple {
    display: none;
  }
}
</style>
