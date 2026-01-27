// LearningActivities/app/dashboard/customers/page.tsx

import { Metadata } from 'next';
import { fetchCustomersList } from '@/app/lib/data';
import CustomersList from '@/app/ui/customers/customers-list';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page() {
  const customers = await fetchCustomersList();

  return (
    <main className="w-full">
      <h1 className="mb-4 text-xl font-semibold">Customers</h1>
      <CustomersList customers={customers} />
    </main>
  );
}
