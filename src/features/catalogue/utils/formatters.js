const inr = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** 48482.38 → "₹48,482.38"; negatives get a real minus sign: "−₹23,632.24" */
export function formatRupees(value) {
  return `${value < 0 ? '−' : ''}₹${inr.format(Math.abs(value))}`;
}

/** 1 → "01" */
export function sheetNumber(n) {
  return String(n).padStart(2, '0');
}
