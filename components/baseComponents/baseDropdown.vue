<template>
  <div
    :class="[
      'dropdown',
      `dropdown--${props.status}`,
      { 'dropdown--disabled': props.disabled },
    ]"
    ref="dropdownRef"
  >
    <label v-if="props.label" class="dropdown__label">{{ props.label }}</label>
    <button
      type="button"
      class="dropdown__toggle"
      :disabled="props.disabled"
      @click="toggleDropdown"
    >
      <span class="dropdown__selected">{{ displayLabel }}</span>
      <span class="dropdown__arrow">▾</span>
    </button>
    <ul v-if="isOpen" class="dropdown__list">
      <li
        v-for="(item, index) in filteredItems"
        :key="index"
        class="dropdown__item"
        @click="select(item)"
      >
        {{ typeof item === "object" ? item.label ?? item : item }}
      </li>
    </ul>
    <div
      v-if="props.message"
      :class="['dropdown__message', `dropdown__message--${props.status}`]"
    >
      {{ props.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  items: { type: Array, default: () => [] },
  selected: { type: [String, Number, Object], default: null },
  message: { type: String, default: "" },
  status: {
    type: String,
    default: "basic",
    validator: (val) => ["basic", "warn", "error"].includes(val),
  },
  filterSelected: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["update"]);

const isOpen = ref(false);
const dropdownRef = ref(null);

const displayLabel = computed(() => {
  if (props.selected == null) return "Select...";
  return typeof props.selected === "object"
    ? props.selected.label ?? JSON.stringify(props.selected)
    : props.selected;
});

const filteredItems = computed(() => {
  if (props.filterSelected && props.selected != null) {
    return props.items.filter((item) => item !== props.selected);
  }
  return props.items;
});

function toggleDropdown() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

function closeDropdown() {
  isOpen.value = false;
}

function select(item) {
  emit("update", item);
  closeDropdown();
}

function onClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
});
</script>

<style lang="scss" scoped>
$border-basic: #ccc;
$border-warn: #f0ad4e;
$border-error: #d9534f;
$msg-basic: #666;
$msg-warn: #f0ad4e;
$msg-error: #d9534f;
$bg: #fff;
$bg-hover: #f5f5f5;
$box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

.dropdown {
  position: relative;
  display: inline-block;
  font-family: inherit;

  &__label {
    display: block;
    margin-bottom: 4px;
    font-size: 0.875rem;
  }

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 200px;
    padding: 8px;
    border: 1px solid;
    background: $bg;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &--basic {
    .dropdown__toggle {
      border-color: $border-basic;
    }
  }

  &--warn {
    .dropdown__toggle {
      border-color: $border-warn;
    }
  }

  &--error {
    .dropdown__toggle {
      border-color: $border-error;
    }
  }

  &--disabled {
    .dropdown__toggle {
      background: #e6e6e6;
    }
  }

  &__arrow {
    margin-left: 8px;
  }

  &__list {
    position: absolute;
    z-index: 1000;
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100%;
    border: 1px solid $border-basic;
    background: $bg;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: $box-shadow;
  }

  &__item {
    padding: 8px;
    cursor: pointer;

    &:hover {
      background-color: $bg-hover;
    }
  }

  &__message {
    margin-top: 4px;
    font-size: 0.75rem;

    &--basic {
      color: $msg-basic;
    }

    &--warn {
      color: $msg-warn;
    }

    &--error {
      color: $msg-error;
    }
  }
}
</style>
