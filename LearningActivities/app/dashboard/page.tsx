// app/dashboard/page.js

import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { invoices, customers, revenue } from '@/app/lib/placeholder-data';

export default async function Page() {
  const latestInvoices = invoices.slice(0, 5).map((inv, idx) => {
    const customer = customers.find((c) => c.id === inv.customer_id);

    return {
      id: String(idx + 1),
      amount: `$${inv.amount}`,
      name: customer?.name ?? 'Unknown',
      email: customer?.email ?? '',
      image_url: customer?.image_url ?? '/customers/default.png',
    };
  });

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}
