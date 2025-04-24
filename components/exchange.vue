<template>
  <div>
    <!-- Mode Selection -->
    <div>
      <label> <input type="radio" value="cash" v-model="mode" /> Cash </label>
      <label>
        <input type="radio" value="cashless" v-model="mode" /> Non-Cash
      </label>
    </div>

    <!-- From Field -->
    <div>
      <label>Ես ունեմ</label>
      <input
        type="text"
        v-model="fromAmount"
        @focus="onFocus('from')"
        @blur="onBlur"
        maxlength="12"
      />
      <select v-model="fromCurrency">
        <option v-for="cur in fromCurrencyOptions" :key="cur" :value="cur">
          {{ cur }}
        </option>
      </select>
    </div>

    <!-- To Field -->
    <div>
      <label>Ինձ պետք է</label>
      <input
        type="text"
        v-model="toAmount"
        @focus="onFocus('to')"
        @blur="onBlur"
        maxlength="12"
      />
      <select v-model="toCurrency">
        <option v-for="cur in toCurrencyOptions" :key="cur" :value="cur">
          {{ cur }}
        </option>
      </select>
    </div>

    <!-- Swap Button -->
    <button @click="swapCurrencies">Swap</button>
  </div>
</template>

<script setup>
import { useExchangeCalculator } from "@/composables/useExchangeCalculator";
import rawRates from "@/data/exchangeRates";

const {
  mode,
  fromAmount,
  toAmount,
  fromCurrency,
  toCurrency,
  fromCurrencyOptions,
  toCurrencyOptions,
  onFocus,
  onBlur,
  swapCurrencies,
} = useExchangeCalculator(rawRates, {
  formatNumber: (num) =>
    num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  parseNumber: (str) => Number(String(str).replace(/,/g, "")),
});
</script>
