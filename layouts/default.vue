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
      :selected="['California']"
      placeholder="Select a state"
    />
  </div>
</template>
<script setup lang="ts">
import BaseSelect from "~/components/select.vue";
</script>
