<template>
  <div class="p-4 space-y-6">
    <h1 class="text-2xl font-semibold">Transfer Between My Sources</h1>

    <div v-if="loading" class="italic">Loading…</div>
    <div v-else class="space-y-4">
      <!-- From -->
      <div>
        <label class="block mb-1 font-medium">From:</label>
        <select v-model="fromItem" class="w-full border rounded px-2 py-1">
          <option :value="null" disabled>— select source —</option>
          <option v-for="it in allItems" :key="it.key" :value="it">
            {{ it.name }} ({{ it.type }}) — {{ it.amount.toFixed(2) }}
          </option>
        </select>
      </div>

      <!-- To -->
      <div>
        <label class="block mb-1 font-medium">To:</label>
        <select
          v-model="toItem"
          class="w-full border rounded px-2 py-1"
          :disabled="!fromItem"
        >
          <option :value="null" disabled>— select destination —</option>
          <option v-for="it in toItems" :key="it.key" :value="it">
            {{ it.name }} ({{ it.type }}) — {{ it.amount.toFixed(2) }}
          </option>
        </select>
      </div>

      <!-- Amount + Transfer -->
      <div class="flex items-center space-x-2">
        <input
          v-model.number="amount"
          type="number"
          min="0.01"
          placeholder="Amount"
          class="border px-2 py-1 rounded w-32"
        />
        <button
          @click="doTransfer"
          :disabled="!canTransfer || transferring"
          class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {{ transferring ? "Transferring…" : "Transfer" }}
        </button>
      </div>

      <!-- Message -->
      <p v-if="message" :class="messageClass">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTransferStore } from "@/stores/useTransferStore";
import type { SourceItem } from "@/stores/useTransferStore";

const store = useTransferStore();
const loading = ref(true);
const transferring = ref(false);
const message = ref("");
const fromItem = ref<SourceItem | null>(null);
const toItem = ref<SourceItem | null>(null);
const amount = ref<number | null>(null);

// all sources
const allItems = computed(() => store.mergedItems);

// to-list excludes the chosen from
const toItems = computed(() =>
  fromItem.value
    ? allItems.value.filter((i) => i.key !== fromItem.value!.key)
    : allItems.value
);

const canTransfer = computed(
  () =>
    !!fromItem.value &&
    !!toItem.value &&
    !!amount.value &&
    amount.value > 0 &&
    amount.value <= fromItem.value!.amount
);

const messageClass = computed(() =>
  message.value.includes("successful") ? "text-green-600" : "text-red-600"
);

async function doTransfer() {
  if (!canTransfer.value) return;
  transferring.value = true;
  message.value = "";
  try {
    await store.transferFunds(fromItem.value!, toItem.value!, amount.value!);
    message.value = "Transfer successful 🎉";
    // reset selections if you like:
    fromItem.value = null;
    toItem.value = null;
    amount.value = null;
  } catch (err) {
    console.error(err);
    message.value = "Transfer failed. Please try again.";
  } finally {
    transferring.value = false;
  }
}

onMounted(async () => {
  await store.fetchAccountsAndCards();
  loading.value = false;
});
</script>

<style scoped>
/* page‑specific styles here */
</style>
