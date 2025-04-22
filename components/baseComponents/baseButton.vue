<template>
  <button
    :class="['base-button', variant, size]"
    :disabled="disabled"
    :type="loading ? 'disabled' : 'button'"
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
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border-radius: 6px;
  font-weight: 500;

  &:focus {
    outline: none;
  }
  &.primary {
    background-color: rgba(var(--v-theme-primary));
    color: rgba(var(--v-theme-background));
  }
  &:disabled {
    background-color: rgba(var(--v-theme-primary), 0.5);
    color: rgba(var(--v-theme-background), 0.5);
    cursor: not-allowed;
  }
}

</style>
