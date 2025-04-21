<template>
  <button
      :class="[
      'base-button w-100 font-weight-medium rounded-lg cursor-pointer d-inline-flex align-center justify-center bg-primary text-white text-subtitle-1',
      variant,
      size,
      { disabled }
    ]"
      :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped lang="scss">
.base-button {
  border: none;
  height: 48px;
}

button[type="disabled"] {
  opacity: 30%;
  pointer-events: none;
}

</style>
