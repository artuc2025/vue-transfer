<template>
  <div class="base-select-wrapper">
    <span>Select</span>
    <v-select :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']" multiple variant="outlined"
      v-model="selected" placeholder="Select your state"></v-select>
  </div>
</template>

<script setup lang="ts">
const selected = ref<string[]>([]);
</script>

<style scoped lang="scss">
:deep(.v-field__input) {
  padding: 0;
  min-height: 44px;
}

:deep(.v-select .v-field.v-field:hover .v-field--variant-outlined .v-field__outline__start) {
  border-color: red;
}

:deep(.v-field__input input) {
  top: 50%;
  transform: translateY(-50%);
  left: 14px;
}

:deep(.v-field__outline) {
  --v-field-border-opacity: 1;
}

:deep(.v-field--variant-outlined .v-field__outline__start) {
  border-color: rgba(var(--v-theme-light-gray-8));
}

:deep(.v-field--variant-outlined .v-field__outline__end) {
  border-color: rgba(var(--v-theme-light-gray-8));
}
</style>
