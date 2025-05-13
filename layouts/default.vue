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
      :selected="selectedItems"
      placeholder="Select a state"
    />
    <DateInput v-model="date" />
    <BaseRange v-model="range" :min="0" :max="100" :step="1" />
    <div>{{ range }}</div>
    <div>{{ selectedItems }}</div>
    <div>{{ date }}</div>
    <div>{{ formatted }}</div>
    <div space-x-4>
      <label class="radio">
        <input v-model="lang" value="hy-am" type="radio" />
        <span>Armenia</span>
      </label>
      <label class="radio">
        <input v-model="lang" value="ru" type="radio" />
        <span>Russian</span>
      </label>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseSelect from "~/components/select.vue";
import DateInput from "~/components/dateInput.vue";
import BaseRange from "~/components/baseRange.vue";
import dayjs from "dayjs";
const selectedItems = ref<string[]>(["California"]);
const date = ref<string>("2023-10-01");
const range = ref<number[]>([0, 100]);
const lang = ref<string>("ru");

const formatted = computed(() => {
  return dayjs("2019-01-25").locale(lang.value).format("DD MMMM YYYY");
});
</script>
