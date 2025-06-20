export const PAYMENT_MODES = {
  cash: {
    value: "cash",
    label: "Cash",
  },
  upi: {
    value: "upi",
    label: "UPI",
  },
  card: {
    value: "card",
    label: "Card",
  },
  net_banking: {
    value: "net_banking",
    label: "Net Banking",
  },
  others: {
    value: "others",
    label: "Others",
  },
} as const;

export type PaymentMode = keyof typeof PAYMENT_MODES;

export const PAYMENT_MODE_OPTIONS = Object.entries(PAYMENT_MODES).map(
  ([_, { label, value }]) => ({
    value,
    label,
  })
);
