export function useExchangeCalculator(
  rawRates,
  {
    formatNumber = (n) => n.toString(),
    parseNumber = (s) => Number(String(s).replace(/,/g, "")),
  } = {}
) {
  // Build lookup map (include AMD base)
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
  const editingField = ref(null); // track focus for formatting
  const rawFrom = ref(0);
  const rawTo = ref(0);

  // Dropdown options
  const fromCurrencyOptions = computed(() =>
    allCurrencies.filter((c) => c !== toCurrency.value)
  );
  const toCurrencyOptions = computed(() =>
    allCurrencies.filter((c) => c !== fromCurrency.value)
  );

  // Helper to get rate object
  const getRate = (cur) => ratesMap[cur];

  // Core calculation on raw numbers
  function calculateRawTo() {
    const amt = rawFrom.value;
    let result = 0;
    if (fromCurrency.value === "AMD") {
      const rate = getRate(toCurrency.value)[
        mode.value === "cash" ? "cashSell" : "cashlessSell"
      ];
      result = amt / rate;
    } else if (toCurrency.value === "AMD") {
      const rate = getRate(fromCurrency.value)[
        mode.value === "cash" ? "cashBuy" : "cashlessBuy"
      ];
      result = amt * rate;
    } else {
      const viaAMD =
        amt *
        getRate(fromCurrency.value)[
          mode.value === "cash" ? "cashBuy" : "cashlessBuy"
        ];
      const rate = getRate(toCurrency.value)[
        mode.value === "cash" ? "cashSell" : "cashlessSell"
      ];
      result = viaAMD / rate;
    }
    rawTo.value = result;
  }

  function calculateRawFrom() {
    const amt = rawTo.value;
    let result = 0;
    if (toCurrency.value === "AMD") {
      const rate = getRate(fromCurrency.value)[
        mode.value === "cash" ? "cashBuy" : "cashlessBuy"
      ];
      result = amt / rate;
    } else if (fromCurrency.value === "AMD") {
      const rate = getRate(toCurrency.value)[
        mode.value === "cash" ? "cashSell" : "cashlessSell"
      ];
      result = amt * rate;
    } else {
      const viaAMD =
        amt *
        getRate(toCurrency.value)[
          mode.value === "cash" ? "cashBuy" : "cashlessBuy"
        ];
      const rate = getRate(fromCurrency.value)[
        mode.value === "cash" ? "cashSell" : "cashlessSell"
      ];
      result = viaAMD / rate;
    }
    rawFrom.value = result;
  }

  // Computed with formatting and parsing
  const fromAmount = computed({
    get() {
      // if editing, show unformatted
      if (editingField.value === "from") {
        return rawFrom.value === 0 ? "" : String(rawFrom.value);
      }
      return formatNumber(rawFrom.value);
    },
    set(val) {
      const parsed = parseNumber(val);
      if (!isNaN(parsed)) {
        rawFrom.value = parsed;
        lastEdited.value = "from";
        calculateRawTo();
      }
    },
  });

  const toAmount = computed({
    get() {
      if (editingField.value === "to") {
        return rawTo.value === 0 ? "" : String(rawTo.value);
      }
      return formatNumber(rawTo.value);
    },
    set(val) {
      const parsed = parseNumber(val);
      if (!isNaN(parsed)) {
        rawTo.value = parsed;
        lastEdited.value = "to";
        calculateRawFrom();
      }
    },
  });

  // Focus/blur handlers
  function onFocus(field) {
    editingField.value = field;
    lastEdited.value = field;
  }
  function onBlur() {
    editingField.value = null;
  }

  // Recalculate on currency or mode change
  watch([fromCurrency, toCurrency, mode], () => {
    if (lastEdited.value === "from") calculateRawTo();
    else calculateRawFrom();
  });

  // Swap functionality
  function swapCurrencies() {
    const prevCur = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = prevCur;

    const prevRaw = rawFrom.value;
    rawFrom.value = rawTo.value;
    rawTo.value = prevRaw;

    editingField.value = null;
    lastEdited.value = "from";
    calculateRawTo();
  }

  return {
    // state
    mode,
    fromCurrency,
    toCurrency,
    fromCurrencyOptions,
    toCurrencyOptions,
    // formatted amounts
    fromAmount,
    toAmount,
    // handlers
    onFocus,
    onBlur,
    swapCurrencies,
  };
}
