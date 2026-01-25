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

export function formatDateToLocal(
  dateStr: string,
  locale: string = 'en-US',
) {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function generatePagination(currentPage: number, totalPages: number) {
  // If there are 7 or fewer pages, show all
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Always show first, last, current, and neighbors
  const pages: (number | '...')[] = [];

  const firstPage = 1;
  const lastPage = totalPages;

  pages.push(firstPage);

  // Left dots
  if (currentPage > 3) {
    pages.push('...');
  }

  // Middle numbers
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Right dots
  if (currentPage < totalPages - 2) {
    pages.push('...');
  }

  pages.push(lastPage);

  return pages;
}
