<template>
  <div style="width: 600px; padding: 100px">
    <BaseSelect
      label="Select a state"
      :items="[
        'California',
        'Colorado',
        'Florida',
        'Georgia',
        'Texas',
        'Wyoming',
      ]"
      v-model="selectedItems"
      placeholder="Select a state"
    />
    <DateInput v-model="date" />
    <div>{{ selectedItems }}</div>
    <div>{{ date }}</div>
  </div>
</template>
<script setup lang="ts">
import BaseSelect from "~/components/select.vue";
import DateInput from "~/components/dateInput.vue";
const selectedItems = ref<string[]>(["California"]);
const date = ref<string>("2023-10-01");
</script>
