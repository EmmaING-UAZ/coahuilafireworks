// js/utils.js

/**
 * Formats a number as a currency string (e.g., $1,234.56).
 * @param {number} amount The number to format.
 * @returns {string} The formatted currency string.
 */
function formatCurrency(amount) {
  // Ensure the amount is a number and handle potential floating point inaccuracies.
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) {
    console.error("Invalid amount passed to formatCurrency:", amount);
    return "$0.00";
  }
  return `$${numericAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}
