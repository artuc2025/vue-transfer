<template>
  <div class="base-select-wrapper">
    <span v-if="label">{{ props.label }}</span>
    <v-select
      :items="props.items"
      multiple
      variant="outlined"
      v-model="selectedItems"
      :placeholder="props.placeholder"
      :menu-icon="triangleIcon"
      :menu-props="{ class: 'base-select-menu__content' }"
      class="base-select"
    ></v-select>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: string[];
  label: string;
  selected: string[];
  placeholder: string;
}>();

const selectedItems = ref<string[]>(props.selected || []);
const triangleIcon = () =>
  h(
    "svg",
    {
      width: "12",
      height: "7",
      viewBox: "0 0 12 7",
      fill: "none",
    },
    [
      h("path", {
        d: "M11 1.33398L6.58926 5.74473C6.26382 6.07017 5.73618 6.07017 5.41074 5.74473L1 1.33398",
        stroke: "#08163D",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
      }),
    ]
  );
</script>

<style lang="scss">
.base-select {
  .v-field {
    border-radius: 6px;
  }
  .v-field__input {
    padding: 10px 14px;
    min-height: 44px;
    color: rgba(62, 73, 103, 1);
    opacity: 1;
    input {
      top: 50%;
      transform: translateY(-50%);
      left: 14px;
      &::placeholder {
        color: rgba(62, 73, 103, 1);
        opacity: 1;
      }
    }
  }
  .v-field__outline {
    --v-field-border-opacity: 1;
    .v-field__outline__start,
    .v-field__outline__end {
      border-color: rgba(234, 234, 241, 1);
    }
  }
}
.base-select-menu__content {
  &.v-menu {
    .v-overlay__content {
      border-radius: 6px;
    }
    .v-list {
      padding: 0;
      .v-list-item {
        color: red;
        transition: none;
        &.v-list-item--active {
          background-color: blue;
          color: gold;
        }
        &.v-list-item--selected {
          background-color: green;
          color: purple;
        }
        &:hover {
          &:not(.v-list-item--active) {
            background-color: lightblue;
            color: darkblue;
          }
        }
        .v-ripple__container {
          display: none;
        }
      }
    }
  }
}
</style>
