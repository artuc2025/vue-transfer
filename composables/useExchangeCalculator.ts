// composables/useExchangeCalculator.ts
import { ref, computed, watch } from "vue";
import type { Ref } from "vue";

/**
 * Mode of exchange operation
 */
export type ExchangeMode = "cash" | "cashless";

/**
 * Exchange rate entry
 */
export interface Rate {
  externalId: string;
  cashSell: number;
  cashlessSell: number;
  cashBuy: number;
  cashlessBuy: number;
}

/**
 * Options for number formatting and parsing
 */
export interface UseExchangeCalculatorOptions {
  formatNumber?: (value: number) => string;
  parseNumber?: (value: string) => number;
}

/**
 * Core composable to drive exchange calculations
 * @param rawRates array of exchange rates
 * @param options formatting/parsing overrides
 */
export function useExchangeCalculator(
  rawRates: Rate[],
  options: UseExchangeCalculatorOptions = {}
) {
  const {
    formatNumber = (n: number) => n.toString(),
    parseNumber = (s: string) => Number(s.replace(/,/g, "")),
  } = options;

  // Map rates by currency code, include AMD as base
  const ratesMap: Record<string, Rate> = {
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
          cashSell: r.cashSell,
          cashlessSell: r.cashlessSell,
          cashBuy: r.cashBuy,
          cashlessBuy: r.cashlessBuy,
        },
      ])
    ),
  };
  const allCurrencies = Object.keys(ratesMap);

  // Reactive state
  const mode: Ref<ExchangeMode> = ref("cash");
  const fromCurrency: Ref<string> = ref("AMD");
  const toCurrency: Ref<string> = ref("USD");
  const lastEdited: Ref<"from" | "to"> = ref("from");
  const editingField: Ref<"from" | "to" | null> = ref(null);
  const rawFrom: Ref<number> = ref(0);
  const rawTo: Ref<number> = ref(0);
  const inputFrom: Ref<string> = ref("");
  const inputTo: Ref<string> = ref("");

  // Dropdown lists (exclude selected counterpart)
  const fromCurrencyOptions = computed<string[]>(() =>
    allCurrencies.filter((c) => c !== toCurrency.value)
  );
  const toCurrencyOptions = computed<string[]>(() =>
    allCurrencies.filter((c) => c !== fromCurrency.value)
  );

  // Fetch rate object
  function getRate(currency: string): Rate {
    return ratesMap[currency];
  }

  // Perform calculations, rounding to two decimals
  function calculateRawTo(): void {
    const amt = rawFrom.value;
    let result = 0;
    if (fromCurrency.value === "AMD") {
      result =
        amt /
        getRate(toCurrency.value)[
          mode.value === "cash" ? "cashSell" : "cashlessSell"
        ];
    } else if (toCurrency.value === "AMD") {
      result =
        amt *
        getRate(fromCurrency.value)[
          mode.value === "cash" ? "cashBuy" : "cashlessBuy"
        ];
    } else {
      const viaAMD =
        amt *
        getRate(fromCurrency.value)[
          mode.value === "cash" ? "cashBuy" : "cashlessBuy"
        ];
      result =
        viaAMD /
        getRate(toCurrency.value)[
          mode.value === "cash" ? "cashSell" : "cashlessSell"
        ];
    }
    rawTo.value = parseFloat(result.toFixed(2));
  }
  function calculateRawFrom(): void {
    const amt = rawTo.value;
    let result = 0;
    if (toCurrency.value === "AMD") {
      result =
        amt /
        getRate(fromCurrency.value)[
          mode.value === "cash" ? "cashBuy" : "cashlessBuy"
        ];
    } else if (fromCurrency.value === "AMD") {
      result =
        amt *
        getRate(toCurrency.value)[
          mode.value === "cash" ? "cashSell" : "cashlessSell"
        ];
    } else {
      const viaAMD =
        amt *
        getRate(toCurrency.value)[
          mode.value === "cash" ? "cashBuy" : "cashlessBuy"
        ];
      result =
        viaAMD /
        getRate(fromCurrency.value)[
          mode.value === "cash" ? "cashSell" : "cashlessSell"
        ];
    }
    rawFrom.value = parseFloat(result.toFixed(2));
  }

  // Computed props for UI binding
  const fromAmount = computed<string>({
    get(): string {
      if (editingField.value === "from") {
        return inputFrom.value;
      }
      return formatNumber(rawFrom.value);
    },
    set(val: string): void {
      if (editingField.value !== "from") return;
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
  const toAmount = computed<string>({
    get(): string {
      if (editingField.value === "to") {
        return inputTo.value;
      }
      return formatNumber(rawTo.value);
    },
    set(val: string): void {
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

  // Handlers for focus/blur behavior
  function onFocus(field: "from" | "to"): void {
    editingField.value = field;
    lastEdited.value = field;
    if (field === "from") {
      inputFrom.value =
        rawFrom.value === 0
          ? ""
          : isInt(rawFrom.value)
          ? rawFrom.value.toString()
          : rawFrom.value.toFixed(2);
    } else {
      inputTo.value =
        rawTo.value === 0
          ? ""
          : isInt(rawTo.value)
          ? rawTo.value.toString()
          : rawTo.value.toFixed(2);
    }
  }
  function onBlur(): void {
    editingField.value = null;
    inputFrom.value = "";
    inputTo.value = "";
  }

  // Watch for currency or mode changes
  watch([fromCurrency, toCurrency, mode], (): void => {
    if (lastEdited.value === "from") calculateRawTo();
    else calculateRawFrom();
  });

  // Swap currencies and recalculations
  function swapCurrencies(): void {
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
  } as const;
}

function isInt(n: number): boolean {
  return n % 1 === 0;
}
