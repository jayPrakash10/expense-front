export const CURRENCIES = {
  USD: {
    symbol: "$",
    name: "US Dollar",
    code: "USD",
    symbolNative: "$",
    decimalDigits: 2,
    rounding: 0,
    codeNumeric: "840",
  },
  EUR: {
    symbol: "€",
    name: "Euro",
    code: "EUR",
    symbolNative: "€",
    decimalDigits: 2,
    rounding: 0,
    codeNumeric: "978",
  },
  GBP: {
    symbol: "£",
    name: "British Pound",
    code: "GBP",
    symbolNative: "£",
    decimalDigits: 2,
    rounding: 0,
    codeNumeric: "826",
  },
  INR: {
    symbol: "₹",
    name: "Indian Rupee",
    code: "INR",
    symbolNative: "₹",
    decimalDigits: 2,
    rounding: 0,
    codeNumeric: "356",
  },
  AUD: {
    symbol: "A$",
    name: "Australian Dollar",
    code: "AUD",
    symbolNative: "$",
    decimalDigits: 2,
    rounding: 0,
    codeNumeric: "036",
  },
} as const;

export const CURRENCY_CODES = Object.keys(
  CURRENCIES
) as (keyof typeof CURRENCIES)[];

export const CURRENCY_OPTIONS = CURRENCY_CODES.map((code) => ({
  value: code,
  label: CURRENCIES[code].name,
  symbol: CURRENCIES[code].symbol,
}));
