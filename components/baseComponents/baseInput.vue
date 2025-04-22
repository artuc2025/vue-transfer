<template>
  <div class="base-input-wrapper">
    <label v-if="label" class="base-input-label">{{ label }}</label>
    <div class="input-message-symbol-wrapper">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="['base-input', status]"
        :style="{ paddingRight: symbol ? '50px' : '16px' }"
      />
      <span v-if="symbol" class="input-symbol">{{ symbol }}</span>
      <span v-if="message" :class="['base-input-message', status]">
        {{ message }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  status: { type: String, default: "basic" }, // 'basic' | 'warn' | 'error'
  message: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  symbol: { type: String, default: "" },
});

defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
}

.base-input-label {
  margin-bottom: 10px;
  padding-left: 14px;
  font-weight: 400;
  font-size: 14px;
  color: rgba(var(--v-theme-dark-blue-8));
}

.input-message-symbol-wrapper {
  position: relative;
  border: 1px solid rgba(var(--v-theme-light-gray-2), 0.8);
  border-radius: 6px;
  background-color: rgba(var(--v-theme-light-gray-1), 0.7);
  backdrop-filter: blur(42.400001525878906px);
}

.base-input {
  width: 100%;
  height: 48px;
  padding-left: 16px;
  font-weight: 400;
  font-size: 16px;
  padding-left: 16px;
  outline: none;
  box-shadow: unset;
  color: rgba(var(--v-theme-dark-blue-8));
}

.base-input::placeholder {
  color: rgba(var(--v-theme-dark-blue-8), 0.3);
}

.base-input-message {
  font-size: 12px;
  position: absolute;
  top: calc(100% + 4px);
  right: 14px;
}

.input-symbol {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  font-size: 16px;
  color: rgba(var(--v-theme-dark-blue-8));
  pointer-events: none;
  user-select: none;
  &::before {
    content: "";
    position: absolute;
    height: 30px;
    width: 1px;
    background-color: rgba(var(--v-theme-light-gray-2));
    top: 50%;
    right: calc(100% + 16px);
    transform: translateY(-50%);
  }
}

.base-input-message.basic {
  color: rgba(var(--v-theme-dark-blue-2));
}

.base-input-message.warn {
  color: rgba(var(--v-theme-warning));
}
.base-input-message.error {
  color: rgba(var(--v-theme-error));
}
</style>
