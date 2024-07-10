export function formatCurrency(priceCents) {
 return (Math.round(priceCents)/100).toFixed(2);
}

// 6.005.toFixed(2) => '6.00' -- incorrect
// 7.005.toFixed(2) => '7.00' -- incorrect
// 8.005.toFixed(2) => '8.01' -- correct
// To resolve this issue, use Math.round() to round the priceCents first

export default formatCurrency;