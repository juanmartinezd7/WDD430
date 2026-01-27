//LearningActivities/app/ui/customers/customers-list.tsx

import Image from 'next/image';
import type { CustomerListItem } from '@/app/lib/data';

export default function CustomersList({ customers }: { customers: CustomerListItem[] }) {
  return (
    <div className="rounded-md bg-white shadow-sm">
      <ul className="divide-y divide-gray-200">
        {customers.map((customer) => (
          <li key={customer.id} className="flex items-center gap-4 p-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
              <Image
                src={customer.image_url}
                alt={`${customer.name} avatar`}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {customer.name}
              </p>
              <p className="truncate text-sm text-gray-500">{customer.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
