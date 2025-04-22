<template>
  <div
    class="toggle-switch-wrapper"
    :class="{ 'toggle-switch-wrapper--disabled': disabled }"
    @click="toggle"
  >
    <label
      v-if="$slots.label || label"
      class="toggle-switch-label"
      :style="{ marginRight: gap + 'px' }"
    >
      <template v-if="$slots.label">
        <slot name="label"></slot>
      </template>
      <template v-else>
        {{ label }}
      </template>
    </label>

    <div
      class="toggle-switch"
      :class="{ 'toggle-switch--checked': modelValue }"
      :style="{
        width: width + 'px',
        height: height + 'px'
      }"
    >
      <div
        class="toggle-switch__circle"
        :style="{
          width: circleSize + 'px',
          height: circleSize + 'px',
          transform: 'translateX(' + (modelValue ? width - height : 0) + 'px)'
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  label: { type: String, default: '' },
  size: { type: Number, default: 24 },
  gap: { type: Number, default: 8 },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const width = computed(() => props.size * 1.6)
const height = computed(() => props.size)
const circleSize = computed(() => props.size - 4)
const gap = computed(() => props.gap)

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
.toggle-switch-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.toggle-switch-wrapper--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.toggle-switch-label {
  color: rgba(var(--v-theme-dark-blue-2));
  font-size: 14px;
}

.toggle-switch {
  position: relative;
  background-color: rgba(var(--v-theme-light-gray-2));
  border-radius: 999px;
  transition: background-color 0.2s;
}

.toggle-switch--checked {
  background-color: rgba(var(--v-theme-primary));
}

.toggle-switch__circle {
  position: absolute;
  top: 2px;
  left: 2px;
  background-color: rgba(var(--v-theme-background));
  border: 0.5px solid rgba(var(--v-theme-light-gray-2));
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0px 3px 1px 0px #0000000F, 0px 3px 8px 0px #00000026;
}
</style>
