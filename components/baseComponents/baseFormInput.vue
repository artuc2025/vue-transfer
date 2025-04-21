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

<style>
:root {
  --color-disabled-text: rgba(91, 91, 93, 1);
  --color-message-basic: rgba(8, 22, 61, 1);
  --color-message-warn: rgba(220, 117, 25, 1);
  --color-message-error: rgba(207, 73, 73, 1);

  --color-symbol-border: rgba(227, 227, 237, 1);

  --color-border-default: rgba(227, 227, 237, 0.8);
  --color-bg-default: rgba(249, 249, 250, 0.7);
  --color-text-primary: rgba(62, 73, 103, 1);
  --color-placeholder: #999;
}

.base-input-wrapper {
  display: flex;
  flex-direction: column;
}

.base-input-label {
  margin-bottom: 10px;
  padding-left: 14px;
  font-weight: 400;
  font-size: 14px;
  color: var(--color-text-primary);
}

.input-message-symbol-wrapper {
  position: relative;
  border: 1px solid var(--color-border-default);
  border-radius: 6px;
  background-color: var(--color-bg-default);
  backdrop-filter: blur(42.400001525878906px);
}

.base-input {
  width: 100%;
  height: 48px;
  padding-left: 16px;
  font-weight: 400;
  font-size: 16px;
  padding-left: 16px;
}

.base-input:focus,
.base-input:focus-visible {
  border: 1px solid var(--color-border-default);
  outline: none;
  box-shadow: unset;
}

.base-input::placeholder {
  color: var(--color-placeholder);
}

.base-input:disabled {
  color: var(--color-disabled-text);
  cursor: not-allowed;
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
  color: var(--color-text-primary);
  pointer-events: none;
  user-select: none;
  &::before {
    content: "";
    position: absolute;
    height: 30px;
    width: 1px;
    background-color: var(--color-symbol-border);
    top: 50%;
    right: calc(100% + 16px);
    transform: translateY(-50%);
  }
}

.base-input-message.basic {
  color: var(--color-message-basic);
}

.base-input-message.warn {
  color: var(--color-message-warn);
}
.base-input-message.error {
  color: var(--color-message-error);
}
</style>
