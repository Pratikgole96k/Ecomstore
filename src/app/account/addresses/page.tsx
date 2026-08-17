import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { MapPin, ChevronRight, Plus, CheckCircle2 } from 'lucide-react';
import SavedAddressManager from './SavedAddressManager';

export const dynamic = 'force-dynamic';

export default async function AccountAddressesPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?redirect=/account/addresses');
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.id },
    orderBy: { isDefault: 'desc' },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500">
        <Link href="/" className="hover:text-vastrika-maroon-800">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/account" className="hover:text-vastrika-maroon-800">
          My Account
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-stone-900 font-semibold">Saved Addresses</span>
      </nav>

      <div>
        <h1 className="font-serif text-3xl font-bold text-vastrika-maroon-950">
          Saved Delivery Addresses
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage your residential, studio and boutique delivery locations.
        </p>
      </div>

      <SavedAddressManager initialAddresses={addresses} userId={session.id} />
    </div>
  );
}
