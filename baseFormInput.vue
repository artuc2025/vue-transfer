<template>
  <div class="base-input-wrapper">
    <div>
      <label v-if="label" class="base-form-label d-inline-block text-body-2 text-dark-blue-2">
        {{ label }}
      </label>
      <div class="position-relative">
        <slot
            :modelValue="internalValue"
            :updateModelValue="(val) => (internalValue = val)"
        >
          <v-text-field
              v-model="internalValue"
              :type="type"
              :placeholder="placeholder"
              :disabled="disabled"
              :error="error"
              :rules="rules"
              :variant="variant"
              density="comfortable"
              label="Մուտքագրել"
              hide-details="auto"
              class="base-form-input"
          />
        </slot>
        <div v-if="currencyValue" class="base-form-currency-value position-absolute">{{currencyValue}}</div>
      </div>

    </div>
    <div class="base-form-description d-flex justify-end">
       <span v-if="description" class="text-caption text-dark-blue-2">
      {{ description }}
    </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number, Object, Array],
  label: String,
  description: String,
  currencyValue: String,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  variant: String,
  baseColor: String,
  disabled: Boolean,
  error: Boolean,
  rules: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<style scoped lang="scss">
.base-form {
  &-label {
    padding: 10px 14px;
  }
  &-description {
    padding: 4px 14px;
  }
}
:deep(.v-field__input){
  padding: 10px 14px !important;
  height: 48px;
  color: rgb(var(--v-theme-dark-blue-8)) !important;
  border-radius: 6px;
  backdrop-filter: blur(42.400001525878906px);
  background: rgba(249, 249, 250, 0.7);
}
:deep(.v-field--focused){
  border: none !important;
}
:deep(.v-field--variant-outlined .v-field__outline__start) {
  opacity: unset !important;
}
:deep(.v-field--variant-outlined .v-field__outline__end) {
  opacity: unset !important;
}
:deep(.v-field--active .v-field__outline){
  color: rgb(var(--v-theme-light-blue-8)) !important;
}
:deep(.v-autocomplete .mdi-menu-down::before) {
  content: '' !important;
  background-image: url('/public/assets/img/chevron.svg');
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
}
:deep(.v-autocomplete .v-field--appended) {
    padding-inline-end: 14px;
}
:deep(.v-autocomplete .v-field__overlay) {
  background: rgba(249, 249, 250, 0.7);
}
.base-form-currency-value {
  right: 14px;
  top: 12px;
  &:before {
    content: '';
    width: 28px;
    height: 1px;
    background-color: rgb(var(--v-theme-light-gray-2));
    position: absolute;
    transform: rotate(90deg);
    top: 11px;
    right: 16px;
  }
}
</style>
