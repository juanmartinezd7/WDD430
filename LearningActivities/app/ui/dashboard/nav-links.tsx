//LearningActivities/app/ui/dashboard/nav-links.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  HomeIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentDuplicateIcon },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600',
              { 'bg-sky-100 text-blue-600': pathname === link.href }
            )}
          >
            <LinkIcon className="h-5 w-5" />
            <p className="block">{link.name}</p>
          </Link>
        );    
      })}
    </>
  );
}
