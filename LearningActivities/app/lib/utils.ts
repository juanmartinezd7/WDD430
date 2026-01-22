// LearningActivities/app/lib/utils.ts
export function generateYAxis(revenue) {
  const values = (revenue || []).map((d) => d.revenue);
  const max = Math.max(...values, 0);
  
  // Round up to the nearest 1000 so bars look nice
  const topLabel = max === 0 ? 1000 : Math.ceil(max / 1000) * 1000;

  // 5 ticks: top -> bottom
  const yAxisLabels = [
    `$${topLabel}`,
    `$${Math.round(topLabel * 0.75)}`,
    `$${Math.round(topLabel * 0.5)}`,
    `$${Math.round(topLabel * 0.25)}`,
    "$0",
  ];

  
  return { yAxisLabels, topLabel };
}


export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
