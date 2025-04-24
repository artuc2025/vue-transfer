// composables/useExchangeCalculator.js
import { ref, computed, watch } from "vue";

/**
 * Reusable exchange calculator logic with formatting, validation, and focus behavior.
 * @param {Array} rawRates - rate objects: { externalId, cashSell, cashlessSell, cashBuy, cashlessBuy }
 * @param {Object} options
 * @param {Function} options.formatNumber - formats numbers for display
 * @param {Function} options.parseNumber  - parses formatted strings to numbers
 */
export function useExchangeCalculator(
  rawRates,
  {
    formatNumber = (n) => n.toString(),
    parseNumber = (s) => Number(String(s).replace(/,/g, "")),
  } = {}
) {
  // Build lookup map (include AMD as base)
  const ratesMap = {
    AMD: {
      externalId: "AMD",
      cashSell: 1,
      cashlessSell: 1,
      cashBuy: 1,
      cashlessBuy: 1,
    },
    ...Object.fromEntries(
      rawRates.map((r) => [
        r.externalId,
        {
          externalId: r.externalId,
          cashSell: Number(r.cashSell),
          cashlessSell: Number(r.cashlessSell),
          cashBuy: Number(r.cashBuy),
          cashlessBuy: Number(r.cashlessBuy),
        },
      ])
    ),
  };
  const allCurrencies = Object.keys(ratesMap);

  // Reactive state
  const mode = ref("cash"); // 'cash' or 'cashless'
  const fromCurrency = ref("AMD");
  const toCurrency = ref("USD");
  const lastEdited = ref("from"); // 'from' | 'to'
  const editingField = ref(null); // which field is focused

  // Raw numeric values
  const rawFrom = ref(0);
  const rawTo = ref(0);

  // Input buffers for editing
  const inputFrom = ref("");
  const inputTo = ref("");

  // Dropdown options
  const fromCurrencyOptions = computed(() =>
    allCurrencies.filter((c) => c !== toCurrency.value)
  );
  const toCurrencyOptions = computed(() =>
    allCurrencies.filter((c) => c !== fromCurrency.value)
  );

  // Rate lookup
  const getRate = (cur) => ratesMap[cur];

  // Calculation: always round to 2 decimals
  function calculateRawTo() {
    const amt = rawFrom.value;
    let res = 0;
    if (fromCurrency.value === "AMD") {
      res =
        amt /
        getRate(toCurrency.value)[
          mode.value === "cash" ? "cashSell" : "cashlessSell"
        ];
    } else if (toCurrency.value === "AMD") {
      res =
        amt *
        getRate(fromCurrency.value)[
          mode.value === "cash" ? "cashBuy" : "cashlessBuy"
        ];
    } else {
      const via =
        amt *
        getRate(fromCurrency.value)[
          mode.value === "cash" ? "cashBuy" : "cashlessBuy"
        ];
      res =
        via /
        getRate(toCurrency.value)[
          mode.value === "cash" ? "cashSell" : "cashlessSell"
        ];
    }
    rawTo.value = Number(res.toFixed(2));
  }
  function calculateRawFrom() {
    const amt = rawTo.value;
    let res = 0;
    if (toCurrency.value === "AMD") {
      res =
        amt /
        getRate(fromCurrency.value)[
          mode.value === "cash" ? "cashBuy" : "cashlessBuy"
        ];
    } else if (fromCurrency.value === "AMD") {
      res =
        amt *
        getRate(toCurrency.value)[
          mode.value === "cash" ? "cashSell" : "cashlessSell"
        ];
    } else {
      const via =
        amt *
        getRate(toCurrency.value)[
          mode.value === "cash" ? "cashBuy" : "cashlessBuy"
        ];
      res =
        via /
        getRate(fromCurrency.value)[
          mode.value === "cash" ? "cashSell" : "cashlessSell"
        ];
    }
    rawFrom.value = Number(res.toFixed(2));
  }

  // Computed values with formatting & validation
  const fromAmount = computed({
    get() {
      if (editingField.value === "from") {
        return inputFrom.value;
      }
      return formatNumber(rawFrom.value);
    },
    set(val) {
      if (editingField.value !== "from") return;
      // validation: integer max12, decimal max2
      const [intPart, decPart] = val.split(".");
      if (intPart.length > 12) return;
      if (decPart && decPart.length > 2) return;
      inputFrom.value = val;
      const num = parseNumber(val);
      if (!isNaN(num)) {
        rawFrom.value = num;
        lastEdited.value = "from";
        calculateRawTo();
      }
    },
  });

  const toAmount = computed({
    get() {
      if (editingField.value === "to") {
        return inputTo.value;
      }
      return formatNumber(rawTo.value);
    },
    set(val) {
      if (editingField.value !== "to") return;
      const [intPart, decPart] = val.split(".");
      if (intPart.length > 12) return;
      if (decPart && decPart.length > 2) return;
      inputTo.value = val;
      const num = parseNumber(val);
      if (!isNaN(num)) {
        rawTo.value = num;
        lastEdited.value = "to";
        calculateRawFrom();
      }
    },
  });

  // Focus/blur handlers
  function onFocus(field) {
    editingField.value = field;
    lastEdited.value = field;
    if (field === "from") {
      // clear if zero, else show two decimals
      inputFrom.value = rawFrom.value === 0 ? "" : rawFrom.value.toFixed(2);
    } else {
      inputTo.value = rawTo.value === 0 ? "" : rawTo.value.toFixed(2);
    }
  }

  function onBlur() {
    editingField.value = null;
    inputFrom.value = "";
    inputTo.value = "";
  }

  // Recalculate on currency/mode change
  watch([fromCurrency, toCurrency, mode], () => {
    if (lastEdited.value === "from") calculateRawTo();
    else calculateRawFrom();
  });

  // Swap currencies & values
  function swapCurrencies() {
    [fromCurrency.value, toCurrency.value] = [
      toCurrency.value,
      fromCurrency.value,
    ];
    [rawFrom.value, rawTo.value] = [rawTo.value, rawFrom.value];
    editingField.value = null;
    lastEdited.value = "from";
    calculateRawTo();
  }

  return {
    mode,
    fromCurrency,
    toCurrency,
    fromCurrencyOptions,
    toCurrencyOptions,
    fromAmount,
    toAmount,
    onFocus,
    onBlur,
    swapCurrencies,
  };
}
