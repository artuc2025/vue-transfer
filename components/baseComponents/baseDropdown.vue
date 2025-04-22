<template>
  <div
    :class="[
      'dropdown',
      { 'dropdown--disabled': props.disabled },
      { 'dropdown--open': isOpen },
    ]"
    ref="dropdownRef"
  >
    <label v-if="props.label" class="dropdown__label">{{ props.label }}</label>
    <div class="dropdown__header-body-wrapper">
        <div class="dropdown__header">

          <button
          type="button"
          class="dropdown__toggle"
          :disabled="props.disabled"
          @click="toggleDropdown"
        >
          <span class="dropdown__selected">{{ displayLabel }}</span>
          <div class="dropdown__arrow">
            <svgo-chevron-down />
          </div>
        </button>
        </div>
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
    </div>
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
.dropdown {
  &--open {
    .dropdown__arrow {
      transform: rotate(180deg);
    }
  }

  &__label {
    margin-bottom: 10px;
    padding-left: 14px;
    font-weight: 400;
    font-size: 14px;
    color: rgba(var(--v-theme-dark-blue-8));
  }
  
  .dropdown__header-body-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: 200px;
    height: 48px;
    padding: 0 16px;
    border: 1px solid rgba(var(--v-theme-light-gray-2), 0.8);
    border-radius: 6px;
    background-color: rgba(var(--v-theme-light-gray-1), 0.7);
    backdrop-filter: blur(42.400001525878906px);
    cursor: pointer;
  }

  &__selected {
    font-weight: 400;
    color: rgba(var(--v-theme-dark-blue-8));
  }

  &__arrow {
    color: rgba(var(--v-theme-dark-blue-2));
    font-size: 10px;
    transition: transform 0.3s ease;
  }

  &__list {
    position: absolute;
    top: calc(100% + 10px);
    z-index: 1000;
    width: 100%;
    background-color: rgba(var(--v-theme-background));
    border: 1px solid rgba(var(--v-theme-light-gray-2), 0.8);
    border-radius: 6px;
    max-height: 200px;
    margin: 0;
    list-style: none;
    padding: 16px;
    overflow-x: hidden;
    overflow-y: auto;
    backdrop-filter: blur(42.400001525878906px)
  }
  
  &__item {
    color: rgba(var(--v-theme-light-gray-26));
    font-size: 14px;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background-color: rgba(var(--v-theme-light-blue-9));
    }
  }

  &__message {
    margin-top: 4px;
    font-size: 12px;
    text-align: right;
    &--basic {
      color: rgba(var(--v-theme-dark-blue-2));
    }

    &--warn {
      color: rgba(var(--v-theme-warning));;
    }

    &--error {
      color: rgba(var(--v-theme-error));;
    }
  }
}
</style>
