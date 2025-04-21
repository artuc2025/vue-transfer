<script setup lang="ts">
const props = defineProps({
  modelValue: [Boolean, String, Number],
  label: String,
  description: String,
  disabled: Boolean,
  loading: Boolean,
  inset: Boolean,
  color: {
    type: String,
    default: 'primary',
  },
  trueValue: {
    default: true,
  },
  falseValue: {
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<template>
  <div class="base-switch-wrapper">
    <label v-if="label" class="base-switch-label text-body-2 d-block mb-1">
      {{ label }}
    </label>

    <v-switch
        v-model="internalValue"
        :disabled="disabled"
        :loading="loading"
        :inset="inset"
        :color="color"
        :true-value="trueValue"
        :false-value="falseValue"
        hide-details="auto"
        class="base-switch"
    >
      <template v-if="$slots.append" #append>
        <slot name="append" />
      </template>
      <template v-if="$slots.label" #label>
        <slot name="label" />
      </template>
    </v-switch>

    <span v-if="description" class="base-switch-description text-caption d-block mt-1">
      {{ description }}
    </span>
  </div>
</template>


<style scoped lang="scss">
:deep(.v-switch__track) {
  opacity: unset;
}
:deep(.v-switch--inset .v-switch__track) {
  height: 36px;
  min-width: 56px;
}
:deep(.v-switch--inset .v-switch__thumb) {
    height: 28px;
    width: 28px;
}

</style>
