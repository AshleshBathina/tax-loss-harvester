/**
 * Format a number as Indian Rupees currency.
 */
export const formatCurrency = (value) => {
  const absVal = Math.abs(value);
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absVal);
  return value < 0 ? `- ₹${formatted}` : `₹${formatted}`;
};

/**
 * Format a number with up to `decimals` significant decimal places,
 * trimming trailing zeros.
 */
export const formatNumber = (value, decimals = 8) => {
  if (Math.abs(value) < 1e-10) return "0";
  return parseFloat(value.toPrecision(6)).toString();
};

/**
 * Format gain with sign and color class.
 * Returns { text, isPositive }
 */
export const formatGain = (gain) => {
  const absVal = Math.abs(gain);
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absVal);
  const isPositive = gain >= 0;
  return {
    text: `${isPositive ? "+" : "-"}₹${formatted}`,
    isPositive,
  };
};
