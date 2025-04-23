<template>
  <div>
    <!-- Mode Selection -->
    <div>
      <label>
        <input type="radio" value="cash" v-model="mode" /> Cash
      </label>
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
        maxlength="12"
      />
      <select v-model="fromCurrency">
        <option
          v-for="currency in fromCurrencyOptions"
          :key="currency.externalId"
          :value="currency.externalId"
        >
          {{ currency.externalId }}
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
        maxlength="12"
      />
      <select v-model="toCurrency">
        <option
          v-for="currency in toCurrencyOptions"
          :key="currency.externalId"
          :value="currency.externalId"
        >
          {{ currency.externalId }}
        </option>
      </select>
    </div>

    <!-- Swap Button -->
    <div>
      <button @click="swapCurrencies">Swap</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

/*
Plan:
1. State: fromAmount, toAmount, fromCurrency, toCurrency, mode ('cash'|'cashless'), lastEdited.
2. Computed: currency options lists excluding selected opposite currency.
3. Methods: onFocus to set lastEdited and clear initial '0'; getRate to fetch rate object.
4. Calculation: calculateTo and calculateFrom based on mode and currencies, handling AMD base or chain conversion.
5. Watchers: watch relevant state to trigger calculation.
6. Swap function to switch currencies and amounts.
*/

// Hardcoded rates data
const rawRates = [
  { externalId: 'USD', cashSell: 409, cashlessSell: 407.75, cashBuy: 402, cashlessBuy: 401.25 },
  { externalId: 'EUR', cashSell: 425, cashlessSell: 420.5, cashBuy: 410, cashlessBuy: 404.5 },
  { externalId: 'RUR', cashSell: 6.9, cashlessSell: 6.97, cashBuy: 6.4, cashlessBuy: 6.42 },
  { externalId: 'CHF', cashSell: 436, cashlessSell: 435.5, cashBuy: 415, cashlessBuy: 415.5 },
  { externalId: 'GBP', cashSell: 502, cashlessSell: 501.5, cashBuy: 477, cashlessBuy: 477.5 }
];

// Add AMD as base currency
const ratesMap = {
  AMD: { externalId: 'AMD', cashSell: 1, cashlessSell: 1, cashBuy: 1, cashlessBuy: 1 },
  ...Object.fromEntries(rawRates.map(r => [r.externalId, r]))
};

const allCurrencies = Object.keys(ratesMap);

// Reactive state
const mode = ref('cash'); // 'cash' or 'cashless'
const fromAmount = ref('0');
const toAmount = ref('0');
const fromCurrency = ref('AMD');
const toCurrency = ref('USD');
const lastEdited = ref('from');

// Computed currency options (exclude opposite)
const fromCurrencyOptions = computed(() =>
  allCurrencies.filter(c => c !== toCurrency.value).map(id => ratesMap[id])
);
const toCurrencyOptions = computed(() =>
  allCurrencies.filter(c => c !== fromCurrency.value).map(id => ratesMap[id])
);

// Helpers
function getRate(currency) {
  return ratesMap[currency];
}

function onFocus(field) {
  lastEdited.value = field;
  if (field === 'from' && fromAmount.value === '0') {
    fromAmount.value = '';
  }
  if (field === 'to' && toAmount.value === '0') {
    toAmount.value = '';
  }
}

// Calculation functions
function calculateTo() {
  const amount = Number(fromAmount.value);
  if (isNaN(amount)) {
    toAmount.value = '';
    return;
  }
  let result = 0;
  if (fromCurrency.value === 'AMD') {
    const rate = getRate(toCurrency.value)[mode.value === 'cash' ? 'cashSell' : 'cashlessSell'];
    result = amount / rate;
  } else if (toCurrency.value === 'AMD') {
    const rate = getRate(fromCurrency.value)[mode.value === 'cash' ? 'cashBuy' : 'cashlessBuy'];
    result = amount * rate;
  } else {
    const toAMD = amount * getRate(fromCurrency.value)[mode.value === 'cash' ? 'cashBuy' : 'cashlessBuy'];
    const rate = getRate(toCurrency.value)[mode.value === 'cash' ? 'cashSell' : 'cashlessSell'];
    result = toAMD / rate;
  }
  toAmount.value = result.toFixed(2);
}

function calculateFrom() {
  const amount = Number(toAmount.value);
  if (isNaN(amount)) {
    fromAmount.value = '';
    return;
  }
  let result = 0;
  if (toCurrency.value === 'AMD') {
    const rate = getRate(fromCurrency.value)[mode.value === 'cash' ? 'cashBuy' : 'cashlessBuy'];
    result = amount / rate;
  } else if (fromCurrency.value === 'AMD') {
    const rate = getRate(toCurrency.value)[mode.value === 'cash' ? 'cashSell' : 'cashlessSell'];
    result = amount * rate;
  } else {
    const toAMD = amount * getRate(toCurrency.value)[mode.value === 'cash' ? 'cashBuy' : 'cashlessBuy'];
    result = toAMD / getRate(fromCurrency.value)[mode.value === 'cash' ? 'cashSell' : 'cashlessSell'];
  }
  fromAmount.value = result.toFixed(2);
}

// Watch for changes
watch(
  [fromAmount, fromCurrency, toCurrency, mode, lastEdited],
  () => { if (lastEdited.value === 'from') calculateTo(); }
);

watch(
  [toAmount, fromCurrency, toCurrency, mode, lastEdited],
  () => { if (lastEdited.value === 'to') calculateFrom(); }
);

// Swap currencies and amounts
function swapCurrencies() {
  const prevFrom = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = prevFrom;
  const prevAmount = fromAmount.value;
  fromAmount.value = toAmount.value;
  toAmount.value = prevAmount;
  lastEdited.value = 'from';
  calculateTo();
}
</script>
