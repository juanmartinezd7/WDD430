// app/ui/dashboard/sidenav.tsx
import Link from 'next/link';
import NavLinks from './nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import AcmeLogo from '@/app/ui/acme-logo';
import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="mb-4 flex h-16 items-center justify-start rounded-md bg-blue-600 p-4 md:h-40"
      >
        <AcmeLogo />
      </Link>

      {/* Navigation */}
      <div className="flex grow flex-col space-y-1">
        <NavLinks />

        <div className="mt-auto pt-4">
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button className="flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-gray-100">
              <PowerIcon className="h-5 w-5" />
              <span className="hidden md:block">Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
